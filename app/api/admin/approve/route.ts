import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "লগইন করুন" }, { status: 401 });

  // Check admin role
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "অ্যাডমিন অ্যাক্সেস দরকার" }, { status: 403 });
  }

  const { design_id, status } = await req.json();
  if (!design_id || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "ভুল প্যারামিটার" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("designs")
    .update({ status })
    .eq("id", design_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
