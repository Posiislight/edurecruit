from __future__ import annotations

from django.db import transaction

from applications.models import StudentApplication
from programmes.models import Programme
from screening.models import AdmissionsDecision
from screening.rules import check_hard_rules

GRADE_POINTS = {
    "A1": 6,
    "B2": 5,
    "B3": 4,
    "C4": 3,
    "C5": 2,
    "C6": 1,
}


def _norm_subject(name: str) -> str:
    return " ".join((name or "").strip().split()).lower()


def _olevel_map(application: StudentApplication) -> dict[str, str]:
    out: dict[str, str] = {}
    for row in application.olevel_results or []:
        if not isinstance(row, dict):
            continue
        subject = row.get("subject")
        grade = row.get("grade")
        if subject is None or grade is None:
            continue
        out[_norm_subject(str(subject))] = str(grade).strip().upper()
    return out


def _persist_decision(
    application: StudentApplication,
    *,
    ai_score: int,
    jamb_component: int,
    olevel_component: int,
    sitting_component: int,
    recency_component: int,
    qualified: bool,
    confidence: str,
    recommendation: str,
    reasoning: str,
    chain_of_thought: list[str],
    factors_used: list[str],
    bias_flag: bool,
    bias_explanation: str | None,
    audit_passed: bool,
    audit_remarks: str,
    identified_risks: list[str],
) -> AdmissionsDecision:
    decision, _ = AdmissionsDecision.objects.update_or_create(
        application=application,
        defaults={
            "ai_score": ai_score,
            "jamb_component": jamb_component,
            "olevel_component": olevel_component,
            "sitting_component": sitting_component,
            "recency_component": recency_component,
            "qualified": qualified,
            "confidence": confidence,
            "recommendation": recommendation,
            "reasoning": reasoning,
            "chain_of_thought": chain_of_thought,
            "factors_used": factors_used,
            "bias_flag": bias_flag,
            "bias_explanation": bias_explanation,
            "audit_passed": audit_passed,
            "audit_remarks": audit_remarks,
            "identified_risks": identified_risks,
        },
    )
    return decision


def _score_jamb(application: StudentApplication, programme: Programme) -> tuple[int, int]:
    delta = application.jamb_score - programme.jamb_cutoff
    if delta >= 40:
        return 50, delta
    if delta >= 20:
        return 40, delta
    if delta >= 1:
        return 30, delta
    return 0, delta


def _score_olevel(application: StudentApplication, programme: Programme) -> tuple[int, float, list[str]]:
    olevel = _olevel_map(application)
    subject_names = []
    for subject in programme.required_subjects or []:
        key = _norm_subject(str(subject))
        if key not in subject_names:
            subject_names.append(key)

    grades = [olevel.get(subject, "") for subject in subject_names]
    values = [GRADE_POINTS.get(grade, 0) for grade in grades]
    average = (sum(values) / len(values)) if values else 0

    if average >= 5.5:
        score = 30
    elif average >= 4.5:
        score = 24
    elif average >= 3.5:
        score = 18
    elif average >= 2.5:
        score = 12
    else:
        score = 6

    return score, average, grades


def _score_sittings(application: StudentApplication) -> int:
    return 10 if application.number_of_sittings == StudentApplication.SITTING_ONE else 5


def _score_recency(application: StudentApplication) -> int:
    if application.result_year >= 2023:
        return 10
    if application.result_year >= 2021:
        return 7
    if application.result_year >= 2019:
        return 4
    return 2


def _recommendation(score: int) -> tuple[str, str]:
    if score >= 80:
        return AdmissionsDecision.REC_ADMIT, AdmissionsDecision.CONF_HIGH
    if score >= 60:
        return AdmissionsDecision.REC_REVIEW, AdmissionsDecision.CONF_LOW
    return AdmissionsDecision.REC_REJECT, AdmissionsDecision.CONF_LOW


