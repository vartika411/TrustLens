from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0
)


def explanation_agent(state):

    score = state["ai_probability"]

    if score > 0.75:
        detector_assessment = (
            "Strong synthetic indicators"
        )

    elif score > 0.55:
        detector_assessment = (
            "Moderate synthetic indicators"
        )

    elif score > 0.40:
        detector_assessment = (
            "Weak synthetic indicators"
        )

    else:
        detector_assessment = (
            "Low synthetic indicators"
        )

    findings_text = "\n".join(
        state["findings"]
    )

    prompt = f"""
You are an image authenticity analyst.

Analysis Results:

Detector Assessment:
{detector_assessment}

Authenticity Score:
{state["authenticity_score"]}

Findings:
{findings_text}

Your task is to INTERPRET the findings.

Guidelines:

- Do NOT repeat numeric values already shown to the user.
- Focus on what the findings mean.
- Missing metadata is common and should not be treated as suspicious by itself.
- Automated detectors are probabilistic and can produce false positives and false negatives.
- Do not claim certainty.
- Do not state that an image is AI-generated unless synthetic indicators are strong.
- Avoid phrases such as:
  "likely AI-generated"
  "probably AI-generated"
  "appears AI-generated"

Interpretation Rules:

- Low synthetic indicators:
  Describe as generally consistent with authentic media.

- Weak synthetic indicators:
  Describe as inconclusive and requiring additional context.

- Moderate synthetic indicators:
  Describe as warranting additional verification.

- Strong synthetic indicators:
  Describe as deserving further scrutiny.

Writing Style:

- Professional
- Neutral
- Concise
- Maximum 3 sentences

Generate only the assessment.
"""

    response = llm.invoke(
        [HumanMessage(content=prompt)]
    )

    state["explanation"] = (
        response.content.strip()
    )

    return state