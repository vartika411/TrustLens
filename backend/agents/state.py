from typing import TypedDict

class AnalysisState(TypedDict):

    filename: str
    filepath: str

    media_type: str

    metadata_risk: float
    compression_risk: float
    ai_risk: float

    ai_probability: float

    authenticity_score: int

    findings: list[str]

    summary: str

    explanation: str