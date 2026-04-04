import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}

export function getStorefrontUrl() {
  const storefrontUrl = process.env.STOREFRONT_URL?.trim();

  if (!storefrontUrl) {
    throw new Error("STOREFRONT_URL is not configured.");
  }

  return storefrontUrl.replace(/\/+$/, "");
}

export function getStripeWebhookSecret() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured.");
  }

  return webhookSecret;
}

export function buildStripeCheckoutUrls(orderId: string) {
  const storefrontUrl = getStorefrontUrl();

  return {
    cancelUrl: `${storefrontUrl}/checkout?stripe=cancelled&orderId=${encodeURIComponent(
      orderId
    )}`,
    successUrl: `${storefrontUrl}/checkout/confirmado?stripe=success&orderId=${encodeURIComponent(
      orderId
    )}&session_id={CHECKOUT_SESSION_ID}`,
  };
}
