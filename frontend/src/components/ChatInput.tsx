"use client";

import { useState, type KeyboardEvent } from "react";

interface Props {
  loading: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

export default function ChatInput({ loading, onSend, onStop }: Props) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim() || loading) return;
    onSend(text);
    setText("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t border-slate-800 p-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        placeholder="Escribe tu mensaje… (Enter envía, Shift+Enter salta de línea)"
        className="max-h-32 flex-1 resize-none rounded-xl bg-slate-800 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {loading ? (
        <button
          onClick={onStop}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
        >
          Detener
        </button>
      ) : (
        <button
          onClick={submit}
          disabled={!text.trim()}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-40"
        >
          Enviar
        </button>
      )}
    </div>
  );
}