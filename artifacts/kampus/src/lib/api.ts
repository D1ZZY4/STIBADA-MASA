export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const token = localStorage.getItem("kampus_token");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`/api${path}`, { ...options, headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: "Terjadi kesalahan" }));
    throw new Error(payload.error || "Terjadi kesalahan");
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export function trackEvent(event: string, path = window.location.pathname) {
  apiFetch("/analytics/event", {
    method: "POST",
    body: JSON.stringify({ event, path }),
  }).catch(() => undefined);
}