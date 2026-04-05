"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CartPanel } from "@/features/cart/components/cart-panel";
import { useCartStore } from "@/features/cart/store/cart-store";
import { CheckoutCustomerForm } from "@/features/checkout/components/checkout-customer-form";
import { CheckoutOrderSummary } from "@/features/checkout/components/checkout-order-summary";
import { getOrderStatus } from "@/features/checkout/api/get-order-status";
import { useCheckoutForm } from "@/features/checkout/hooks/use-checkout-form";
import type {
  CheckoutSubmissionPhase,
  GetOrderStatusResponse,
} from "@/features/checkout/types/checkout";

export function CheckoutPageView() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems());
  const {
    cartSummary,
    errors,
    formData,
    handleCustomerFieldChange,
    handleDeliveryFieldChange,
    handleSubmit,
    isSubmitting,
    submissionState,
    validationErrorCount,
  } = useCheckoutForm(items);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  if (!mounted) {
    return (
      <main className="relative min-h-screen overflow-hidden text-white">
        <CartPanel />
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
              Checkout
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-stone-50">
              Preparando tu resumen de compra
            </h1>
            <div className="mt-8 h-40 rounded-[2rem] border border-dashed border-white/10 bg-black/10" />
          </div>
        </div>
      </main>
    );
  }

  const isEmpty = items.length === 0;

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(212,177,138,0.18),transparent_58%)]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl" />

      <CartPanel />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <StripeReturnBannerSlot />
        </Suspense>

        <header className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)]">
          <div className="rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:p-10">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-stone-400">
              <Link href="/" className="transition hover:text-stone-200">
                Inicio
              </Link>
              <span>/</span>
              <Link href="/catalogo" className="transition hover:text-stone-200">
                Catalogo
              </Link>
              <span>/</span>
              <span className="text-stone-200">Checkout</span>
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.32em] text-stone-400">
              Checkout Leyne
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[0.01em] text-stone-50 sm:text-5xl">
              Revisa tu compra y prepara el pago test.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              Esta base ya crea la orden preliminar real y deja el siguiente paso
              listo para abrir Stripe Checkout test sin rehacer el flujo.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/catalogo"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-100 transition hover:border-white/30 hover:bg-white/[0.05]"
              >
                Seguir comprando
              </Link>
              <p className="text-sm leading-7 text-stone-400">
                {totalItems} item{totalItems === 1 ? "" : "s"} en el carrito en esta
                vista.
              </p>
            </div>
          </div>

          <article className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-10">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
              Estado actual
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <MetricCard
                label="Resumen activo"
                value={isEmpty ? "Vacio" : "Listo"}
                helper="El checkout ya responde al store real"
              />
              <MetricCard
                label="Items"
                value={String(totalItems)}
                helper="Sincronizados desde el carrito actual"
              />
              <MetricCard
                label="Integracion"
                value={getIntegrationStatusLabel(
                  submissionState.phase,
                  submissionState.orderResult !== null
                )}
                helper="Lista para Stripe test y webhook despues"
              />
            </div>
          </article>
        </header>

        {isEmpty ? (
          <section className="rounded-[2.5rem] border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:px-10">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
              Carrito vacio
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[0.01em] text-stone-50 sm:text-4xl">
              Todavia no hay productos para procesar.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
              Cuando agregues productos desde la home, el catalogo o la ficha de
              producto, aqui veras el resumen completo de compra y los formularios
              de entrega.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/catalogo"
                className="inline-flex items-center justify-center rounded-full bg-[rgba(212,177,138,0.95)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-950 transition hover:bg-[rgba(226,196,164,1)]"
              >
                Ir al catalogo
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-100 transition hover:border-white/30 hover:bg-white/[0.05]"
              >
                Volver a home
              </Link>
            </div>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
            <CheckoutCustomerForm
              formData={formData}
              errors={errors}
              onCustomerFieldChange={handleCustomerFieldChange}
              onDeliveryFieldChange={handleDeliveryFieldChange}
              disabled={isSubmitting}
            />
            <CheckoutOrderSummary
              cartSummary={cartSummary}
              submissionState={submissionState}
              validationErrorCount={validationErrorCount}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    </main>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
};

function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-stone-50">{value}</p>
      <p className="mt-2 text-sm text-stone-300">{helper}</p>
    </div>
  );
}

type StripeReturnBannerProps = {
  description: string;
  title: string;
  tone: "success" | "neutral";
};

function StripeReturnBanner({
  description,
  title,
  tone,
}: StripeReturnBannerProps) {
  return (
    <section
      className={[
        "rounded-[2rem] border px-6 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm",
        tone === "success"
          ? "border-emerald-300/25 bg-emerald-300/10"
          : "border-white/10 bg-white/[0.04]",
      ].join(" ")}
    >
      <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
        Retorno Stripe test
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-stone-50">{title}</h2>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-stone-200">
        {description}
      </p>
    </section>
  );
}

