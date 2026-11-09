"use client";

import { useCallback, useRef, useState } from "react";
import axios from "axios";
import { streamChat } from "@/services/api";
import type { Message } from "@/types/chat";

// crypto.randomUUID() solo existe en HTTPS/localhost; en EC2 por HTTP fallaría.
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || loading) return;

      const userMsg: Message = { id: newId(), role: "user", content };
      const assistantId = newId();
      const history = [...messages, userMsg];

      setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await streamChat(
          { messages: history.map(({ role, content }) => ({ role, content })) },
          (chunk) =>
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + chunk } : m
              )
            ),
          controller.signal
        );
      } catch (e) {
        if (!axios.isCancel(e)) {
          setError("No se pudo obtener respuesta del servidor.");
        }
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [messages, loading]
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, send, stop, reset };
}