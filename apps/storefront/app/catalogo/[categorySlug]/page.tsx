import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/features/catalog/api/get-products";
import { CatalogPageView } from "@/features/catalog/components/catalog-page-view";
import {
  getCatalogCategoryRecord,
  normalizeCatalogCategorySlug,
} from "@/features/catalog/content/catalog-showcase";

type CatalogCategoryPageProps = {
  params: Promise<{
    categorySlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: CatalogCategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;

  return {
    title: `${toTitleCase(categorySlug)} | Catalogo Leyne`,
    description:
      "Vista de categoria del catalogo de Leyne preparada para crecer con multiples categorias.",
  };
}

export default async function CatalogCategoryPage({
  params,
}: CatalogCategoryPageProps) {
  const { categorySlug } = await params;
  const normalizedSlug = normalizeCatalogCategorySlug(categorySlug);
  const products = await getProducts();
  const category = getCatalogCategoryRecord(products, normalizedSlug);

  if (!category) {
    notFound();
  }

  return (
    <CatalogPageView
      products={products}
      activeCategorySlug={category.slug}
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
