import { Sparkles } from "lucide-react";
import type { Excuse } from "../types";

interface ExcuseCardProps {
  excuse: Excuse | null;
}

const tierBadgeStyles: Record<number, string> = {
  1: "bg-green-100 text-green-700",
  2: "bg-[#EDE9FE] text-[#7B6EF6]",
  3: "bg-orange-100 text-orange-700",
  4: "bg-red-100 text-[#F2665A]",
  5: "bg-red-100 text-[#F2665A]",
};

export default function ExcuseCard({ excuse }: ExcuseCardProps) {
  if (!excuse) {
    return (
      <div className="w-full p-10 rounded-3xl border border-dashed border-black/10 text-center text-gray-400 font-semibold">
        Your excuse will appear here. Good luck.
      </div>
    );
  }

  const believability = Math.max(10, 100 - excuse.tier * 18);

  return (
    <div className="w-full p-7 rounded-3xl bg-white shadow-sm border border-black/5 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${tierBadgeStyles[excuse.tier]}`}>
            Tier {excuse.tier}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-gray-400">
            <Sparkles size={12} />
            {excuse.source === "AI" ? "AI Generated" : "Classic"}
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 font-semibold">Believability</div>
          <div className="text-2xl font-display font-bold" style={{ color: "var(--color-purple)" }}>
            {believability}%
          </div>
        </div>
      </div>

      <p className="font-display text-lg leading-relaxed text-[#2b2118]">
        {excuse.text}
      </p>
    </div>
  );
}