import { useState } from "react";
import NameForm from "./components/NameForm";
import ExcuseCard from "./components/ExcuseCard";
import HistoryList from "./components/HistoryList";
import { fetchExcuse, fetchHistory } from "./api/excuseApi";
import type { Excuse, HistoryItem } from "./types";

export default function App() {
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [excuse, setExcuse] = useState<Excuse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (name: string) => {
    setLoading(true);
    setError(null);
    setCurrentName(name);

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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">The Excuse Generator</h1>
          <p className="text-gray-500">Now with a memory. It gets worse every time.</p>
        </div>

        <NameForm onSubmit={handleGenerate} loading={loading} />

        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
        )}

        <ExcuseCard excuse={excuse} />

        {currentName && <HistoryList history={history} />}
      </div>
    </div>
  );
}