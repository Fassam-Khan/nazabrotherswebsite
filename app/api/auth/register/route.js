import { NextResponse } from "next/server";

export async function POST(req) {
  const { firstName, lastName, email, password } = await req.json();

  const auth = "Basic " + Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64");

  const res = await fetch(`${process.env.WC_STORE_URL}/wp-json/wc/v3/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: auth },
    body: JSON.stringify({
      email,
      first_name: firstName,
      last_name: lastName,
      username: email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ message: data.message || "Registration failed" }, { status: 400 });
  }

  return NextResponse.json({ id: data.id, email: data.email });
}