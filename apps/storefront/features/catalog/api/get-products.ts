import type { Product } from "@/features/catalog/types/product";
import { getApiUrl } from "@/lib/api-url";

export async function getProducts() {
  const res = await fetch(getApiUrl("/products"), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error fetching products");
  }

  const products = await res.json();

  if (!Array.isArray(products)) {
    throw new Error("Unexpected products payload");
  }

  return products as Product[];
}
