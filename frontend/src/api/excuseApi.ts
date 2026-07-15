import type { Excuse, HistoryItem } from "../types";

const BASE_URL = "http://localhost:3000/api";

export async function fetchExcuse(name: string): Promise<Excuse> {
  const res = await fetch(`${BASE_URL}/excuse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch excuse");
  }

  const data = await res.json();

  return {
    text: data.excuse,
    tier: data.tier,
    source: data.source,
  };
}

export async function fetchHistory(name: string): Promise<HistoryItem[]> {
  const res = await fetch(`${BASE_URL}/history/${encodeURIComponent(name)}`);

  if (!res.ok) {
    throw new Error("Failed to fetch history");
  }

  const data = await res.json();
  return data.history;
}