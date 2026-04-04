import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/features/catalog/api/get-products";
import { ProductDetailView } from "@/features/catalog/components/product-detail-view";
import { findProductByRoute } from "@/features/catalog/lib/product-helpers";

type ProductDetailPageProps = {
  params: Promise<{
    categorySlug: string;
    productSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { productSlug } = await params;

  return {
    title: `${toTitleCase(productSlug)} | Leyne Boutique`,
    description:
      "Detalle de producto de Leyne con imagen, descripcion, variante base y acceso directo al carrito.",
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { categorySlug, productSlug } = await params;
  const products = await getProducts();
  const product = findProductByRoute(products, categorySlug, productSlug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.category.name === product.category.name
    )
    .slice(0, 3);

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}

function toTitleCase(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}
