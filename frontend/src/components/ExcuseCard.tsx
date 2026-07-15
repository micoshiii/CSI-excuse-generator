import type { Excuse } from "../types";

interface ExcuseCardProps {
  excuse: Excuse | null;
}

const tierColors: Record<number, string> = {
  1: "bg-green-100 text-green-800",
  2: "bg-blue-100 text-blue-800",
  3: "bg-yellow-100 text-yellow-800",
  4: "bg-orange-100 text-orange-800",
  5: "bg-red-100 text-red-800",
};

export default function ExcuseCard({ excuse }: ExcuseCardProps) {
  if (!excuse) return null;

  const believability = Math.max(10, 100 - excuse.tier * 18);

  return (
    <div className="p-6 rounded-xl border border-gray-200 shadow-sm bg-white space-y-3">
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tierColors[excuse.tier]}`}>
          Tier {excuse.tier}
        </span>
        <span className="text-xs text-gray-400">{excuse.source}</span>
      </div>
      <p className="text-lg text-gray-800">{excuse.text}</p>
      <div className="text-sm text-gray-500">Believability: {believability}%</div>
    </div>
  );
}