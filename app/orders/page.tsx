import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, designs(title, image_url)")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  const statusLabel: Record<string, string> = {
    draft: "ড্রাফট",
    pending: "পেন্ডিং",
    paid: "পেমেন্ট হয়েছে",
    shipped: "পাঠানো হয়েছে",
    delivered: "ডেলিভারী",
    cancelled: "বাতিল",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">আমার অর্ডারসমূহ</h1>
      {!orders?.length && (
        <p className="text-gray-400">এখনো কোনো অর্ডার নেই</p>
      )}
      <div className="space-y-4">
        {orders?.map((o) => {
          const design = o.designs as { title?: string; image_url?: string } | null;
          return (
            <div key={o.id} className="flex gap-4 items-center bg-white border rounded-xl p-4 shadow-sm">
              {design?.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={design.image_url} alt={design.title} className="w-20 h-20 object-cover rounded-lg border" />
              )}
              <div className="flex-1">
                <h2 className="font-semibold">{design?.title || "অর্ডার"}</h2>
                <p className="text-sm text-gray-500">অর্ডার #: {o.id.slice(0, 8)}</p>
                <p className="text-sm font-medium text-red-600">৳{o.total_price?.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                  {statusLabel[o.status] || o.status}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(o.created_at).toLocaleDateString("bn-BD")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
