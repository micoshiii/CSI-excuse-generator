export function PawTrail({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} fill="none">
      <path
        d="M20 20 Q 120 10, 180 60 T 380 100"
        stroke="#e8d9c5"
        strokeWidth="2"
        strokeDasharray="6 8"
        fill="none"
      />
      {[
        [20, 20], [110, 25], [200, 55], [290, 80], [370, 100],
      ].map(([cx, cy], i) => (
        <g key={i} opacity={0.5}>
          <ellipse cx={cx} cy={cy} rx="5" ry="4" fill="#e8d9c5" />
          <ellipse cx={cx - 6} cy={cy - 6} rx="2" ry="1.6" fill="#e8d9c5" />
          <ellipse cx={cx + 6} cy={cy - 6} rx="2" ry="1.6" fill="#e8d9c5" />
        </g>
      ))}
    </svg>
  );
}

function Cat({ color, className = "" }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={className} fill="none">
      <ellipse cx="55" cy="55" rx="50" ry="30" fill={color} />
      <path d="M15 45 L5 20 L28 38 Z" fill={color} />
      <path d="M75 38 L98 20 L88 45 Z" fill={color} />
      <path d="M95 60 Q120 55, 115 30" stroke="#000" strokeWidth="3" fill="none" opacity="0.85" />
      <circle cx="35" cy="48" r="2.2" fill="#000" opacity="0.85" />
      <circle cx="55" cy="48" r="2.2" fill="#000" opacity="0.85" />
      <path d="M42 56 Q45 59, 48 56" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.85" />
    </svg>
  );
}

export function CatRow() {
  const cats = [
    { color: "#c9b8a3" },
    { color: "#f2665a" },
    { color: "#f5a3a0" },
    { color: "#b8a9f0" },
    { color: "#f5a94e" },
  ];

  return (
    <div className="flex items-end justify-center gap-2">
      {cats.map((cat, i) => (
        <Cat key={i} color={cat.color} className="w-20 sm:w-24 opacity-90" />
      ))}
    </div>
  );
}

export function StickyNote({
  text,
  color,
  rotate = "-4deg",
  className = "",
}: {
  text: string;
  color: string;
  rotate?: string;
  className?: string;
}) {
  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-md text-white text-xs font-bold leading-snug w-32 ${className}`}
      style={{ backgroundColor: color, transform: `rotate(${rotate})` }}
    >
      {text}
    </div>
  );
}

export function Blob({ className = "", color = "#f5a3a0" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <path
        d="M45,-58C58,-49,68,-35,71,-20C74,-5,70,12,61,26C52,40,38,51,22,58C6,65,-12,68,-28,62C-44,56,-58,42,-65,25C-72,8,-72,-12,-63,-27C-54,-42,-37,-52,-20,-59C-3,-66,15,-70,45,-58Z"
        fill={color}
        transform="translate(100 100)"
      />
    </svg>
  );
}