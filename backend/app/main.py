from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from agents.graph import graph
from pathlib import Path

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "TrustLens API is running"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    filepath = UPLOAD_DIR / file.filename

    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())

    result = graph.invoke(
    {
        "filename": file.filename,
        "filepath": str(filepath),

        "findings": [],

        "metadata_risk": 0,
        "compression_risk": 0,

        "ai_probability": 0,

        "authenticity_score": 0,

        "explanation": ""
    }
)

    return {
    "findings": result["findings"],
    "summary": result["summary"],
    "trust_score": result["authenticity_score"],
    "explanation": result["explanation"]
}