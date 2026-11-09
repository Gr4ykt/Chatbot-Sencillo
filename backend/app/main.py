import asyncio
import logging
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import chat

log = logging.getLogger("uvicorn.error")


async def _warmup() -> None:
    """Carga el modelo en RAM al arrancar, para que la primera consulta no espere."""
    try:
        async with httpx.AsyncClient(
            base_url=settings.ollama_url, timeout=settings.read_timeout
        ) as client:
            await client.post("/api/generate", json={"model": settings.model})
        log.info("Modelo %s precargado", settings.model)
    except httpx.HTTPError as exc:
        log.warning("No se pudo precargar el modelo: %s", exc)


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(_warmup())
    yield
    task.cancel()


app = FastAPI(title="Chatbot IA - Backend", lifespan=lifespan)

if settings.allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )

app.include_router(chat.router, prefix="/api")


@app.get("/api/health")
async def health():
    try:
        async with httpx.AsyncClient(base_url=settings.ollama_url, timeout=3) as client:
            r = await client.get("/api/tags")
            r.raise_for_status()
            models = [m["name"] for m in r.json().get("models", [])]
    except httpx.HTTPError:
        raise HTTPException(status_code=503, detail="Ollama no disponible")
    return {
        "status": "ok",
        "model": settings.model,
        "model_available": settings.model in models,
    }