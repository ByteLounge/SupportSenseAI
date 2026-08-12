"""
Main Application Entrypoint: main.py
Lead Engineer: Member 3 (AI Engineer)
Description: Boots up FastAPI AI microservice with CORS middleware and OpenAPI specs.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# Enable CORS for cross-origin backend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Router
app.include_router(router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {"status": "UP", "service": "SupportSense AI Microservice"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
