const KEY = "typequest-session-id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem(KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem(KEY, sid);
  }
  return sid;
}

export function clearSession() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}
