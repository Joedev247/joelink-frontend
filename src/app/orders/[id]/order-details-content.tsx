"use client";

import { useState } from "react";
import { CheckCircle, Eye, EyeSlash, LockKey, ShoppingBagOpen } from "@phosphor-icons/react/dist/ssr";
import { money } from "@/lib/store";
import type { Product } from "@/lib/store";

type OrderDetailsContentProps = {
  order: {
    id: string;
    product: string;
    date: string;
    amount: number;
    status: string;
  };
  product?: Product;
};

export function OrderDetailsContent({ order, product }: OrderDetailsContentProps) {
  const [showPassword, setShowPassword] = useState(false);
  const password = product ? "SecurePass123" : "••••••••";

  return (
    <section className="mt-5 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0f766e]">Account details</p>
          <h3 className="mt-2 text-xl font-black text-slate-950">Your delivery is ready</h3>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#ecfdf5] px-3 py-1.5 text-xs font-bold text-[#0f766e]">
          <CheckCircle size={14} weight="fill" />
          {order.status}
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#a3f45f]/20 text-[#0f766e]">
              <ShoppingBagOpen size={20} weight="fill" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-950">Purchase summary</p>
              <p className="text-xs text-slate-500">Order {order.id}</p>
            </div>
          </div>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
              <dt className="text-slate-500">Purchased on</dt>
              <dd className="font-semibold text-slate-900">{order.date}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
              <dt className="text-slate-500">Amount paid</dt>
              <dd className="font-semibold text-slate-900">{money(order.amount)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
              <dt className="text-slate-500">Delivery</dt>
              <dd className="font-semibold text-slate-900">Instant access</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-[#071426] p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-[#a3f45f]">
              <LockKey size={20} weight="fill" />
            </div>
            <div>
              <p className="text-sm font-black">Credential access</p>
              <p className="text-xs text-slate-300">Secure delivery for your account</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Username</p>
              <p className="mt-1 font-semibold">{product?.name ?? order.product}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Password</p>
                  <p className="mt-1 font-semibold">{showPassword ? password : "••••••••"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-full bg-white/10 p-2 text-[#a3f45f] transition hover:bg-white/20"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlash size={16} weight="bold" /> : <Eye size={16} weight="bold" />}
                </button>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-300">
            Access is prepared for your dashboard. If anything is missing, contact support and we will help resolve it quickly.
          </p>
        </div>
      </div>

      {product && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Included features</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.features.map((feature) => (
              <span key={feature} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
