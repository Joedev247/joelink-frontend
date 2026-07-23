"use client";

import { ArrowRight, Copy, Gift, ShieldCheck, Sparkle, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { Shell, PageTitle } from "@/components/shell";

const wishlistItems = [
  {
    name: "CapCut Pro 1-Month Account",
    price: "CFA 5,000.00",
    tag: "Private account",
  },
  {
    name: "Spotify Premium Family",
    price: "CFA 3,200.00",
    tag: "Instant delivery",
  },
];

export default function ProfilePage() {
  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10 mb-30">
        <PageTitle
          eyebrow="My account"
          title="Profile"
          description="Manage your details, security, referrals, and saved wishlist items from one place."
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="bg-[#a3f45f] p-6 text-white sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-2xl font-black backdrop-blur">
                      J
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">User profile</p>
                      <h2 className="mt-1 text-2xl font-black">Joedev</h2>
                      <p className="mt-1 text-sm text-white/80">joedev@gmail.com</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold">
                    <Sparkle size={16} weight="fill" />
                    Premium member
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Wallet balance</p>
                  <p className="mt-2 text-xl font-black text-slate-950">CFA 24,000</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Orders</p>
                  <p className="mt-2 text-xl font-black text-slate-950">12 active</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Member since</p>
                  <p className="mt-2 text-xl font-black text-slate-950">Jan 2026</p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#a3f45f]/20 text-[#0f766e]">
                  <UserCircle size={22} weight="fill" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">Profile settings</h3>
                  <p className="text-sm text-slate-500">Keep your account details up to date.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Full name
                  <input
                    defaultValue="Joedev"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Preferred currency
                  <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10">
                    <option>CFA</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </label>
              </div>

              <button className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#a3f45f] px-4 py-3 text-sm font-black text-[#09120b] transition hover:brightness-105">
                Update profile
                <ArrowRight size={16} weight="bold" />
              </button>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ecfdf5] text-[#0f766e]">
                  <ShieldCheck size={22} weight="fill" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">Security</h3>
                  <p className="text-sm text-slate-500">Update your password to keep the account protected.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-1">
                <label className="block text-sm font-semibold text-slate-700">
                  New password
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                  />
                </label>
              </div>

              <button className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-50">
                Change password
              </button>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eef8ff] text-[#1a73e8]">
                  <Gift size={22} weight="fill" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">My wishlist</h3>
                  <p className="text-sm text-slate-500">Saved items you can revisit anytime.</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {wishlistItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div>
                      <p className="text-sm font-black text-slate-950">{item.name}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.tag}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-950">{item.price}</p>
                      <button className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#0f766e]">
                        View <ArrowRight size={12} weight="bold" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-[#071426] p-5 text-white shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#a3f45f]">Referral & affiliate</p>
                  <h3 className="mt-2 text-xl font-black">Earn wallet credits for referrals</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Share your unique link below and earn rewards every time a referral completes a purchase.</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-2">
                  <Gift size={20} weight="fill" />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Your link</p>
                <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white/10 p-3">
                  <p className="flex-1 truncate text-sm font-semibold text-white">https://joelink.com/ref/joedev</p>
                  <button className="rounded-xl bg-[#a3f45f] p-2 text-[#09120b] transition hover:brightness-105">
                    <Copy size={16} weight="bold" />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-3 grid-cols-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-xl font-black">0</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Visitors</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-xl font-black">0</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Signups</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-xl font-black">0</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Buyers</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Shell>
  );
}
