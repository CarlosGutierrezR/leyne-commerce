export const STOREFRONT_IMAGE_FALLBACK_SRC = "/images/pijama1.jpg";

type ImageRecordLike = {
  alt?: string | null;
  altText?: string | null;
  position?: number | null;
  url?: string | null;
};

export function getStorefrontImageSrc(
  src?: string | null,
  fallbackSrc = STOREFRONT_IMAGE_FALLBACK_SRC
) {
  if (typeof src !== "string") {
    return fallbackSrc;
  }

  const trimmedSrc = src.trim();

  return trimmedSrc.length > 0 ? trimmedSrc : fallbackSrc;
}

export function getStorefrontImageAltText(
  value: string | null | undefined,
  fallbackAlt: string
) {
  if (typeof value !== "string") {
    return fallbackAlt;
  }

  const trimmedAlt = value.trim();

  return trimmedAlt.length > 0 ? trimmedAlt : fallbackAlt;
}

export function getStorefrontImageRecordAltText(
  image: ImageRecordLike | null | undefined,
  fallbackAlt: string
) {
  return getStorefrontImageAltText(image?.altText ?? image?.alt, fallbackAlt);
}

export function sortStorefrontImagesByPosition<T extends ImageRecordLike>(
  images: T[]
) {
  return [...images].sort((left, right) => {
    const leftPosition =
      typeof left.position === "number" ? left.position : Number.MAX_SAFE_INTEGER;
    const rightPosition =
      typeof right.position === "number"
        ? right.position
        : Number.MAX_SAFE_INTEGER;

    return leftPosition - rightPosition;
  });
}
