"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function CartIcon2() {
  const { cartCount, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      aria-label="Open cart"
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <ShoppingCart className="w-6 h-6" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </button>
  );
}