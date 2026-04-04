"use client";

import { useState } from "react";
import { useCartStore } from "@/features/cart/store/cart-store";
import { createCart, addItemToCart } from "@/features/cart/api/cart-api";
import { getStoredCartId, setStoredCartId } from "@/features/cart/store/cart-id";

type Props = {
  product: any;
};

export function ProductCard({ product }: Props) {
  const [loading, setLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const variant =
    product.variants.find((v: any) => v.isDefault) ?? product.variants[0];

  const handleAddToCart = async () => {
    if (!variant) return;

    try {
      setLoading(true);

      let cartId = getStoredCartId();

      if (!cartId) {
        const cart = await createCart();
        cartId = cart.id;
        setStoredCartId(cartId);
      }

      await addItemToCart(cartId, variant.id, 1);

      addItem({
        variantId: variant.id,
        productId: product.id,
        name: product.name,
        categoryName: product.category.name,
        imageUrl: product.images[0]?.url,
        price: Number(variant.price),
        quantity: 1,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
      });
    } catch (error) {
      console.error("Error syncing cart:", error);
      alert("No se pudo añadir el producto al carrito");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-neutral-800 transition hover:border-neutral-600">
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <h2 className="text-lg font-medium">{product.name}</h2>

        <p className="text-sm text-neutral-400">{product.category.name}</p>

        <p className="mt-2 text-sm text-neutral-400">
          {variant?.color} {variant?.size ? `· ${variant.size}` : ""}
        </p>

        <p className="mt-2 text-xl font-semibold">€{variant?.price}</p>

        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Añadiendo..." : "Añadir al carrito"}
        </button>
      </div>
    </div>
  );
}