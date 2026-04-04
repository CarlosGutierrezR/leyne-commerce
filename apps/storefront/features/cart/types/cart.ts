export type CartItem = {
  variantId: string;
  productId: string;
  name: string;
  categoryName: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  size?: string | null;
  color?: string | null;
  sku: string;
};