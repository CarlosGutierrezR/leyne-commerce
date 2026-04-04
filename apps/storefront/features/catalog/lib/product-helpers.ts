import {
  getProductDefaultVariant,
  type ProductImage,
  type Product,
} from "@/features/catalog/types/product";
import { normalizeCatalogCategorySlug } from "@/features/catalog/content/catalog-showcase";
import {
  getStorefrontImageRecordAltText,
  getStorefrontImageSrc,
  STOREFRONT_IMAGE_FALLBACK_SRC,
  sortStorefrontImagesByPosition,
} from "@/lib/storefront-image";

export function getProductPrimaryImage(product: Product) {
  return getStorefrontImageSrc(getProductSortedImages(product)[0]?.url);
}

export function getProductPrimaryImageAlt(product: Product) {
  return getStorefrontImageRecordAltText(
    getProductSortedImages(product)[0],
    product.name
  );
}

export function getProductSortedImages(product: Product) {
  return sortStorefrontImagesByPosition(product.images);
}

export function getProductGalleryImages(product: Product): ProductImage[] {
  const images = getProductSortedImages(product);

  if (images.length > 0) {
    return images;
  }

  return [
    {
      altText: product.name,
      position: 0,
      url: STOREFRONT_IMAGE_FALLBACK_SRC,
    },
  ];
}

export function normalizeProductSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductSlug(product: Product) {
  return normalizeProductSlug(product.slug ?? product.name);
}

export function getProductCategorySlug(product: Product) {
  return normalizeCatalogCategorySlug(product.category.slug ?? product.category.name);
}

export function getProductHref(product: Product) {
  return `/catalogo/${getProductCategorySlug(product)}/${getProductSlug(product)}`;
}

export function findProductByRoute(
  products: Product[],
  categorySlug: string,
  productSlug: string
) {
  const normalizedCategorySlug = normalizeCatalogCategorySlug(categorySlug);
  const normalizedProductSlug = normalizeProductSlug(productSlug);

  return products.find(
    (product) =>
      getProductCategorySlug(product) === normalizedCategorySlug &&
      getProductSlug(product) === normalizedProductSlug
  );
}

export function getProductStartingPrice(product: Product) {
  const prices = product.variants
    .map((variant) => Number(variant.price))
    .filter((price) => !Number.isNaN(price));

  if (prices.length === 0) {
    return null;
  }

  return Math.min(...prices);
}

export function getProductVariantLabel(product: Product) {
  const variant = getProductDefaultVariant(product);

  return [variant?.color, variant?.size].filter(Boolean).join(" / ");
}
