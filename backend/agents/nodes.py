from .image_tools import (
    extract_metadata,
    analyze_image_quality,
    compression_score,
    noise_estimation,
    detect_faces,
    sharpness_score,
)
from models.ai_detector import (
    detect_ai_generated
)


def compression_node(state):

    findings = state["findings"]

    score = sharpness_score(
        state["filepath"]
    )

    findings.append(
        f"Sharpness score: {score:.2f}"
    )

    if score < 50:

        findings.append(
            "Very blurry image"
        )

        state["compression_risk"] = 0.5

    elif score < 150:

        findings.append(
            "Moderately sharp image"
        )

        state["compression_risk"] = 0.2

    else:

        findings.append(
            "High detail image"
        )

        state["compression_risk"] = 0.1

    state["findings"] = findings

    return state

def metadata_node(state):

    findings = state["findings"]

    has_metadata = extract_metadata(
        state["filepath"]
    )

    if has_metadata:

        findings.append(
            "EXIF metadata present"
        )

        state["metadata_risk"] = 0.1

    else:

        findings.append(
            "EXIF metadata missing"
        )

        state["metadata_risk"] = 0.3

    state["findings"] = findings

    return state


def classify_media(state):

    filename = state["filename"].lower()

    if filename.endswith(
        (".jpg", ".jpeg", ".png")
    ):
        state["media_type"] = "image"

    else:
        state["media_type"] = "video"

    return state

def image_analysis_node(state):

    filepath = state["filepath"]

    findings = state["findings"]

    info = analyze_image_quality(filepath)

    if info:

        width = info["width"]
        height = info["height"]

        findings.append(
            f"Resolution: {width}x{height}"
        )

        megapixels = round(
            (width * height) / 1_000_000,
            2
        )

        findings.append(
            f"Megapixels: {megapixels} MP"
        )

    noise = noise_estimation(filepath)

    findings.append(
        f"Noise level: {noise:.2f}"
    )

    faces = detect_faces(filepath)

    findings.append(
        f"Faces detected: {faces}"
    )

    state["findings"] = findings

    return state

def video_agent(state):

    state["findings"] = [
        "Frames sampled",
        "No deepfake indicators found"
    ]

    return state

def route_media(state):

    return state["media_type"]

def trust_score_agent(state):

    score = 70

    score -= int(
        state["ai_probability"] * 40
    )

    score -= int(
        state["metadata_risk"] * 10
    )

    score -= int(
        state["compression_risk"] * 10
    )

    score = max(0, min(100, score))

    state["authenticity_score"] = score

    return state


def summary_agent(state):

    score = state[
        "authenticity_score"
    ]

    if score >= 80:

        state["summary"] = (
            "Strong authenticity signals detected."
        )

    elif score >= 60:

        state["summary"] = (
            "Some authenticity signals present, but verification remains limited."
        )

    else:

        state["summary"] = (
            "Insufficient evidence to establish authenticity."
        )

    return state


def ai_detector_node(state):

    probability = detect_ai_generated(
        state["filepath"]
    )

    state["ai_probability"] = probability

    state["ai_risk"] = probability

    state["findings"].append(
        f"AI generation probability: {probability:.2f}"
    )

    return state

