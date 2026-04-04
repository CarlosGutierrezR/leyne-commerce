"use client";

import { useCartStore } from "@/features/cart/store/cart-store";

type Props = {
  product: any;
};

export function ProductCard({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const variant =
    product.variants.find((v: any) => v.isDefault) ?? product.variants[0];

  const handleAddToCart = () => {
    if (!variant) return;

    addItem({
      variantId: variant.id,
      productId: product.id,
      name: product.name,
      categoryName: product.category.name,
      imageUrl: product.images[0]?.url,
      price: Number(variant.price),
      size: variant.size,
      color: variant.color,
      sku: variant.sku,
    });
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
          className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:opacity-90"
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}