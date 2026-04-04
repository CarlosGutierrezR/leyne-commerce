"use client";

import { useState } from "react";
import { addItemToCart, createCart } from "@/features/cart/api/cart-api";
import {
  clearStoredCartId,
  getStoredCartId,
  setStoredCartId,
} from "@/features/cart/store/cart-id";
import { useCartStore } from "@/features/cart/store/cart-store";
import type { Product, ProductVariant } from "@/features/catalog/types/product";

type AddToCartButtonProps = {
  product: Product;
  variant: ProductVariant | null;
  className?: string;
  idleLabel?: string;
  pendingLabel?: string;
  unavailableLabel?: string;
};

export function AddToCartButton({
  product,
  variant,
  className,
  idleLabel = "Agregar al carrito",
  pendingLabel = "Agregando...",
  unavailableLabel = "No disponible",
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const imageUrl = product.images[0]?.url || "/images/pijama1.jpg";
  const price = Number(variant?.price ?? 0);

  const handleAddToCart = async () => {
    if (!variant) return;

    try {
      setLoading(true);

      let cartId = getStoredCartId();
      let cartItem: unknown;

      try {
        const resolvedCartId = await ensureActiveCartId(cartId);

        cartId = resolvedCartId;
        cartItem = await addItemToCart(resolvedCartId, variant.id, 1);
      } catch (error) {
        if (!shouldRotateCart(error)) {
          throw error;
        }

        clearStoredCartId();

        const freshCartId = await ensureActiveCartId(null);

        cartId = freshCartId;
        cartItem = await addItemToCart(freshCartId, variant.id, 1);
      }

      addItem({
        cartItemId: getCartItemId(cartItem),
        variantId: variant.id,
        productId: product.id,
        name: product.name,
        categoryName: product.category.name,
        imageUrl,
        price,
        quantity: 1,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
      });
    } catch (error) {
      console.error("Error syncing cart:", error);
      alert("No se pudo agregar el producto al carrito");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={loading || !variant}
      className={className}
    >
      {loading ? pendingLabel : variant ? idleLabel : unavailableLabel}
    </button>
  );
}

async function ensureActiveCartId(cartId: string | null) {
  if (cartId) {
    return cartId;
  }

  const cart = await createCart();
  const createdCartId = typeof cart?.id === "string" ? cart.id : null;

  if (!createdCartId) {
    throw new Error("Cart ID unavailable");
  }

  setStoredCartId(createdCartId);

  return createdCartId;
}

function shouldRotateCart(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message === "Cart not found" ||
    error.message === "Cart is no longer active."
  );
}

function getCartItemId(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const cartItem = payload as { id?: unknown; item?: { id?: unknown } };

  if (typeof cartItem.id === "string") {
    return cartItem.id;
  }

  if (typeof cartItem.item?.id === "string") {
    return cartItem.item.id;
  }

  return undefined;
}
