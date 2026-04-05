import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/products", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        collection: true,
        variants: true,
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(
      products.map((product) => ({
        ...product,
        images: product.images.map((image) => ({
          id: image.id,
          position: image.position,
          url: image.url,
          altText: image.alt,
        })),
      }))
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to fetch products",
    });
  }
});

export default router;
