from __future__ import annotations

import base64
import json
import mimetypes
import os
import re
from datetime import datetime
from typing import Any

from django.core.files.uploadedfile import UploadedFile

ALLOWED_GRADES = {"A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"}
MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024
DEFAULT_OPENROUTER_VISION_MODEL = "openai/gpt-4o-mini"
SUPPORTED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}
GENERIC_CONTENT_TYPES = {
    "application/octet-stream",
    "binary/octet-stream",
}

WAEC_RESULT_PROMPT = """You extract official Nigerian O'Level result data from WAEC or NECO result images.
Return ONLY valid JSON with this exact shape:
{
  "exam_type": "WAEC" | "NECO" | "UNKNOWN",
  "exam_year": <integer or null>,
  "number_of_sittings": <1 | 2 | null>,
  "subjects": [
    {
      "subject": "<subject name as seen on the result>",
      "grade": "<A1|B2|B3|C4|C5|C6|D7|E8|F9>"
    }
  ],
  "notes": ["<optional short note>", "<optional short note>"]
}

Rules:
- Extract only subjects and grades you can read from the image.
- Do not invent rows.
- Ignore candidate biodata unless it helps identify the exam year or sitting count.
- Keep subject names close to the document text.
- If a value is unreadable, omit that row instead of guessing.
- Include at most 12 subject rows.
"""


class ResultParsingError(Exception):
    """Base exception for WAEC parsing failures."""


class ResultParsingConfigError(ResultParsingError):
    """Raised when the parsing service is not configured."""


class UnsupportedResultFileError(ResultParsingError):
    """Raised when the uploaded file is not a supported image."""


