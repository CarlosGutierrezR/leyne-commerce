export async function getProducts() {
  const res = await fetch("http://127.0.0.1:4000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Error fetching products");

  return res.json();
}