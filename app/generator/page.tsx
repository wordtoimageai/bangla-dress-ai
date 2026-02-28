"use client";
import { useState } from "react";

const MEASUREMENTS = [
  { key: "bust", label: "বুক (ইঞ্চ)", placeholder: "38" },
  { key: "waist", label: "কোমর (ইঞ্চ)", placeholder: "32" },
  { key: "hip", label: "নিতম্ব (ইঞ্চ)", placeholder: "40" },
  { key: "height", label: "উচ্চতা (ইঞ্চ)", placeholder: "62" },
  { key: "sleeve", label: "হাতা (ইঞ্চ)", placeholder: "24" },
  { key: "kameez_length", label: "কামিজ দৈর্ঘ্য (ইঞ্চ)", placeholder: "42" },
];

export default function GeneratorPage() {
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [style, setStyle] = useState("ফরমাল");
  const [color, setColor] = useState("লাল");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ measurements, style, color, prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ডিজাইন তৈরি সমস্যা");
      setResult(data.image_url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-red-700 mb-6">AI ড্রেস জেনারেটর</h1>
      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {MEASUREMENTS.map((m) => (
            <div key={m.key}>
              <label className="block text-sm font-medium mb-1">{m.label}</label>
              <input
                type="number"
                placeholder={m.placeholder}
                value={measurements[m.key] || ""}
                onChange={(e) =>
                  setMeasurements((prev) => ({ ...prev, [m.key]: e.target.value }))
                }
                className="border rounded px-3 py-2 w-full text-sm"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">স্টাইল</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="border rounded px-3 py-2 w-full text-sm"
            >
              {["ফরমাল", "ক্যাজুয়াল", "ব্রাইডাল", "পার্টি"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">রং</label>
            <input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="লাল, সবুজ..."
              className="border rounded px-3 py-2 w-full text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">বিশেষ বর্ণনা (ঐচ্ছিক)</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="যেমন: ডিজিটাল প্রিন্ট, কাসাব সেলাই..."
            rows={3}
            className="border rounded px-3 py-2 w-full text-sm"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "AI তৈরি করছে..." : "AI দিয়ে ডিজাইন তৈরি করুন"}
        </button>
      </form>
      {result && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-3">আপনার AI ডিজাইন</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result} alt="Generated design" className="rounded-xl border mx-auto max-w-sm" />
        </div>
      )}
    </div>
  );
}
