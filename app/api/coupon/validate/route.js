import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ valid: false, message: "No coupon code provided" }, { status: 400 });
  }

  const auth = "Basic " + Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64");

  const res = await fetch(
    `${process.env.WC_STORE_URL}/wp-json/wc/v3/coupons?code=${encodeURIComponent(code)}`,
    { headers: { Authorization: auth } }
  );

  const coupons = await res.json();

  if (!coupons.length) {
    return NextResponse.json({ valid: false, message: "Coupon not found" }, { status: 404 });
  }

  const coupon = coupons[0];

  if (coupon.date_expires && new Date(coupon.date_expires) < new Date()) {
    return NextResponse.json({ valid: false, message: "Coupon has expired" }, { status: 400 });
  }

  return NextResponse.json({
    valid: true,
    coupon: {
      code: coupon.code,
      discount_type: coupon.discount_type,
      amount: coupon.amount,
    },
  });
}