# TrustLens 🔍

TrustLens is an AI-powered media authenticity platform that helps users assess whether digital images are authentic or potentially AI-generated. Instead of relying on a single detector, TrustLens combines multiple forensic signals, computer vision techniques, and AI reasoning to generate an explainable authenticity assessment.

> **⚠️ Note:** TrustLens provides probabilistic assessments based on multiple signals. It is designed to assist human decision-making and should not be considered a definitive proof of authenticity or manipulation.

---

## ✨ Features

### ✅ Currently Implemented

- Upload and analyze images
- EXIF metadata extraction
- Resolution and megapixel analysis
- Noise estimation
- Sharpness analysis
- Face detection using OpenCV
- AI-generated image detection using Hugging Face Transformers
- Multi-stage analysis workflow using LangGraph
- Authenticity score generation
- Explainable AI analysis using Groq LLM
- Interactive React dashboard

---

## 🏗️ Tech Stack

### Frontend
- React.js
- TypeScript

### Backend
- Python
- FastAPI

### AI & Machine Learning
- LangGraph
- LangChain
- Hugging Face Transformers
- Groq
- OpenCV

---

## ⚙️ System Architecture

```
                  User Uploads Image
                           │
                           ▼
                    FastAPI Backend
                           │
                           ▼
                  LangGraph Orchestrator
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
 Metadata Analysis   Image Analysis    AI Detector
 (EXIF)              (OpenCV)         (Hugging Face)
        └──────────────────┼──────────────────┘
                           ▼
                 Authenticity Score Engine
                           │
                           ▼
               Groq Explanation Agent
                           │
                           ▼
                 React Results Dashboard
```

---

## 🔍 Current Analysis Pipeline

Every uploaded image goes through multiple analysis stages:

1. **Metadata Analysis**
   - EXIF metadata extraction
   - Metadata availability checks

2. **Image Quality Analysis**
   - Resolution
   - Megapixels
   - Noise estimation
   - Sharpness estimation
   - Face detection

3. **Synthetic Content Detection**
   - Hugging Face image classification models
   - Detector confidence calculation

4. **Authenticity Scoring**
   - Combines multiple forensic signals
   - Produces an overall authenticity score

5. **Explainable AI**
   - Groq LLM interprets the forensic findings
   - Generates a concise human-readable assessment

---

## 📂 Project Structure

```
TrustLens/

├── frontend/
│   ├── src/
│   ├── components/
│   └── pages/
│
├── backend/
│   ├── agents/
│   │   ├── metadata_agent.py
│   │   ├── image_agent.py
│   │   ├── ai_detector_agent.py
│   │   ├── trust_score_agent.py
│   │   └── explanation_agent.py
│   │
│   ├── models/
│   │   ├── ai_detector.py
│   │   └── detector_*.py
│   │
│   ├── graph.py
│   ├── state.py
│   └── main.py
│
└── README.md
```

---

## 🚀 Future Roadmap

### Phase 1 (Current)

- ✅ Image authenticity analysis
- ✅ Explainable AI reports
- ✅ LangGraph workflow
- ✅ Hugging Face detector integration

### Phase 2

- Multi-model detector benchmarking
- Ensemble AI detection
- Image type classification
  - Camera photos
  - Screenshots
  - Social media images
  - Documents
- Improved confidence calibration
- Better authenticity scoring

### Phase 3

- Video authenticity analysis
- Keyframe extraction
- Deepfake detection
- Audio authenticity analysis
- Timeline-based media verification

### Phase 4

- Browser extension
- REST API
- Batch media analysis
- PDF authenticity reports
- User history and dashboards

---

## 💡 Why TrustLens?

Current AI image detectors often produce false positives and false negatives, especially on screenshots, compressed images, and edited photographs.

TrustLens addresses this by combining:

- Computer vision analysis
- Metadata inspection
- AI-generated image detection
- Explainable LLM reasoning

rather than relying on a single AI model.

The long-term vision is to evolve TrustLens into a comprehensive **AI Media Trust Platform** capable of analyzing images, videos, audio, and documents using multi-agent AI workflows.

---

## 🔮 Vision

TrustLens aims to become an explainable AI platform for verifying digital media authenticity by combining:

- Agentic AI (LangGraph)
- Large Language Models
- Computer Vision
- AI Forensics
- Multi-model reasoning
- Explainable AI

to help users make informed decisions about the authenticity of digital content.

---

## 👩‍💻 Author

**Vartika Agrawal**

Frontend & AI Systems Engineer

---
⭐ If you found this project interesting, feel free to star the repository!
