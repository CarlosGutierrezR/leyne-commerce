import Link from "next/link";
import { CartPanel } from "@/features/cart/components/cart-panel";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { ProductGallery } from "@/features/catalog/components/product-gallery";
import {
  getProductCategorySlug,
  getProductHref,
  getProductPrimaryImage,
  getProductPrimaryImageAlt,
} from "@/features/catalog/lib/product-helpers";
import {
  getProductDefaultVariant,
  type Product,
} from "@/features/catalog/types/product";
import { StorefrontImage } from "@/lib/storefront-image-element";
import { formatPrice } from "@/lib/format-price";

type ProductDetailViewProps = {
  product: Product;
  relatedProducts: Product[];
};

export function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  const defaultVariant = getProductDefaultVariant(product);
  const categorySlug = getProductCategorySlug(product);

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(212,177,138,0.18),transparent_58%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl" />

      <CartPanel />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-stone-400">
              <Link href="/" className="transition hover:text-stone-200">
                Inicio
              </Link>
              <span>/</span>
              <Link href="/catalogo" className="transition hover:text-stone-200">
                Catalogo
              </Link>
              <span>/</span>
              <Link
                href={`/catalogo/${categorySlug}`}
                className="transition hover:text-stone-200"
              >
                {product.category.name}
              </Link>
              <span>/</span>
              <span className="text-stone-200">{product.name}</span>
            </div>

            <ProductGallery product={product} />
          </div>

          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:p-10">
              <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
                Producto Leyne
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[0.01em] text-stone-50 sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-stone-300">
                {product.description ||
                  "Ficha de producto preparada para crecer con mas detalle, mas variantes y un flujo de compra posterior."}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <MetricCard
                  label="Precio"
                  value={
                    defaultVariant ? formatPrice(defaultVariant.price) : "No disponible"
                  }
                  helper="Variante por defecto"
                />
                <MetricCard
                  label="Color"
                  value={defaultVariant?.color || "Sin definir"}
                  helper="Seleccion principal"
                />
                <MetricCard
                  label="Talla"
                  value={defaultVariant?.size || "Unica"}
                  helper="Dato disponible"
                />
              </div>

              <div className="mt-8 rounded-[2rem] border border-white/10 bg-black/15 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
                      CTA principal
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-stone-50">
                      {defaultVariant
                        ? formatPrice(defaultVariant.price)
                        : "Producto sin variante activa"}
                    </p>
                    <p className="mt-2 text-sm text-stone-300">
                      SKU {defaultVariant?.sku || "Sin SKU"}.
                    </p>
                  </div>

                  <AddToCartButton
                    product={product}
                    variant={defaultVariant}
                    className="w-full rounded-full bg-[rgba(212,177,138,0.95)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-stone-950 transition hover:bg-[rgba(226,196,164,1)] disabled:cursor-not-allowed disabled:bg-stone-600 disabled:text-stone-200 sm:w-auto"
                    idleLabel="Agregar al carrito"
                    pendingLabel="Agregando..."
                  />
                </div>
              </div>
            </div>

            <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
                    Variantes
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] text-stone-50">
                    Base visual para elegir despues
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-stone-300 sm:text-right">
                  La ficha ya muestra opciones reales del backend aunque la interaccion
                  avanzada de variantes se deje para el siguiente paso.
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {product.variants.map((variant) => {
                  const isDefault = defaultVariant?.id === variant.id;

                  return (
                    <article
                      key={variant.id}
                      className={[
                        "rounded-[1.75rem] border p-4 transition",
                        isDefault
                          ? "border-[rgba(212,177,138,0.45)] bg-[rgba(212,177,138,0.08)]"
                          : "border-white/10 bg-black/15",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-stone-400">
                            {isDefault ? "Variante por defecto" : "Variante disponible"}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-stone-50">
                            {[variant.color, variant.size].filter(Boolean).join(" / ") ||
                              "Seleccion disponible"}
                          </h3>
                        </div>
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-stone-300">
                          {formatPrice(variant.price)}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <VariantTag label={`SKU ${variant.sku}`} />
                        {variant.color ? <VariantTag label={`Color ${variant.color}`} /> : null}
                        {variant.size ? <VariantTag label={`Talla ${variant.size}`} /> : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        </header>

        {relatedProducts.length > 0 ? (
          <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-8">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
                  Continuar explorando
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] text-stone-50 sm:text-4xl">
                  Mas productos de la misma categoria
                </h2>
                <p className="mt-3 text-sm leading-7 text-stone-300 sm:text-base">
                  Dejamos la transicion lista entre ficha de producto y navegacion de catalogo.
                </p>
              </div>

              <Link
                href={`/catalogo/${categorySlug}`}
                className="inline-flex items-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-100 transition hover:border-white/30 hover:bg-white/[0.05]"
              >
                Volver a {product.category.name}
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={getProductHref(relatedProduct)}
                  className="group overflow-hidden rounded-[2rem] border border-white/10 bg-black/15 transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-stone-950">
                    <StorefrontImage
                      src={getProductPrimaryImage(relatedProduct)}
                      alt={getProductPrimaryImageAlt(relatedProduct)}
                      fallbackAlt={relatedProduct.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="space-y-3 p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-400">
                      {relatedProduct.category.name}
                    </p>
                    <h3 className="text-xl font-semibold text-stone-50">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm leading-7 text-stone-300">
                      {relatedProduct.description ||
                        "Ficha preparada para ampliar la experiencia de catalogo."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
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
      <p className="mt-3 text-2xl font-semibold text-stone-50">{value}</p>
      <p className="mt-2 text-sm text-stone-300">{helper}</p>
    </div>
  );
}

type VariantTagProps = {
  label: string;
};

function VariantTag({ label }: VariantTagProps) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-stone-300">
      {label}
    </span>
  );
}
