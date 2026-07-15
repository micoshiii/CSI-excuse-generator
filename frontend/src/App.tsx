import { useState } from "react";
import { History } from "lucide-react";
import NameForm from "./components/NameForm";
import ExcuseCard from "./components/ExcuseCard";
import HistoryList from "./components/HistoryList";
import { PawTrail, StickyNote, Blob } from "./components/Decorations";
import { fetchExcuse, fetchHistory } from "./api/excuseApi";
import type { Excuse, HistoryItem } from "./types";

export default function App() {
  const [excuse, setExcuse] = useState<Excuse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleGenerate = async (name: string) => {
    setLoading(true);
    setError(null);

    try {
      const newExcuse = await fetchExcuse(name);
      setExcuse(newExcuse);

      const updatedHistory = await fetchHistory(name);
      setHistory(updatedHistory);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Blob className="absolute -top-10 -left-16 w-64 opacity-40 -z-10" color="#f5a3a0" />
      <Blob className="absolute top-1/3 -right-20 w-72 opacity-30 -z-10" color="#b8a9f0" />
      <PawTrail className="absolute top-10 left-10 w-64 hidden md:block -z-10" />
      <PawTrail className="absolute top-24 right-10 w-64 hidden md:block -z-10 scale-x-[-1]" />

      <StickyNote
        text="Excuses get wilder as you go!"
        color="#f2665a"
        rotate="-6deg"
        className="absolute bottom-24 left-4 hidden lg:block"
      />
      <StickyNote
        text="Use wisely. Abuse risk."
        color="#7b6ef6"
        rotate="5deg"
        className="absolute bottom-24 right-4 hidden lg:block"
      />

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐱</span>
            <div>
              <div className="font-display font-bold text-lg leading-tight">ExcuseGen</div>
              <div className="text-xs text-[#f2665a] font-semibold leading-tight">Invent. Escape. Repeat.</div>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold text-sm hover:bg-[#f2665a]/5 transition"
            style={{ borderColor: "var(--color-coral)", color: "var(--color-coral)" }}
          >
            <History size={16} />
            History
          </button>
        </div>

        <div className="text-center space-y-3">
          <h1 className="font-display font-bold text-5xl leading-tight">
            The Excuse
            <br />
            <span style={{ color: "var(--color-coral)" }}>Generator</span>
          </h1>
          <p className="text-gray-500 font-semibold">
            Now with a memory. It gets{" "}
            <span style={{ color: "var(--color-coral)" }}>worse</span> every time.
          </p>
        </div>

        <NameForm onSubmit={handleGenerate} loading={loading} />

        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-semibold">{error}</div>
        )}

        <ExcuseCard excuse={excuse} />
      </div>

        

      <HistoryList history={history} isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
}