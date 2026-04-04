import type { Metadata } from "next";
import { CheckoutConfirmationPageView } from "@/features/checkout/components/checkout-confirmation-page-view";

export const metadata: Metadata = {
  title: "Pedido confirmado | Leyne Boutique",
  description:
    "Confirmacion post-pago de Leyne con estado real del pedido verificado desde backend.",
};

export default function CheckoutConfirmationPage() {
  return <CheckoutConfirmationPageView />;
}
