import Link from "next/link";
import {
  catalogBrandMark,
  catalogCollections,
  getCatalogCategoryShowcases,
} from "@/features/catalog/content/catalog-showcase";
import type { Product } from "@/features/catalog/types/product";
import { formatPrice } from "@/lib/format-price";

type HomeCatalogDiscoveryProps = {
  products: Product[];
};

export function HomeCatalogDiscovery({
  products,
}: HomeCatalogDiscoveryProps) {
  const categoryShowcases = getCatalogCategoryShowcases(products);
  const primaryCategory = categoryShowcases[0] ?? null;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
            Explorar catalogo
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] text-stone-50 sm:text-4xl">
            La home ya abre por categoria y por una lectura editorial honesta
          </h2>
        </div>

        <p className="max-w-xl text-sm leading-7 text-stone-300 sm:text-right">
          Las categorias ya navegan a rutas reales. Las colecciones siguen siendo
          una capa visual curada y, mientras no tengan ruta propia, conducen de
          forma explicita al catalogo general.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        {primaryCategory ? (
          <article className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/20 shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${primaryCategory.imageSrc}')` }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,9,8,0.18),rgba(12,9,8,0.72)_55%,rgba(12,9,8,0.92)_100%)]" />

            <div className="relative flex h-full min-h-[24rem] flex-col justify-between p-7 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-full border border-white/15 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.28em] text-stone-100">
                  Categoria conectada
                </div>
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-3 py-2 backdrop-blur-sm">
                  <div
                    className="h-8 w-8 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${catalogBrandMark.src}')` }}
                    aria-hidden="true"
                  />
                  <span className="text-xs uppercase tracking-[0.22em] text-stone-200">
                    Leyne
                  </span>
                </div>
              </div>

              <div className="max-w-xl">
                <p className="text-sm uppercase tracking-[0.24em] text-stone-300">
                  {primaryCategory.title}
                </p>
                <h3 className="mt-4 text-4xl font-semibold tracking-[0.01em] text-stone-50 sm:text-5xl">
                  Entrada principal para compra directa
                </h3>
                <p className="mt-4 max-w-lg text-sm leading-7 text-stone-200 sm:text-base">
                  {primaryCategory.description}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                    <p className="text-2xl font-semibold text-stone-50">
                      {primaryCategory.productCount}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-300">
                      productos activos
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                    <p className="text-2xl font-semibold text-stone-50">
                      {primaryCategory.startingPrice !== null
                        ? formatPrice(primaryCategory.startingPrice)
                        : "-"}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-300">
                      precio base
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                    <p className="text-2xl font-semibold text-stone-50">
                      {catalogCollections.length}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-300">
                      colecciones visuales
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href={`/catalogo/${primaryCategory.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-[rgba(212,177,138,0.95)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-950 transition hover:bg-[rgba(226,196,164,1)]"
                  >
                    Ver categoria
                  </Link>
                  <Link
                    href="/catalogo"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-100 transition hover:border-white/30 hover:bg-white/[0.05]"
                  >
                    Ir al catalogo
                  </Link>
                  <p className="text-sm leading-7 text-stone-300">
                    La capa visual del catalogo ya esta separada del grid de compra.
                  </p>
                </div>
              </div>
            </div>
          </article>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {catalogCollections.map((collection) => (
            <article
              key={collection.slug}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 min-h-[15rem] shadow-[0_18px_60px_rgba(0,0,0,0.22)]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${collection.imageSrc}')` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,7,0.1),rgba(10,8,7,0.65)_58%,rgba(10,8,7,0.88)_100%)]" />

              <div className="relative flex h-full flex-col justify-between p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-stone-200">
                    {collection.line}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-stone-300">
                    {collection.assetCount} assets
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-stone-50">
                    {collection.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-200">
                    {collection.description}
                  </p>
                  <Link
                    href="/catalogo"
                    className="mt-4 inline-flex text-sm font-medium uppercase tracking-[0.16em] text-stone-100 transition hover:text-[rgba(212,177,138,1)]"
                  >
                    Ir al catalogo general
                  </Link>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-400">
                    Ruta propia de coleccion pendiente
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
