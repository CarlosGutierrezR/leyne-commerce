"use client";

import Link from "next/link";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  clearStoredCartId,
  getStoredCartId,
} from "@/features/cart/store/cart-id";
import { useCartStore } from "@/features/cart/store/cart-store";
import { getOrderStatus } from "@/features/checkout/api/get-order-status";
import type { GetOrderStatusResponse } from "@/features/checkout/types/checkout";
import { formatPrice } from "@/lib/format-price";

type ConfirmationPhase = "idle" | "loading" | "loaded" | "error";
type CartCleanupState =
  | "idle"
  | "cleared"
  | "already_cleared"
  | "preserved_other_cart"
  | "not_applicable";

export function CheckoutConfirmationPageView() {
  return (
    <Suspense fallback={<ConfirmationLoadingState />}>
      <CheckoutConfirmationPageContent />
    </Suspense>
  );
}

function CheckoutConfirmationPageContent() {
  const searchParams = useSearchParams();
  const clearLocalCart = useCartStore((state) => state.clearCart);
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");
  const stripeReturnStatus = searchParams.get("stripe");
  const [phase, setPhase] = useState<ConfirmationPhase>(
    orderId ? "loading" : "idle"
  );
  const [order, setOrder] = useState<GetOrderStatusResponse["order"] | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cartCleanupState, setCartCleanupState] =
    useState<CartCleanupState>("idle");
  const handledCleanupOrderIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    const safeOrderId = orderId;
    let active = true;
    let attempts = 0;

    async function loadOrder() {
      try {
        const response = await getOrderStatus(safeOrderId);

        if (!active) {
          return true;
        }

        const nextCleanupState = finalizePaidOrderCart({
          clearLocalCart,
          handledCleanupOrderIdRef,
          order: response.order,
        });

        setOrder(response.order);
        setPhase("loaded");
        setErrorMessage(null);

        if (nextCleanupState) {
          setCartCleanupState(nextCleanupState);
        }

        if (
          stripeReturnStatus !== "success" ||
          isTerminalOrderStatus(response.order.status)
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
            : "No pudimos consultar el estado real del pedido."
        );

        return true;
      }

      return false;
    }

    void loadOrder();

    if (stripeReturnStatus !== "success") {
      return () => {
        active = false;
      };
    }

    const intervalId = window.setInterval(() => {
      attempts += 1;

      if (attempts >= 10) {
        window.clearInterval(intervalId);
        return;
      }

      void loadOrder().then((shouldStop) => {
        if (shouldStop) {
          window.clearInterval(intervalId);
        }
      });
    }, 2500);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [clearLocalCart, orderId, stripeReturnStatus]);

  if (!orderId) {
    return (
      <ConfirmationShell>
        <StateCard
          eyebrow="Pedido Leyne"
          title="No encontramos una referencia de pedido"
          description="Necesitamos un orderId valido para mostrar la confirmacion real del pago y cerrar la compra de forma segura."
          actions={[
            {
              href: "/checkout",
              label: "Volver al checkout",
              tone: "primary",
            },
            {
              href: "/catalogo",
              label: "Seguir comprando",
              tone: "secondary",
            },
          ]}
          tone="neutral"
        />
      </ConfirmationShell>
    );
  }

  if (phase === "error") {
    return (
      <ConfirmationShell>
        <StateCard
          eyebrow="Pedido Leyne"
          title="No pudimos cerrar la confirmacion"
          description={
            errorMessage ??
            "Falta la referencia del pedido o no pudimos consultar el estado real en backend."
          }
          actions={[
            {
              href: "/checkout",
              label: "Volver al checkout",
              tone: "primary",
            },
            {
              href: "/catalogo",
              label: "Seguir comprando",
              tone: "secondary",
            },
          ]}
          tone="neutral"
        />
      </ConfirmationShell>
    );
  }

  if (phase === "loading" || !order) {
    return <ConfirmationLoadingState />;
  }

  if (order.status === "paid") {
    return (
      <ConfirmationShell>
        <section className="rounded-[2.75rem] border border-emerald-300/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(255,255,255,0.04))] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-100/80">
            Pedido confirmado
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[0.01em] text-stone-50 sm:text-5xl">
            Gracias. Tu pago ya quedo confirmado por Stripe.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-stone-200 sm:text-lg">
            El pedido <span className="font-semibold text-stone-50">{order.id}</span>{" "}
            ya figura como pagado en backend. Esta vista usa el estado real de la
            orden confirmado por webhook, no solo el redirect del navegador.
          </p>

          <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
            <p className="text-sm leading-7 text-stone-200">
              {getCartCleanupMessage(cartCleanupState)}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center rounded-full bg-[rgba(212,177,138,0.95)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-950 transition hover:bg-[rgba(226,196,164,1)]"
            >
              Seguir explorando
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-100 transition hover:border-white/30 hover:bg-white/[0.05]"
            >
              Volver a home
            </Link>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)]">
          <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
                  Resumen final
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-stone-50">
                  Tu pedido Leyne
                </h2>
              </div>
              <StatusPill label="Pagado" tone="success" />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <MetricCard
                label="Orden"
                value={order.id}
                helper="Referencia interna lista para soporte o seguimiento"
              />
              <MetricCard
                label="Total"
                value={formatPrice(Number(order.total))}
                helper={`${order.itemCount} item${order.itemCount === 1 ? "" : "s"} confirmados`}
              />
              <MetricCard
                label="Pago confirmado"
                value={formatDate(order.paidAt)}
                helper="Marcado desde webhook de Stripe test"
              />
              <MetricCard
                label="Stripe"
                value={order.stripeStatus}
                helper={
                  sessionId
                    ? `Checkout Session ${sessionId}`
                    : "Session asociada en backend"
                }
              />
            </div>

            <div className="mt-8 space-y-3">
              {order.items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.5rem] border border-white/10 bg-black/15 p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                        {item.categoryName}
                      </p>
                      <h3 className="mt-2 text-lg font-medium text-stone-50">
                        {item.productName}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-stone-300">
                        {[item.color, item.size].filter(Boolean).join(" / ") ||
                          "Variante confirmada"}
                      </p>
                      <p className="mt-1 text-sm text-stone-400">
                        SKU {item.sku} - Cantidad {item.quantity}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-stone-50">
                      {formatPrice(Number(item.lineTotal))}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
                Cliente
              </p>
              <div className="mt-5 space-y-4 text-sm leading-7 text-stone-200">
                <p>
                  <span className="text-stone-400">Nombre:</span>{" "}
                  {order.customerFullName}
                </p>
                <p>
                  <span className="text-stone-400">Correo:</span>{" "}
                  {order.customerEmail}
                </p>
                <p>
                  <span className="text-stone-400">Telefono:</span>{" "}
                  {order.customerPhone}
                </p>
              </div>
            </section>

            <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
                Entrega
              </p>
              <div className="mt-5 space-y-4 text-sm leading-7 text-stone-200">
                <p>{order.deliveryAddressLine1}</p>
                <p>
                  {order.deliveryCity}, {order.deliveryRegion}
                </p>
                <p>
                  {order.deliveryPostalCode} - {order.deliveryCountry}
                </p>
                {order.deliveryNotes ? (
                  <p>
                    <span className="text-stone-400">Notas:</span>{" "}
                    {order.deliveryNotes}
                  </p>
                ) : null}
              </div>
            </section>
          </aside>
        </div>
      </ConfirmationShell>
    );
  }

  if (
    order.status === "payment_failed" ||
    order.status === "payment_expired"
  ) {
    return (
      <ConfirmationShell>
        <StateCard
          eyebrow="Estado real del pedido"
          title="No se confirmo el pago"
          description={`El estado actual en backend para la orden ${order.id} es ${order.status}. Tu carrito no se ha cerrado en esta vista, asi que puedes revisar los productos y volver a intentar el checkout test.`}
          actions={[
            {
              href: "/checkout",
              label: "Volver al checkout",
              tone: "primary",
            },
            {
              href: "/catalogo",
              label: "Seguir comprando",
              tone: "secondary",
            },
          ]}
          tone="neutral"
        />
      </ConfirmationShell>
    );
  }

  return (
    <ConfirmationShell>
      <StateCard
        eyebrow="Verificacion en curso"
        title="Estamos confirmando tu pedido"
        description={`Stripe ya devolvio el flujo al storefront para la orden ${order.id}, pero el estado real actual sigue en ${order.status}. Esta pantalla espera la confirmacion final del webhook antes de cerrar el carrito.`}
        actions={[
          {
            href: `/checkout/confirmado?stripe=${encodeURIComponent(
              stripeReturnStatus ?? "success"
            )}&orderId=${encodeURIComponent(order.id)}${
              sessionId
                ? `&session_id=${encodeURIComponent(sessionId)}`
                : ""
            }`,
            label: "Actualizar estado",
            tone: "primary",
          },
          {
            href: "/catalogo",
            label: "Volver al catalogo",
            tone: "secondary",
          },
        ]}
        tone="neutral"
      />
    </ConfirmationShell>
  );
}

function ConfirmationShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(212,177,138,0.18),transparent_58%)]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-5 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-stone-400">
            <Link href="/" className="transition hover:text-stone-200">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/checkout" className="transition hover:text-stone-200">
              Checkout
            </Link>
            <span>/</span>
            <span className="text-stone-200">Confirmacion</span>
          </div>
        </header>

        {children}
      </div>
    </main>
  );
}

function ConfirmationLoadingState() {
  return (
    <ConfirmationShell>
      <StateCard
        eyebrow="Pedido Leyne"
        title="Verificando el estado real del pago"
        description="Estamos consultando la orden en backend para confirmar el resultado real del pago. En esta etapa, el webhook de Stripe sigue siendo la fuente de verdad."
        actions={[
          {
            href: "/catalogo",
            label: "Seguir explorando",
            tone: "secondary",
          },
        ]}
        tone="neutral"
      />
    </ConfirmationShell>
  );
}

type StateCardAction = {
  href: string;
  label: string;
  tone: "primary" | "secondary";
};

function StateCard({
  actions,
  description,
  eyebrow,
  title,
  tone,
}: {
  actions: StateCardAction[];
  description: string;
  eyebrow: string;
  title: string;
  tone: "neutral" | "success";
}) {
  return (
    <section
      className={[
        "rounded-[2.75rem] border p-8 shadow-[0_30px_120px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:p-10",
        tone === "success"
          ? "border-emerald-300/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(255,255,255,0.04))]"
          : "border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]",
      ].join(" ")}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[0.01em] text-stone-50 sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-stone-200 sm:text-lg">
        {description}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {actions.map((action) => (
          <Link
            key={`${action.href}-${action.label}`}
            href={action.href}
            className={
              action.tone === "primary"
                ? "inline-flex items-center justify-center rounded-full bg-[rgba(212,177,138,0.95)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-950 transition hover:bg-[rgba(226,196,164,1)]"
                : "inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-100 transition hover:border-white/30 hover:bg-white/[0.05]"
            }
          >
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

function MetricCard({
  helper,
  label,
  value,
}: {
  helper: string;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
        {label}
      </p>
      <p className="mt-3 break-all text-xl font-semibold text-stone-50">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-stone-300">{helper}</p>
    </article>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "neutral";
}) {
  return (
    <span
      className={[
        "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]",
        tone === "success"
          ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
          : "border-white/10 bg-white/[0.04] text-stone-200",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function getCartCleanupMessage(state: CartCleanupState) {
  if (state === "cleared") {
    return "Cerramos el carrito local asociado a este pedido para que la tienda no vuelva a mostrar una compra ya pagada.";
  }

  if (state === "already_cleared") {
    return "Esta sesion ya no tenia un carrito activo asociado a la compra, asi que no fue necesario limpiarlo otra vez.";
  }

  if (state === "preserved_other_cart") {
    return "Detectamos un carrito nuevo o distinto en esta sesion y lo conservamos intacto. Solo cerramos la referencia del pedido ya pagado.";
  }

  if (state === "not_applicable") {
    return "La orden quedo confirmada y el cierre del carrito no requirio una accion local adicional.";
  }

  return "Estamos cerrando la compra con el estado real confirmado por webhook.";
}

function finalizePaidOrderCart({
  clearLocalCart,
  handledCleanupOrderIdRef,
  order,
}: {
  clearLocalCart: () => void;
  handledCleanupOrderIdRef: MutableRefObject<string | null>;
  order: GetOrderStatusResponse["order"];
}) {
  if (order.status !== "paid") {
    return null;
  }

  if (handledCleanupOrderIdRef.current === order.id) {
    return null;
  }

  const storedCartId = getStoredCartId();
  let nextState: CartCleanupState;

  if (storedCartId && order.cartId && storedCartId === order.cartId) {
    clearLocalCart();
    clearStoredCartId();
    nextState = "cleared";
  } else if (!storedCartId) {
    nextState = "already_cleared";
  } else if (order.cartId && storedCartId !== order.cartId) {
    nextState = "preserved_other_cart";
  } else {
    nextState = "not_applicable";
  }

  handledCleanupOrderIdRef.current = order.id;

  return nextState;
}

function formatDate(value: string | null) {
  if (!value) {
    return "Pendiente";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function isTerminalOrderStatus(status: string) {
  return (
    status === "paid" ||
    status === "payment_failed" ||
    status === "payment_expired"
  );
}
