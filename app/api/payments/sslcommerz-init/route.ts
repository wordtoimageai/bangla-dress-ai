import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { initSSLCommerzPayment } from "@/lib/sslcommerz";

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { order_id, name, phone, address, email } = body;
  if (!order_id || !name || !phone || !address) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data: profile } = await supabase.from("users").select("*").eq("auth_id", user.id).single();
  const { data: order } = await supabase
    .from("orders").select("*, designs(*)").eq("id", order_id).eq("user_id", profile?.id).single();

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const amount = order.designs?.price_bdt || 0;
  if (!amount) return NextResponse.json({ error: "Invalid order amount" }, { status: 400 });

Add SSLCommerz init payment route  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const sslRes = await initSSLCommerzPayment({
    total_amount: amount,
    currency: "BDT",
    tran_id,
    success_url: `${baseUrl}/api/payments/sslcommerz-success`,
    fail_url: `${baseUrl}/api/payments/sslcommerz-fail`,
    cancel_url: `${baseUrl}/api/payments/sslcommerz-cancel`,
    cus_name: name,
    cus_email: email || "noemail@example.com",
    cus_phone: phone,
  });

  if (sslRes.status !== "SUCCESS" || !sslRes.GatewayPageURL) {
    return NextResponse.json({ error: sslRes.failedreason || "SSLCommerz init failed" }, { status: 500 });
  }

  await supabase.from("orders").update({
    shipping_address: { name, phone, address, email },
    payment_provider: "sslcommerz",
    payment_status: "unpaid",
    status: "pending",
    payment_info: { tran_id, sessionkey: sslRes.sessionkey },
  }).eq("id", order_id);

  return NextResponse.json({ gateway_url: sslRes.GatewayPageURL });
}
