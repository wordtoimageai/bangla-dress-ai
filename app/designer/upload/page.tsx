"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const MEASUREMENT_FIELDS = [
  { key: "bust", label: "বুক" },
  { key: "waist", label: "কোমর" },
  { key: "hip", label: "নিতম্ব" },
  { key: "height", label: "উচ্চতা" },
  { key: "sleeve", label: "হাতা" },
  { key: "kameez_length", label: "কামিজ দৈর্ঘ্য" },
];

export default function DesignerUploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("ফরমাল");
  const [image, setImage] = useState<File | null>(null);
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) return setError("ছবি নির্বাচন করুন");
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("price", price);
      fd.append("category", category);
      fd.append("image", image);
      fd.append("measurements", JSON.stringify(
        Object.fromEntries(Object.entries(measurements).map(([k, v]) => [k, Number(v)]))
      ));
      const res = await fetch("/api/designer/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "আপলোড সমস্যা");
      router.push("/designer/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">নতুন ডিজাইন আপলোড</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="ডিজাইনের নাম" className="border rounded px-3 py-2 w-full" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="বিস্তারিত বর্ণনা" rows={3} className="border rounded px-3 py-2 w-full" />
        <div className="flex gap-3">
          <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)}
            placeholder="মূল্য (৳)" className="border rounded px-3 py-2 flex-1" />
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-3 py-2 flex-1">
            {["ফরমাল", "ক্যাজুয়াল", "ব্রাইডাল", "পার্টি"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ডিজাইন ছবি</label>
          <input required type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="text-sm" />
        </div>
        <div>
          <h3 className="font-medium mb-2">মাপজোখ (ইঞ্চ) - যাদের জন্য ডিজাইনটি তৈরি</h3>
          <div className="grid grid-cols-2 gap-3">
            {MEASUREMENT_FIELDS.map(f => (
              <div key={f.key}>
                <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
                <input type="number" value={measurements[f.key] || ""}
                  onChange={(e) => setMeasurements(p => ({ ...p, [f.key]: e.target.value }))}
                  className="border rounded px-2 py-1.5 w-full text-sm" />
              </div>
            ))}
          </div>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50">
          {loading ? "আপলোড হচ্ছে..." : "ডিজাইন দাখিল করুন"}
        </button>
      </form>
    </div>
  );
}
