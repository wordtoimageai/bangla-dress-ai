import { createServerSupabaseClient } from "@/lib/supabase-server";
import DesignCard from "@/components/design-card";

export default async function ShowcasePage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("designs")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }
  if (searchParams.search) {
    query = query.ilike("title", `%${searchParams.search}%`);
  }

  const { data: designs } = await query;

  const categories = ["সব", "ফরমাল", "ক্যাজুয়াল", "ব্রাইডাল", "পার্টি"];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-red-700 mb-6">ডিজাইন শোকেস</h1>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <a
            key={cat}
            href={cat === "সব" ? "/showcase" : `/showcase?category=${cat}`}
            className="px-4 py-1.5 rounded-full border border-red-300 text-sm hover:bg-red-50"
          >
            {cat}
          </a>
        ))}
      </div>

      {/* Search */}
      <form className="mb-8">
        <input
          name="search"
          defaultValue={searchParams.search}
          placeholder="ডিজাইন খুঁজুন..."
          className="border rounded-full px-4 py-2 w-full max-w-sm text-sm"
        />
      </form>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {designs?.map((d) => (
          <DesignCard key={d.id} design={d} />
        ))}
        {!designs?.length && (
          <p className="col-span-full text-center text-gray-400 py-16">
            কোনো ডিজাইন পাওয়া যায়নি
          </p>
        )}
      </div>
    </div>
  );
}
