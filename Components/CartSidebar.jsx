"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, Trash2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/Components/ui/sheet";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Badge } from "@/Components/ui/badge";

import { useCart } from "@/app/context/CartContext";
export default function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  } = useCart();

  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-md p-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-1">
                {totalItems}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="rounded-full bg-muted p-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-base">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add items to get started
              </p>
            </div>
            <Button onClick={closeCart} className="mt-2">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <ScrollArea className="flex-1 px-6">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <SheetFooter className="flex-col gap-0 px-6 pt-4 pb-6 border-t sm:flex-col">
              {/* Order summary */}
              <div className="w-full space-y-2 text-sm mb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {subtotal < 100 && (
                  <p className="text-xs text-muted-foreground">
                    Add{" "}
                    <span className="font-medium text-foreground">
                      ${(100 - subtotal).toFixed(2)}
                    </span>{" "}
                    more for free shipping
                  </p>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-base pt-1">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex w-full flex-col gap-2">
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout" onClick={closeCart}>
                    Checkout
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <Link href="/cart" onClick={closeCart}>
                    View Full Cart
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive w-full"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <div className="flex gap-4 py-4">
      {/* Product image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Product details */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium leading-tight truncate">
              {item.name}
            </p>
            {item.variant && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.variant}
              </p>
            )}
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors"
            aria-label={`Remove ${item.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity controls */}
          <div className="flex items-center rounded-md border">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="flex h-7 w-8 items-center justify-center text-sm font-medium border-x">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price */}
          <p className="text-sm font-semibold">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}