import Link from "next/link";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import type { Product } from "@/features/catalog/types/product";

type HomeCatalogSectionProps = {
  products: Product[];
  categoryNames: string[];
  collectionCount: number;
};

export function HomeCatalogSection({
  products,
  categoryNames,
  collectionCount,
}: HomeCatalogSectionProps) {
  return (
    <section
      id="catalogo"
      className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:p-8"
    >
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
            Compra directa
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] text-stone-50 sm:text-4xl">
            Productos listos para agregar al carrito
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-300 sm:text-base">
            La capa editorial vive arriba y aqui queda la zona transaccional:
            productos conectados al backend, variantes visibles y flujo de carrito intacto.
          </p>
          <Link
            href="/catalogo"
            className="mt-5 inline-flex items-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-100 transition hover:border-white/30 hover:bg-white/[0.05]"
          >
            Ver ruta de catalogo
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {categoryNames.map((categoryName) => (
            <span
              key={categoryName}
              className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-stone-300"
            >
              {categoryName}
            </span>
          ))}
          <span className="rounded-full border border-[rgba(212,177,138,0.22)] bg-[rgba(212,177,138,0.08)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-stone-200">
            {collectionCount} colecciones reales
          </span>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      ) : (
        <div className="mt-8 rounded-[2rem] border border-dashed border-white/10 bg-black/10 px-6 py-10 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-stone-500">
            Sin productos visibles
          </p>
          <p className="mt-3 text-sm text-stone-300">
            Cuando el backend devuelva articulos, apareceran aqui sin cambiar la
            estructura de la home.
          </p>
        </div>
      )}
    </section>
  );
}
