import type { Metadata } from "next";
import { CheckoutPageView } from "@/features/checkout/components/checkout-page-view";

export const metadata: Metadata = {
  title: "Checkout | Leyne Boutique",
  description:
    "Revision de compra y base de checkout de Leyne con resumen del carrito y formularios de cliente y entrega.",
};

export default function CheckoutPage() {
  return <CheckoutPageView />;
}
