"""
AI screening via OpenRouter (OpenAI-compatible API).

Env: OPENROUTER_API_KEY, OPENROUTER_MODEL (e.g. anthropic/claude-3.5-sonnet or anthropic/claude-sonnet-4-20250514).
Optional: OPENROUTER_HTTP_REFERER, OPENROUTER_X_TITLE for OpenRouter attribution headers.
"""

from __future__ import annotations

import json
import os
import re
from typing import Any

from django.db import transaction

from applications.models import StudentApplication
from programmes.models import Programme
from screening.models import AdmissionsDecision
from screening.rules import check_hard_rules

# System prompt for structured AI screening
SYSTEM_PROMPT = """You are an AI admissions screening assistant for a Nigerian university.
Your job is to evaluate student applications fairly and transparently based on academic criteria.

SCORING RULES (total 100 points):
1. JAMB (50 pts): 40+ above cutoff=50, 20-39 above=40, 1-19 above=30, below=0 (disqualified).
2. O'LEVEL (30 pts): Grade required subjects (A1=6, B2=5, B3=4, C4=3, C5=2, C6=1). Avg: 5.5-6=30, 4.5-5.4=24, 3.5-4.4=18, 2.5-3.4=12, 1-2.4=6.
3. SITTINGS (10 pts): 1 sitting=10, 2 sittings=5.
4. RECENCY (10 pts): 2023+=10, 2021-22=7, 2019-20=4, <2019=2.

DISQUALIFICATION: JAMB < cutoff, missing English/Math/Required subjects.

BIAS RULES: Ignore name, gender, state of origin. Use ONLY academic factors.

Return ONLY JSON:
{
  "score": <int>,
  "jamb_component": <int>,
  "olevel_component": <int>,
  "sitting_component": <int>,
  "recency_component": <int>,
  "qualified": <bool>,
  "confidence": "high"|"low"|"disqualified",
  "recommendation": "admit"|"review"|"reject",
  "reasoning": "Short explanation (2-3 sentences, concise and human-readable)",
  "factors_used": ["3-5 short bullet-style reasons grounded in the score breakdown"],
  "bias_flag": <bool>,
  "bias_explanation": <str|null>
}
"""

AUDITOR_PROMPT = """You are an independent Admissions Ethics Auditor. Your job is to review an AI's screening decision for potential bias or logical errors.
Look for: Proxy Bias (state/gender/name usage), Calculation Errors, and Logic Gaps. Set 'audit_passed' to false if you find issues.

Return ONLY JSON:
{
  "audit_passed": <bool>,
  "audit_remarks": <str>,
  "identified_risks": [<str>]
}
"""


def _build_user_payload(application: StudentApplication, programme: Programme) -> dict[str, Any]:
    return {
        "programme": {
            "name": programme.name,
            "faculty": programme.faculty,
            "jamb_cutoff": programme.jamb_cutoff,
            "required_subjects": programme.required_subjects,
        },
        "student": {
            "jamb_score": application.jamb_score,
            "olevel_results": application.olevel_results,
            "number_of_sittings": application.number_of_sittings,
            "result_year": application.result_year,
        },
    }


def _parse_json_content(text: str) -> dict[str, Any]:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return json.loads(text)


def _openrouter_client():
    from openai import OpenAI

    api_key = os.environ.get("OPENROUTER_API_KEY", "")
    headers = {}
    ref = os.environ.get("OPENROUTER_HTTP_REFERER", "").strip()
    title = os.environ.get("OPENROUTER_X_TITLE", "").strip()
    if ref:
        headers["HTTP-Referer"] = ref
    if title:
        headers["X-Title"] = title

    kwargs: dict[str, Any] = {
        "base_url": "https://openrouter.ai/api/v1",
        "api_key": api_key or "missing-key",
    }
    if headers:
        kwargs["default_headers"] = headers
    return OpenAI(**kwargs)


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
    chain_of_thought: list | None = None,
    factors_used: list | None = None,
    bias_flag: bool,
    bias_explanation: str | None,
    audit_passed: bool = True,
    audit_remarks: str | None = None,
    identified_risks: list | None = None,
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
            "chain_of_thought": chain_of_thought or [],
            "factors_used": factors_used or [],
            "bias_flag": bias_flag,
            "bias_explanation": bias_explanation,
            "audit_passed": audit_passed,
            "audit_remarks": audit_remarks,
            "identified_risks": identified_risks or [],
        },
    )
    return decision


