const API_URL = "http://127.0.0.1:4000/api";

export async function createCart() {
  const res = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to create cart");
  }

  return res.json();
}

export async function getCart(cartId: string) {
  const res = await fetch(`${API_URL}/cart/${cartId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch cart");
  }

  return res.json();
}

export async function addItemToCart(
  cartId: string,
  variantId: string,
  quantity = 1
) {
  const res = await fetch(`${API_URL}/cart/${cartId}/items`, {
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
    throw new Error("Failed to add item to cart");
  }

  return res.json();
}

export async function removeItemFromCart(cartId: string, itemId: string) {
  const res = await fetch(`${API_URL}/cart/${cartId}/items/${itemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to remove item from cart");
  }

  return res.json();
}

export async function clearCart(cartId: string) {
  const res = await fetch(`${API_URL}/cart/${cartId}/items`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to clear cart");
  }

  return res.json();
}