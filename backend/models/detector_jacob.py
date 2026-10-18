from transformers import pipeline

DETECTOR = None


def load_model():

    global DETECTOR

    if DETECTOR is None:

        DETECTOR = pipeline(
            "image-classification",
            model="jacoballessio/ai-image-detect-distilled"
        )

    return DETECTOR


def predict(filepath):

    detector = load_model()

    results = detector(filepath)

    print(results)

    for item in results:

        label = item["label"].lower()

        if "fake" in label:
            return float(item["score"])

        if "ai" in label:
            return float(item["score"])

    return 0.0