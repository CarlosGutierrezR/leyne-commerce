export type CartItem = {
  cartItemId?: string;
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
