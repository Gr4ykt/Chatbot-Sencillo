export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
}

export interface ChatRequest {
  messages: Pick<Message, "role" | "content">[];
}