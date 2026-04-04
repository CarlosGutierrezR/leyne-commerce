import type { CartItem } from "@/features/cart/types/cart";
import type {
  CheckoutCartSummary,
  CheckoutFormData,
  CheckoutFormErrors,
  PreliminaryCheckoutPayload,
} from "@/features/checkout/types/checkout";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createEmptyCheckoutFormData(): CheckoutFormData {
  return {
    customer: {
      fullName: "",
      email: "",
      phone: "",
      reference: "",
    },
    delivery: {
      addressLine1: "",
      city: "",
      region: "",
      postalCode: "",
      country: "",
      notes: "",
    },
  };
}

export function createEmptyCheckoutErrors(): CheckoutFormErrors {
  return {
    customer: {},
    delivery: {},
  };
}

export function buildCheckoutCartSummary(items: CartItem[]): CheckoutCartSummary {
  const summaryItems = items.map((item) => ({
    variantId: item.variantId,
    productId: item.productId,
    name: item.name,
    categoryName: item.categoryName,
    imageUrl: item.imageUrl,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    sku: item.sku,
    unitPrice: item.price,
    lineTotal: item.price * item.quantity,
  }));

  const subtotal = summaryItems.reduce((acc, item) => acc + item.lineTotal, 0);
  const itemCount = summaryItems.reduce((acc, item) => acc + item.quantity, 0);

  return {
    currency: "EUR",
    items: summaryItems,
    itemCount,
    subtotal,
    shippingAmount: null,
    taxAmount: null,
    total: subtotal,
  };
}

export function validateCheckoutFormData(
  formData: CheckoutFormData
): CheckoutFormErrors {
  const errors = createEmptyCheckoutErrors();

  if (!formData.customer.fullName.trim()) {
    errors.customer.fullName = "Ingresa el nombre completo.";
  }

  if (!formData.customer.email.trim()) {
    errors.customer.email = "Ingresa un correo electronico.";
  } else if (!EMAIL_REGEX.test(formData.customer.email.trim())) {
    errors.customer.email = "Usa un correo valido.";
  }

  if (!formData.customer.phone.trim()) {
    errors.customer.phone = "Ingresa un telefono de contacto.";
  }

  if (!formData.delivery.addressLine1.trim()) {
    errors.delivery.addressLine1 = "Ingresa una direccion de entrega.";
  }

  if (!formData.delivery.city.trim()) {
    errors.delivery.city = "Ingresa la ciudad.";
  }

  if (!formData.delivery.region.trim()) {
    errors.delivery.region = "Ingresa la provincia o region.";
  }

  if (!formData.delivery.postalCode.trim()) {
    errors.delivery.postalCode = "Ingresa el codigo postal.";
  }

  if (!formData.delivery.country.trim()) {
    errors.delivery.country = "Ingresa el pais.";
  }

  return errors;
}

export function countCheckoutErrors(errors: CheckoutFormErrors) {
  return (
    Object.values(errors.customer).filter(Boolean).length +
    Object.values(errors.delivery).filter(Boolean).length
  );
}

export function buildPreliminaryCheckoutPayload(
  formData: CheckoutFormData,
  cart: CheckoutCartSummary,
  cartId: string | null
): PreliminaryCheckoutPayload {
  return {
    cart,
    cartId,
    createdAt: new Date().toISOString(),
    customer: {
      ...formData.customer,
      fullName: formData.customer.fullName.trim(),
      email: formData.customer.email.trim(),
      phone: formData.customer.phone.trim(),
      reference: formData.customer.reference.trim(),
    },
    delivery: {
      ...formData.delivery,
      addressLine1: formData.delivery.addressLine1.trim(),
      city: formData.delivery.city.trim(),
      region: formData.delivery.region.trim(),
      postalCode: formData.delivery.postalCode.trim(),
      country: formData.delivery.country.trim(),
      notes: formData.delivery.notes.trim(),
    },
    integration: {
      backendStatus: "ready_for_order_creation",
      stripeMode: "test",
      stripeStatus: "pending_checkout_session",
    },
    source: "storefront",
  };
}
