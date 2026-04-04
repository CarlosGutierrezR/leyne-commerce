import Link from "next/link";
import type { CatalogCategoryRecord } from "@/features/catalog/content/catalog-showcase";
import { formatPrice } from "@/lib/format-price";

type CatalogCategoryShowcaseGridProps = {
  categories: CatalogCategoryRecord[];
  activeCategorySlug?: string | null;
};

export function CatalogCategoryShowcaseGrid({
  categories,
  activeCategorySlug,
}: CatalogCategoryShowcaseGridProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
            Categorias
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] text-stone-50">
            Entrada visual del catalogo por categoria
          </h2>
        </div>

        <p className="max-w-xl text-sm leading-7 text-stone-300 sm:text-right">
          La navegacion queda preparada para multiples categorias aunque hoy el
          backend solo exponga una base inicial.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {categories.map((category) => {
          const isActive = activeCategorySlug === category.slug;

          return (
            <Link
              key={category.slug}
              href={`/catalogo/${category.slug}`}
              className={[
                "group relative overflow-hidden rounded-[2rem] border bg-black/20 shadow-[0_20px_70px_rgba(0,0,0,0.24)] transition",
                isActive
                  ? "border-[rgba(212,177,138,0.45)]"
                  : "border-white/10 hover:border-white/20",
              ].join(" ")}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${category.imageSrc}')` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,7,0.16),rgba(10,8,7,0.7)_55%,rgba(10,8,7,0.92)_100%)]" />

              <div className="relative flex min-h-[19rem] flex-col justify-between p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-stone-100">
                    {isActive ? "Categoria activa" : "Categoria"}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-stone-300">
                    {category.productCount} producto{category.productCount === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="max-w-xl">
                  <h3 className="text-3xl font-semibold text-stone-50">
                    {category.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-200">
                    {category.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <div className="rounded-full border border-white/10 bg-black/15 px-4 py-2 text-sm text-stone-100">
                      Desde{" "}
                      <span className="font-semibold">
                        {category.startingPrice !== null
                          ? formatPrice(category.startingPrice)
                          : "-"}
                      </span>
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-stone-300">
                      Ver categoria
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
