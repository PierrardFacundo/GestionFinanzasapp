const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type QueryValue = string | number | boolean | undefined | null;
type QueryLike = Record<string, QueryValue> | Record<string, unknown>;

function q(params?: QueryLike) {
  if (!params) return "";
  const sp = new URLSearchParams();

  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v as any));
  });

  const s = sp.toString();
  return s ? `?${s}` : "";
}

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export async function get<T>(path: string, params?: QueryLike): Promise<T> {
  const res = await fetch(`${BASE}${path}${q(params)}`, { method: "GET" });
  return handle<T>(res);
}

export async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return handle<T>(res);
}

export async function patch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return handle<T>(res);
}

export async function del<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { method: "DELETE" });
  return handle<T>(res);
}

