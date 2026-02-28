import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("designs")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "ডিজাইন পাওয়া যায়নি" }, { status: 404 });
  }

  return NextResponse.json(data);
}
