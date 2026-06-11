"use client";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cart.length === 0)
    return <p className="p-8 text-center">Your cart is empty.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.map((item) => (
        <div key={item.id} className="flex items-center gap-4 border-b py-4">
          <img src={item.images?.[0]?.src} alt={item.name} className="w-16 h-16 object-cover rounded" />

          <div className="flex-1">
            <p className="font-semibold">{item.name}</p>
            <p className="text-gray-500">${item.price} each</p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-2 py-1 border rounded">−</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2 py-1 border rounded">+</button>
          </div>

          <p className="w-20 text-right font-medium">
            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
          </p>

          <button onClick={() => removeFromCart(item.id)}
            className="text-red-500 hover:text-red-700">✕</button>
        </div>
      ))}

      {/* Summary */}
      <div className="mt-6 text-right">
        <p className="text-xl font-bold">Total: ${cartTotal.toFixed(2)}</p>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={clearCart}
            className="px-4 py-2 border rounded hover:bg-gray-100">
            Clear Cart
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}