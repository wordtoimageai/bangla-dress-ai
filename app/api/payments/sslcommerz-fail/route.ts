import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const formData = await req.formData();
  const tran_id = String(formData.get("tran_id") || "");
  const status = String(formData.get("status") || "");
  const orderId = tran_id.replace("BDRESS-", "");

  await supabase.from("orders").update({
    payment_status: "failed",
    status: "pending",
    payment_raw: { tran_id, status },
  }).eq("id", orderId);

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/payment-failed?order_id=${orderId}`
  );
}
