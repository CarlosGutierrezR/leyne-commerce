import type { PrismaClient } from "../src/generated/prisma/client.js";
import { prisma } from "../src/lib/prisma.js";

type CatalogCategorySeed = {
  name: string;
  slug: string;
};

type CatalogCollectionSeed = {
  description: string;
  lineName: string;
  name: string;
  slug: string;
};

type CatalogProductSeed = {
  categorySlug: string;
  collectionSlug: string;
  description: string;
  images: string[];
  name: string;
  slug: string;
  variant: {
    price: number;
    size: string;
    sku: string;
    stock: number;
  };
};

type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

const catalogCategories: CatalogCategorySeed[] = [
  {
    name: "Pijamas",
    slug: "pijamas",
  },
];

const catalogCollections: CatalogCollectionSeed[] = [
  {
    name: "Fantastic",
    slug: "fantastic",
    lineName: "Linea Satin",
    description:
      "Capsula visual base para una lectura suave y continua del catalogo.",
  },
  {
    name: "Fantastic Premium",
    slug: "fantastic-premium",
    lineName: "Linea Satin",
    description:
      "Variante premium preparada para destacar producto, detalle textil y narrativa visual.",
  },
  {
    name: "Primavera",
    slug: "primavera",
    lineName: "Linea Satin",
    description:
      "Entrada editorial para una coleccion ligera y facil de ordenar por estilos y variantes.",
  },
  {
    name: "Primavera Deluxe",
    slug: "primavera-deluxe",
    lineName: "Linea Satin",
    description:
      "Biblioteca visual amplia para fichas mas completas y una futura vista de coleccion.",
  },
  {
    name: "Sensualidad",
    slug: "sensualidad",
    lineName: "Linea Satin",
    description:
      "Coleccion lista para una navegacion mas emocional dentro de la home y del catalogo.",
  },
  {
    name: "Sensualidad Gold",
    slug: "sensualidad-gold",
    lineName: "Linea Satin",
    description:
      "Variacion con tono premium lista para crecer hacia un escaparate mas aspiracional.",
  },
];

const catalogProducts: CatalogProductSeed[] = [
  {
    name: "Pijama Satin Fantastic",
    slug: "pijama-satin-fantastic",
    description:
      "Coleccion Fantastic de Linea Satin con galeria real conectada desde los assets del repositorio.",
    categorySlug: "pijamas",
    collectionSlug: "fantastic",
    variant: {
      sku: "SAT-FANTASTIC-U",
      size: "Unica",
      price: 32.9,
      stock: 12,
    },
    images: [
      "/images/LINEA SATIN/FANTASTIC/1.png",
      "/images/LINEA SATIN/FANTASTIC/2.png",
      "/images/LINEA SATIN/FANTASTIC/3.png",
    ],
  },
  {
    name: "Pijama Satin Fantastic Premium",
    slug: "pijama-satin-fantastic-premium",
    description:
      "Version premium de Fantastic dentro de Linea Satin, sembrada con fotos reales del catalogo.",
    categorySlug: "pijamas",
    collectionSlug: "fantastic-premium",
    variant: {
      sku: "SAT-FANTASTIC-PREM-U",
      size: "Unica",
      price: 38.9,
      stock: 10,
    },
    images: [
      "/images/LINEA SATIN/FANTASTIC PREMIUM/1.png",
      "/images/LINEA SATIN/FANTASTIC PREMIUM/2.png",
      "/images/LINEA SATIN/FANTASTIC PREMIUM/3.png",
    ],
  },
  {
    name: "Pijama Satin Primavera",
    slug: "pijama-satin-primavera",
    description:
      "Linea Satin Primavera con biblioteca visual real para portada, listado y ficha de producto.",
    categorySlug: "pijamas",
    collectionSlug: "primavera",
    variant: {
      sku: "SAT-PRIMAVERA-U",
      size: "Unica",
      price: 29.9,
      stock: 14,
    },
    images: [
      "/images/LINEA SATIN/PRIMAVERA/1 PRIMAVERA SATIN.png",
      "/images/LINEA SATIN/PRIMAVERA/2.png",
      "/images/LINEA SATIN/PRIMAVERA/3.png",
    ],
  },
  {
    name: "Pijama Satin Primavera Deluxe",
    slug: "pijama-satin-primavera-deluxe",
    description:
      "Edicion Primavera Deluxe de Linea Satin con imagenes reales ordenadas para una galeria consistente.",
    categorySlug: "pijamas",
    collectionSlug: "primavera-deluxe",
    variant: {
      sku: "SAT-PRIMAVERA-DELUXE-U",
      size: "Unica",
      price: 41.9,
      stock: 9,
    },
    images: [
      "/images/LINEA SATIN/PRIMAVERA DELUXE/2.png",
      "/images/LINEA SATIN/PRIMAVERA DELUXE/3.png",
      "/images/LINEA SATIN/PRIMAVERA DELUXE/4.png",
    ],
  },
  {
    name: "Pijama Satin Sensualidad",
    slug: "pijama-satin-sensualidad",
    description:
      "Capsula Sensualidad de Linea Satin preparada para un detalle de producto con fotos variadas.",
    categorySlug: "pijamas",
    collectionSlug: "sensualidad",
    variant: {
      sku: "SAT-SENSUALIDAD-U",
      size: "Unica",
      price: 35.9,
      stock: 11,
    },
    images: [
      "/images/LINEA SATIN/SENSUALIDAD/1.png",
      "/images/LINEA SATIN/SENSUALIDAD/2.png",
      "/images/LINEA SATIN/SENSUALIDAD/3.png",
    ],
  },
  {
    name: "Pijama Satin Sensualidad Gold",
    slug: "pijama-satin-sensualidad-gold",
    description:
      "Version Sensualidad Gold de Linea Satin con galeria real conectada a ProductImage.",
    categorySlug: "pijamas",
    collectionSlug: "sensualidad-gold",
    variant: {
      sku: "SAT-SENSUALIDAD-GOLD-U",
      size: "Unica",
      price: 44.9,
      stock: 8,
    },
    images: [
      "/images/LINEA SATIN/SENSUALIDAD GOLD/1.png",
      "/images/LINEA SATIN/SENSUALIDAD GOLD/2.png",
      "/images/LINEA SATIN/SENSUALIDAD GOLD/3.png",
    ],
  },
];

