import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  const { data: pending } = await supabase
    .from("designs")
    .select("*, users(email)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">অ্যাডমিন প্যানেল — পেন্ডিং ডিজাইন</h1>
      {pending?.length === 0 && (
        <p className="text-gray-400">সব ডিজাইন রিভিউ হয়ে গেছে</p>
      )}
      <div className="space-y-4">
        {pending?.map((d) => (
          <div key={d.id} className="flex gap-4 items-start bg-white border rounded-xl p-4 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.image_url} alt={d.title} className="w-24 h-24 object-cover rounded-lg border" />
            <div className="flex-1">
              <h2 className="font-semibold">{d.title}</h2>
              <p className="text-sm text-gray-500 mb-1">{(d.users as { email?: string })?.email}</p>
              <p className="text-sm text-gray-600 mb-2">মূল্য: ৳{d.price?.toLocaleString()}</p>
              <div className="flex gap-2">
                <form action="/api/admin/approve" method="POST" className="inline">
                  <input type="hidden" name="design_id" value={d.id} />
                  <input type="hidden" name="status" value="approved" />
                  <button
                    type="submit"
                    className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700"
                  >
                    अনুমোদন
                  </button>
                </form>
                <form action="/api/admin/approve" method="POST" className="inline">
                  <input type="hidden" name="design_id" value={d.id} />
                  <input type="hidden" name="status" value="rejected" />
                  <button
                    type="submit"
                    className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-600"
                  >
                    প্রত্যাখ্যান
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
