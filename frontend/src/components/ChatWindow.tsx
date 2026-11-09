"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const { messages, loading, error, send, stop, reset } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <h1 className="text-base font-semibold text-white">Chatbot IA</h1>
        <button
          onClick={reset}
          className="text-xs text-slate-400 hover:text-white"
        >
          Nueva conversación
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="mt-10 text-center text-sm text-slate-500">
            Escribe un mensaje para comenzar.
          </p>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {error && <p className="text-center text-sm text-red-400">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <ChatInput loading={loading} onSend={send} onStop={stop} />
    </div>
  );
}