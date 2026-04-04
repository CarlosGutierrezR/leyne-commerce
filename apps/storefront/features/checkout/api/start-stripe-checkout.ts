import type { CreateStripeCheckoutSessionResponse } from "@/features/checkout/types/checkout";
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
    throw new Error(
      isErrorResponse(data) && typeof data.error === "string"
        ? data.error
        : "Failed to start Stripe Checkout."
    );
  }

  return data as CreateStripeCheckoutSessionResponse;
}

function isErrorResponse(value: unknown): value is { error?: string } {
  return typeof value === "object" && value !== null;
}
