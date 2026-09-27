from app.schemas import Qualification
from app.verification import verify_quotes


def test_verify_quotes_exact_match_ignores_case_and_whitespace() -> None:
    result = verify_quotes(
        "Built   Python APIs\nwith FastAPI.",
        [Qualification(claim="FastAPI", evidence_quote="built python apis with fastapi.", verified=False)],
    )
    assert result[0].verified is True


def test_verify_quotes_accepts_high_similarity_fuzzy_match() -> None:
    result = verify_quotes(
        "Developed Python services for payment processing.",
        [Qualification(claim="Python", evidence_quote="Developed Python service for payment processing.", verified=False)],
    )
    assert result[0].verified is True


def test_verify_quotes_rejects_unsupported_quote() -> None:
    result = verify_quotes(
        "Experience with Java and Spring Boot.",
        [Qualification(claim="Kubernetes", evidence_quote="Managed Kubernetes clusters.", verified=False)],
    )
    assert result[0].verified is False
