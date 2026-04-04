import { ProductCard } from "@/features/catalog/components/product-card";
import type { Product } from "@/features/catalog/types/product";

type ProductGridProps = {
  products: Product[];
  className?: string;
};

export function ProductGrid({ products, className }: ProductGridProps) {
  const classes = [
    "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
