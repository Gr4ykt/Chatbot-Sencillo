import type { Message } from "@/types/chat";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-indigo-600 text-white"
            : "rounded-bl-sm bg-slate-800 text-slate-100"
        }`}
      >
        {message.content || (
          <span className="animate-pulse text-slate-400">Pensando…</span>
        )}
      </div>
    </div>
  );
}