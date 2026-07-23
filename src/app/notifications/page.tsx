"use client";

import Link from "next/link";
import { Bell, ArrowRight, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Shell, PageTitle } from "@/components/shell";
import { getWalletState } from "@/lib/wallet";

const notifications = [
  {
    title: "Deposit completed",
    detail: "Your wallet top-up of $120.00 is now available.",
    time: "2 hours ago",
    tone: "success",
  },
  {
    title: "Purchase pending",
    detail: "Your latest account order is being processed.",
    time: "Today",
    tone: "info",
  },
  {
    title: "Referral milestone",
    detail: "A new signup joined your affiliate network.",
    time: "Yesterday",
    tone: "neutral",
  },
];

export default function NotificationsPage() {
  const wallet = getWalletState();

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <PageTitle
          eyebrow="Updates"
          title="Notifications"
          description="View your recent wallet activity, purchases, and account updates in one place."
        />

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[#071426] text-white">
                <Bell size={20} weight="fill" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-950">Latest activity</h2>
                <p className="text-sm text-slate-500">You currently have {wallet.transactions.length} recent updates.</p>
              </div>
            </div>
            <Link href="/wallet" className="inline-flex items-center text-center gap-2 bg-[#a3f45f] rounded-xl px-4 py-2.5 text-sm font-black text-black">
              Go to wallet <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {notifications.map((item) => (
              <article key={item.title} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 grid h-10 w-10 place-items-center rounded-2xl ${item.tone === "success" ? "bg-emerald-100 text-emerald-700" : item.tone === "info" ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-700"}`}>
                    <Sparkle size={18} weight="fill" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-950">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.detail}</p>
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-400 sm:text-right">{item.time}</div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
