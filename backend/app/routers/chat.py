import logging

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.config import settings
from app.schemas import ChatRequest
from app.services.ollama_client import OllamaError, stream_chat

router = APIRouter()
log = logging.getLogger("chat")


@router.post("/chat")
async def chat(req: ChatRequest):
    history = [m.model_dump() for m in req.messages][-settings.max_messages :]
    messages = [{"role": "system", "content": settings.system_prompt}, *history]

    stream = stream_chat(messages)

    # Se espera el primer fragmento antes de responder: así un error de
    # conexión o de modelo inexistente devuelve un 503 real y no un stream roto.
    try:
        first = await anext(stream)
    except StopAsyncIteration:
        first = ""
    except OllamaError as exc:
        log.error("Fallo al iniciar el stream: %s", exc)
        raise HTTPException(status_code=503, detail="El modelo no está disponible")

    async def body():
        if first:
            yield first
        try:
            async for chunk in stream:
                yield chunk
        except OllamaError as exc:
            log.error("Fallo durante el stream: %s", exc)
            yield "\n\n[Se interrumpió la respuesta del modelo]"

    return StreamingResponse(
        body(),
        media_type="text/plain; charset=utf-8",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )