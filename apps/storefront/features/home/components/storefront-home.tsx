import { CartPanel } from "@/features/cart/components/cart-panel";
import { catalogCollections } from "@/features/catalog/content/catalog-showcase";
import type { Product } from "@/features/catalog/types/product";
import { HomeCatalogDiscovery } from "@/features/home/components/home-catalog-discovery";
import { HomeCatalogSection } from "@/features/home/components/home-catalog-section";
import { HomeFeaturedProducts } from "@/features/home/components/home-featured-products";
import { HomeHero } from "@/features/home/components/home-hero";

type StorefrontHomeProps = {
  products: Product[];
};

export function StorefrontHome({ products }: StorefrontHomeProps) {
  const featuredProducts = products.slice(0, Math.min(products.length, 3));
  const categoryNames = Array.from(
    new Set(products.map((product) => product.category.name))
  );

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(212,177,138,0.18),transparent_58%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl" />

      <CartPanel />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <HomeHero
          totalProducts={products.length}
          totalCategories={categoryNames.length}
          totalCollections={catalogCollections.length}
        />
        <HomeCatalogDiscovery products={products} />
        <HomeFeaturedProducts products={featuredProducts} />
        <HomeCatalogSection
          products={products}
          categoryNames={categoryNames}
          collectionCount={catalogCollections.length}
        />
      </div>
    </main>
  );
}
