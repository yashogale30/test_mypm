import re

from rapidfuzz import fuzz

from .schemas import Qualification


FUZZY_THRESHOLD = 85


def normalize_text(value: str) -> str:
    """Normalize case and contiguous whitespace for deterministic comparison."""
    return re.sub(r"\s+", " ", value).strip().casefold()


def _fuzzy_quote_match(normalized_quote: str, normalized_resume: str) -> bool:
    if not normalized_quote or not normalized_resume:
        return False

    quote_length = len(normalized_quote)
    # Compare character windows close to the quote's size, including a small
    # tolerance for OCR/punctuation differences without accepting unrelated text.
    lengths = range(max(1, quote_length - 10), min(len(normalized_resume), quote_length + 10) + 1)
    for window_length in lengths:
        for start in range(0, len(normalized_resume) - window_length + 1):
            if fuzz.ratio(normalized_quote, normalized_resume[start : start + window_length]) >= FUZZY_THRESHOLD:
                return True
    return False


def verify_quotes(resume_text: str, qualifications: list[Qualification]) -> list[Qualification]:
    """Return copied qualifications annotated by exact/fuzzy resume evidence checks."""
    normalized_resume = normalize_text(resume_text)
    verified_qualifications: list[Qualification] = []
    for qualification in qualifications:
        normalized_quote = normalize_text(qualification.evidence_quote)
        is_verified = bool(normalized_quote) and (
            normalized_quote in normalized_resume
            or _fuzzy_quote_match(normalized_quote, normalized_resume)
        )
        verified_qualifications.append(qualification.model_copy(update={"verified": is_verified}))
    return verified_qualifications
