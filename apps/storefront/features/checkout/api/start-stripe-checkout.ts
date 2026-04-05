import type {
  CheckoutApiErrorResponse,
  CreateStripeCheckoutSessionResponse,
} from "@/features/checkout/types/checkout";
import { getApiUrl } from "@/lib/api-url";

export async function startStripeCheckout(orderId: string) {
  const res = await fetch(getApiUrl(`/orders/${orderId}/checkout-session`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = (await res.json().catch(() => null)) as unknown;

  if (!res.ok) {
    throw new Error(formatStripeCheckoutErrorMessage(data));
  }

  return data as CreateStripeCheckoutSessionResponse;
}

function formatStripeCheckoutErrorMessage(value: unknown) {
  if (!isErrorResponse(value)) {
    return "No pudimos iniciar Stripe Checkout test.";
  }

  if (value.code === "STRIPE_CONFIGURATION_ERROR") {
    const missingEnvVars = value.diagnostic?.missingEnvVars ?? [];
    const invalidEnvVars = value.diagnostic?.invalidEnvVars ?? [];
    const issues: string[] = [];

    if (missingEnvVars.length > 0) {
      issues.push(`Faltan ${missingEnvVars.join(", ")}`);
    }

    if (invalidEnvVars.length > 0) {
      issues.push(`Hay variables invalidas: ${invalidEnvVars.join(", ")}`);
    }

    const summary = issues.length > 0 ? `${issues.join(". ")}.` : "";
    const action = value.diagnostic?.action
      ? ` ${value.diagnostic.action}`
      : "";

    return `Stripe test no esta listo en apps/api.${summary ? ` ${summary}` : ""}${action}`.trim();
  }

  if (value.code === "STRIPE_API_ERROR") {
    return value.error ?? "Stripe devolvio un error al iniciar el Checkout Session test.";
  }

  return value.error ?? "No pudimos iniciar Stripe Checkout test.";
}

function isErrorResponse(value: unknown): value is CheckoutApiErrorResponse {
  return typeof value === "object" && value !== null;
}
