"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Copy, Gift, ShieldCheck, UserCircle, HeartBreak } from "@phosphor-icons/react/dist/ssr";
import { Shell, PageTitle } from "@/components/shell";
import { getWishlistItems, money, type WishlistItem } from "@/lib/store";
import { getCurrentUser, updateUser } from "@/lib/api";

function formatMemberSince(value: unknown) {
  if (typeof value !== "string" || !value) {
    return "Unavailable";
  }

  const createdAt = new Date(value);
  if (!Number.isFinite(createdAt.getTime())) {
    return "Unavailable";
  }

  return createdAt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [memberSince, setMemberSince] = useState("Unavailable");
  const [statusMessage, setStatusMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const profileHandle = (fullName || email || "user").trim().toLowerCase().replace(/[^a-z0-9._]+/g, "") || "user";
  const profileInitials = (fullName || email || "User")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase() || "U";

  useEffect(() => {
    const syncProfile = async () => {
      try {
        const response = await getCurrentUser();
        const currentUser = response?.user;

        if (currentUser) {
          const currentUserId = String(currentUser.id || "");
          setUserId(currentUserId);
          setFullName(String(currentUser.name || ""));
          setEmail(String(currentUser.email || ""));
          setMemberSince(formatMemberSince(currentUser.createdAt ?? currentUser.created_at));
          setAvatarUrl(window.localStorage.getItem(`joelink-profile-avatar-${currentUserId}`) || "");
          setWishlistItems(getWishlistItems());
          return;
        }
      } catch {
        // Fall back to empty values rather than dummy defaults.
      }

      setUserId(null);
      setFullName("");
      setEmail("");
      setAvatarUrl("");
      setMemberSince("Unavailable");
      setWishlistItems(getWishlistItems());
    };

    void syncProfile();
    window.addEventListener("storage", syncProfile);
    window.addEventListener("joelink-account-updated", syncProfile);

    return () => {
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener("joelink-account-updated", syncProfile);
    };
  }, []);

  const handleSaveProfile = async () => {
    if (typeof window === "undefined") {
      return;
    }

    const nextName = fullName.trim() || "";
    const nextEmail = email.trim() || "";

    if (userId) {
      try {
        await updateUser(userId, {
          name: nextName,
          email: nextEmail,
        });
      } catch {
        setStatusMessage("Could not update your profile right now.");
        return;
      }
    }

    window.localStorage.setItem("joelink-profile-name", nextName);
    window.localStorage.setItem("joelink-profile-email", nextEmail);
    window.localStorage.setItem("joelink-account-name", nextName);
    window.localStorage.setItem("joelink-account-email", nextEmail);
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
                    <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-white/70 text-2xl font-black text-black">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={`${fullName || "User"} profile photo`}
                          width={64}
                          height={64}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      ) : profileInitials}
                    </div>
                    <div>
                      <h2 className="mt-1 text-xl font-black text-black">{fullName || "Your profile"}</h2>
                      <p className="mt-1 text-sm text-black/80">{email || "Sign in to see your account details."}</p>
                      <p className="mt-1 text-sm font-semibold text-black/70">@{profileHandle}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
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
                    autoComplete="name"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                  />
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
