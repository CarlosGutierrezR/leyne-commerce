import type { Metadata } from "next";
import { getProducts } from "@/features/catalog/api/get-products";
import { CatalogPageView } from "@/features/catalog/components/catalog-page-view";

export const metadata: Metadata = {
  title: "Catalogo | Leyne Boutique",
  description: "Explora el catalogo de Leyne por categoria y compra desde una vista dedicada.",
};

export default async function CatalogPage() {
  const products = await getProducts();

  return <CatalogPageView products={products} />;
}