function StripeReturnBannerSlot() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");
  const stripeReturnStatus = searchParams.get("stripe");
  const [phase, setPhase] = useState<"idle" | "loading" | "loaded" | "error">(
    orderId ? "loading" : "idle"
  );
  const [order, setOrder] = useState<GetOrderStatusResponse["order"] | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const currentOrderId = orderId;

    if (!currentOrderId) {
      return;
    }

    const safeOrderId = currentOrderId;

    let active = true;
    let attempts = 0;

    async function loadOrderStatus() {
      try {
        const response = await getOrderStatus(safeOrderId);

        if (!active) {
          return;
        }

        setOrder(response.order);
        setPhase("loaded");
        setErrorMessage(null);

        if (
          stripeReturnStatus !== "success" ||
          response.order.status === "paid" ||
          response.order.status === "payment_failed" ||
          response.order.status === "payment_expired"
        ) {
          return true;
        }
      } catch (error) {
        if (!active) {
          return true;
        }

        setPhase("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No pudimos consultar el estado real de la orden."
        );

        return true;
      }

      return false;
    }

    void loadOrderStatus();

    if (stripeReturnStatus !== "success") {
      return () => {
        active = false;
      };
    }

    const intervalId = window.setInterval(() => {
      attempts += 1;

      if (attempts >= 8) {
        window.clearInterval(intervalId);
        return;
      }

      void loadOrderStatus().then((shouldStop) => {
        if (shouldStop) {
          window.clearInterval(intervalId);
        }
      });
    }, 3000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [orderId, stripeReturnStatus]);

  const banner = getStripeReturnBanner({
    errorMessage,
    order,
    orderId,
    phase,
    sessionId,
    stripeReturnStatus,
  });

  if (!banner) {
    return null;
  }

  return (
    <StripeReturnBanner
      description={banner.description}
      title={banner.title}
      tone={banner.tone}
    />
  );
}

function getIntegrationStatusLabel(
  phase: CheckoutSubmissionPhase,
  hasPreliminaryOrder: boolean
) {
  if (phase === "order_ready") {
    return "Orden lista";
  }

  if (phase === "creating_order" || phase === "starting_payment") {
    return "En curso";
  }

  if (phase === "validation_error") {
    return "Revisar";
  }

  if (phase === "error") {
    return hasPreliminaryOrder ? "Reintentar pago" : "Error";
  }

  return "Pendiente";
}

function getStripeReturnBanner({
  errorMessage,
  order,
  orderId,
  phase,
  sessionId,
  stripeReturnStatus,
}: {
  errorMessage: string | null;
  order: GetOrderStatusResponse["order"] | null;
  orderId: string | null;
  phase: "idle" | "loading" | "loaded" | "error";
  sessionId: string | null;
  stripeReturnStatus: string | null;
}) {
  if (stripeReturnStatus !== "success" && stripeReturnStatus !== "cancelled") {
    return null;
  }

  if (phase === "loading") {
    return {
      description: `El redirect de Stripe ya ocurrio para la orden ${
        orderId ?? "desconocida"
      }. Ahora estamos consultando el estado real en backend, porque la fuente de verdad es el webhook.`,
      title: "Verificando estado real del pago",
      tone: "neutral" as const,
    };
  }

  if (phase === "error") {
    return {
      description: errorMessage
        ? `${errorMessage} El redirect no confirma el pago por si solo; la fuente de verdad sigue siendo el webhook de Stripe.`
        : "No pudimos verificar el estado real del pago en este momento.",
      title: "No pudimos verificar la orden",
      tone: "neutral" as const,
    };
  }

  if (stripeReturnStatus === "cancelled") {
    return {
      description: `El usuario salio del Checkout Session test para la orden ${
        orderId ?? "desconocida"
      }. El estado real actual en backend es ${
        order?.status ?? "pendiente"
      }, y puedes reintentar Stripe desde esta misma vista.`,
      title: "Pago test cancelado",
      tone: "neutral" as const,
    };
  }

  if (order?.status === "paid") {
    return {
      description: `Stripe confirmo el pago real de la orden ${
        order.id
      } por webhook${sessionId ? ` y el redirect llego con session ${sessionId}` : ""}. La orden ya figura como pagada en base de datos.`,
      title: "Pago confirmado",
      tone: "success" as const,
    };
  }

  return {
    description: `Stripe devolvio al storefront para la orden ${
      orderId ?? "desconocida"
    }, pero el estado real actual en backend sigue siendo ${
      order?.status ?? "pendiente"
    }. Aun estamos esperando o revisando la confirmacion final por webhook. Si esto persiste, revisa STRIPE_WEBHOOK_SECRET en apps/api y el envio real de eventos hacia /api/stripe/webhook.`,
    title: "Pago en verificacion",
    tone: "neutral" as const,
  };
}
