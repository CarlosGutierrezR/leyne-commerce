"use client";

import Link from "next/link";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import {
  getProductHref,
  getProductPrimaryImage,
  getProductPrimaryImageAlt,
  getProductVariantLabel,
} from "@/features/catalog/lib/product-helpers";
import {
  getProductDefaultVariant,
  type Product,
} from "@/features/catalog/types/product";
import { StorefrontImage } from "@/lib/storefront-image-element";
import { formatPrice } from "@/lib/format-price";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const variant = getProductDefaultVariant(product);
  const imageUrl = getProductPrimaryImage(product);
  const imageAlt = getProductPrimaryImageAlt(product);
  const variantLabel = getProductVariantLabel(product);
  const price = Number(variant?.price ?? 0);
  const productHref = getProductHref(product);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[rgba(212,177,138,0.45)] hover:bg-white/[0.07]">
      <Link href={productHref} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-stone-950">
          <StorefrontImage
            src={imageUrl}
            alt={imageAlt}
            fallbackAlt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.24em] text-stone-100/90">
            {product.category.name}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div className="space-y-2">
          <Link href={productHref} className="block">
            <h2 className="text-xl font-medium tracking-[0.01em] text-stone-50 transition hover:text-[rgba(226,196,164,1)]">
              {product.name}
            </h2>
          </Link>

          <p className="text-sm leading-6 text-stone-300">
            {variantLabel || "Seleccion actual disponible"}
          </p>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
                Precio
              </p>
              <p className="mt-2 text-2xl font-semibold text-stone-50">
                {formatPrice(price)}
              </p>
            </div>

            <p className="text-right text-xs uppercase tracking-[0.18em] text-stone-400">
              {variant?.sku || "Sin SKU"}
            </p>
          </div>

          <Link
            href={productHref}
            className="inline-flex text-xs font-medium uppercase tracking-[0.18em] text-stone-300 transition hover:text-[rgba(226,196,164,1)]"
          >
            Ver detalle
          </Link>

          <AddToCartButton
            product={product}
            variant={variant}
            className="w-full rounded-full bg-[rgba(212,177,138,0.95)] px-4 py-3 text-sm font-semibold tracking-[0.08em] text-stone-950 transition hover:bg-[rgba(226,196,164,1)] disabled:cursor-not-allowed disabled:bg-stone-600 disabled:text-stone-200"
          />
        </div>
      </div>
    </article>
  );
}
