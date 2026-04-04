import { getProducts } from "@/features/catalog/api/get-products";
import { StorefrontHome } from "@/features/home/components/storefront-home";

export default async function Home() {
  const products = await getProducts();

  return <StorefrontHome products={products} />;
}
