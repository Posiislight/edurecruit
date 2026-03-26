"""Hard eligibility rules before AI screening."""

GRADE_ORDER = [
    "A1",
    "B2",
    "B3",
    "C4",
    "C5",
    "C6",
    "D7",
    "E8",
    "F9",
    "PASS",
]  # lower index = better grade

GRADE_INDEX = {g: i for i, g in enumerate(GRADE_ORDER)}


def _norm_subject(s: str) -> str:
    return " ".join(s.strip().split()).lower()


def _olevel_map(application) -> dict:
    """subject normalized -> grade string."""
    out = {}
    for row in application.olevel_results or []:
        if not isinstance(row, dict):
            continue
        subj = row.get("subject")
        grade = row.get("grade")
        if subj is None or grade is None:
            continue
        out[_norm_subject(str(subj))] = str(grade).strip().upper()
    return out


def grade_at_least(grade: str, minimum: str) -> bool:
    g = (grade or "").strip().upper()
    m = (minimum or "").strip().upper()
    if g not in GRADE_INDEX or m not in GRADE_INDEX:
        return False
    return GRADE_INDEX[g] <= GRADE_INDEX[m]


def check_hard_rules(application, programme) -> dict:
    """Return {qualified: True} or {qualified: False, reason: str}."""
    if application.jamb_score < programme.jamb_cutoff:
        return {"qualified": False, "reason": "JAMB score is below programme cutoff."}

    olevel = _olevel_map(application)

    eng = olevel.get(_norm_subject("English Language"))
    if eng is None:
        return {"qualified": False, "reason": "English Language is missing from O'level results."}
    if not grade_at_least(eng, "C6"):
        return {"qualified": False, "reason": "English Language grade is below C6."}

    mat = olevel.get(_norm_subject("Mathematics"))
    if mat is None:
        return {"qualified": False, "reason": "Mathematics is missing from O'level results."}
    if not grade_at_least(mat, "C6"):
        return {"qualified": False, "reason": "Mathematics grade is below C6."}

    required = programme.required_subjects or []
    for subj in required:
        key = _norm_subject(str(subj))
        if key not in olevel:
            return {
                "qualified": False,
                "reason": f"Required subject '{subj}' is missing from O'level results.",
            }

    return {"qualified": True}
