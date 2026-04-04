"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/features/cart/store/cart-store";
import { getStoredCartId } from "@/features/cart/store/cart-id";

import { removeItemFromCart } from "@/features/cart/api/cart-api";

export function CartPanel() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore((state) => state.totalItems());
  const totalPrice = useCartStore((state) => state.totalPrice());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="fixed top-6 right-6 z-50 rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-white shadow">
        Carrito (0)
      </button>
    );
  }

  const handleRemove = async (item: any) => {
    try {
      console.log("REMOVE item =>", item);

      const cartId = getStoredCartId();
      console.log("REMOVE cartId =>", cartId);

      if (cartId && item.cartItemId) {
        await removeItemFromCart(cartId, item.cartItemId);
      }

      removeItem(item.variantId);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

const handleClear = async () => {
  try {
    const cartId = getStoredCartId();
    console.log("CLEAR cartId =>", cartId);

    if (cartId) {
      const cart = await fetch(`http://localhost:4000/api/cart/${cartId}`).then(res => res.json());

      for (const item of cart.items) {
        await removeItemFromCart(cartId, item.id);
      }
    }

    clearCart();
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed top-6 right-6 z-50 rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-white shadow"
      >
        Carrito ({totalItems})
      </button>

      {open && (
        <aside className="fixed right-6 top-20 z-50 w-[380px] rounded-2xl border border-neutral-800 bg-neutral-950 p-5 text-white shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tu carrito</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-neutral-400 hover:text-white"
            >
              Cerrar
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-neutral-400">Tu carrito está vacío.</p>
          ) : (
            <>
              <div className="max-h-[420px] space-y-4 overflow-auto">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="rounded-xl border border-neutral-800 p-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.imageUrl || "/images/pijama1.jpg"}
                        alt={item.name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-neutral-400">
                          {item.color} {item.size ? `· ${item.size}` : ""}
                        </p>
                        <p className="text-sm text-neutral-400">
                          Cantidad: {item.quantity}
                        </p>
                        <p className="mt-1 font-semibold">
                          €{item.price * item.quantity}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(item)}
                      className="mt-3 text-sm text-red-400 hover:text-red-300"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-neutral-800 pt-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-neutral-400">Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="mb-4 flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>€{totalPrice}</span>
                </div>

                <button
                  onClick={handleClear}
                  className="w-full rounded-xl border border-neutral-700 px-4 py-3 text-sm hover:bg-neutral-900"
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