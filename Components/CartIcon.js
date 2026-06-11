"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Link href="/cart" className="relative">
      🛒
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </Link>
  );
}