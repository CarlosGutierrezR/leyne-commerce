import type { CartItem } from "@/features/cart/types/cart";

export type CheckoutCustomerData = {
  fullName: string;
  email: string;
  phone: string;
  reference: string;
};

export type CheckoutDeliveryAddress = {
  addressLine1: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  notes: string;
};

export type CheckoutFormData = {
  customer: CheckoutCustomerData;
  delivery: CheckoutDeliveryAddress;
};

export type CheckoutCartLineSummary = Pick<
  CartItem,
  | "variantId"
  | "productId"
  | "name"
  | "categoryName"
  | "imageUrl"
  | "quantity"
  | "size"
  | "color"
  | "sku"
> & {
  unitPrice: number;
  lineTotal: number;
};

export type CheckoutCartSummary = {
  currency: "EUR";
  items: CheckoutCartLineSummary[];
  itemCount: number;
  subtotal: number;
  shippingAmount: number | null;
  taxAmount: number | null;
  total: number;
};

export type PreliminaryCheckoutPayload = {
  cart: CheckoutCartSummary;
  cartId: string | null;
  createdAt: string;
  customer: CheckoutCustomerData;
  delivery: CheckoutDeliveryAddress;
  integration: {
    backendStatus: "ready_for_order_creation";
    stripeMode: "test";
    stripeStatus: "pending_checkout_session";
  };
  source: "storefront";
};

export type PreliminaryOrderItem = {
  categoryName: string;
  color: string | null;
  createdAt: string;
  id: string;
  imageUrl: string | null;
  lineTotal: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  size: string | null;
  sku: string;
  unitPrice: string;
  updatedAt: string;
  variantId: string;
};

export type PreliminaryOrder = {
  cartId: string | null;
  createdAt: string;
  currency: string;
  customerEmail: string;
  customerFullName: string;
  customerPhone: string;
  customerReference: string | null;
  deliveryAddressLine1: string;
  deliveryCity: string;
  deliveryCountry: string;
  deliveryNotes: string | null;
  deliveryPostalCode: string;
  deliveryRegion: string;
  id: string;
  itemCount: number;
  items: PreliminaryOrderItem[];
  shippingAmount: string | null;
  source: string;
  status: string;
  paidAt: string | null;
  stripeCheckoutSessionExpiresAt: string | null;
  stripeCheckoutSessionId: string | null;
  stripeMode: string;
  stripePaymentIntentId: string | null;
  stripeStatus: string;
  subtotal: string;
  taxAmount: string | null;
  total: string;
  updatedAt: string;
};

export type CreatePreliminaryOrderResponse = {
  integration: {
    nextStep: "create_stripe_checkout_session";
    stripeMode: string;
    stripeStatus: string;
  };
  message: string;
  ok: true;
  order: PreliminaryOrder;
};

export type CreateStripeCheckoutSessionResponse = {
  checkoutSession: {
    expiresAt: string | null;
    id: string;
    status: string;
    url: string;
  };
  integration: {
    nextStep: "complete_stripe_test_checkout";
    redirectStrategy: "session_url";
    stripeMode: "test";
  };
  message: string;
  ok: true;
  order: {
    id: string;
    status: string;
    stripePaymentIntentId: string | null;
    stripeCheckoutSessionExpiresAt: string | null;
    stripeCheckoutSessionId: string | null;
    stripeStatus: string;
  };
};

export type GetOrderStatusResponse = {
  integration: {
    sourceOfTruth: "stripe_webhook";
  };
  ok: true;
  order: PreliminaryOrder;
};

export type CheckoutCustomerErrors = Partial<
  Record<keyof CheckoutCustomerData, string>
>;

export type CheckoutDeliveryErrors = Partial<
  Record<keyof CheckoutDeliveryAddress, string>
>;

export type CheckoutFormErrors = {
  customer: CheckoutCustomerErrors;
  delivery: CheckoutDeliveryErrors;
};

export type CheckoutSubmissionPhase =
  | "idle"
  | "validation_error"
  | "creating_order"
  | "order_ready"
  | "starting_payment"
  | "error";

export type CheckoutSubmissionState = {
  checkoutSessionResult: CreateStripeCheckoutSessionResponse | null;
  message?: string;
  orderResult: CreatePreliminaryOrderResponse | null;
  payload: PreliminaryCheckoutPayload | null;
  phase: CheckoutSubmissionPhase;
};
