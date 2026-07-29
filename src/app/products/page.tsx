"use client";
import Link from "next/link";
import { Storefront, ArrowRight, Heart } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { Shell, PageTitle } from "@/components/shell";
import { categories, products as fallbackProducts, money, getWishlistProductIds, toggleWishlistProduct } from "@/lib/store";
import { getStoredCurrency } from "@/lib/currency";
import { getProducts } from "@/lib/api";

export default function ProductsPage() {
  const [category, setCategory] = useState("All accounts");
  const [query, setQuery] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [catalog, setCatalog] = useState(fallbackProducts);

  useEffect(() => {
    const syncFavorites = () => setFavoriteIds(getWishlistProductIds());
    syncFavorites();
    window.addEventListener("storage", syncFavorites);
    window.addEventListener("joelink-account-updated", syncFavorites);

    void getProducts()
      .then((products) => setCatalog(products))
      .catch(() => setCatalog(fallbackProducts));

    return () => {
      window.removeEventListener("storage", syncFavorites);
      window.removeEventListener("joelink-account-updated", syncFavorites);
    };
  }, []);

  const visible = catalog.filter((p) => {
    const matchesCategory = category === "All accounts" || p.category === category;
    const q = query.trim().toLowerCase();
    const hay = `${p.name} ${p.description} ${p.category}`.toLowerCase();
    const matchesQuery = q === "" || hay.includes(q);
    return matchesCategory && matchesQuery;
  });
  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 mb-30">
        <PageTitle
          eyebrow="Marketplace"
          title="Premium digital accounts"
          description="Fast selection, simple pricing, and clear checkout for on-the-go buyers."
        />
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <label className="sr-only" htmlFor="category-select">Category</label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm sm:w-auto"
            >
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => { setCategory("All accounts"); setQuery(""); }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 sm:px-4"
            >
              Reset
            </button>
          </div>

          <div className="flex w-full items-center gap-3 sm:w-[420px]">
            <label className="sr-only" htmlFor="product-search">Search accounts</label>
            <input
              id="product-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search accounts"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:border-[#79d8d0] focus:ring-2 focus:ring-[#79d8d0]/20"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="text-sm font-semibold text-slate-500">Clear</button>
            )}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => {
            const isFavorite = favoriteIds.includes(p.id);

            return (
              <div key={p.id} className="account-card group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl">
                <button
                  type="button"
                  aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const nextIds = toggleWishlistProduct(p.id);
                    setFavoriteIds(nextIds);
                  }}
                  className={`absolute right-3 top-3 z-10 rounded-full border p-2 transition ${isFavorite ? "border-rose-200 bg-rose-50 text-rose-600 shadow-sm" : "border-slate-200 bg-white/90 text-slate-500 hover:border-rose-200 hover:text-rose-500"}`}
                >
                  <Heart size={16} weight={isFavorite ? "fill" : "regular"} />
                </button>

                <Link href={`/product/${p.id}`} className="block">
                  <div className={`relative mb-4 flex aspect-[1.45] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${p.color}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,.25),transparent_45%)]" />
                    <div className="relative grid h-20 w-20 place-items-center rounded-[1.4rem] bg-white/95 p-3 shadow-2xl ring-4 ring-white/20 transition duration-300 group-hover:scale-105 text-slate-900">
                      <Storefront size={36} weight="bold" />
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-3 px-1">
                    <div>
                      <h3 className="text-sm font-black text-slate-950">{p.name}</h3>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{p.category}</p>
                    </div>
                    <span className="mt-0.5 flex items-center gap-1 text-[9px] font-black text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> LIVE</span>
                  </div>
                  <p className="mt-3 line-clamp-2 min-h-10 px-1 text-xs leading-5 text-slate-500">{p.description}</p>
                  <div className="mt-4 flex items-end justify-between border-t border-slate-100 px-1 pt-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="account-price numeric-display text-lg font-black">{money(p.price, getStoredCurrency())}</span>
                        <span className="numeric-display text-[10px] text-slate-400 line-through">{money(p.originalPrice ?? p.price * 1.35, getStoredCurrency())}</span>
                      </div>
                      <span className="account-savings text-[10px] font-bold">Save {Math.round((1 - p.price / (p.originalPrice ?? p.price * 1.35)) * 100)}% today</span>
                    </div>
                    <span className="account-card-button rounded-lg px-3 py-2 text-[11px] font-black text-[#09120b] transition group-hover:brightness-110">View account</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
