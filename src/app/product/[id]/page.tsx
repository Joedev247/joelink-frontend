import Link from "next/link";
import { Storefront } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { products, money } from "@/lib/store";
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === Number(id));
  if (!product) notFound();

  return (
    <Shell>
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8 mb-30">
        <Link href="/products" className="text-sm font-semibold text-slate-700">
          ← Back to products
        </Link>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className={`relative grid place-items-center bg-gradient-to-br ${product.color} p-8 sm:p-10`}>
            <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-white/90 text-4xl font-black text-slate-950 shadow-lg sm:h-28 sm:w-28 sm:text-5xl">
                <Storefront size={48} weight="bold" className="text-slate-950" />
            </div>
          </div>

          <div className="space-y-5 px-5 py-6 sm:px-6 sm:py-7">
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600">
                {product.category}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% off
              </span>
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                {product.description}
              </p>
            </div>

            <div className="flex items-start justify-between gap-3 rounded-[1.5rem] bg-slate-50 p-4">
              <div>
                <p className="text-xl font-black text-slate-950 sm:text-2xl">
                  {money(product.price)}
                </p>
                <p className="mt-1 text-xs text-slate-500 line-through">
                  {money(product.originalPrice)}
                </p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Best value
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {product.features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  {feature}
                </div>
              ))}
            </div>

            <Link
              href="/login"
              className="block rounded-xl bg-[#a3f45f] px-5 py-4 text-center text-sm font-black uppercase tracking-[0.15em] text-black transition"
            >
              Log in to purchase
            </Link>

            <p className="text-center text-xs uppercase tracking-[0.2em] text-slate-400">
              instant delivery · buyer protection
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
