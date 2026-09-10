# Module 10: Python FastAPI AI Microservice & Gemini Specification

---

## 1. AI Architecture & Microservice Design

The SupportSense AI intelligence layer runs as an autonomous, high-throughput Python microservice built on **FastAPI**, **Pydantic v2**, and the **Google Gemini SDK** (`google-generativeai` with `gemini-1.5-flash`). It is designed for sub-second latency, deterministic structured JSON outputs, and graceful degradation during network partitions.

```
[ Express Backend (Port 5000) ]
        |
        |  REST JSON (Connection Keep-Alive, 5.0s Timeout)
        v
[ FastAPI Ingress Router (/api/v1/ai/...) ]
        |
        +---> [ Pydantic Schema Validation & Sanitization ]
        |
        +---> [ SHA-256 In-Memory TTL Response Cache (_RESPONSE_CACHE) ]
        |       |-- HIT  --> Return cached JSON in < 1ms
        |       +-- MISS --> Proceed to Generation Pipeline
        |
        +---> [ Model Instance Pool (_MODEL_CACHE) ]
        |       +-- Reuses pre-instantiated genai.GenerativeModel objects
        |
        +---> [ Asynchronous Non-Blocking LLM Dispatch ]
                |-- Gemini 1.5 Flash (asyncio.wait_for with 4.5s ceiling)
                +-- Fallback: Deterministic Heuristic Engine if timeout / offline
```

---

## 2. Gemini Client Engineering & Optimization Architecture

The core engine in [`ai-service/app/core/gemini_client.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/core/gemini_client.py) implements three production performance optimizations:

### 2.1 Model Instance Pooling (`_MODEL_CACHE`)
Instantiating `genai.GenerativeModel` repeatedly incurs significant Python object allocation and SDK configuration overhead. SupportSense AI caches model instances using a composite cache key:

$$\text{Cache Key} = (\text{model\_name}, \text{system\_instruction}, \text{response\_mime\_type})$$

```python
_MODEL_CACHE: Dict[Tuple[str, Optional[str], str], genai.GenerativeModel] = {}

def get_or_create_model(
    model_name: str,
    system_instruction: Optional[str] = None,
    response_mime_type: str = "application/json"
) -> genai.GenerativeModel:
    cache_key = (model_name, system_instruction, response_mime_type)
    if cache_key in _MODEL_CACHE:
        return _MODEL_CACHE[cache_key]

    model = genai.GenerativeModel(
        model_name=model_name,
        system_instruction=system_instruction,
        generation_config={
            "response_mime_type": response_mime_type,
            "temperature": 0.1,  # Low temperature for deterministic output
            "top_p": 0.95
        }
    )
    _MODEL_CACHE[cache_key] = model
    return model
```

### 2.2 SHA-256 In-Memory TTL Response Caching (`_RESPONSE_CACHE`)
Repeated queries (e.g. duplicate status checks, common user triage queries, identical polish requests) bypass the Google Gemini API entirely:
- **Hashing**: `hashlib.sha256(f"{system_instruction}___{prompt_text}".encode("utf-8")).hexdigest()`.
- **TTL**: 300 seconds (5 minutes).
- **Capacity & Eviction**: 500 entries maximum; evicts the oldest 20% (100 entries) when full.
- **Latency**: Serves identical requests in **< 1ms**.

### 2.3 Non-Blocking Event-Loop Asynchrony
All high-volume endpoints use `generate_json_response_async` calling `model.generate_content_async`:
- Wrapped in `asyncio.wait_for(..., timeout=4.5)` to guarantee the FastAPI worker never stalls.
- If Gemini times out (>4.5s) or throws a network exception, the engine catches it and seamlessly serves the deterministic heuristic fallback payload with confidence calibrated to 0.50.

---

## 3. Implemented AI Capabilities & Services

SupportSense AI provides 10 specialized AI capabilities across 6 service modules:

| Capability | Module File | Description | Core Model Output |
| :--- | :--- | :--- | :--- |
| **AI Concierge & Ticket Crafter** | [`concierge_service.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/services/concierge_service.py) | Interactive customer chatbot that parses conversational queries and synthesizes enterprise support tickets | Markdown spec, checklist, mood, patience, predicted SLA |
| **1-Click Tone Polishing** | [`concierge_service.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/services/concierge_service.py) | Rewrites agent drafts into Empathetic, Concise, Formal, or Technical styles | Polished text, rationale |
| **Mood & Patience Detection** | [`triage_service.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/services/triage_service.py) | Evaluates sentiment polarity and customer urgency state | `HAPPY`, `NEUTRAL`, `FRUSTRATED`; Patience: `CALM` to `CRITICAL` |
| **Predicted Resolution Time** | [`triage_service.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/services/triage_service.py) | Statistical forecast grounded in historical Kaggle/Bitext benchmarks | E.g. *"1–2 business days"*, *"2–4 hours"* |
| **Agent Assist Checklist** | [`triage_service.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/services/triage_service.py) | Generates 3–5 step-by-step verification checkboxes for agents | Actionable checklist array |
| **Suggested Empathy Reply** | [`triage_service.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/services/triage_service.py) | Pre-drafted de-escalation response for human agent review | Suggested reply body, tone summary |
| **Response Quality Checker** | [`quality_service.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/services/quality_service.py) | Audits agent draft responses across 4 communication pillars | Professionalism, Empathy, Clarity, Actionability (0–100) |
| **Reopened Timeline Summary** | [`triage_service.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/services/triage_service.py) | Condenses multi-turn threaded conversations into 5–6 chronological bullets | Formatted bullet summary, root cause |
| **Weekly Learning Insights** | [`insights_service.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/services/insights_service.py) | Aggregates ticket patterns to reveal recurring bugs and FAQ gaps | Top issues, agent mistakes, FAQ recommendations |
| **Department Auto-Responder** | [`auto_reply_service.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/services/auto_reply_service.py) | Autonomous evaluation and reply dispatch for 4 enterprise departments | Trigger decision, department reply, audit actions |

---

## 4. Specialized Prompt Engineering Standards

All 8 prompt templates in [`ai-service/app/prompts/templates.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/prompts/templates.py) follow strict operational guidelines:
1. **Explicit Role Framing**: E.g. *"You are SupportSense AI Concierge — an empathetic, ultra-smart enterprise customer support assistant."*
2. **Strict JSON Constraints**: Prompts require exact key schemas with escaped delimiters (`{{ ... }}`).
3. **Deterministic Generation Parameters**: `temperature: 0.1` and `top_p: 0.95` to eliminate hallucination and formatting drift.
4. **Anti-Gaming Urgency Defense**: Prompts explicitly decouple customer emotion or uppercase shouting ("URGENT", "EMERGENCY", "HELP NOW!!!") from technical priority. A customer shouting about a profile photo change is triaged as `MOOD: Frustrated`, `PATIENCE: Concerned`, but `PRIORITY: LOW`. Priority is reserved strictly for verifiable business outages, financial errors, or security breaches.
5. **Tone Polisher 3-Variation Cycling & Anti-Nesting**:
   - Accepts `variation_number: 1, 2, or 3` in `AI_TONE_POLISH_PROMPT`.
   - Variation 1 provides a direct, structured solution.
   - Variation 2 provides a warm, consultative partnership response.
   - Variation 3 provides an action-oriented, proactive next-step plan.
   - Strips existing customer or agent greetings/sign-offs before generating output to prevent recursive nesting (e.g. *"Dear Sarah, Hi Sarah, Hello Sarah"*).
