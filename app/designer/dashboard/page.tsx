import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DesignerDashboard() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: designs } = await supabase
    .from("designs")
    .select("*")
    .eq("designer_id", user.id)
    .order("created_at", { ascending: false });

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total_price, created_at, designs(title)")
    .eq("designs.designer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ডিজাইনার ড্যাশবোর্ড</h1>
        <Link
          href="/designer/upload"
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
        >
          + নতুন ডিজাইন
        </Link>
      </div>

      <h2 className="text-lg font-semibold mb-3">আমার ডিজাইনসমূহ</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {designs?.map((d) => (
          <div key={d.id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.image_url} alt={d.title} className="w-full h-40 object-cover" />
            <div className="p-3">
              <p className="font-medium text-sm truncate">{d.title}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  statusColor[d.status] || "bg-gray-100"
                }`}
              >
                {d.status}
              </span>
              <div className="flex gap-2 mt-2">
                <Link
                  href={`/designer/edit/${d.id}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  সম্পাদন
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-3">সাম্প্রতিক অর্ডার</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2">ডিজাইন</th>
              <th className="pb-2">মূল্য</th>
              <th className="pb-2">স্ট্যাটাস</th>
              <th className="pb-2">তারিখ</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((o) => (
              <tr key={o.id} className="border-b last:border-0">
                <td className="py-2">{(o.designs as { title?: string })?.title || "-"}</td>
                <td className="py-2">৳{o.total_price?.toLocaleString()}</td>
                <td className="py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[o.status] || "bg-gray-100"}` }>
                    {o.status}
                  </span>
                </td>
                <td className="py-2">{new Date(o.created_at).toLocaleDateString("bn-BD")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
