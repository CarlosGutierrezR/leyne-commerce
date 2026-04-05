"use client";

import { useEffect, useState } from "react";
import { getProductGalleryImages } from "@/features/catalog/lib/product-helpers";
import type { Product } from "@/features/catalog/types/product";
import { getStorefrontImageRecordAltText } from "@/lib/storefront-image";
import { StorefrontImage } from "@/lib/storefront-image-element";

type ProductGalleryProps = {
  product: Product;
};

export function ProductGallery({ product }: ProductGalleryProps) {
  const galleryImages = getProductGalleryImages(product);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product.id]);

  const activeImage = galleryImages[activeImageIndex] ?? galleryImages[0];
  const hasMultipleImages = galleryImages.length > 1;

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/20 shadow-[0_28px_100px_rgba(0,0,0,0.28)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-stone-950">
          <StorefrontImage
            src={activeImage?.url}
            alt={getStorefrontImageRecordAltText(activeImage, product.name)}
            fallbackAlt={product.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.24em] text-stone-100">
            {product.category.name}
          </span>
          {hasMultipleImages ? (
            <span className="absolute bottom-5 right-5 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.24em] text-stone-100 backdrop-blur-sm">
              {activeImageIndex + 1} / {galleryImages.length}
            </span>
          ) : null}
        </div>
      </div>

      {hasMultipleImages ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
              Galeria interactiva
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
              Selecciona una vista
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {galleryImages.map((image, index) => {
              const isActive = index === activeImageIndex;

              return (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  aria-label={`Ver ${product.name} vista ${index + 1}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveImageIndex(index)}
                  className={[
                    "group relative overflow-hidden rounded-[1.5rem] border bg-white/[0.04] text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,177,138,0.65)] focus-visible:ring-offset-0",
                    isActive
                      ? "border-[rgba(212,177,138,0.55)] bg-[rgba(212,177,138,0.08)] shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
                      : "border-white/10 hover:border-white/20 hover:bg-white/[0.07]",
                  ].join(" ")}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <StorefrontImage
                      src={image.url}
                      alt={getStorefrontImageRecordAltText(
                        image,
                        `${product.name} vista ${index + 1}`
                      )}
                      fallbackAlt={`${product.name} vista ${index + 1}`}
                      className={[
                        "h-full w-full object-cover transition duration-500",
                        isActive ? "scale-[1.02]" : "group-hover:scale-105",
                      ].join(" ")}
                    />
                  </div>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone-100">
                    Vista {index + 1}
                  </div>
                  {isActive ? (
                    <div className="absolute bottom-3 right-3 rounded-full border border-[rgba(212,177,138,0.4)] bg-[rgba(212,177,138,0.18)] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone-50">
                      Activa
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-stone-300">
          Vista principal unica disponible para este producto.
        </div>
      )}
    </div>
  );
}
