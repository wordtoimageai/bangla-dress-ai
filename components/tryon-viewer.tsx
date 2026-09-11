"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Design {
  id: string;
  title: string;
  image_url?: string;
  [key: string]: unknown;
}

interface TryonViewerProps {
  design: Design;
}

export default function TryonViewer({ design }: TryonViewerProps) {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUserImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleTryOn = async () => {
    if (!userImage || !design.image_url) {
      setError("ছবি আপলোড করুন");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          human_image: userImage,
          garment_image: design.image_url,
        }),
      });
      const data = await res.json();
      if (data.output) {
        setResult(data.output);
      } else {
        throw new Error(data.error || "ব্যর্থ হয়েছে");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border rounded-xl p-6 bg-slate-50">
      <h2 className="text-xl font-bold mb-4">ভার্চুয়াল ট্রাই-অন</h2>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">আপনার ছবি আপলোড করুন</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
          />
        </div>
        {userImage && (
          <div className="flex gap-4 items-start">
            <div>
              <p className="text-xs text-gray-500 mb-1">আপনার ছবি</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={userImage} alt="user" className="w-32 h-40 object-cover rounded-lg border" />
            </div>
            {design.image_url && (
              <div>
                <p className="text-xs text-gray-500 mb-1">পোশাক</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={design.image_url} alt={design.title} className="w-32 h-40 object-cover rounded-lg border" />
              </div>
            )}
          </div>
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button
          onClick={handleTryOn}
          disabled={loading || !userImage}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {loading ? "লোড হচ্ছে..." : "ট্রাই-অন করুন"}
        </Button>
        {result && (
          <div>
            <p className="text-sm font-medium mb-2">ফলাফল:</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result} alt="tryon result" className="w-full max-w-md rounded-xl border shadow" />
          </div>
        )}
      </div>
    </div>
  );
}
