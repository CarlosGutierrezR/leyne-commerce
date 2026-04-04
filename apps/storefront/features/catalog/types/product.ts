export type ProductImage = {
  id?: string;
  url: string;
  alt?: string | null;
  altText?: string | null;
  position?: number | null;
};

export type ProductCategory = {
  id?: string;
  name: string;
  slug?: string;
};

export type ProductVariant = {
  id: string;
  price: number | string;
  size?: string | null;
  color?: string | null;
  sku: string;
  isDefault?: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  category: ProductCategory;
  images: ProductImage[];
  variants: ProductVariant[];
};

export function getProductDefaultVariant(product: Product) {
  return product.variants.find((variant) => variant.isDefault) ?? product.variants[0] ?? null;
}
