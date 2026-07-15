import type { HistoryItem } from "../types";

interface HistoryListProps {
  history: HistoryItem[];
}

export default function HistoryList({ history }: HistoryListProps) {
  if (history.length === 0) {
    return <p className="text-gray-400 text-sm">No excuses generated yet.</p>;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">History</h2>
      <ul className="space-y-2">
        {history.map((item, i) => (
          <li key={i} className="p-3 rounded-lg bg-gray-50 text-sm text-gray-700 flex justify-between">
            <span>{item.text}</span>
            <span className="text-gray-400 ml-3 whitespace-nowrap">Tier {item.tier}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}