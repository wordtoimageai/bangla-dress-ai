import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const formData = await req.formData();
  const tran_id = String(formData.get("tran_id") || "");
  const status = String(formData.get("status") || "");
  const val_id = String(formData.get("val_id") || "");
  const amount = Number(formData.get("amount") || 0);

  if (status !== "VALID" && status !== "VALIDATED") {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payment-failed?reason=${status}`
    );
  }

  const orderId = tran_id.replace("BDRESS-", "");

  await supabase.from("orders").update({
    payment_status: "paid",
    status: "processing",
    payment_trx_id: val_id || tran_id,
    payment_raw: { tran_id, status, val_id, amount },
  }).eq("id", orderId);

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?order_id=${orderId}`
  );
}
