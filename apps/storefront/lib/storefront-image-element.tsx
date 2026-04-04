"use client";

import type { ImgHTMLAttributes, SyntheticEvent } from "react";
import {
  getStorefrontImageAltText,
  getStorefrontImageSrc,
  STOREFRONT_IMAGE_FALLBACK_SRC,
} from "@/lib/storefront-image";

type StorefrontImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "alt" | "src"
> & {
  alt?: string | null;
  fallbackAlt?: string;
  fallbackSrc?: string;
  src?: string | null;
};

export function StorefrontImage({
  alt,
  fallbackAlt = "Leyne Boutique",
  fallbackSrc = STOREFRONT_IMAGE_FALLBACK_SRC,
  onError,
  src,
  ...props
}: StorefrontImageProps) {
  const resolvedSrc = getStorefrontImageSrc(src, fallbackSrc);
  const resolvedAlt = getStorefrontImageAltText(alt, fallbackAlt);

  function handleError(event: SyntheticEvent<HTMLImageElement, Event>) {
    const target = event.currentTarget;

    if (target.dataset.fallbackApplied === "true") {
      onError?.(event);
      return;
    }

    target.dataset.fallbackApplied = "true";
    target.src = target.dataset.fallbackSrc ?? fallbackSrc;
    onError?.(event);
  }

  return (
    <img
      {...props}
      alt={resolvedAlt}
      data-fallback-applied="false"
      data-fallback-src={fallbackSrc}
      onError={handleError}
      src={resolvedSrc}
    />
  );
}