async function main() {
  await prisma.$transaction(async (tx: TransactionClient) => {
    // Reset the product catalog so the storefront always reflects this curated seed.
    await tx.cartItem.deleteMany();
    await tx.productImage.deleteMany();
    await tx.productVariant.deleteMany();
    await tx.product.deleteMany();
    await tx.collection.deleteMany();
    await tx.category.deleteMany();

    const categoryIds = new Map<string, string>();
    const collectionIds = new Map<string, string>();

    for (const category of catalogCategories) {
      const createdCategory = await tx.category.create({
        data: category,
      });

      categoryIds.set(createdCategory.slug, createdCategory.id);
    }

    for (const collection of catalogCollections) {
      const createdCollection = await tx.collection.create({
        data: collection,
      });

      collectionIds.set(createdCollection.slug, createdCollection.id);
    }

    for (const product of catalogProducts) {
      const categoryId = categoryIds.get(product.categorySlug);
      const collectionId = collectionIds.get(product.collectionSlug);

      if (!categoryId) {
        throw new Error(`Missing category for product ${product.slug}`);
      }

      if (!collectionId) {
        throw new Error(`Missing collection for product ${product.slug}`);
      }

      await tx.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          categoryId,
          collectionId,
          variants: {
            create: {
              sku: product.variant.sku,
              size: product.variant.size,
              price: product.variant.price,
              stock: product.variant.stock,
              isDefault: true,
            },
          },
          images: {
            create: product.images.map((url, index) => ({
              url,
              alt: `${product.name} vista ${index + 1}`,
              position: index,
            })),
          },
        },
      });
    }
  });

  const [categoryCount, collectionCount, productCount, variantCount, imageCount] =
    await Promise.all([
      prisma.category.count(),
      prisma.collection.count(),
      prisma.product.count(),
      prisma.productVariant.count(),
      prisma.productImage.count(),
    ]);

  console.log(
    `Catalog seed completed: ${categoryCount} categories, ${collectionCount} collections, ${productCount} products, ${variantCount} variants, ${imageCount} images.`
  );
}

main()
  .catch((error) => {
    console.error("Catalog seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
