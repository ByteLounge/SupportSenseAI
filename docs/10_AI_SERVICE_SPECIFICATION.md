# Module 10: Python FastAPI AI Microservice & Gemini Specification

---

## 1. AI Architecture & Microservice Design

The AI service runs as a lightweight, independent Python microservice built with **FastAPI** and **Google Gemini SDK** (`google-generativeai` / `gemini-1.5-flash`):

```
[ Express Backend ]
        |
        v REST POST /api/v1/ai/...
[ FastAPI Router ]
        |
        v (Input Validation via Pydantic)
[ AI Service Engine ]
        |
        +---> [ Prompt Templates (Structured JSON output constraints) ]
        |
        +---> [ Gemini API Client (With automatic fallback & confidence scoring) ]
```

---

## 2. Implemented AI Features & Novel Capabilities

1. **AI Mood Indicator**: Categorizes customer emotion into `🙂 HAPPY`, `😐 NEUTRAL`, or `😠 FRUSTRATED` with exact confidence ratings (e.g. 0.945).
2. **Customer Patience Score**: Tracks customer urgency (`CALM`, `CONCERNED`, `FRUSTRATED`, `CRITICAL`).
3. **Resolution Predictor**: Forecasts estimated resolution duration (e.g. *"1–2 business days"*).
4. **Agent Assist Checklist**: Generates 3-5 actionable step-by-step verification checkboxes tailored to ticket contents.
5. **Response Quality Checker**: Evaluates agent draft replies across 4 metrics: Professionalism, Empathy, Clarity, Actionability (0-100 scales).
6. **Timeline Summarizer**: Generates 5-6 bullet point chronological history when tickets are reopened or reassigned.
7. **Weekly Learning Insights**: Synthesizes top repeated issues, agent handling mistakes, and FAQ additions.

---

## 3. Swagger / FastAPI Documentation

- **Swagger Interface**: `http://localhost:8000/api/v1/docs`
- **ReDoc Interface**: `http://localhost:8000/api/v1/redoc`
