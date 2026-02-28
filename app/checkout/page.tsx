"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const designId = searchParams.get("design_id");
  const orderId = searchParams.get("order_id");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [design, setDesign] = useState<{ title?: string; price?: number; image_url?: string } | null>(null);

  useEffect(() => {
    if (designId) {
      fetch(`/api/designs/${designId}`)
        .then(r => r.json())
        .then(d => setDesign(d))
        .catch(() => {});
    }
  }, [designId]);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payments/sslcommerz-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design_id: designId, order_id: orderId, name, phone, address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "পেমেন্ট ইনিশিয়েট সমস্যা");
      // Redirect to SSLCommerz gateway
      window.location.href = data.GatewayPageURL;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">চেকআউট</h1>
      {design && (
        <div className="bg-red-50 rounded-xl p-4 mb-6 flex gap-3 items-center">
          {design.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={design.image_url} alt={design.title} className="w-16 h-16 object-cover rounded-lg" />
          )}
          <div>
            <p className="font-semibold">{design.title}</p>
            <p className="text-red-600 font-bold">৳{design.price?.toLocaleString()}</p>
          </div>
        </div>
      )}
      <form onSubmit={handlePay} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">নাম</label>
          <input required value={name} onChange={(e) => setName(e.target.value)}
            placeholder="আপনার পূর্ণ নাম" className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ফোন নম্বর</label>
          <input required value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX" className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ডেলিভারি ঠিকানা</label>
          <textarea required value={address} onChange={(e) => setAddress(e.target.value)}
            placeholder="বিস্তারিত ঠিকানা" rows={3} className="border rounded px-3 py-2 w-full" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50">
          {loading ? "প্রসেস হচ্ছে..." : "bKash / SSLCommerz দিয়ে পেমেন্ট করুন"}
        </button>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8">লোড হচ্ছে...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
