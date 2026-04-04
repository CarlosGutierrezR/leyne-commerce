"use client";

import { useCartStore } from "@/features/cart/store/cart-store";

export function CartButton() {
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <div className="fixed top-6 right-6 z-50 rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-white shadow">
      Carrito ({totalItems})
    </div>
  );
}