6. **Human-in-the-Loop Safeguards**: Prompt rules strictly prevent the model from promising irreversible financial refunds or system changes without human verification.

---

## 5. Complete FastAPI REST Endpoint Reference

All endpoints are mounted under `/api/v1` in [`ai-service/app/api/router.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/api/router.py):

| Method | Endpoint | Request Model | Response Model | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/ai/triage` | `TriageRequest` | `dict` | Classifies category, priority, mood, patience, resolution ETA, checklist, and suggested reply. |
| `POST` | `/ai/concierge/chat` | `ConciergeChatRequest` | `dict` | Interactive conversational concierge; synthesizes formal ticket draft with markdown structure. |
| `POST` | `/ai/polish-tone` | `TonePolishRequest` | `dict` | 1-Click tone polishing into Empathetic, Concise, Formal, or Technical tone. |
| `POST` | `/ai/department-auto-reply` | `DepartmentAutoReplyRequest` | `dict` | Evaluates departmental eligibility and generates automated confirmation reply. |
| `POST` | `/ai/verify-response` | `QualityCheckRequest` | `dict` | Evaluates agent draft reply across 4 communication pillars (0–100 scores). |
| `POST` | `/ai/summarize-timeline` | `TimelineSummaryRequest` | `dict` | Summarizes multi-turn thread history into a 5–6 bullet chronological brief. |
| `GET` | `/ai/insights` | *None* | `dict` | Returns aggregated weekly friction drivers, agent mistakes, and recommended FAQs. |
| `GET` | `/ai/departments/definitions` | *None* | `dict` | Returns configured support departments, allowed categories, and auto-reply policies. |
| `GET` | `/ai/datasets/benchmark-metrics` | *None* | `dict` | Retrieves benchmark resolution metrics derived from Kaggle & Hugging Face datasets. |
| `GET` | `/ai/datasets/stream-sample` | Query params: `dataset_name`, `limit` | `dict` | Streams live sample records from Hugging Face dataset for demo & verification. |

---

## 6. Dataset Integration & Benchmark Engine

[`ai-service/app/services/dataset_service.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/services/dataset_service.py) grounds AI predictions in empirical customer support data:
- **Kaggle Customer Support Ticket Dataset**: Loads local CSV benchmarks (`Customer Support Ticket Dataset/customer_support_tickets.csv`) calculating category-level average resolution durations, satisfaction ratings, and priority distributions.
- **Hugging Face Streaming**: Streams live records from `bitext/Bitext-customer-support-llm-chatbot-training-dataset` to validate conversational intents and agent templates.
- **Enterprise Department Registry**: Manages policy rules for the 4 core departments:
  1. *Finance & Billing* (Categories: Billing, Subscriptions, Refunds)
  2. *Technical Support* (Categories: Technical, Bug, Outage)
  3. *Identity & Access* (Categories: Account, SSO, MFA, Authentication)
  4. *API Platform Team* (Categories: Technical, API, Webhooks, Integrations)

---

## 7. Interactive API Documentation

FastAPI automatically generates interactive OpenAPI documentation accessible when the service is running:
- **Swagger UI**: `http://localhost:8000/api/v1/docs`
- **ReDoc UI**: `http://localhost:8000/api/v1/redoc`
- **OpenAPI Schema**: `http://localhost:8000/api/v1/openapi.json`
