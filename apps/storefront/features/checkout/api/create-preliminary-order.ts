import type {
  CreatePreliminaryOrderResponse,
  PreliminaryCheckoutPayload,
} from "@/features/checkout/types/checkout";
import { getApiUrl } from "@/lib/api-url";

export async function createPreliminaryOrder(
  payload: PreliminaryCheckoutPayload
) {
  const res = await fetch(getApiUrl("/orders"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => null)) as unknown;

  if (!res.ok) {
    throw new Error(
      isErrorResponse(data) && typeof data.error === "string"
        ? data.error
        : "Failed to create preliminary order."
    );
  }

  return data as CreatePreliminaryOrderResponse;
}

function isErrorResponse(value: unknown): value is { error?: string } {
  return typeof value === "object" && value !== null;
}
