"use client";

import type {
  CheckoutCartSummary,
  CheckoutSubmissionState,
} from "@/features/checkout/types/checkout";
import { StorefrontImage } from "@/lib/storefront-image-element";
import { formatPrice } from "@/lib/format-price";

type CheckoutOrderSummaryProps = {
  cartSummary: CheckoutCartSummary;
  onSubmit: () => void;
  submissionState: CheckoutSubmissionState;
  validationErrorCount: number;
};

export function CheckoutOrderSummary({
  cartSummary,
  onSubmit,
  submissionState,
  validationErrorCount,
}: CheckoutOrderSummaryProps) {
  const hasPreliminaryOrder = submissionState.orderResult !== null;
  const buttonLabel = getButtonLabel(
    submissionState.phase,
    hasPreliminaryOrder
  );

  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <section className="rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
              Resumen
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] text-stone-50">
              Tu compra
            </h2>
          </div>
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-stone-300">
            {cartSummary.itemCount} item{cartSummary.itemCount === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-8 max-h-[24rem] space-y-3 overflow-auto pr-1">
          {cartSummary.items.map((item) => (
            <article
              key={item.variantId}
              className="rounded-[1.5rem] border border-white/10 bg-black/20 p-3"
            >
              <div className="flex gap-3">
                <StorefrontImage
                  src={item.imageUrl || "/images/pijama1.jpg"}
                  alt={item.name}
                  fallbackAlt={item.name}
                  className="h-20 w-20 rounded-2xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                    {item.categoryName}
                  </p>
                  <h3 className="mt-1 truncate font-medium text-stone-50">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-stone-300">
                    {[item.color, item.size].filter(Boolean).join(" / ") ||
                      "Variante activa"}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                    <span className="text-stone-400">Cantidad: {item.quantity}</span>
                    <span className="font-semibold text-stone-50">
                      {formatPrice(item.lineTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 border-t border-white/10 pt-5">
          <SummaryRow label="Subtotal" value={formatPrice(cartSummary.subtotal)} />
          <SummaryRow label="Envio" value="Se definira" muted />
          <SummaryRow label="Total" value={formatPrice(cartSummary.total)} strong />
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={
            submissionState.phase === "creating_order" ||
            submissionState.phase === "starting_payment"
          }
          className="mt-6 w-full rounded-full bg-[rgba(212,177,138,0.95)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-stone-950 transition hover:bg-[rgba(226,196,164,1)] disabled:cursor-wait disabled:opacity-80"
        >
          {buttonLabel}
        </button>

        <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
            Integracion siguiente
          </p>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            Paso 1: crear orden preliminar real. Paso 2: abrir Stripe Checkout
            test usando esa orden como base de pago.
          </p>
        </div>

        {submissionState.message ? (
          <div
            className={[
              "mt-4 rounded-[1.5rem] border p-4 text-sm leading-7",
              submissionState.phase === "order_ready"
                ? "border-emerald-300/25 bg-emerald-300/10 text-stone-100"
                : submissionState.phase === "validation_error"
                  ? "border-amber-300/20 bg-amber-300/10 text-stone-100"
                  : submissionState.phase === "error"
                    ? "border-red-300/25 bg-red-300/10 text-stone-100"
                    : "border-[rgba(212,177,138,0.22)] bg-[rgba(212,177,138,0.08)] text-stone-100",
            ].join(" ")}
          >
            <p>{submissionState.message}</p>
            {submissionState.phase === "validation_error" ? (
              <p className="mt-2 text-sm text-stone-200">
                Campos pendientes detectados: {validationErrorCount}
              </p>
            ) : null}
          </div>
        ) : null}

        {submissionState.orderResult ? (
          <details className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
            <summary className="cursor-pointer list-none text-sm font-medium text-stone-100">
              Ver orden preliminar
            </summary>
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <MiniStat
                  label="Orden"
                  value={submissionState.orderResult.order.id}
                />
                <MiniStat
                  label="Estado"
                  value={submissionState.orderResult.order.status}
                />
                <MiniStat
                  label="Stripe"
                  value={submissionState.orderResult.order.stripeStatus}
                />
                <MiniStat
                  label="Session ID"
                  value={
                    submissionState.orderResult.order.stripeCheckoutSessionId ??
                    "Pendiente"
                  }
                />
              </div>
              <pre className="overflow-auto rounded-[1.25rem] border border-white/10 bg-black/30 p-4 text-xs leading-6 text-stone-300">
                {JSON.stringify(submissionState.orderResult, null, 2)}
              </pre>
            </div>
          </details>
        ) : null}

        {submissionState.payload ? (
          <details className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
            <summary className="cursor-pointer list-none text-sm font-medium text-stone-100">
              Ver payload enviado
            </summary>
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <MiniStat
                  label="Cliente"
                  value={submissionState.payload.customer.fullName}
                />
                <MiniStat
                  label="Correo"
                  value={submissionState.payload.customer.email}
                />
                <MiniStat
                  label="Total"
                  value={formatPrice(submissionState.payload.cart.total)}
                />
                <MiniStat
                  label="Cart ID"
                  value={submissionState.payload.cartId ?? "Sin cartId"}
                />
              </div>
              <pre className="overflow-auto rounded-[1.25rem] border border-white/10 bg-black/30 p-4 text-xs leading-6 text-stone-300">
                {JSON.stringify(submissionState.payload, null, 2)}
              </pre>
            </div>
          </details>
        ) : null}
      </section>
    </aside>
  );
}

function getButtonLabel(
  phase: CheckoutSubmissionState["phase"],
  hasPreliminaryOrder: boolean
) {
  if (phase === "creating_order") {
    return "Creando orden...";
  }

  if (phase === "starting_payment") {
    return "Iniciando Stripe test...";
  }

  if (phase === "validation_error") {
    return "Revisar datos";
  }

  if (phase === "error") {
    return hasPreliminaryOrder ? "Reintentar Stripe test" : "Reintentar orden";
  }

  if (phase === "order_ready") {
    return "Ir a Stripe test";
  }

  return "Crear orden preliminar";
}

type MiniStatProps = {
  label: string;
  value: string;
};

function MiniStat({ label, value }: MiniStatProps) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
        {label}
      </p>
      <p className="mt-2 break-all text-sm text-stone-100">{value}</p>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
};

function SummaryRow({
  label,
  value,
  strong = false,
  muted = false,
}: SummaryRowProps) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-4 py-2",
        strong ? "text-lg font-semibold text-stone-50" : "text-sm",
      ].join(" ")}
    >
      <span className={muted ? "text-stone-500" : "text-stone-400"}>
        {label}
      </span>
      <span className={strong ? "text-stone-50" : "text-stone-200"}>
        {value}
      </span>
    </div>
  );
}
