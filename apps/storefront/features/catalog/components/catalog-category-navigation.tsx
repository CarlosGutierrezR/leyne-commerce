import Link from "next/link";
import type { CatalogCategoryRecord } from "@/features/catalog/content/catalog-showcase";

type CatalogCategoryNavigationProps = {
  categories: CatalogCategoryRecord[];
  activeCategorySlug?: string | null;
};

export function CatalogCategoryNavigation({
  categories,
  activeCategorySlug,
}: CatalogCategoryNavigationProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Categorias del catalogo"
      className="flex flex-wrap gap-3"
    >
      <CategoryLink
        href="/catalogo"
        isActive={!activeCategorySlug}
        label="Todo el catalogo"
        meta={`${categories.reduce((total, category) => total + category.productCount, 0)} productos`}
      />

      {categories.map((category) => (
        <CategoryLink
          key={category.slug}
          href={`/catalogo/${category.slug}`}
          isActive={activeCategorySlug === category.slug}
          label={category.title}
          meta={`${category.productCount} producto${category.productCount === 1 ? "" : "s"}`}
        />
      ))}
    </nav>
  );
}

type CategoryLinkProps = {
  href: string;
  isActive: boolean;
  label: string;
  meta: string;
};

function CategoryLink({ href, isActive, label, meta }: CategoryLinkProps) {
  return (
    <Link
      href={href}
      className={[
        "rounded-full border px-4 py-3 text-sm transition",
        isActive
          ? "border-[rgba(212,177,138,0.45)] bg-[rgba(212,177,138,0.14)] text-stone-50"
          : "border-white/10 bg-white/[0.04] text-stone-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-stone-50",
      ].join(" ")}
    >
      <span className="block font-medium">{label}</span>
      <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-stone-400">
        {meta}
      </span>
    </Link>
  );
}
