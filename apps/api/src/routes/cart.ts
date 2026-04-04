import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

type MutableCartResult =
  | {
      ok: true;
      cart: {
        id: string;
        status: string;
      };
    }
  | {
      ok: false;
      status: number;
      error: string;
    };

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
                    images: {
                      orderBy: {
                        position: "asc",
                      },
                    },
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

    const mutableCart = await getMutableCart(cartId);

    if (!mutableCart.ok) {
      return res.status(mutableCart.status).json({
        ok: false,
        error: mutableCart.error,
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

router.delete("/cart/:id/items/:itemId", async (req, res) => {
  try {
    const cartId = req.params.id;
    const itemId = req.params.itemId;

    const mutableCart = await getMutableCart(cartId);

    if (!mutableCart.ok) {
      return res.status(mutableCart.status).json({
        ok: false,
        error: mutableCart.error,
      });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId,
        id: itemId,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        ok: false,
        error: "Cart item not found.",
      });
    }

    const deletedItem = await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    return res.status(200).json({
      ok: true,
      message: "Cart item removed successfully.",
      item: deletedItem,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return res.status(500).json({
      ok: false,
      error: "Failed to remove item from cart",
    });
  }
});

router.delete("/cart/:id/items", async (req, res) => {
  try {
    const cartId = req.params.id;
    const mutableCart = await getMutableCart(cartId);

    if (!mutableCart.ok) {
      return res.status(mutableCart.status).json({
        ok: false,
        error: mutableCart.error,
      });
    }

    const deletedItems = await prisma.cartItem.deleteMany({
      where: {
        cartId,
      },
    });

    return res.status(200).json({
      ok: true,
      message: "Cart cleared successfully.",
      cartId,
      removedCount: deletedItems.count,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({
      ok: false,
      error: "Failed to clear cart",
    });
  }
});

async function getMutableCart(cartId: string): Promise<MutableCartResult> {
  const cart = await prisma.cart.findUnique({
    where: {
      id: cartId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!cart) {
    return {
      ok: false,
      status: 404,
      error: "Cart not found",
    };
  }

  if (cart.status !== "active") {
    return {
      ok: false,
      status: 409,
      error: "Cart is no longer active.",
    };
  }

  return {
    ok: true,
    cart,
  };
}

export default router;
