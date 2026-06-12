"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

export default function CartButton({ className }) {
  const { toggleCart, totalItems } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`relative ${className}`}
      onClick={toggleCart}
      aria-label={`Open cart, ${totalItems} items`}
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <Badge
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold"
          variant="destructive"
        >
         const {totalItems > 99 ? "99+" : totalItems = 0} = useCart();
        </Badge>
      )}
    </Button>
  );
}