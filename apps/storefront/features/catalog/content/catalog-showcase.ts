import type { Product } from "@/features/catalog/types/product";

export type CatalogCollectionRecord = {
  slug: string;
  title: string;
  description: string;
  lineName: string | null;
  imageSrc: string;
  imageAlt: string;
  productCount: number;
  startingPrice: number | null;
  products: Product[];
};

export type CatalogCategoryShowcase = {
  slug: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  productCount: number;
  startingPrice: number | null;
};

export type CatalogCategoryRecord = CatalogCategoryShowcase & {
  products: Product[];
};

const categoryVisuals: Record<
  string,
  {
    imageSrc: string;
    imageAlt: string;
    description: string;
  }
> = {
  pijamas: {
    imageSrc: "/images/catalog/categories/pijamas/cover.jpg",
    imageAlt: "Pijama satin primavera",
    description:
      "Categoria conectada al backend y lista para crecer con fichas reales de producto.",
  },
};

export const catalogBrandMark = {
  src: "/images/catalog/brand/leyne-confort-care/logo-primary.png",
  alt: "Leyne Confort Care",
};

export function getCatalogCollectionRecords(
  products: Product[]
): CatalogCollectionRecord[] {
  const groupedProducts = new Map<string, Product[]>();

  for (const product of products) {
    const collection = product.collection;

    if (!collection) {
      continue;
    }

    const slug = normalizeCatalogCollectionSlug(
      collection.slug ?? collection.name
    );
    const collectionProducts = groupedProducts.get(slug) ?? [];
    collectionProducts.push(product);
    groupedProducts.set(slug, collectionProducts);
  }

  return Array.from(groupedProducts.entries())
    .map(([slug, collectionProducts]) => {
      const firstProduct = collectionProducts[0];
      const collection = firstProduct?.collection;
      const firstImage = firstProduct?.images[0];

      return {
        slug,
        title: collection?.name ?? firstProduct?.name ?? slug,
        description:
          collection?.description ??
          "Coleccion real conectada al backend y disponible dentro del catalogo activo.",
        lineName: collection?.lineName ?? null,
        imageSrc: firstImage?.url ?? "/images/pijama1.jpg",
        imageAlt:
          firstImage?.altText ??
          collection?.name ??
          firstProduct?.name ??
          "Coleccion activa",
        productCount: collectionProducts.length,
        startingPrice: getStartingPrice(collectionProducts),
        products: collectionProducts,
      };
    })
    .sort((left, right) => {
      if (right.productCount !== left.productCount) {
        return right.productCount - left.productCount;
      }

      return left.title.localeCompare(right.title, "es");
    });
}

export function getCatalogCategoryShowcases(
  products: Product[]
): CatalogCategoryShowcase[] {
  return getCatalogCategoryRecords(products).map((record) => ({
    slug: record.slug,
    title: record.title,
    description: record.description,
    imageSrc: record.imageSrc,
    imageAlt: record.imageAlt,
    productCount: record.productCount,
    startingPrice: record.startingPrice,
  }));
}

export function getCatalogCategoryRecords(
  products: Product[]
): CatalogCategoryRecord[] {
  const groupedProducts = new Map<string, Product[]>();

  for (const product of products) {
    const slug = normalizeCatalogCategorySlug(
      product.category.slug ?? product.category.name
    );
    const categoryProducts = groupedProducts.get(slug) ?? [];
    categoryProducts.push(product);
    groupedProducts.set(slug, categoryProducts);
  }

  return Array.from(groupedProducts.entries())
    .map(([slug, categoryProducts]) => {
      const visual = categoryVisuals[slug];
      const title = categoryProducts[0]?.category.name ?? slug;
      const firstImage = categoryProducts[0]?.images[0];
      const startingPrice = getStartingPrice(categoryProducts);

      return {
        slug,
        title,
        description:
          visual?.description ??
          "Categoria activa del catalogo conectada al backend actual.",
        imageSrc: visual?.imageSrc ?? firstImage?.url ?? "/images/pijama1.jpg",
        imageAlt: visual?.imageAlt ?? firstImage?.altText ?? title,
        productCount: categoryProducts.length,
        startingPrice,
        products: categoryProducts,
      };
    })
    .sort((left, right) => right.productCount - left.productCount);
}

export function getCatalogCategoryRecord(
  products: Product[],
  categorySlug: string
) {
  const normalizedSlug = normalizeCatalogCategorySlug(categorySlug);

  return getCatalogCategoryRecords(products).find(
    (category) => category.slug === normalizedSlug
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

export function normalizeCatalogCategorySlug(value: string) {
  return normalizeCatalogSlug(value);
}

export function normalizeCatalogCollectionSlug(value: string) {
  return normalizeCatalogSlug(value);
}

function normalizeCatalogSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
