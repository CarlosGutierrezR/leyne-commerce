import { ProductCard } from "@/components/product/product-card";
import { CartPanel } from "@/components/cart/cart-panel";
import { getProducts } from "@/features/catalog/api/get-products";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-neutral-950 p-10 text-white">
      <CartPanel />

      <h1 className="mb-10 text-4xl font-light tracking-wide">
        Leyne Boutique
      </h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}