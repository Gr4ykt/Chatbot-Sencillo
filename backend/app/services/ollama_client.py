import json
from collections.abc import AsyncIterator

import httpx

from app.config import settings


class OllamaError(Exception):
    pass


async def stream_chat(messages: list[dict]) -> AsyncIterator[str]:
    """Consulta a Ollama y devuelve el texto a medida que se genera."""
    payload = {
        "model": settings.model,
        "messages": messages,
        "stream": True,
        "options": {"num_ctx": settings.num_ctx},
    }
    timeout = httpx.Timeout(connect=5.0, read=settings.read_timeout, write=10.0, pool=5.0)

    try:
        async with httpx.AsyncClient(base_url=settings.ollama_url, timeout=timeout) as client:
            async with client.stream("POST", "/api/chat", json=payload) as resp:
                if resp.status_code != 200:
                    detail = (await resp.aread()).decode(errors="ignore")[:200]
                    raise OllamaError(f"Ollama respondió {resp.status_code}: {detail}")

                async for line in resp.aiter_lines():
                    if not line:
                        continue
                    data = json.loads(line)
                    if "error" in data:
                        raise OllamaError(data["error"])
                    chunk = data.get("message", {}).get("content", "")
                    if chunk:
                        yield chunk
                    if data.get("done"):
                        break
    except httpx.HTTPError as exc:
        raise OllamaError(f"No se pudo conectar con Ollama: {exc}") from exc