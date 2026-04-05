import type { Request, Response } from "express";
import type Stripe from "stripe";
import { prisma } from "../lib/prisma.js";
import {
  getStripeClient,
  isStripeConfigurationError,
  getStripeWebhookSecret,
} from "../lib/stripe.js";

export async function handleStripeWebhook(req: Request, res: Response) {
  try {
    const signature = req.headers["stripe-signature"];

    if (typeof signature !== "string" || signature.length === 0) {
      return res.status(400).send("Missing Stripe signature.");
    }

    const stripe = getStripeClient();
    const webhookSecret = getStripeWebhookSecret();
    const rawBody = req.body;

    if (!Buffer.isBuffer(rawBody)) {
      return res.status(400).send("Stripe webhook payload must be raw.");
    }

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case "checkout.session.async_payment_succeeded":
        await markOrderPaidFromSession(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case "checkout.session.async_payment_failed":
        await updateOrderFromSession(
          event.data.object as Stripe.Checkout.Session,
          {
            status: "payment_failed",
            stripeStatus: "async_payment_failed",
          }
        );
        break;
      case "checkout.session.expired":
        await updateOrderFromSession(
          event.data.object as Stripe.Checkout.Session,
          {
            status: "payment_expired",
            stripeStatus: "checkout_session_expired",
          }
        );
        break;
      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);

    if (isStripeConfigurationError(error)) {
      return res.status(500).json({
        ok: false,
        code: error.code,
        error: error.message,
        diagnostic: {
          action: error.action,
          invalidEnvVars: error.invalidEnvVars,
          missingEnvVars: error.missingEnvVars,
          sourceOfTruth: "stripe_webhook",
        },
      });
    }

    return res.status(400).send(
      error instanceof Error ? error.message : "Invalid Stripe webhook."
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  if (session.payment_status === "paid") {
    await markOrderPaidFromSession(session);
    return;
  }

  await updateOrderFromSession(session, {
    status: "pending_payment",
    stripeStatus: "checkout_completed_pending_payment",
  });
}

async function markOrderPaidFromSession(session: Stripe.Checkout.Session) {
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : null;

  await updateOrderFromSession(session, {
    paidAt: new Date(),
    status: "paid",
    stripePaymentIntentId: paymentIntentId,
    stripeStatus: "paid",
  });
}

async function updateOrderFromSession(
  session: Stripe.Checkout.Session,
  data: {
    paidAt?: Date | null;
    status: string;
    stripePaymentIntentId?: string | null;
    stripeStatus: string;
  }
) {
  const orderId = getOrderIdFromSession(session);

  if (!orderId) {
    return;
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [
        {
          id: orderId,
        },
        {
          stripeCheckoutSessionId: session.id,
        },
      ],
    },
    select: {
      cartId: true,
      id: true,
    },
  });

  if (!order) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        paidAt: typeof data.paidAt === "undefined" ? undefined : data.paidAt,
        status: data.status,
        stripeCheckoutSessionExpiresAt: session.expires_at
          ? new Date(session.expires_at * 1000)
          : undefined,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId:
          typeof data.stripePaymentIntentId === "undefined"
            ? undefined
            : data.stripePaymentIntentId,
        stripeStatus: data.stripeStatus,
      },
    });

    if (data.status !== "paid" || !order.cartId) {
      return;
    }

    await tx.cart.updateMany({
      where: {
        id: order.cartId,
        status: "active",
      },
      data: {
        status: "ordered",
      },
    });
  });
}

function getOrderIdFromSession(session: Stripe.Checkout.Session) {
  if (typeof session.client_reference_id === "string") {
    return session.client_reference_id;
  }

  if (typeof session.metadata?.orderId === "string") {
    return session.metadata.orderId;
  }

  return null;
}
