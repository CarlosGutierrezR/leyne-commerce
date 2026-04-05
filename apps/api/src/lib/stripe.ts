import Stripe from "stripe";

let stripeClient: Stripe | null = null;

const REQUIRED_STRIPE_CHECKOUT_ENV_VARS = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STOREFRONT_URL",
] as const;

type StripeConfigEnvVar = (typeof REQUIRED_STRIPE_CHECKOUT_ENV_VARS)[number];

type StripeConfigurationIssue = {
  invalidEnvVars: StripeConfigEnvVar[];
  missingEnvVars: StripeConfigEnvVar[];
};

export class StripeConfigurationError extends Error {
  readonly action: string;
  readonly code = "STRIPE_CONFIGURATION_ERROR";
  readonly invalidEnvVars: StripeConfigEnvVar[];
  readonly missingEnvVars: StripeConfigEnvVar[];

  constructor(issue: StripeConfigurationIssue) {
    super(buildStripeConfigurationErrorMessage(issue));
    this.name = "StripeConfigurationError";
    this.action =
      "Configura las variables requeridas en apps/api, reinicia la API y vuelve a intentar el flujo de Stripe test.";
    this.invalidEnvVars = issue.invalidEnvVars;
    this.missingEnvVars = issue.missingEnvVars;
  }
}

export function getStripeClient() {
  const secretKey = resolveStripeConfiguration(["STRIPE_SECRET_KEY"])
    .STRIPE_SECRET_KEY;

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}

export function getStorefrontUrl() {
  return resolveStripeConfiguration(["STOREFRONT_URL"]).STOREFRONT_URL;
}

export function getStripeWebhookSecret() {
  return resolveStripeConfiguration(["STRIPE_WEBHOOK_SECRET"])
    .STRIPE_WEBHOOK_SECRET;
}

export function assertStripeCheckoutConfiguration() {
  return resolveStripeConfiguration(REQUIRED_STRIPE_CHECKOUT_ENV_VARS);
}

export function getRequiredStripeCheckoutEnvVars() {
  return [...REQUIRED_STRIPE_CHECKOUT_ENV_VARS];
}

export function isStripeConfigurationError(
  error: unknown
): error is StripeConfigurationError {
  return error instanceof StripeConfigurationError;
}

export function buildStripeCheckoutUrls(orderId: string) {
  const storefrontUrl = getStorefrontUrl();

  return {
    cancelUrl: `${storefrontUrl}/checkout?stripe=cancelled&orderId=${encodeURIComponent(
      orderId
    )}`,
    successUrl: `${storefrontUrl}/checkout/confirmado?stripe=success&orderId=${encodeURIComponent(
      orderId
    )}&session_id={CHECKOUT_SESSION_ID}`,
  };
}

function resolveStripeConfiguration(requiredEnvVars: readonly StripeConfigEnvVar[]) {
  const missingEnvVars: StripeConfigEnvVar[] = [];
  const invalidEnvVars: StripeConfigEnvVar[] = [];
  const resolvedValues = {} as Record<StripeConfigEnvVar, string>;

  for (const envVar of requiredEnvVars) {
    const rawValue = readTrimmedEnvVar(envVar);

    if (!rawValue) {
      missingEnvVars.push(envVar);
      continue;
    }

    if (envVar === "STOREFRONT_URL") {
      const normalizedUrl = normalizeAbsoluteHttpUrl(rawValue);

      if (!normalizedUrl) {
        invalidEnvVars.push(envVar);
        continue;
      }

      resolvedValues[envVar] = normalizedUrl;
      continue;
    }

    resolvedValues[envVar] = rawValue;
  }

  if (missingEnvVars.length > 0 || invalidEnvVars.length > 0) {
    throw new StripeConfigurationError({
      invalidEnvVars,
      missingEnvVars,
    });
  }

  return resolvedValues;
}

function buildStripeConfigurationErrorMessage({
  invalidEnvVars,
  missingEnvVars,
}: StripeConfigurationIssue) {
  const messages: string[] = [
    "Stripe test no esta listo en apps/api.",
  ];

  if (missingEnvVars.length > 0) {
    messages.push(`Faltan ${formatEnvVarList(missingEnvVars)}.`);
  }

  if (invalidEnvVars.includes("STOREFRONT_URL")) {
    messages.push(
      "STOREFRONT_URL debe ser una URL absoluta valida con http o https."
    );
  }

  if (missingEnvVars.includes("STRIPE_WEBHOOK_SECRET")) {
    messages.push(
      "Sin STRIPE_WEBHOOK_SECRET la confirmacion real del pago no puede cerrarse por webhook."
    );
  }

  return messages.join(" ");
}

function formatEnvVarList(envVars: readonly StripeConfigEnvVar[]) {
  return envVars.join(", ");
}

function normalizeAbsoluteHttpUrl(value: string) {
  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

function readTrimmedEnvVar(name: StripeConfigEnvVar) {
  const value = process.env[name];

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}
