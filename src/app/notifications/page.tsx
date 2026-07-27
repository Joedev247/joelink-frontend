"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, ArrowRight, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Shell, PageTitle } from "@/components/shell";
import { getWalletState, markNotificationsAsRead, type WalletTransaction } from "@/lib/wallet";
import { convertAmount, getStoredCurrency, type CurrencyCode } from "@/lib/currency";

function buildNotification(item: WalletTransaction) {
  const isDeposit = item.kind === "deposit";
  const title = isDeposit
    ? item.status === "Pending"
      ? "Deposit pending"
      : "Deposit completed"
    : item.status === "Pending"
      ? "Purchase pending"
      : "Purchase completed";

  const detail = `${item.type} via ${item.method} • ${item.amount}`;
  const tone = isDeposit ? "success" : "info";

  return {
    title,
    detail,
    time: item.date,
    tone,
  };
}

export default function NotificationsPage() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    const syncTransactions = () => {
      setTransactions(getWalletState().transactions);
    };

    syncTransactions();
    window.addEventListener("joelink-account-updated", syncTransactions);
    window.addEventListener("storage", syncTransactions);

    return () => {
      window.removeEventListener("joelink-account-updated", syncTransactions);
      window.removeEventListener("storage", syncTransactions);
    };
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      markNotificationsAsRead(transactions);
      window.dispatchEvent(new Event("joelink-account-updated"));
    }
  }, [transactions.length]);

  const currency = getStoredCurrency();
  const notifications = transactions.map((item) => {
    const amountValue = typeof item.amountValue === "number" && Number.isFinite(item.amountValue)
      ? item.amountValue
      : Number(item.amount.replace(/[^0-9.-]/g, ""));
    const convertedAmount = item.kind === "deposit"
      ? amountValue
      : Number.isFinite(amountValue) ? convertAmount(amountValue, "USD", currency) : amountValue;
    const sign = item.kind === "purchase" ? "-" : "+";
    const amountText = Number.isFinite(convertedAmount)
      ? (() => {
          const formattedAmount = new Intl.NumberFormat(currency === "NGN" || currency === "CFA" ? "en-US" : currency === "GBP" ? "en-GB" : "en-US", {
            style: "currency",
            currency: currency === "CFA" ? "XOF" : currency,
            maximumFractionDigits: currency === "NGN" || currency === "CFA" ? 0 : 2,
          }).format(convertedAmount);

          return formattedAmount.replace(/^([^0-9.-]*)/, "$1" + sign);
        })()
      : item.amount;

    return {
      ...buildNotification(item),
      detail: `${item.type} via ${item.method} • ${amountText}`,
    };
  });

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
                <p className="text-sm text-slate-500">You currently have {transactions.length} recent updates.</p>
              </div>
            </div>
            <Link href="/wallet" className="inline-flex items-center gap-2 rounded-xl bg-[#a3f45f] px-4 py-2.5 text-center text-sm font-black text-black">
              Go to wallet <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {notifications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No transaction activity yet. Your wallet updates will appear here automatically.
              </div>
            ) : (
              notifications.map((item) => (
                <article key={`${item.title}-${item.time}`} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 grid h-10 w-10 place-items-center rounded-2xl ${item.tone === "success" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"}`}>
                      <Sparkle size={18} weight="fill" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-950">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{item.detail}</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-400 sm:text-right">{item.time}</div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </Shell>
  );
}
