"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { createOrderFromProduct, money } from "@/lib/store";
import { getStoredCurrency } from "@/lib/currency";
import { applyPurchaseToWallet } from "@/lib/wallet";
import { createOrder, createWalletDeposit } from "@/lib/api";
import type { Product } from "@/lib/store";

type ProductDetailClientProps = {
  product: Product;
};

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const [hasAccount] = useState(() => typeof window !== "undefined" && window.localStorage.getItem("joelink-account-created") === "true");
  const [checkoutState, setCheckoutState] = useState<"idle" | "processing" | "success">("idle");

  function handlePurchase() {
    if (!hasAccount) {
      router.push("/login");
      return;
    }

    setCheckoutState("processing");
    window.setTimeout(() => {
      void (async () => {
        try {
          await createOrder({
            userId: "user_2",
            productId: String(product.id),
            amount: product.price,
            status: "completed",
          });
          await createWalletDeposit({
            userId: "user_2",
            type: "purchase",
            amount: product.price,
            description: product.name,
          });
        } catch {
          // fall back to local-only behavior if the backend is unavailable
        }

        createOrderFromProduct(product);
        applyPurchaseToWallet(product.price, product.name);
        window.dispatchEvent(new Event("joelink-account-updated"));
        setCheckoutState("success");
      })();
    }, 1400);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8 mb-30">
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
        <button type="button" onClick={() => router.back()} className="inline-flex items-center gap-2 text-slate-700 transition hover:text-slate-950">
          <ArrowLeft size={18} weight="bold" />
          Back to products
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className={`relative grid place-items-center bg-gradient-to-br ${product.color} p-8 sm:p-10`}>
          <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-white/90 text-4xl font-black text-slate-950 shadow-lg sm:h-28 sm:w-28 sm:text-5xl">
            {product.name.charAt(0)}
          </div>
        </div>

        <div className="space-y-5 px-5 py-6 sm:px-6 sm:py-7">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600">
              {product.category}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {Math.round((1 - product.price / (product.originalPrice ?? product.price * 1.35)) * 100)}% off
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
              <p className="text-xl font-black text-slate-950 sm:text-2xl">{money(product.price, getStoredCurrency())}</p>
              <p className="mt-1 text-xs text-slate-500 line-through">{money(product.originalPrice ?? product.price * 1.35, getStoredCurrency())}</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Best value
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {(product.features ?? []).map((feature) => (
              <div key={feature} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                {feature}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handlePurchase}
              className="w-full rounded-xl bg-[#a3f45f]  px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-black shadow-[0_15px_35px_rgba(15,118,110,0.22)] transition duration-200"
            >
              {hasAccount ? "Purchase now" : "Log in to purchase"}
            </button>
            <p className="text-center text-xs uppercase tracking-[0.25em] text-slate-400">
              instant delivery · buyer protection
            </p>
          </div>
        </div>
      </div>

      {checkoutState !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 px-4 pb-6 pt-24 sm:px-6">
          <div className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_100px_rgba(15,118,110,0.16)]">
            <div className="rounded-[2rem] bg-[#f8fdfa] p-8 text-center">
              {checkoutState === "processing" ? (
                <>
                  <div className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-full bg-[#a3f45f] text-black shadow-inner">
                    <CircleNotch size={40} weight="bold" className="animate-spin" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-950">Processing...</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Your order is being prepared. Please wait while we confirm your purchase.
                  </p>
                </>
              ) : (
                <>
                  <div className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-full bg-[#a3f45f]  text-black shadow-[0_15px_30px_rgba(15,118,110,0.24)]">
                    <CheckCircle size={44} weight="bold" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-950">Success!</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Your purchase was successful. Your account is ready to use.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutState("idle");
                      router.push("/orders");
                    }}
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#a3f45f]  px-6 py-3 text-sm font-black text-black shadow-[0_12px_30px_rgba(15,118,110,0.28)] transition"
                  >
                    Nice one!
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
