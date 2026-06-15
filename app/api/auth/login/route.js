import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const wpRes = await fetch(`${process.env.WC_STORE_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    // Read as text first, since a misconfigured endpoint can return HTML or an empty body
    const text = await wpRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Non-JSON response from WP JWT endpoint:", text);
      return NextResponse.json(
        { message: "Unexpected response from WordPress. Check that the JWT auth plugin is active and WC_STORE_URL is correct." },
        { status: 502 }
      );
    }

    if (!wpRes.ok) {
      return NextResponse.json({ message: data.message || "Invalid email or password" }, { status: wpRes.status });
    }

    return NextResponse.json({
      token: data.token,
      user: { email: data.user_email, name: data.user_display_name },
    });
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json({ message: "Server error during login" }, { status: 500 });
  }
}