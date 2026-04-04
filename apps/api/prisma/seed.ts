import { prisma } from "../src/lib/prisma";

async function main() {
  // Crear categoría
  const category = await prisma.category.create({
    data: {
      name: "Pijamas",
      slug: "pijamas",
    },
  });

  // Crear producto
  const product = await prisma.product.create({
    data: {
      name: "Pijama Satin Primavera",
      slug: "pijama-satin-primavera",
      description: "Pijama en satín suave, cómoda y elegante.",
      categoryId: category.id,
    },
  });

  // Crear variantes
  await prisma.productVariant.createMany({
    data: [
      {
        productId: product.id,
        sku: "PSP-ROSA-S",
        size: "S",
        color: "Rosa",
        price: 25.0,
        stock: 10,
        isDefault: true,
      },
      {
        productId: product.id,
        sku: "PSP-ROSA-M",
        size: "M",
        color: "Rosa",
        price: 25.0,
        stock: 8,
      },
      {
        productId: product.id,
        sku: "PSP-NEGRO-M",
        size: "M",
        color: "Negro",
        price: 27.0,
        stock: 5,
      },
    ],
  });

  // Imagen
  await prisma.productImage.create({
    data: {
      productId: product.id,
      url: "/images/pijama1.jpg",
      alt: "Pijama Satin Primavera",
    },
  });

  console.log("Seed ejecutado correctamente");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });