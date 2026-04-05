import { Router } from "express";
import Stripe from "stripe";
import { prisma } from "../lib/prisma.js";
import {
  assertStripeCheckoutConfiguration,
  buildStripeCheckoutUrls,
  getStripeClient,
  getRequiredStripeCheckoutEnvVars,
  isStripeConfigurationError,
} from "../lib/stripe.js";

const router = Router();

type CheckoutCustomerPayload = {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  reference?: unknown;
};

type CheckoutDeliveryPayload = {
  addressLine1?: unknown;
  city?: unknown;
  region?: unknown;
  postalCode?: unknown;
  country?: unknown;
  notes?: unknown;
};

type ParsedCheckoutItem = {
  quantity: number;
  variantId: string;
};

type ParsedCheckoutPayload = {
  cart: {
    currency: "EUR";
    items: ParsedCheckoutItem[];
    shippingAmount: number | null;
    taxAmount: number | null;
  };
  cartId: string | null;
  customer: {
    email: string;
    fullName: string;
    phone: string;
    reference: string | null;
  };
  delivery: {
    addressLine1: string;
    city: string;
    country: string;
    notes: string | null;
    postalCode: string;
    region: string;
  };
  source: string;
};

type StripeSdkError = Error & {
  code?: string;
  requestId?: string | null;
  type: string;
};

router.post("/orders", async (req, res) => {
  try {
    const parsedPayload = parseCheckoutOrderPayload(req.body);

    if (!parsedPayload.ok) {
      return res.status(400).json({
        ok: false,
        error: parsedPayload.error,
      });
    }

    const payload = parsedPayload.data;
    const variantIds = payload.cart.items.map((item) => item.variantId);
    const variants = await prisma.productVariant.findMany({
      where: {
        id: {
          in: variantIds,
        },
      },
      include: {
        product: {
          include: {
            category: true,
            images: {
              orderBy: {
                position: "asc",
              },
              take: 1,
            },
          },
        },
      },
    });

    if (variants.length !== variantIds.length) {
      return res.status(400).json({
        ok: false,
        error: "One or more product variants are invalid.",
      });
    }

    const variantById = new Map(variants.map((variant) => [variant.id, variant]));

    const orderItems = payload.cart.items.map((item) => {
      const variant = variantById.get(item.variantId);

      if (!variant || !variant.product.isActive) {
        throw new Error("INVALID_VARIANT");
      }

      const unitPrice = roundCurrency(Number(variant.price));
      const lineTotal = roundCurrency(unitPrice * item.quantity);

      return {
        categoryName: variant.product.category.name,
        color: variant.color,
        imageUrl: variant.product.images[0]?.url ?? null,
        lineTotal,
        productId: variant.productId,
        productName: variant.product.name,
        quantity: item.quantity,
        size: variant.size,
        sku: variant.sku,
        unitPrice,
        variantId: variant.id,
      };
    });

    const subtotal = roundCurrency(
      orderItems.reduce((acc, item) => acc + item.lineTotal, 0)
    );
    const shippingAmount = payload.cart.shippingAmount;
    const taxAmount = payload.cart.taxAmount;
    const total = roundCurrency(
      subtotal + (shippingAmount ?? 0) + (taxAmount ?? 0)
    );
    const itemCount = orderItems.reduce((acc, item) => acc + item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        cartId: payload.cartId,
        currency: payload.cart.currency,
        customerEmail: payload.customer.email,
        customerFullName: payload.customer.fullName,
        customerPhone: payload.customer.phone,
        customerReference: payload.customer.reference,
        deliveryAddressLine1: payload.delivery.addressLine1,
        deliveryCity: payload.delivery.city,
        deliveryCountry: payload.delivery.country,
        deliveryNotes: payload.delivery.notes,
        deliveryPostalCode: payload.delivery.postalCode,
        deliveryRegion: payload.delivery.region,
        itemCount,
        shippingAmount,
        source: payload.source,
        stripeMode: "test",
        stripeStatus: "pending_checkout_session",
        subtotal,
        taxAmount,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    return res.status(201).json({
      ok: true,
      message: "Preliminary order created successfully.",
      order,
      integration: {
        nextStep: "create_stripe_checkout_session",
        stripeMode: "test",
        stripeStatus: "pending_checkout_session",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_VARIANT") {
      return res.status(400).json({
        ok: false,
        error: "One or more products are no longer available for checkout.",
      });
    }

    console.error("Error creating preliminary order:", error);

    return res.status(500).json({
      ok: false,
      error: "Failed to create preliminary order.",
    });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        ok: false,
        error: "Order not found.",
      });
    }

    return res.status(200).json({
      ok: true,
      order,
      integration: {
        sourceOfTruth: "stripe_webhook",
      },
    });
  } catch (error) {
    console.error("Error fetching order:", error);

    return res.status(500).json({
      ok: false,
      error: "Failed to fetch order.",
    });
  }
});

router.post("/orders/:id/checkout-session", async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!isNonEmptyString(orderId)) {
      return res.status(400).json({
        ok: false,
        error: "order.id is required.",
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        ok: false,
        error: "Order not found.",
      });
    }

    if (order.items.length === 0) {
      return res.status(400).json({
        ok: false,
        error: "Order has no items to charge.",
      });
    }

    assertStripeCheckoutConfiguration();

    const stripe = getStripeClient();
    const { cancelUrl, successUrl } = buildStripeCheckoutUrls(order.id);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      cancel_url: cancelUrl,
      client_reference_id: order.id,
      customer_email: order.customerEmail,
      line_items: order.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: order.currency.toLowerCase(),
          product_data: {
            description: buildOrderItemDescription(item),
            name: item.productName,
          },
          unit_amount: toStripeAmount(item.unitPrice),
        },
      })),
      metadata: {
        orderId: order.id,
        source: order.source,
      },
      payment_intent_data: {
        metadata: {
          orderId: order.id,
        },
      },
      success_url: successUrl,
    });

    if (!session.url) {
      throw new Error("STRIPE_SESSION_URL_MISSING");
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        stripeCheckoutSessionExpiresAt: session.expires_at
          ? new Date(session.expires_at * 1000)
          : null,
        stripeCheckoutSessionId: session.id,
        stripeStatus: "checkout_session_created",
      },
      select: {
        id: true,
        status: true,
        stripeCheckoutSessionExpiresAt: true,
        stripeCheckoutSessionId: true,
        stripePaymentIntentId: true,
        stripeStatus: true,
      },
    });

    return res.status(200).json({
      ok: true,
      message: "Stripe Checkout Session created successfully.",
      order: updatedOrder,
      checkoutSession: {
        expiresAt: session.expires_at
          ? new Date(session.expires_at * 1000).toISOString()
          : null,
        id: session.id,
        status: session.status ?? "open",
        url: session.url,
      },
      integration: {
        nextStep: "complete_stripe_test_checkout",
        redirectStrategy: "session_url",
        stripeMode: "test",
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "STRIPE_SESSION_URL_MISSING"
    ) {
      return res.status(500).json({
        ok: false,
        error: "Stripe did not return a checkout URL.",
      });
    }

    if (isStripeConfigurationError(error)) {
      return res.status(500).json({
        ok: false,
        error: error.message,
        code: error.code,
        diagnostic: {
          action: error.action,
          invalidEnvVars: error.invalidEnvVars,
          missingEnvVars: error.missingEnvVars,
          requiredEnvVars: getRequiredStripeCheckoutEnvVars(),
          sourceOfTruth: "stripe_webhook",
        },
      });
    }

    if (error instanceof Stripe.errors.StripeError) {
      return res.status(502).json({
        ok: false,
        error: buildStripeApiErrorMessage(error),
        code: "STRIPE_API_ERROR",
        diagnostic: {
          requestId: error.requestId ?? null,
          stripeCode: error.code ?? null,
          stripeType: error.type ?? null,
        },
      });
    }

    console.error("Error creating Stripe Checkout Session:", error);

    return res.status(500).json({
      ok: false,
      error: "Failed to create Stripe Checkout Session.",
    });
  }
});