def _persist_manual_review(
    application: StudentApplication,
    *,
    reason: str,
    risks: list[str] | None = None,
) -> AdmissionsDecision:
    with transaction.atomic():
        decision = _persist_decision(
            application,
            ai_score=0,
            jamb_component=0,
            olevel_component=0,
            sitting_component=0,
            recency_component=0,
            qualified=True,
            confidence=AdmissionsDecision.CONF_LOW,
            recommendation=AdmissionsDecision.REC_REVIEW,
            reasoning=reason,
            chain_of_thought=[],
            factors_used=[
                "Automated screening is unavailable for this application.",
                "A human admissions officer must review the record before any final decision.",
            ],
            bias_flag=False,
            bias_explanation="No automated bias assessment was completed because the screening service was unavailable.",
            audit_passed=False,
            audit_remarks=reason,
            identified_risks=risks or ["Automated screening unavailable."],
        )
        StudentApplication.objects.filter(pk=application.pk).update(
            status=StudentApplication.STATUS_REVIEW,
        )
    application.refresh_from_db()
    return decision


def screen_application(application: StudentApplication, programme: Programme) -> AdmissionsDecision:
    """Run hard rules then AI (Primary + Auditor); update application status to screened."""
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
                    "Hard Rule Check: Failed",
                    f"Exact rule triggered: {reason}",
                ],
                bias_flag=False,
                bias_explanation=None,
            )
            StudentApplication.objects.filter(pk=application.pk).update(
                status=StudentApplication.STATUS_SCREENED,
            )
        application.refresh_from_db()
        return decision

    api_key = os.environ.get("OPENROUTER_API_KEY", "").strip()
    model = os.environ.get("OPENROUTER_MODEL", "").strip()
    user_payload = _build_user_payload(application, programme)
    user_text = json.dumps(user_payload, ensure_ascii=False)

    if not api_key or not model:
        return _persist_manual_review(
            application,
            reason="Automated screening is unavailable because the AI configuration is incomplete. This application has been routed for manual officer review.",
            risks=["OPENROUTER_API_KEY or OPENROUTER_MODEL is not configured."],
        )

    try:
        client = _openrouter_client()
        # 1. Primary Screening
        primary_response = client.chat.completions.create(
            model=model,
            temperature=0.2,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_text},
            ],
        )
        data = _parse_json_content(primary_response.choices[0].message.content or "{}")

        # 2. Ethics Audit (Independent Verification)
        audit_payload = {
            "application_data": user_payload,
            "ai_decision": data
        }
        audit_response = client.chat.completions.create(
            model=model,
            temperature=0.1,
            messages=[
                {"role": "system", "content": AUDITOR_PROMPT},
                {"role": "user", "content": json.dumps(audit_payload)},
            ],
        )
        audit_data = _parse_json_content(audit_response.choices[0].message.content or "{}")

    except Exception as exc:
        return _persist_manual_review(
            application,
            reason="Automated screening could not be completed reliably. This application has been escalated for manual officer review.",
            risks=[f"Screening/Audit failed: {exc}"],
        )

    def _int(key: str, default: int = 0) -> int:
        try:
            return int(data.get(key, default))
        except (TypeError, ValueError):
            return default

    with transaction.atomic():
        decision = _persist_decision(
            application,
            ai_score=_int("score"),
            jamb_component=_int("jamb_component"),
            olevel_component=_int("olevel_component"),
            sitting_component=_int("sitting_component"),
            recency_component=_int("recency_component"),
            qualified=bool(data.get("qualified", False)),
            confidence=str(data.get("confidence", AdmissionsDecision.CONF_LOW)),
            recommendation=str(data.get("recommendation", AdmissionsDecision.REC_REVIEW)),
            reasoning=str(data.get("reasoning", "")),
            chain_of_thought=data.get("chain_of_thought", []),
            factors_used=data.get("factors_used"),
            bias_flag=bool(data.get("bias_flag", False)),
            bias_explanation=data.get("bias_explanation"),
            audit_passed=bool(audit_data.get("audit_passed", True)),
            audit_remarks=str(audit_data.get("audit_remarks", "")),
            identified_risks=audit_data.get("identified_risks", []),
        )
        StudentApplication.objects.filter(pk=application.pk).update(
            status=StudentApplication.STATUS_SCREENED,
        )
    application.refresh_from_db()
    return decision
