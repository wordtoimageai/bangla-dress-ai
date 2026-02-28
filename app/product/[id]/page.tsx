import { createServerSupabaseClient } from "@/lib/supabase-server";
import TryonViewer from "@/components/tryon-viewer";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: design } = await supabase
    .from("designs")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!design) notFound();

  const measurements = design.measurements as Record<string, number> | null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={design.image_url}
            alt={design.title}
            className="w-full rounded-2xl border shadow"
          />
        </div>
        {/* Details */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{design.title}</h1>
          <p className="text-gray-500">{design.description}</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-red-600">৳{design.price?.toLocaleString()}</span>
            <span className="text-sm text-gray-400">টাকা</span>
          </div>
          {/* Measurements hint */}
          {measurements && (
            <div className="bg-red-50 rounded-xl p-4 text-sm">
              <h3 className="font-semibold mb-2">মাপজোখ (ইঞ্চ)</h3>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(measurements).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{k}:</span>
                    <span className="font-medium">{v}"</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={`/checkout?design_id=${design.id}`}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-red-700"
            >
              অর্ডার করুন
            </a>
          </div>
          {/* Try-on */}
          <TryonViewer designId={design.id} />
        </div>
      </div>
    </div>
  );
}
