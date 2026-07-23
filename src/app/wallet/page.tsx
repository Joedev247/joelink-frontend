"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell, PageTitle } from "@/components/shell";
import { formatCurrency, getWalletState, type WalletTransaction } from "@/lib/wallet";

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    const syncWallet = () => {
      const wallet = getWalletState();
      setBalance(wallet.balance);
      setTransactions(wallet.transactions);
    };

    syncWallet();
    window.addEventListener("joelink-account-updated", syncWallet);
    window.addEventListener("storage", syncWallet);

    return () => {
      window.removeEventListener("joelink-account-updated", syncWallet);
      window.removeEventListener("storage", syncWallet);
    };
  }, []);

  return (
    <Shell>
      <div className="mx-auto w-full px-4 py-8 sm:max-w-2xl sm:px-6 lg:max-w-3xl lg:px-8 mb-30">
        <PageTitle
          eyebrow="Your account"
          title="Wallet"
          description="Manage balance, add funds, and track transactions."
        />

        <section className="rounded-2xl bg-[#a3f45f] p-5 text-black shadow-lg sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-black/90">Balance</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-black tracking-tight sm:text-4xl">{formatCurrency(balance)}</p>
                <span className="text-sm uppercase tracking-widest text-black/80">USD</span>
              </div>
            </div>
            <p className="text-right text-xs uppercase tracking-widest text-black">
              {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </p>
          </div>

          <div className="mt-5">
            <Link
              href="/wallet/add-funds"
              className="block w-full rounded-lg bg-black/80 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-black/90 sm:px-5 sm:py-4"
            >
              Add funds
            </Link>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-6">
          <h2 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">Transactions</h2>

          <div className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-bold text-slate-950">{tx.type}</p>
                    <p className="text-xs text-slate-500">{tx.method}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
                    tx.status === "Pending"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {tx.status}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200/50">
                  <p className="text-base font-black text-slate-950">{tx.amount}</p>
                  <p className="text-xs text-slate-500">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
