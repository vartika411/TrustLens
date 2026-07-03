# TrustLens 🔍

An AI-powered media authenticity platform that analyzes images using computer vision, AI models, and agentic workflows to provide explainable authenticity assessments.

TrustLens combines image forensics, metadata analysis, synthetic media detection, and LLM-powered explanations to help users evaluate whether an image may have been AI-generated or manipulated.

---

## Features

### ✅ Currently Implemented

- Upload and analyze images
- Image metadata (EXIF) extraction
- Resolution and megapixel analysis
- Image sharpness estimation
- Noise estimation
- Face detection using OpenCV
- AI-generated image detection using Hugging Face models
- Multi-stage analysis pipeline using LangGraph
- Authenticity score generation
- Explainable AI analysis using Groq LLM
- React dashboard for displaying analysis results

---

## Sample Analysis

```
File: portrait.jpg

Resolution: 1200x1600
Megapixels: 1.92 MP
Faces detected: 3
Sharpness: Moderate
Noise Level: Low

Synthetic Content Score: 0.42

Authenticity Score: 46

Analysis:
The available signals are inconclusive and do not provide strong evidence of synthetic generation. Automated detector outputs are probabilistic and should be interpreted alongside image source and context.
```

---

# Tech Stack

## Frontend

- React.js
- TypeScript

## Backend

- FastAPI
- Python

## AI & ML

- LangGraph
- LangChain
- Hugging Face Transformers
- Groq LLM
- OpenCV

---

# System Architecture

```
                Image Upload
                     │
                     ▼
              Metadata Analysis
                     │
                     ▼
            Image Quality Analysis
                     │
                     ▼
        AI Image Detection (HF Model)
                     │
                     ▼
         Authenticity Score Generator
                     │
                     ▼
      Groq Explanation Agent (LangGraph)
                     │
                     ▼
               React Dashboard
```

---

# Current Pipeline

1. User uploads an image.
2. FastAPI stores the uploaded image.
3. LangGraph orchestrates the analysis workflow.
4. Metadata and forensic signals are extracted.
5. Hugging Face vision model estimates synthetic media indicators.
6. Multiple signals are combined into an authenticity score.
7. Groq generates a human-readable explanation.
8. Results are displayed in the React dashboard.

---

# Project Structure

```
backend/
│
├── agents/
│   ├── metadata_agent.py
│   ├── image_agent.py
│   ├── ai_detector_agent.py
│   ├── trust_score_agent.py
│   └── explanation_agent.py
│
├── models/
│   ├── detector_*.py
│   └── ai_detector.py
│
├── graph.py
├── state.py
└── main.py

frontend/
│
├── src/
├── components/
└── pages/
```

---

# Roadmap

## Phase 1 (Current)

- ✅ Image authenticity analysis
- ✅ Explainable AI reports
- ✅ LangGraph workflow
- ✅ Hugging Face detector integration

---

## Phase 2

- Multi-model detector ensemble
- Image type classification
    - Camera photo
    - Screenshot
    - Social media image
    - Document
- Confidence calibration
- Improved authenticity scoring

---

## Phase 3

- Video authenticity analysis
- Keyframe extraction
- Deepfake detection
- Audio authenticity analysis
- Timeline visualization

---

## Phase 4

- Browser extension
- REST API
- Batch analysis
- PDF authenticity reports
- User history and dashboards

---

# Challenges

One of the major engineering challenges was evaluating AI-generated image detectors.

Instead of relying on a single model, TrustLens benchmarks multiple Hugging Face models against a curated dataset of:

- Real photographs
- Screenshots
- AI-generated images

This evaluation highlighted the limitations of current detectors and reinforced the need for multi-signal authenticity assessment rather than relying on a single AI model.

---

# Future Vision

TrustLens aims to become an explainable AI media verification platform capable of analyzing:

- Images
- Videos
- Audio
- Documents

using a combination of:

- Computer Vision
- AI Forensics
- Agentic AI (LangGraph)
- LLM Reasoning
- Explainable AI

to help users make informed decisions about digital media authenticity.

---

## Author

**Vartika Agrawal**

Frontend & AI Systems Engineer

```

## One suggestion

I would **not** call the score **"AI generation probability"** anymore.

Throughout the README, I'd rename it to one of these:

- **Synthetic Content Score** ⭐ (my favorite)
- Detector Confidence
- Synthetic Media Score
- AI Detection Score

This better reflects what the model is actually producing and avoids implying a precise probability that the image is AI-generated. It also aligns better with the multi-signal approach you're building toward.
