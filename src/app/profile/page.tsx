"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Copy, Gift, ShieldCheck, Sparkle, UserCircle, HeartBreak } from "@phosphor-icons/react/dist/ssr";
import { Shell, PageTitle } from "@/components/shell";
import { getOrders, getWishlistItems, money, type WishlistItem } from "@/lib/store";
import { getWalletState } from "@/lib/wallet";
import { SUPPORTED_CURRENCIES, type CurrencyCode } from "@/lib/currency";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("Joedev");
  const [email, setEmail] = useState("joedev@gmail.com");
  const [currency, setCurrency] = useState<CurrencyCode>("CFA");
  const [walletBalance, setWalletBalance] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [memberSince, setMemberSince] = useState("Jan 2026");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const syncProfile = () => {
      if (typeof window === "undefined") {
        return;
      }

      const storedName = window.localStorage.getItem("joelink-profile-name") || "Joedev";
      const storedEmail = window.localStorage.getItem("joelink-profile-email") || "joedev@gmail.com";
      const storedCurrency = (window.localStorage.getItem("joelink-profile-currency") as CurrencyCode | null) || "CFA";
      const storedMemberDate = window.localStorage.getItem("joelink-profile-member-since") || "Jan 2026";

      setFullName(storedName);
      setEmail(storedEmail);
      setCurrency(SUPPORTED_CURRENCIES.includes(storedCurrency) ? storedCurrency : "CFA");
      setMemberSince(storedMemberDate);
      setWalletBalance(getWalletState().balance);
      setOrderCount(getOrders().length);
      setWishlistItems(getWishlistItems());
    };

    syncProfile();
    window.addEventListener("storage", syncProfile);
    window.addEventListener("joelink-account-updated", syncProfile);

    return () => {
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener("joelink-account-updated", syncProfile);
    };
  }, []);

  const handleSaveProfile = () => {
    if (typeof window === "undefined") {
      return;
    }

    const nextName = fullName.trim() || "Joedev";
    const nextEmail = email.trim() || "joedev@gmail.com";
    const nextCurrency = currency || "CFA";

    window.localStorage.setItem("joelink-profile-name", nextName);
    window.localStorage.setItem("joelink-profile-email", nextEmail);
    window.localStorage.setItem("joelink-profile-currency", nextCurrency);
    window.localStorage.setItem("joelink-profile-member-since", memberSince || "Jan 2026");
    window.dispatchEvent(new Event("joelink-account-updated"));
    setStatusMessage("Profile updated successfully.");
  };

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
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-white/15 text-2xl font-black backdrop-blur text-black">
                      J
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-black/80">User profile</p>
                      <h2 className="mt-1 text-2xl font-black text-black">{fullName}</h2>
                      <p className="mt-1 text-sm text-black/80">{email}</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 text-black px-3 py-2 text-sm font-semibold">
                    <Sparkle size={16} weight="fill" />
                    Premium member
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Wallet balance</p>
                  <p className="mt-2 text-xl font-black text-slate-950">{money(walletBalance, currency)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Orders</p>
                  <p className="mt-2 text-xl font-black text-slate-950">{orderCount} active</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Member since</p>
                  <p className="mt-2 text-xl font-black text-slate-950">{memberSince}</p>
                </div>
              </div>
            </section>

            <section id="profile-settings" className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
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
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Preferred currency
                  <select
                    value={currency}
                    onChange={(event) => {
                      const nextCurrency = event.target.value as CurrencyCode;
                      setCurrency(nextCurrency);
                      window.localStorage.setItem("joelink-profile-currency", nextCurrency);
                      window.dispatchEvent(new Event("joelink-account-updated"));
                    }}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                  >
                    {SUPPORTED_CURRENCIES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSaveProfile}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#a3f45f] px-4 py-3 text-sm font-black text-[#09120b] transition hover:brightness-105"
                >
                  Update profile
                  <ArrowRight size={16} weight="bold" />
                </button>
                {statusMessage ? <span className="text-sm font-semibold text-[#0f766e]">{statusMessage}</span> : null}
              </div>
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
            <section id="wishlist" className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
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
                {wishlistItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#ecfdf5] text-[#0f766e]">
                      <HeartBreak size={20} weight="fill" />
                    </div>
                    Your saved favorites will appear here.
                  </div>
                ) : (
                  wishlistItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div>
                        <p className="text-sm font-black text-slate-950">{item.name}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.tag}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-950">{money(item.price)}</p>
                        <Link href={`/product/${item.id}`} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#0f766e]">
                          View <ArrowRight size={12} weight="bold" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
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
