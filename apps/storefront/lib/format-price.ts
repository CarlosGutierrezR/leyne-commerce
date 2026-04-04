const euroFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export function formatPrice(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  if (Number.isNaN(amount)) {
    return euroFormatter.format(0);
  }

  return euroFormatter.format(amount);
}