def demo_screen_application(
    application: StudentApplication,
    programme: Programme,
) -> AdmissionsDecision:
    hard = check_hard_rules(application, programme)
    if not hard.get("qualified"):
        reason = hard.get("reason", "Did not pass hard eligibility rules.")
        with transaction.atomic():
            decision = _persist_decision(
                application,
                ai_score=0,
                jamb_component=0,
                olevel_component=0,
                sitting_component=0,
                recency_component=0,
                qualified=False,
                confidence=AdmissionsDecision.CONF_DISQUALIFIED,
                recommendation=AdmissionsDecision.REC_REJECT,
                reasoning=reason,
                chain_of_thought=[
                    "Hard rule validation failed.",
                    reason,
                ],
                factors_used=[
                    "Required baseline academic eligibility was not met.",
                    "The application was rejected before weighted scoring.",
                ],
                bias_flag=False,
                bias_explanation=None,
                audit_passed=True,
                audit_remarks="Demo screener confirmed the rejection was based on objective eligibility rules only.",
                identified_risks=[],
            )
            StudentApplication.objects.filter(pk=application.pk).update(
                status=StudentApplication.STATUS_SCREENED,
            )
        application.refresh_from_db()
        return decision

    jamb_component, delta = _score_jamb(application, programme)
    olevel_component, olevel_average, grades = _score_olevel(application, programme)
    sitting_component = _score_sittings(application)
    recency_component = _score_recency(application)
    ai_score = jamb_component + olevel_component + sitting_component + recency_component
    recommendation, confidence = _recommendation(ai_score)

    risks: list[str] = []
    if application.number_of_sittings == StudentApplication.SITTING_TWO:
        risks.append("Applicant used two sittings, which weakens competitiveness.")
    if application.result_year < 2021:
        risks.append("O'level result is relatively old and may need manual verification.")
    if 60 <= ai_score < 75:
        risks.append("Overall score is borderline and merits officer attention.")
    if any(grade in {"C5", "C6"} for grade in grades):
        risks.append("One or more required subjects are only at minimum pass level.")

    reasoning = (
        f"The applicant scored {ai_score}/100 after weighted scoring for JAMB, O'level, sittings, "
        f"and result recency. JAMB was {application.jamb_score} against a cutoff of {programme.jamb_cutoff}, "
        f"and the academic profile supports a {recommendation} recommendation."
    )

    factors_used = [
        f"JAMB score {application.jamb_score} versus cutoff {programme.jamb_cutoff} contributed {jamb_component}/50.",
        f"Required-subject O'level average was {olevel_average:.1f}, contributing {olevel_component}/30.",
        f"{application.number_of_sittings} sitting(s) contributed {sitting_component}/10.",
        f"Result year {application.result_year} contributed {recency_component}/10.",
        f"Final recommendation: {recommendation}.",
    ]

    chain_of_thought = [
        "Hard rule validation passed.",
        f"JAMB delta above cutoff: {delta}.",
        f"O'level average points across required subjects: {olevel_average:.1f}.",
        f"Composite score computed as {ai_score}/100.",
    ]

    with transaction.atomic():
        decision = _persist_decision(
            application,
            ai_score=ai_score,
            jamb_component=jamb_component,
            olevel_component=olevel_component,
            sitting_component=sitting_component,
            recency_component=recency_component,
            qualified=True,
            confidence=confidence,
            recommendation=recommendation,
            reasoning=reasoning,
            chain_of_thought=chain_of_thought,
            factors_used=factors_used,
            bias_flag=False,
            bias_explanation="The demo screener used only academic criteria and ignored identity attributes.",
            audit_passed=True,
            audit_remarks="No bias indicators or calculation anomalies were detected in the demo screening pass.",
            identified_risks=risks,
        )
        StudentApplication.objects.filter(pk=application.pk).update(
            status=StudentApplication.STATUS_SCREENED,
        )
    application.refresh_from_db()
    return decision
