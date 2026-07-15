import { useState } from "react";
import { User, Sparkles } from "lucide-react";

interface NameFormProps {
  onSubmit: (name: string) => void;
  loading: boolean;
}

export default function NameForm({ onSubmit, loading }: NameFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length === 0) return;
    onSubmit(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full">
      <div className="flex items-center flex-1 bg-white rounded-2xl px-4 border border-black/5 shadow-sm">
        <User size={18} className="text-gray-400" />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-3 py-3.5 bg-transparent focus:outline-none font-semibold text-[#2b2118] placeholder:text-gray-400 placeholder:font-normal"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-white shadow-sm disabled:opacity-50 transition hover:brightness-105 active:scale-[0.98]"
        style={{ backgroundColor: "var(--color-coral)" }}
      >
        <Sparkles size={16} />
        {loading ? "Generating..." : "Generate Excuse"}
      </button>
    </form>
  );
}