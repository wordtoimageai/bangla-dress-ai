import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "লগইন করুন" }, { status: 401 });

  const fd = await req.formData();
  const title = fd.get("title") as string;
  const description = fd.get("description") as string;
  const price = Number(fd.get("price"));
  const category = fd.get("category") as string;
  const image = fd.get("image") as File;
  const measurementsRaw = fd.get("measurements") as string;
  const measurements = measurementsRaw ? JSON.parse(measurementsRaw) : null;

  if (!title || !image || !price) {
    return NextResponse.json({ error: "নাম, ছবি ও মূল্য দিন" }, { status: 400 });
  }

  // Upload image to Supabase Storage
  const ext = image.name.split(".").pop();
  const filename = `designs/${user.id}_${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("designs")
    .upload(filename, image, { contentType: image.type });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage
    .from("designs")
    .getPublicUrl(filename);

  const { data, error } = await supabase
    .from("designs")
    .insert({
      title,
      description,
      price,
      category,
      image_url: publicUrl,
      measurements,
      designer_id: user.id,
      status: "pending",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
