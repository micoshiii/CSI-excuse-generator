export interface Excuse {
  text: string;
  tier: number;
  source: "STATIC" | "AI";
}

export interface HistoryItem {
  text: string;
  tier: number;
  createdAt: string;
}