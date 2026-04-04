import type {
  CheckoutCustomerData,
  CheckoutDeliveryAddress,
  CheckoutFormData,
  CheckoutFormErrors,
} from "@/features/checkout/types/checkout";

type CheckoutCustomerFormProps = {
  disabled?: boolean;
  errors: CheckoutFormErrors;
  formData: CheckoutFormData;
  onCustomerFieldChange: (
    field: keyof CheckoutCustomerData,
    value: string
  ) => void;
  onDeliveryFieldChange: (
    field: keyof CheckoutDeliveryAddress,
    value: string
  ) => void;
};

export function CheckoutCustomerForm({
  disabled = false,
  errors,
  formData,
  onCustomerFieldChange,
  onDeliveryFieldChange,
}: CheckoutCustomerFormProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2.25rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
              Cliente
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] text-stone-50">
              Informacion de contacto
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-stone-300 sm:text-right">
            Esta base ya guarda los datos en una estructura coherente lista para
            orden y pago.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Field
            label="Nombre completo"
            name="fullName"
            autoComplete="name"
            placeholder="Leyne Client"
            value={formData.customer.fullName}
            error={errors.customer.fullName}
            onChange={(value) => onCustomerFieldChange("fullName", value)}
            disabled={disabled}
          />
          <Field
            label="Correo electronico"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="cliente@leyne.com"
            value={formData.customer.email}
            error={errors.customer.email}
            onChange={(value) => onCustomerFieldChange("email", value)}
            disabled={disabled}
          />
          <Field
            label="Telefono"
            name="phone"
            autoComplete="tel"
            placeholder="+34 600 000 000"
            value={formData.customer.phone}
            error={errors.customer.phone}
            onChange={(value) => onCustomerFieldChange("phone", value)}
            disabled={disabled}
          />
          <Field
            label="Documento o referencia"
            name="reference"
            placeholder="Opcional"
            value={formData.customer.reference}
            onChange={(value) => onCustomerFieldChange("reference", value)}
            disabled={disabled}
          />
        </div>
      </section>

      <section className="rounded-[2.25rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
              Entrega
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] text-stone-50">
              Direccion y despacho
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-stone-300 sm:text-right">
            La vista ya contempla los datos logisticos para el siguiente paso de
            creacion de orden y envio.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Field
            label="Direccion"
            name="addressLine1"
            autoComplete="street-address"
            placeholder="Calle, numero, piso"
            className="sm:col-span-2"
            value={formData.delivery.addressLine1}
            error={errors.delivery.addressLine1}
            onChange={(value) => onDeliveryFieldChange("addressLine1", value)}
            disabled={disabled}
          />
          <Field
            label="Ciudad"
            name="city"
            autoComplete="address-level2"
            placeholder="Ciudad"
            value={formData.delivery.city}
            error={errors.delivery.city}
            onChange={(value) => onDeliveryFieldChange("city", value)}
            disabled={disabled}
          />
          <Field
            label="Provincia o region"
            name="region"
            autoComplete="address-level1"
            placeholder="Provincia"
            value={formData.delivery.region}
            error={errors.delivery.region}
            onChange={(value) => onDeliveryFieldChange("region", value)}
            disabled={disabled}
          />
          <Field
            label="Codigo postal"
            name="postalCode"
            autoComplete="postal-code"
            placeholder="18000"
            value={formData.delivery.postalCode}
            error={errors.delivery.postalCode}
            onChange={(value) => onDeliveryFieldChange("postalCode", value)}
            disabled={disabled}
          />
          <Field
            label="Pais"
            name="country"
            autoComplete="country-name"
            placeholder="Espana"
            value={formData.delivery.country}
            error={errors.delivery.country}
            onChange={(value) => onDeliveryFieldChange("country", value)}
            disabled={disabled}
          />
        </div>

        <div className="mt-4">
          <label className="block">
            <span className="text-sm font-medium text-stone-200">
              Notas para la entrega
            </span>
            <textarea
              name="notes"
              rows={4}
              placeholder="Indicaciones, horario o referencia del pedido"
              value={formData.delivery.notes}
              onChange={(event) =>
                onDeliveryFieldChange("notes", event.target.value)
              }
              disabled={disabled}
              className="mt-2 w-full rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-[rgba(212,177,138,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
        </div>
      </section>
    </div>
  );
}

type FieldProps = {
  error?: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
  value: string;
};

function Field({
  error,
  label,
  name,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  className,
  disabled = false,
  value,
}: FieldProps) {
  const errorId = `${name}-error`;

  return (
    <label className={["block", className].filter(Boolean).join(" ")}>
      <span className="text-sm font-medium text-stone-200">{label}</span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={[
          "mt-2 w-full rounded-[1.5rem] border bg-black/20 px-4 py-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 disabled:cursor-not-allowed disabled:opacity-60",
          error
            ? "border-[rgba(244,114,114,0.5)] focus:border-[rgba(244,114,114,0.72)]"
            : "border-white/10 focus:border-[rgba(212,177,138,0.45)]",
        ].join(" ")}
      />
      {error ? (
        <span id={errorId} className="mt-2 block text-sm text-red-200">
          {error}
        </span>
      ) : null}
    </label>
  );
}
