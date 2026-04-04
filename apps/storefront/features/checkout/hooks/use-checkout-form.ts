"use client";

import { useState } from "react";
import type { CartItem } from "@/features/cart/types/cart";
import { getStoredCartId } from "@/features/cart/store/cart-id";
import { createPreliminaryOrder } from "@/features/checkout/api/create-preliminary-order";
import { startStripeCheckout } from "@/features/checkout/api/start-stripe-checkout";
import {
  buildCheckoutCartSummary,
  buildPreliminaryCheckoutPayload,
  countCheckoutErrors,
  createEmptyCheckoutErrors,
  createEmptyCheckoutFormData,
  validateCheckoutFormData,
} from "@/features/checkout/lib/checkout";
import type {
  CheckoutCustomerData,
  CheckoutDeliveryAddress,
  CheckoutFormErrors,
  CheckoutSubmissionState,
  CreatePreliminaryOrderResponse,
  PreliminaryCheckoutPayload,
} from "@/features/checkout/types/checkout";

export function useCheckoutForm(items: CartItem[]) {
  const [formData, setFormData] = useState(createEmptyCheckoutFormData);
  const [errors, setErrors] = useState<CheckoutFormErrors>(
    createEmptyCheckoutErrors
  );
  const [submissionState, setSubmissionState] = useState<CheckoutSubmissionState>(
    {
      checkoutSessionResult: null,
      orderResult: null,
      payload: null,
      phase: "idle",
    }
  );

  const cartSummary = buildCheckoutCartSummary(items);
  const validationErrorCount = countCheckoutErrors(errors);

  function resetSubmissionState() {
    setSubmissionState((current) =>
      current.phase === "idle" &&
      current.payload === null &&
      current.orderResult === null &&
      current.checkoutSessionResult === null
        ? current
        : {
            checkoutSessionResult: null,
            orderResult: null,
            payload: null,
            phase: "idle",
          }
    );
  }

  function handleCustomerFieldChange(
    field: keyof CheckoutCustomerData,
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      customer: {
        ...current.customer,
        [field]: value,
      },
    }));

    setErrors((current) => {
      const nextCustomer = { ...current.customer };

      delete nextCustomer[field];

      return {
        ...current,
        customer: nextCustomer,
      };
    });

    resetSubmissionState();
  }

  function handleDeliveryFieldChange(
    field: keyof CheckoutDeliveryAddress,
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      delivery: {
        ...current.delivery,
        [field]: value,
      },
    }));

    setErrors((current) => {
      const nextDelivery = { ...current.delivery };

      delete nextDelivery[field];

      return {
        ...current,
        delivery: nextDelivery,
      };
    });

    resetSubmissionState();
  }

  async function handleSubmit() {
    const existingOrder = submissionState.orderResult;

    if (existingOrder) {
      await handleStartPayment(
        existingOrder,
        submissionState.payload ??
          buildPreliminaryCheckoutPayload(
            formData,
            cartSummary,
            getStoredCartId()
          )
      );
      return;
    }

    const nextErrors = validateCheckoutFormData(formData);
    const nextErrorCount = countCheckoutErrors(nextErrors);

    if (nextErrorCount > 0) {
      setErrors(nextErrors);
      setSubmissionState({
        checkoutSessionResult: null,
        message: `Completa ${nextErrorCount} campo${
          nextErrorCount === 1 ? "" : "s"
        } para crear la orden preliminar.`,
        orderResult: null,
        payload: null,
        phase: "validation_error",
      });
      return;
    }

    const payload = buildPreliminaryCheckoutPayload(
      formData,
      cartSummary,
      getStoredCartId()
    );

    setErrors(createEmptyCheckoutErrors());
    setSubmissionState({
      checkoutSessionResult: null,
      message: "Creando orden preliminar en backend...",
      orderResult: null,
      payload,
      phase: "creating_order",
    });

    try {
      const orderResult = await createPreliminaryOrder(payload);

      setSubmissionState({
        checkoutSessionResult: null,
        message: `Orden preliminar creada. Referencia interna: ${orderResult.order.id}. Ya puedes iniciar Stripe test.`,
        orderResult,
        payload,
        phase: "order_ready",
      });
    } catch (error) {
      setSubmissionState({
        checkoutSessionResult: null,
        message:
          error instanceof Error
            ? error.message
            : "No pudimos crear la orden preliminar en este momento.",
        orderResult: null,
        payload,
        phase: "error",
      });
    }
  }

  async function handleStartPayment(
    orderResult: CreatePreliminaryOrderResponse,
    payload: PreliminaryCheckoutPayload
  ) {
    setSubmissionState({
      checkoutSessionResult: null,
      message: "Iniciando Stripe Checkout test...",
      orderResult,
      payload,
      phase: "starting_payment",
    });

    try {
      const checkoutSessionResult = await startStripeCheckout(orderResult.order.id);

      setSubmissionState({
        checkoutSessionResult,
        message: "Stripe test listo. Redirigiendo al Checkout Session...",
        orderResult,
        payload,
        phase: "starting_payment",
      });

      window.location.assign(checkoutSessionResult.checkoutSession.url);
    } catch (error) {
      setSubmissionState({
        checkoutSessionResult: null,
        message:
          error instanceof Error
            ? error.message
            : "No pudimos iniciar Stripe Checkout test.",
        orderResult,
        payload,
        phase: "error",
      });
    }
  }

  return {
    cartSummary,
    errors,
    formData,
    handleCustomerFieldChange,
    handleDeliveryFieldChange,
    handleSubmit,
    hasPreliminaryOrder: submissionState.orderResult !== null,
    isSubmitting:
      submissionState.phase === "creating_order" ||
      submissionState.phase === "starting_payment",
    submissionState,
    validationErrorCount,
  };
}
