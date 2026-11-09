import axios from "axios";
import type { ChatRequest } from "@/types/chat";

const http = axios.create({ baseURL: "/api" });

export async function streamChat(
  body: ChatRequest,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const res = await http.post<ReadableStream<Uint8Array>>("/chat", body, {
    adapter: "fetch",
    responseType: "stream",
    signal,
  });

  const reader = res.data.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}