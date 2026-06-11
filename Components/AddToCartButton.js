"use client";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

export default function AddToCartButton({ product }) {
  const { addToCart, cart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isInCart = cart.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // reset after 2s
  };

  return (
    <div className="flex items-center gap-3">
      {/* Quantity Selector */}
      <div className="flex items-center border rounded">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-1 text-lg"
        >
          −
        </button>
        <span className="px-4">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="px-3 py-1 text-lg"
        >
          +
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className={`px-6 py-2 rounded text-white transition ${
          added ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {added ? "✓ Added!" : isInCart ? "Add More" : "Add to Cart"}
      </button>
    </div>
  );
}