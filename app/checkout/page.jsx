"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", postcode: "", country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
          line_items: items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
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
      {/* Billing form */}
      <div>
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
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

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white py-3 rounded-lg mt-2 disabled:opacity-50"
          >
            {loading ? "Placing order..." : `Place order — $${cartTotal.toFixed(2)}`}
          </button>
        </form>
      </div>

      {/* Order summary */}
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
        <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}