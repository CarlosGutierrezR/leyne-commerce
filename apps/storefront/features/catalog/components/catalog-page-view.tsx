import Link from "next/link";
import { CartPanel } from "@/features/cart/components/cart-panel";
import {
  catalogBrandMark,
  getCatalogCategoryRecords,
} from "@/features/catalog/content/catalog-showcase";
import { CatalogCategoryNavigation } from "@/features/catalog/components/catalog-category-navigation";
import { CatalogCategoryShowcaseGrid } from "@/features/catalog/components/catalog-category-showcase-grid";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import type { Product } from "@/features/catalog/types/product";
import { formatPrice } from "@/lib/format-price";

type CatalogPageViewProps = {
  products: Product[];
  activeCategorySlug?: string | null;
};

export function CatalogPageView({
  products,
  activeCategorySlug = null,
}: CatalogPageViewProps) {
  const categories = getCatalogCategoryRecords(products);
  const activeCategory =
    categories.find((category) => category.slug === activeCategorySlug) ?? null;
  const visibleProducts = activeCategory ? activeCategory.products : products;
  const visibleStartingPrice = getStartingPrice(visibleProducts);

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(212,177,138,0.18),transparent_58%)]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl" />

      <CartPanel />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <header className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
          <div className="rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.26)] backdrop-blur-sm sm:p-10">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-stone-400">
              <Link href="/" className="transition hover:text-stone-200">
                Inicio
              </Link>
              <span>/</span>
              <Link href="/catalogo" className="transition hover:text-stone-200">
                Catalogo
              </Link>
              {activeCategory ? (
                <>
                  <span>/</span>
                  <span className="text-stone-200">{activeCategory.title}</span>
                </>
              ) : null}
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.32em] text-stone-400">
              Catalogo Leyne
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[0.01em] text-stone-50 sm:text-5xl">
              {activeCategory
                ? activeCategory.title
                : "Explora el catalogo completo por categoria"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              {activeCategory
                ? `${activeCategory.description} Esta vista reutiliza el mismo grid de compra y deja el carrito siempre disponible.`
                : "La navegacion del storefront ya separa descubrimiento y compra directa, preparada para multiples categorias sin cambiar el backend actual."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#productos"
                className="inline-flex items-center justify-center rounded-full bg-[rgba(212,177,138,0.95)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-950 transition hover:bg-[rgba(226,196,164,1)]"
              >
                Ver productos
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-100 transition hover:border-white/30 hover:bg-white/[0.05]"
              >
                Volver a home
              </Link>
            </div>
          </div>

          <article className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-10">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url('${catalogBrandMark.src}')` }}
                aria-hidden="true"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
                  Navegacion activa
                </p>
                <p className="mt-1 text-lg font-semibold text-stone-50">
                  {activeCategory ? activeCategory.title : "Todo el catalogo"}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <MetricCard
                label="Categorias"
                value={String(categories.length)}
                helper="Base preparada para multiples grupos"
              />
              <MetricCard
                label="Productos visibles"
                value={String(visibleProducts.length)}
                helper="Resultado de la vista actual"
              />
              <MetricCard
                label="Precio base"
                value={
                  visibleStartingPrice !== null
                    ? formatPrice(visibleStartingPrice)
                    : "-"
                }
                helper="Calculado con variantes reales del backend"
              />
            </div>
          </article>
        </header>

        <CatalogCategoryNavigation
          categories={categories}
          activeCategorySlug={activeCategorySlug}
        />

        <CatalogCategoryShowcaseGrid
          categories={categories}
          activeCategorySlug={activeCategorySlug}
        />

        <section
          id="productos"
          className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-8"
        >
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
                Compra directa
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] text-stone-50 sm:text-4xl">
                {activeCategory
                  ? `Productos en ${activeCategory.title}`
                  : "Todos los productos disponibles"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-300 sm:text-base">
                {activeCategory
                  ? "El grid reutiliza las mismas tarjetas de producto y el mismo flujo de carrito."
                  : "Esta vista centraliza el catalogo completo y deja lista la base para futuros listados y detalle de producto."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeCategory ? (
                <span className="rounded-full border border-[rgba(212,177,138,0.22)] bg-[rgba(212,177,138,0.08)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-stone-200">
                  {activeCategory.title}
                </span>
              ) : null}
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-stone-300">
                {visibleProducts.length} producto{visibleProducts.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="mt-8">
              <ProductGrid products={visibleProducts} />
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-dashed border-white/10 bg-black/10 px-6 py-10 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-stone-500">
                Sin productos visibles
              </p>
              <p className="mt-3 text-sm text-stone-300">
                Cuando el backend exponga productos en esta categoria, apareceran aqui
                sin cambiar la estructura de la ruta.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
};

function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-stone-50">{value}</p>
      <p className="mt-2 text-sm text-stone-300">{helper}</p>
    </div>
  );
}

function getStartingPrice(products: Product[]) {
  const prices = products
    .flatMap((product) => product.variants)
    .map((variant) => Number(variant.price))
    .filter((price) => !Number.isNaN(price));

  if (prices.length === 0) {
    return null;
  }

  return Math.min(...prices);
}
