"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CheckoutPage() {
  const { items, subtotal, discount, cartTotal, coupon, couponError, applyCoupon, removeCoupon, clearCart } = useCart();
  const { user, login, register, logout, isHydrated } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", postcode: "", country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const [authMode, setAuthMode] = useState("guest"); // "guest" | "login" | "register"
  const [authForm, setAuthForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleAuthChange = (e) => setAuthForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      await applyCoupon(couponInput.trim());
      setCouponInput("");
    } catch {
      // error is already set in context
    } finally {
      setCouponLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      if (authMode === "login") {
        const loggedInUser = await login(authForm.email, authForm.password);
        setForm((prev) => ({ ...prev, email: loggedInUser.email }));
      } else if (authMode === "register") {
        const newUser = await register(authForm);
        setForm((prev) => ({
          ...prev,
          email: newUser.email,
          firstName: authForm.firstName,
          lastName: authForm.lastName,
        }));
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing: form,
          line_items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
          coupon_lines: coupon ? [{ code: coupon.code }] : [],
        }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      const data = await res.json();
      clearCart();
      router.push(`/order-confirmation?orderId=${data.id}`);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <p className="text-gray-500">Add some products before checking out.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

        {isHydrated && (
          <div className="mb-6 border rounded-lg p-4">
            {user ? (
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  Logged in as <span className="font-medium">{user.email}</span>
                </p>
                <button onClick={logout} className="text-sm text-red-500 underline">Log out</button>
              </div>
            ) : (
              <>
                <div className="flex gap-4 mb-4 border-b">
                  {["guest", "login", "register"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setAuthMode(mode)}
                      className={`pb-2 text-sm font-medium ${authMode === mode ? "border-b-2 border-black" : "text-gray-400"}`}
                    >
                      {mode === "guest" ? "Guest checkout" : mode === "login" ? "Log in" : "Create account"}
                    </button>
                  ))}
                </div>

                {authMode === "guest" && (
                  <p className="text-sm text-gray-500">
                    Continue below to check out without an account, or log in / create one for faster checkout next time.
                  </p>
                )}

                {(authMode === "login" || authMode === "register") && (
                  <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3">
                    {authMode === "register" && (
                      <div className="grid grid-cols-2 gap-3">
                        <input name="firstName" placeholder="First name" value={authForm.firstName} onChange={handleAuthChange} required className="border rounded-lg p-2" />
                        <input name="lastName" placeholder="Last name" value={authForm.lastName} onChange={handleAuthChange} required className="border rounded-lg p-2" />
                      </div>
                    )}
                    <input name="email" type="email" placeholder="Email" value={authForm.email} onChange={handleAuthChange} required className="border rounded-lg p-2" />
                    <input name="password" type="password" placeholder="Password" value={authForm.password} onChange={handleAuthChange} required className="border rounded-lg p-2" />

                    {authError && <p className="text-red-500 text-sm">{authError}</p>}

                    <button type="submit" disabled={authLoading} className="bg-black text-white py-2 rounded-lg disabled:opacity-50">
                      {authLoading ? "Please wait..." : authMode === "login" ? "Log in" : "Create account"}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required className="border rounded-lg p-2" />
            <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required className="border rounded-lg p-2" />
          </div>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="border rounded-lg p-2" />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border rounded-lg p-2" />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="border rounded-lg p-2" />
          <div className="grid grid-cols-2 gap-4">
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} required className="border rounded-lg p-2" />
            <input name="state" placeholder="State / Province" value={form.state} onChange={handleChange} className="border rounded-lg p-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input name="postcode" placeholder="Postal code" value={form.postcode} onChange={handleChange} required className="border rounded-lg p-2" />
            <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required className="border rounded-lg p-2" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="bg-black text-white py-3 rounded-lg mt-2 disabled:opacity-50">
            {loading ? "Placing order..." : `Place order — $${cartTotal.toFixed(2)}`}
          </button>
        </form>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4">
          {coupon ? (
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Coupon: <span className="font-medium">{coupon.code}</span></span>
              <button onClick={removeCoupon} className="text-red-500 underline text-xs">Remove</button>
            </div>
          ) : (
            <div className="flex gap-2 mb-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code"
                className="border rounded-lg p-2 text-sm flex-1"
              />
              <button onClick={handleApplyCoupon} disabled={couponLoading} className="border rounded-lg px-3 text-sm disabled:opacity-50">
                {couponLoading ? "..." : "Apply"}
              </button>
            </div>
          )}
          {couponError && <p className="text-red-500 text-xs mb-2">{couponError}</p>}
        </div>

        <div className="border-t mt-2 pt-4 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-base border-t pt-2 mt-1">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}