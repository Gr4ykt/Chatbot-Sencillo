import os


class Settings:
    ollama_url: str = os.getenv("OLLAMA_URL", "http://ollama:11434")
    model: str = os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b")
    num_ctx: int = int(os.getenv("NUM_CTX", "2048"))
    max_messages: int = int(os.getenv("MAX_MESSAGES", "20"))
    read_timeout: float = float(os.getenv("READ_TIMEOUT", "300"))
    system_prompt: str = os.getenv(
        "SYSTEM_PROMPT",
        "Eres un asistente útil y conciso. Responde siempre en español.",
    )
    allowed_origins: list[str] = [
        o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()
    ]


settings = Settings()