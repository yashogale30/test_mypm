from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


FitCategory = Literal["Strong Match", "Partial Match", "Weak Match"]


class Qualification(BaseModel):
    claim: str = Field(min_length=1)
    evidence_quote: str = Field(min_length=1)
    verified: bool


class AnalysisInput(BaseModel):
    candidate_name: str = Field(min_length=1)
    target_role: str = Field(min_length=1)
    resume_text: str = Field(min_length=1)
    company_name: str = Field(min_length=1)
    job_title: str = Field(min_length=1)
    job_description: str = Field(min_length=1)

    model_config = ConfigDict(str_strip_whitespace=True)


class LlmAnalysis(BaseModel):
    fit_category: FitCategory
    matching_qualifications: list[Qualification]
    missing_requirements: list[str]
    explanation: str = Field(min_length=1)


class OutreachText(BaseModel):
    message: str = Field(min_length=1)

    @field_validator("message")
    @classmethod
    def must_be_at_most_150_words(cls, value: str) -> str:
        if len(value.split()) > 150:
            raise ValueError("outreach email exceeds 150 words")
        return value


class AnalysisResponse(AnalysisInput, LlmAnalysis):
    id: int
    outreach_message: str
    reliability_flag: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AnalysisSummary(BaseModel):
    id: int
    candidate_name: str
    company_name: str
    job_title: str
    fit_category: FitCategory
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OutreachUpdate(BaseModel):
    outreach_message: str = Field(min_length=1)

    model_config = ConfigDict(str_strip_whitespace=True)


class ReliabilityCheckRequest(BaseModel):
    job_title: str = Field(min_length=1)
    job_description: str = Field(min_length=1)

    model_config = ConfigDict(str_strip_whitespace=True)


class ReliabilityCheckResponse(BaseModel):
    passed: bool
    raw_fit_category: FitCategory
    raw_explanation: str
    reasoning: str
