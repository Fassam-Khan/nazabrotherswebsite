import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { billing, line_items, coupon_lines } = await req.json();

    if (!billing || !line_items || line_items.length === 0) {
      return NextResponse.json(
        { message: "Missing billing details or cart items" },
        { status: 400 }
      );
    }

    const auth =
      "Basic " +
      Buffer.from(
        `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
      ).toString("base64");

    const wooRes = await fetch(`${process.env.WC_STORE_URL}/wp-json/wc/v3/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify({
        payment_method: "bacs",
        payment_method_title: "Direct Bank Transfer",
        set_paid: false,
        billing: {
          first_name: billing.firstName,
          last_name: billing.lastName,
          address_1: billing.address,
          city: billing.city,
          state: billing.state,
          postcode: billing.postcode,
          country: billing.country,
          email: billing.email,
          phone: billing.phone,
        },
        shipping: {
          first_name: billing.firstName,
          last_name: billing.lastName,
          address_1: billing.address,
          city: billing.city,
          state: billing.state,
          postcode: billing.postcode,
          country: billing.country,
        },
        line_items,
        coupon_lines: coupon_lines || [],
      }),
    });

    const data = await wooRes.json();

    if (!wooRes.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to create order" },
        { status: wooRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}