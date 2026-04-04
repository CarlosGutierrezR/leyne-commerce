import type { Product } from "@/features/catalog/types/product";

export type CatalogCollection = {
  slug: string;
  title: string;
  line: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  assetCount: number;
  sourceFolder: string;
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

export const catalogCollections: CatalogCollection[] = [
  {
    slug: "fantastic",
    title: "Fantastic",
    line: "Linea Satin",
    description: "Capsula visual base para una lectura suave y continua del catalogo.",
    imageSrc: "/images/catalog/collections/satin/fantastic/cover.png",
    imageAlt: "Coleccion Fantastic de linea satin",
    assetCount: 16,
    sourceFolder: "public/images/LINEA SATIN/FANTASTIC",
  },
  {
    slug: "fantastic-premium",
    title: "Fantastic Premium",
    line: "Linea Satin",
    description:
      "Variante premium preparada para destacar producto, detalle textil y narrativa visual.",
    imageSrc: "/images/catalog/collections/satin/fantastic-premium/cover.png",
    imageAlt: "Coleccion Fantastic Premium de linea satin",
    assetCount: 10,
    sourceFolder: "public/images/LINEA SATIN/FANTASTIC PREMIUM",
  },
  {
    slug: "primavera",
    title: "Primavera",
    line: "Linea Satin",
    description:
      "Entrada editorial para una coleccion ligera y facil de ordenar por estilos y variantes.",
    imageSrc: "/images/catalog/collections/satin/primavera/cover.png",
    imageAlt: "Coleccion Primavera de linea satin",
    assetCount: 8,
    sourceFolder: "public/images/LINEA SATIN/PRIMAVERA",
  },
  {
    slug: "primavera-deluxe",
    title: "Primavera Deluxe",
    line: "Linea Satin",
    description:
      "Biblioteca visual amplia para fichas mas completas y una futura vista de coleccion.",
    imageSrc: "/images/catalog/collections/satin/primavera-deluxe/cover.png",
    imageAlt: "Coleccion Primavera Deluxe de linea satin",
    assetCount: 12,
    sourceFolder: "public/images/LINEA SATIN/PRIMAVERA DELUXE",
  },
  {
    slug: "sensualidad",
    title: "Sensualidad",
    line: "Linea Satin",
    description:
      "Coleccion lista para una navegacion mas emocional dentro de la home y del catalogo.",
    imageSrc: "/images/catalog/collections/satin/sensualidad/cover.png",
    imageAlt: "Coleccion Sensualidad de linea satin",
    assetCount: 11,
    sourceFolder: "public/images/LINEA SATIN/SENSUALIDAD",
  },
  {
    slug: "sensualidad-gold",
    title: "Sensualidad Gold",
    line: "Linea Satin",
    description:
      "Variacion con tono premium lista para crecer hacia un escaparate mas aspiracional.",
    imageSrc: "/images/catalog/collections/satin/sensualidad-gold/cover.png",
    imageAlt: "Coleccion Sensualidad Gold de linea satin",
    assetCount: 11,
    sourceFolder: "public/images/LINEA SATIN/SENSUALIDAD GOLD",
  },
];

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
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
