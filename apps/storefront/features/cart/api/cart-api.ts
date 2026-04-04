import { getApiUrl } from "@/lib/api-url";

export async function createCart() {
  const res = await fetch(getApiUrl("/cart"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, "Failed to create cart"));
  }

  return res.json();
}

export async function getCart(cartId: string) {
  const res = await fetch(getApiUrl(`/cart/${cartId}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, "Failed to fetch cart"));
  }

  return res.json();
}

export async function addItemToCart(
  cartId: string,
  variantId: string,
  quantity = 1
) {
  const res = await fetch(getApiUrl(`/cart/${cartId}/items`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      variantId,
      quantity,
    }),
  });

  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, "Failed to add item to cart"));
  }

  return res.json();
}

export async function removeItemFromCart(cartId: string, itemId: string) {
  const res = await fetch(getApiUrl(`/cart/${cartId}/items/${itemId}`), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      await getApiErrorMessage(res, "Failed to remove item from cart")
    );
  }

  return res.json();
}

export async function clearCart(cartId: string) {
  const res = await fetch(getApiUrl(`/cart/${cartId}/items`), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, "Failed to clear cart"));
  }

  return res.json();
}

async function getApiErrorMessage(res: Response, fallback: string) {
  const payload = (await res.json().catch(() => null)) as { error?: unknown } | null;

  return typeof payload?.error === "string" ? payload.error : fallback;
}
