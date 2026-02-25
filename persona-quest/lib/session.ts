import { v4Style } from "./uid";

const SESSION_KEY = "persona-quest-session";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = v4Style();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
