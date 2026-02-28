import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createTryOnMockup } from "@/lib/ai-client";

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "লগইন প্রয়োজন" }, { status: 401 });
  }

  const formData = await req.formData();
  const bodyFile = formData.get("body_image") as File | null;
  const designImageUrl = String(formData.get("design_image_url") || "");
  const designId = String(formData.get("design_id") || "");
  const customMeasurementsRaw = formData.get("custom_measurements") || "";

  if (!bodyFile || !designImageUrl || !designId) {
    return NextResponse.json({ error: "Missing inputs" }, { status: 400 });
  }

  const arrayBuffer = await bodyFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileExt = bodyFile.name.split(".").pop() || "jpg";
  const fileName = `${user.id}/body-${Date.now()}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("design-images")
    .upload(fileName, buffer, { contentType: bodyFile.type || "image/jpeg" });

  if (uploadError) {
    return NextResponse.json({ error: "Body image upload failed" }, { status: 500 });
  }

  const bodyImageUrl = supabase.storage
    .from("design-images")
    .getPublicUrl(uploadData.path).data.publicUrl;

  try {
    const { previewUrl } = await createTryOnMockup({
      bodyImageUrl,
      garmentImageUrl: designImageUrl,
    });

    let customMeasurements: any = null;
    if (typeof customMeasurementsRaw === "string" && customMeasurementsRaw) {
      try { customMeasurements = JSON.parse(customMeasurementsRaw); } catch {}
    }

    const { data: profile } = await supabase
      .from("users").select("*").eq("auth_id", user.id).single();

    if (!profile) {
      return NextResponse.json({ error: "User profile missing" }, { status: 400 });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: profile.id,
        design_id: designId,
        custom_measurements: customMeasurements,
        ai_preview_image: previewUrl,
        status: "pending",
        payment_status: "unpaid",
      })
      .select("*")
      .single();

    if (orderError) {
      return NextResponse.json({ error: "Order create ব্যর্থ হয়েছে।" }, { status: 500 });
    }

    return NextResponse.json({ preview_url: previewUrl, order_id: order.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Try-on model ব্যর্থ।" }, { status: 500 });
  }
}
