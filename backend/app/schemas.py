from typing import Literal

from pydantic import BaseModel, Field


class Message(BaseModel):
    # El cliente no puede enviar "system": ese rol lo fija el servidor
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    messages: list[Message] = Field(min_length=1, max_length=50)