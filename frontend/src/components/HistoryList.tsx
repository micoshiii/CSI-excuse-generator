import { X, Clock } from "lucide-react";
import type { HistoryItem } from "../types";

interface HistoryListProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

const tierDotColors: Record<number, string> = {
  1: "#4caf7d",
  2: "#7b6ef6",
  3: "#f5a94e",
  4: "#f2665a",
  5: "#f2665a",
};

const tierBadgeStyles: Record<number, string> = {
  1: "bg-green-100 text-green-700",
  2: "bg-[#EDE9FE] text-[#7B6EF6]",
  3: "bg-orange-100 text-orange-700",
  4: "bg-red-100 text-[#F2665A]",
  5: "bg-red-100 text-[#F2665A]",
};

function believabilityFor(tier: number) {
  return Math.max(10, 100 - tier * 18);
}

export default function HistoryList({ history, isOpen, onClose }: HistoryListProps) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#f4faf5] shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white">
                <Clock size={16} />
              </div>
              <h2 className="font-display text-xl font-bold">Excuse History</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition"
            >
              <X size={16} />
            </button>
          </div>

          {history.length === 0 ? (
            <p className="text-gray-400 text-sm">No excuses generated yet.</p>
          ) : (
            <div className="relative pl-4 space-y-4 border-l-2 border-dashed border-gray-300">
              {history.map((item, i) => (
                <div key={i} className="relative pl-4">
                  <span
                    className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full border-2 border-white"
                    style={{ backgroundColor: tierDotColors[item.tier] }}
                  />
                  <div className="p-4 rounded-2xl bg-white shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tierBadgeStyles[item.tier]}`}>
                        Tier {item.tier}
                      </span>
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-full"
                        style={{ backgroundColor: "#fde8e6", color: "var(--color-coral)" }}
                      >
                        {believabilityFor(item.tier)}%
                      </span>
                    </div>
                    <p className="text-sm text-[#2b2118]">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}