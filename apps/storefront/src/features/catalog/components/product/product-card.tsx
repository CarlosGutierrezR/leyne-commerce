type Props = {
  product: any;
};

export function ProductCard({ product }: Props) {
  const variant = product.variants.find((v: any) => v.isDefault);

  return (
    <div className="group border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition">
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      <div className="p-5">
        <h2 className="text-lg font-medium">
          {product.name}
        </h2>

        <p className="text-sm text-neutral-400">
          {product.category.name}
        </p>

        <p className="text-xl mt-2 font-semibold">
          €{variant?.price}
        </p>
      </div>
    </div>
  );
}