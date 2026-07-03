from models.ai_detector import detect_ai_generated

images = [
    "test-images/real/img1.jpeg",
    "test-images/real/img2.jpeg",
    "test-images/real/img3.jpeg",
    "test-images/real/img4.jpeg",
    "test-images/real/img5.jpeg",
    "test-images/screenshots/img1.png",
    "test-images/screenshots/img2.png",
    "test-images/screenshots/img3.png",
    "test-images/screenshots/img4.png",
    "test-images/screenshots/img5.png",
    "test-images/ai/aiimg1.png",
    "test-images/ai/aiimg2.png",
    "test-images/ai/aiimg3.jpg",
    "test-images/ai/aiimg4.jpg",
    "test-images/ai/aiimg5.jpg",
]

for image in images:

    score = detect_ai_generated(image)

    print(
        f"{image} -> {score:.2f}"
    )
