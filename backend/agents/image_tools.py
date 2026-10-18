from PIL import Image
import cv2
import numpy as np

def sharpness_score(filepath):

    image = cv2.imread(filepath)

    if image is None:
        return 0

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    return cv2.Laplacian(
        gray,
        cv2.CV_64F
    ).var()

def extract_metadata(filepath):

    try:

        image = Image.open(filepath)

        exif = image.getexif()

        if exif:
            return True

        return False

    except Exception:
        return False
    
def analyze_image_quality(filepath):

    image = cv2.imread(filepath)

    if image is None:
        return None

    height, width = image.shape[:2]

    return {
        "width": width,
        "height": height
    }

def compression_score(filepath):

    image = cv2.imread(filepath)

    if image is None:
        return 0

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    laplacian = cv2.Laplacian(
        gray,
        cv2.CV_64F
    )

    score = laplacian.var()

    return round(score, 2)

def noise_estimation(filepath):

    image = cv2.imread(filepath)

    if image is None:
        return 0

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    noise = np.std(gray)

    return round(float(noise), 2)

def detect_faces(filepath):

    image = cv2.imread(filepath)

    if image is None:
        return 0

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades +
        "haarcascade_frontalface_default.xml"
    )

    faces = cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5
    )

    return len(faces)


def detect_image_type(filepath):

    image = Image.open(filepath)

    width, height = image.size

    filename = filepath.lower()

    if "screenshot" in filename:

        return "screenshot"

    return "unknown"