function parseCheckoutOrderPayload(
  payload: unknown
):
  | {
      ok: true;
      data: ParsedCheckoutPayload;
    }
  | {
      ok: false;
      error: string;
    } {
  if (!isRecord(payload)) {
    return {
      ok: false,
      error: "Checkout payload must be an object.",
    };
  }

  const customer = payload.customer;
  const delivery = payload.delivery;
  const cart = payload.cart;

  if (!isRecord(customer) || !isRecord(delivery) || !isRecord(cart)) {
    return {
      ok: false,
      error: "customer, delivery and cart are required.",
    };
  }

  if (!isNonEmptyString(customer.fullName)) {
    return invalid("customer.fullName is required.");
  }

  if (!isValidEmail(customer.email)) {
    return invalid("customer.email must be valid.");
  }

  if (!isNonEmptyString(customer.phone)) {
    return invalid("customer.phone is required.");
  }

  if (!isNonEmptyString(delivery.addressLine1)) {
    return invalid("delivery.addressLine1 is required.");
  }

  if (!isNonEmptyString(delivery.city)) {
    return invalid("delivery.city is required.");
  }

  if (!isNonEmptyString(delivery.region)) {
    return invalid("delivery.region is required.");
  }

  if (!isNonEmptyString(delivery.postalCode)) {
    return invalid("delivery.postalCode is required.");
  }

  if (!isNonEmptyString(delivery.country)) {
    return invalid("delivery.country is required.");
  }

  if (!Array.isArray(cart.items) || cart.items.length === 0) {
    return invalid("cart.items must contain at least one item.");
  }

  const parsedItems: ParsedCheckoutItem[] = [];
  const seenVariantIds = new Set<string>();

  for (const item of cart.items) {
    if (!isRecord(item) || !isNonEmptyString(item.variantId)) {
      return invalid("Each cart item requires a variantId.");
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return invalid("Each cart item requires a valid quantity.");
    }

    if (seenVariantIds.has(item.variantId)) {
      return invalid("Duplicate variantId values are not allowed in cart.items.");
    }

    seenVariantIds.add(item.variantId);

    parsedItems.push({
      quantity: item.quantity,
      variantId: item.variantId,
    });
  }

  const shippingAmount = parseOptionalMoney(cart.shippingAmount);
  const taxAmount = parseOptionalMoney(cart.taxAmount);

  if (shippingAmount === undefined || taxAmount === undefined) {
    return invalid("shippingAmount and taxAmount must be numbers or null.");
  }

  return {
    ok: true,
    data: {
      cart: {
        currency: "EUR",
        items: parsedItems,
        shippingAmount,
        taxAmount,
      },
      cartId: parseOptionalString(payload.cartId),
      customer: {
        email: customer.email.trim(),
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        reference: parseOptionalString(customer.reference),
      },
      delivery: {
        addressLine1: delivery.addressLine1.trim(),
        city: delivery.city.trim(),
        country: delivery.country.trim(),
        notes: parseOptionalString(delivery.notes),
        postalCode: delivery.postalCode.trim(),
        region: delivery.region.trim(),
      },
      source: isNonEmptyString(payload.source)
        ? payload.source.trim()
        : "storefront",
    },
  };
}

function buildStripeApiErrorMessage(error: StripeSdkError) {
  if (error.type === "StripeAuthenticationError") {
    return "Stripe rechazo la credencial configurada en STRIPE_SECRET_KEY. Revisa que la clave test sea valida en apps/api.";
  }

  if (error.type === "StripeAPIConnectionError") {
    return "No se pudo conectar con Stripe desde apps/api al crear la Checkout Session test.";
  }

  if (error.type === "StripeInvalidRequestError") {
    return `Stripe rechazo la solicitud de Checkout Session test: ${error.message}`;
  }

  return `Stripe devolvio un error al crear la Checkout Session test: ${error.message}`;
}

function buildOrderItemDescription(item: {
  categoryName: string;
  color: string | null;
  size: string | null;
}) {
  return [
    item.categoryName,
    [item.color, item.size].filter(Boolean).join(" / "),
  ]
    .filter(Boolean)
    .join(" | ");
}

function invalid(error: string) {
  return {
    ok: false as const,
    error,
  };
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  );
}

function parseOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function parseOptionalMoney(value: unknown) {
  if (value === null || typeof value === "undefined") {
    return null;
  }

  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return undefined;
  }

  return roundCurrency(value);
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function toStripeAmount(value: { toString(): string } | number) {
  const amount =
    typeof value === "number" ? value : Number.parseFloat(value.toString());

  return Math.round(amount * 100);
}

export default router;
