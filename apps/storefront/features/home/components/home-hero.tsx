import Link from "next/link";

type HomeHeroProps = {
  totalProducts: number;
  totalCategories: number;
  totalCollections: number;
};

const heroHighlights = [
  {
    label: "Lectura rapida",
    value: "Home modular",
    description: "Hero, destacados y catalogo separados para que la portada sea mas mantenible.",
  },
  {
    label: "Compra directa",
    value: "Carrito visible",
    description: "El panel del carrito sigue accesible desde la esquina superior sin salir de la home.",
  },
];

export function HomeHero({
  totalProducts,
  totalCategories,
  totalCollections,
}: HomeHeroProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:items-stretch">
      <div className="rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.26)] backdrop-blur-sm sm:p-10">
        <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
          Leyne Boutique
        </p>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-[0.01em] text-stone-50 sm:text-5xl lg:text-6xl">
          Una portada boutique lista para crecer como catalogo real.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
          La home ya combina compra directa con colecciones reales derivadas del
          backend para que la narrativa editorial y el catalogo transaccional hablen del mismo inventario.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center rounded-full bg-[rgba(212,177,138,0.95)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-950 transition hover:bg-[rgba(226,196,164,1)]"
          >
            Explorar catalogo
          </Link>
          <Link
            href="#catalogo"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone-100 transition hover:border-white/30 hover:bg-white/[0.05]"
          >
            Compra directa
          </Link>
          <p className="text-sm leading-7 text-stone-400">
            {totalProducts} productos visibles, {totalCategories} categorias activas
            y {totalCollections} colecciones reales conectadas.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {heroHighlights.map((highlight) => (
            <article
              key={highlight.label}
              className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                {highlight.label}
              </p>
              <p className="mt-4 text-2xl font-semibold text-stone-50">
                {highlight.value}
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                {highlight.description}
              </p>
            </article>
          ))}
        </div>

        <article className="rounded-[2rem] border border-[rgba(212,177,138,0.18)] bg-[rgba(212,177,138,0.08)] p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
            Contexto actual
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-black/15 p-4">
              <p className="text-3xl font-semibold text-stone-50">{totalProducts}</p>
              <p className="mt-2 text-sm text-stone-300">productos listados</p>
            </div>
            <div className="rounded-[1.5rem] bg-black/15 p-4">
              <p className="text-3xl font-semibold text-stone-50">{totalCategories}</p>
              <p className="mt-2 text-sm text-stone-300">categorias visibles</p>
            </div>
            <div className="rounded-[1.5rem] bg-black/15 p-4">
              <p className="text-3xl font-semibold text-stone-50">{totalCollections}</p>
              <p className="mt-2 text-sm text-stone-300">colecciones reales</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
