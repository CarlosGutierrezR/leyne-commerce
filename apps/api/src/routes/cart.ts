import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

/**
 * Crear carrito vacío
 */
router.post("/cart", async (_req, res) => {
  try {
    console.log("POST /api/cart hit");

    const cart = await prisma.cart.create({
      data: {},
      include: {
        items: true,
      },
    });

    console.log("Cart created:", cart);

    res.status(201).json(cart);
  } catch (error) {
    console.error("Error creating cart FULL:");
    console.error(error);

    res.status(500).json({
      ok: false,
      error: "Failed to create cart",
    });
  }
});

/**
 * Obtener carrito por id
 */
router.get("/cart/:id", async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: true,
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return res.status(404).json({
        ok: false,
        error: "Cart not found",
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to fetch cart",
    });
  }
});

/**
 * Añadir item al carrito
 */
router.post("/cart/:id/items", async (req, res) => {
  try {
    const cartId = req.params.id;
    const { variantId, quantity } = req.body;

    if (!variantId || !quantity || quantity < 1) {
      return res.status(400).json({
        ok: false,
        error: "variantId and quantity are required",
      });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId,
          variantId,
        },
      },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: {
          cartId_variantId: {
            cartId,
            variantId,
          },
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });

      return res.status(200).json(updatedItem);
    }

    const newItem = await prisma.cartItem.create({
      data: {
        cartId,
        variantId,
        quantity,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to add item to cart",
    });
  }
});

export default router;