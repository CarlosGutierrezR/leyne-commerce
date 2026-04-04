import { ProductGrid } from "@/features/catalog/components/product-grid";
import type { Product } from "@/features/catalog/types/product";

type HomeFeaturedProductsProps = {
  products: Product[];
};

export function HomeFeaturedProducts({
  products,
}: HomeFeaturedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
            Destacados
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] text-stone-50 sm:text-4xl">
            Una seleccion curada para abrir la experiencia
          </h2>
        </div>

        <p className="max-w-xl text-sm leading-7 text-stone-300 sm:text-right">
          Usamos los primeros productos disponibles para construir una franja
          destacada sin tocar la logica del catalogo ni el flujo actual del carrito.
        </p>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}
