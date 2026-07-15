import { useState } from "react";

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
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-blue-700 transition"
      >
        {loading ? "Generating..." : "Generate Excuse"}
      </button>
    </form>
  );
}