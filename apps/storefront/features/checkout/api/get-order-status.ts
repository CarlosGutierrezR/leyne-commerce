import type { GetOrderStatusResponse } from "@/features/checkout/types/checkout";
import { getApiUrl } from "@/lib/api-url";

export async function getOrderStatus(orderId: string) {
  const res = await fetch(getApiUrl(`/orders/${orderId}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = (await res.json().catch(() => null)) as unknown;

  if (!res.ok) {
    throw new Error(
      isErrorResponse(data) && typeof data.error === "string"
        ? data.error
        : "Failed to fetch order status."
    );
  }

  return data as GetOrderStatusResponse;
}

function isErrorResponse(value: unknown): value is { error?: string } {
  return typeof value === "object" && value !== null;
}
