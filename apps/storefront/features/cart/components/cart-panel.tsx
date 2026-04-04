"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearCart as clearCartOnBackend,
  getCart,
  removeItemFromCart,
} from "@/features/cart/api/cart-api";
import { getStoredCartId } from "@/features/cart/store/cart-id";
import { useCartStore } from "@/features/cart/store/cart-store";
import type { CartItem } from "@/features/cart/types/cart";
import { StorefrontImage } from "@/lib/storefront-image-element";
import { formatPrice } from "@/lib/format-price";

export function CartPanel() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearLocalCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore((state) => state.totalItems());
  const totalPrice = useCartStore((state) => state.totalPrice());

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  if (!mounted) {
    return (
      <button className="fixed right-4 top-4 z-50 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white shadow-lg shadow-black/30 backdrop-blur sm:right-6 sm:top-6">
        Carrito (0)
      </button>
    );
  }

  const handleRemove = async (item: CartItem) => {
    try {
      const cartId = getStoredCartId();
      const cartItemId = item.cartItemId ?? (await resolveCartItemId(cartId, item));

      if (cartId) {
        if (!cartItemId) {
          throw new Error("Cart item ID unavailable");
        }

        await removeItemFromCart(cartId, cartItemId);
      }

      removeItem(item.variantId);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleClear = async () => {
    try {
      const cartId = getStoredCartId();

      if (cartId) {
        await clearCartOnBackend(cartId);
      }

      clearLocalCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="cart-panel"
        className="fixed right-4 top-4 z-50 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-black/30 backdrop-blur transition hover:border-[rgba(212,177,138,0.4)] hover:bg-black/55 sm:right-6 sm:top-6"
      >
        Carrito ({totalItems})
      </button>

      {open && (
        <aside
          id="cart-panel"
          className="fixed inset-x-4 top-20 z-50 ml-auto w-auto max-w-sm rounded-[2rem] border border-white/10 bg-[rgba(16,12,11,0.94)] p-5 text-white shadow-[0_22px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:right-6 sm:inset-x-auto sm:w-[24rem]"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
                Carrito
              </p>
              <h2 className="mt-2 text-xl font-semibold text-stone-50">
                Tu seleccion
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-stone-400 transition hover:text-white"
            >
              Cerrar
            </button>
          </div>

          {items.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-stone-500">
                Sin productos
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                Agrega articulos desde el catalogo para verlos aqui.
              </p>
            </div>
          ) : (
            <>
              <div className="max-h-[26rem] space-y-3 overflow-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-3"
                  >
                    <div className="flex gap-3">
                      <StorefrontImage
                        src={item.imageUrl || "/images/pijama1.jpg"}
                        alt={item.name}
                        fallbackAlt={item.name}
                        className="h-20 w-20 rounded-2xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                          {item.categoryName}
                        </p>
                        <h3 className="mt-1 truncate font-medium text-stone-50">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-stone-300">
                          {[item.color, item.size].filter(Boolean).join(" / ") || "Variante activa"}
                        </p>
                        <p className="mt-1 text-sm text-stone-400">
                          Cantidad: {item.quantity}
                        </p>
                        <p className="mt-2 font-semibold text-stone-50">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      className="mt-3 text-sm text-red-300 transition hover:text-red-200"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-white/10 pt-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-stone-400">Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="mb-4 flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="mb-3 inline-flex w-full items-center justify-center rounded-full bg-[rgba(212,177,138,0.95)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-stone-950 transition hover:bg-[rgba(226,196,164,1)]"
                >
                  Ir al checkout
                </Link>

                <button
                  type="button"
                  onClick={handleClear}
                  className="w-full rounded-full border border-white/15 px-4 py-3 text-sm font-medium text-stone-100 transition hover:border-white/30 hover:bg-white/[0.05]"
                >
                  Vaciar carrito
                </button>
              </div>
            </>
          )}
        </aside>
      )}
    </>
  );
}

type BackendCartResponse = {
  items?: Array<{
    id?: string;
    variantId?: string;
  }>;
};

async function resolveCartItemId(cartId: string | null, item: CartItem) {
  if (!cartId) {
    return undefined;
  }

  const cart = (await getCart(cartId)) as BackendCartResponse;

  return cart.items?.find((cartItem) => cartItem.variantId === item.variantId)?.id;
}