def _extract_text_content(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        parts = [_extract_text_content(item) for item in value]
        return "\n".join(part for part in parts if part)
    if isinstance(value, dict):
        for key in ("text", "content", "value", "output_text"):
            extracted = _extract_text_content(value.get(key))
            if extracted:
                return extracted
        return ""

    text_attr = getattr(value, "text", None)
    if isinstance(text_attr, str):
        return text_attr

    content_attr = getattr(value, "content", None)
    if content_attr is not None:
        extracted = _extract_text_content(content_attr)
        if extracted:
            return extracted

    return str(value)


def _extract_json_block(text: str) -> Any:
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        decoder = json.JSONDecoder()
        for index, char in enumerate(cleaned):
            if char not in "[{":
                continue
            try:
                value, _ = decoder.raw_decode(cleaned[index:])
            except json.JSONDecodeError:
                continue
            return value
    raise json.JSONDecodeError("No JSON object found", cleaned, 0)


def _openrouter_client():
    from openai import OpenAI

    api_key = os.environ.get("OPENROUTER_API_KEY", "").strip()
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


def _simplify_subject(value: str) -> str:
    value = value.upper()
    value = value.replace("&", " AND ")
    value = value.replace("/", " ")
    value = re.sub(r"[^A-Z0-9 ]+", " ", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


SUBJECT_ALIASES = {
    _simplify_subject("Agric Science"): "Agricultural Science",
    _simplify_subject("Agricultural Science"): "Agricultural Science",
    _simplify_subject("Arabic"): "Arabic",
    _simplify_subject("Biology"): "Biology",
    _simplify_subject("Book Keeping"): "Book Keeping",
    _simplify_subject("Book-Keeping"): "Book Keeping",
    _simplify_subject("Chemistry"): "Chemistry",
    _simplify_subject("Christian Religious Knowledge"): "Christian Religious Studies",
    _simplify_subject("Christian Religious Studies"): "Christian Religious Studies",
    _simplify_subject("CRK"): "Christian Religious Studies",
    _simplify_subject("CRS"): "Christian Religious Studies",
    _simplify_subject("C R S"): "Christian Religious Studies",
    _simplify_subject("Civic Education"): "Civic Education",
    _simplify_subject("Commerce"): "Commerce",
    _simplify_subject("Computer Studies"): "Computer Studies",
    _simplify_subject("Data Processing"): "Data Processing",
    _simplify_subject("Economics"): "Economics",
    _simplify_subject("English Language"): "English Language",
    _simplify_subject("English Lang"): "English Language",
    _simplify_subject("Eng Language"): "English Language",
    _simplify_subject("Financial Accounting"): "Financial Accounting",
    _simplify_subject("Financial Acct"): "Financial Accounting",
    _simplify_subject("Food And Nutrition"): "Food and Nutrition",
    _simplify_subject("Food & Nutrition"): "Food and Nutrition",
    _simplify_subject("French"): "French",
    _simplify_subject("Further Mathematics"): "Further Mathematics",
    _simplify_subject("Further Maths"): "Further Mathematics",
    _simplify_subject("General Mathematics"): "Mathematics",
    _simplify_subject("Geography"): "Geography",
    _simplify_subject("Government"): "Government",
    _simplify_subject("Hausa"): "Hausa",
    _simplify_subject("Health Education"): "Health Education",
    _simplify_subject("History"): "History",
    _simplify_subject("Home Management"): "Home Management",
    _simplify_subject("Igbo"): "Igbo",
    _simplify_subject("Insurance"): "Insurance",
    _simplify_subject("Islamic Religious Studies"): "Islamic Studies",
    _simplify_subject("Islamic Studies"): "Islamic Studies",
    _simplify_subject("IRS"): "Islamic Studies",
    _simplify_subject("I R S"): "Islamic Studies",
    _simplify_subject("Literature in English"): "Literature in English",
    _simplify_subject("Lit in English"): "Literature in English",
    _simplify_subject("Literature-In-English"): "Literature in English",
    _simplify_subject("Marketing"): "Marketing",
    _simplify_subject("Mathematics"): "Mathematics",
    _simplify_subject("Maths"): "Mathematics",
    _simplify_subject("Music"): "Music",
    _simplify_subject("Physics"): "Physics",
    _simplify_subject("Technical Drawing"): "Technical Drawing",
    _simplify_subject("Visual Art"): "Visual Arts",
    _simplify_subject("Visual Arts"): "Visual Arts",
    _simplify_subject("Yoruba"): "Yoruba",
}


def normalize_grade(raw_grade: Any) -> str | None:
    if raw_grade is None:
        return None

    cleaned = re.sub(r"[^A-Z0-9]", "", str(raw_grade).upper())
    if not cleaned:
        return None

    if len(cleaned) >= 2:
        letter = cleaned[0]
        digit_part = cleaned[1:].replace("I", "1").replace("L", "1").replace("!", "1")
        digit = next((ch for ch in digit_part if ch.isdigit()), "")
        candidate = f"{letter}{digit}" if digit else cleaned[:2]
    else:
        candidate = cleaned

    return candidate if candidate in ALLOWED_GRADES else None


def normalize_subject(raw_subject: Any) -> str | None:
    if raw_subject is None:
        return None

    simplified = _simplify_subject(str(raw_subject))
    if not simplified:
        return None

    aliased = SUBJECT_ALIASES.get(simplified)
    if aliased:
        return aliased

    words = simplified.lower().split()
    if not words:
        return None

    small_words = {"and", "in", "of"}
    normalized_words = [
        word if word in small_words and index != 0 else word.capitalize()
        for index, word in enumerate(words)
    ]
    return " ".join(normalized_words)


def _parse_subject_line(line: str) -> tuple[str | None, str | None]:
    cleaned = line.strip().strip("|")
    cleaned = re.sub(r"^[\-\*\u2022]+\s*", "", cleaned)
    table_match = re.search(
        r"^(.+?)\s*\|\s*([A-F][0-9IIL!])\s*$",
        cleaned,
        flags=re.IGNORECASE,
    )
    if table_match:
        return table_match.group(1).strip(), table_match.group(2).strip()

    match = re.search(
        r"(.+?)(?:\s*[:\-]\s*|\s+)([A-F][0-9IIL!])$",
        cleaned,
        flags=re.IGNORECASE,
    )
    if not match:
        return None, None
    return match.group(1).strip(), match.group(2).strip()


def normalize_subject_rows(rows: Any) -> list[dict[str, str]]:
    normalized: list[dict[str, str]] = []
    seen_subjects: set[str] = set()

    if not isinstance(rows, list):
        return normalized

    for row in rows:
        raw_subject = None
        raw_grade = None

        if isinstance(row, dict):
            raw_subject = row.get("subject") or row.get("name") or row.get("course")
            raw_grade = row.get("grade") or row.get("result") or row.get("score")
        elif isinstance(row, str):
            raw_subject, raw_grade = _parse_subject_line(row)

        subject = normalize_subject(raw_subject)
        grade = normalize_grade(raw_grade)

        if not subject or not grade:
            continue

        subject_key = subject.casefold()
        if subject_key in seen_subjects:
            continue

        normalized.append({"subject": subject, "grade": grade})
        seen_subjects.add(subject_key)

        if len(normalized) >= 12:
            break

    return normalized


def _coerce_exam_year(value: Any) -> int | None:
    try:
        year = int(value)
    except (TypeError, ValueError):
        return None

    current_year = datetime.utcnow().year + 1
    if 1990 <= year <= current_year:
        return year
    return None


def _coerce_sittings(value: Any) -> int | None:
    try:
        sittings = int(value)
    except (TypeError, ValueError):
        return None
    return sittings if sittings in (1, 2) else None


def _resolve_content_type(file: UploadedFile) -> str:
    content_type = (getattr(file, "content_type", "") or "").lower().strip()
    if content_type and content_type not in GENERIC_CONTENT_TYPES:
        return content_type

    guessed, _ = mimetypes.guess_type(file.name)
    return (guessed or content_type or "").lower().strip()


def _file_to_data_url(file: UploadedFile, content_type: str) -> str:
    encoded = base64.b64encode(file.read()).decode("ascii")
    return f"data:{content_type};base64,{encoded}"


def _parse_exam_type(value: Any, raw_text: str) -> str:
    candidate = str(value or "").strip().upper()
    if candidate in {"WAEC", "NECO"}:
        return candidate

    text = raw_text.upper()
    if "WAEC" in text:
        return "WAEC"
    if "NECO" in text:
        return "NECO"
    return "UNKNOWN"


def _parse_number_of_sittings(value: Any, raw_text: str) -> int | None:
    coerced = _coerce_sittings(value)
    if coerced is not None:
        return coerced

    lowered = raw_text.lower()
    if re.search(r"\bnumber of sittings?\s*[:\-]?\s*(1|one)\b", lowered):
        return 1
    if re.search(r"\bnumber of sittings?\s*[:\-]?\s*(2|two)\b", lowered):
        return 2
    if re.search(r"\b(?:1|one)\s+sitting", lowered):
        return 1
    if re.search(r"\b(?:2|two)\s+sittings?\b", lowered):
        return 2
    return None


def _extract_subject_candidates(payload: dict[str, Any], raw_text: str) -> Any:
    for key in ("subjects", "results", "result_rows", "rows", "entries", "grades"):
        value = payload.get(key)
        if value:
            return value

    inferred_rows = []
    for key, value in payload.items():
        if normalize_subject(key) and normalize_grade(value):
            inferred_rows.append({"subject": key, "grade": value})
    if inferred_rows:
        return inferred_rows

    return raw_text.splitlines()


def _extract_notes(payload: dict[str, Any], raw_text: str) -> list[str]:
    raw_notes = payload.get("notes") or payload.get("note") or payload.get("remarks")
    if isinstance(raw_notes, str):
        raw_notes = [raw_notes]
    if isinstance(raw_notes, list):
        return [note.strip() for note in raw_notes if isinstance(note, str) and note.strip()][:3]

    if raw_text and not payload:
        return ["Parsed from a free-form AI response because the model did not return clean JSON."]
    return []


def _coerce_payload(raw_payload: Any) -> dict[str, Any]:
    if isinstance(raw_payload, dict):
        payload = raw_payload
        raw_text = _extract_text_content(raw_payload).strip()
    elif isinstance(raw_payload, list):
        payload = {"subjects": raw_payload}
        raw_text = _extract_text_content(raw_payload).strip()
    else:
        raw_text = _extract_text_content(raw_payload).strip()
        if not raw_text:
            return {}

        try:
            parsed = _extract_json_block(raw_text)
        except json.JSONDecodeError:
            parsed = {}

        payload = parsed if isinstance(parsed, dict) else {"subjects": parsed} if isinstance(parsed, list) else {}

    subject_rows = normalize_subject_rows(_extract_subject_candidates(payload, raw_text))
    if not subject_rows and raw_text:
        subject_rows = normalize_subject_rows(raw_text.splitlines())

    year_candidate = (
        payload.get("exam_year")
        or payload.get("year")
        or payload.get("session_year")
    )
    sitting_candidate = (
        payload.get("number_of_sittings")
        or payload.get("sittings")
        or payload.get("sitting_count")
    )
    exam_type_candidate = payload.get("exam_type") or payload.get("exam") or payload.get("board")

    return {
        "exam_type": _parse_exam_type(exam_type_candidate, raw_text),
        "exam_year": _coerce_exam_year(year_candidate or next(iter(re.findall(r"\b(?:19|20)\d{2}\b", raw_text)), None)),
        "number_of_sittings": _parse_number_of_sittings(sitting_candidate, raw_text),
        "subjects": subject_rows,
        "notes": _extract_notes(payload, raw_text),
    }


def _parse_json_content(content: Any) -> dict[str, Any]:
    return _coerce_payload(content)


def _call_openrouter_vision(data_url: str) -> dict[str, Any]:
    api_key = os.environ.get("OPENROUTER_API_KEY", "").strip()
    model = (
        os.environ.get("OPENROUTER_VISION_MODEL", "").strip()
        or os.environ.get("OPENROUTER_MODEL", "").strip()
        or DEFAULT_OPENROUTER_VISION_MODEL
    )

    if not api_key:
        raise ResultParsingConfigError(
            "WAEC result parsing is unavailable because the AI parser is not configured."
        )

    client = _openrouter_client()
    response = client.chat.completions.create(
        model=model,
        temperature=0,
        messages=[
            {"role": "system", "content": WAEC_RESULT_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Extract the subject names and grades from this O'Level result image."},
                    {"type": "image_url", "image_url": {"url": data_url}},
                ],
            },
        ],
    )
    content = response.choices[0].message.content or "{}"
    return _parse_json_content(content)


def parse_waec_result_upload(file: UploadedFile) -> dict[str, Any]:
    if not file:
        raise UnsupportedResultFileError("Upload a WAEC result image to continue.")

    if file.size > MAX_UPLOAD_SIZE_BYTES:
        raise UnsupportedResultFileError("Result upload must be 5MB or smaller.")

    content_type = _resolve_content_type(file)
    if content_type not in SUPPORTED_CONTENT_TYPES:
        raise UnsupportedResultFileError("Upload a PNG, JPG, or WEBP image of your WAEC result.")

    try:
        data_url = _file_to_data_url(file, content_type)
        parsed = _call_openrouter_vision(data_url)
    except ResultParsingError:
        raise
    except Exception as exc:
        raise ResultParsingError(
            "We could not read that result image. Upload a clearer image or enter the subjects manually."
        ) from exc

    parsed = _coerce_payload(parsed)
    subjects = normalize_subject_rows(parsed.get("subjects"))
    if not subjects:
        raise ResultParsingError(
            "We could not confidently extract any subjects from that result image."
        )

    return {
        "exam_type": _parse_exam_type(parsed.get("exam_type"), ""),
        "exam_year": _coerce_exam_year(parsed.get("exam_year")),
        "number_of_sittings": _coerce_sittings(parsed.get("number_of_sittings")),
        "subjects": subjects,
        "notes": _extract_notes(parsed, ""),
    }
