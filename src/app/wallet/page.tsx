"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell, PageTitle } from "@/components/shell";
import { formatCurrency, getWalletState, type WalletTransaction } from "@/lib/wallet";
import { convertAmount, getStoredCurrency, type CurrencyCode } from "@/lib/currency";

function formatTransactionAmount(tx: WalletTransaction, currency: CurrencyCode) {
  const amountValue = typeof tx.amountValue === "number" && Number.isFinite(tx.amountValue)
    ? tx.amountValue
    : Number(tx.amount.replace(/[^0-9.-]/g, ""));

  if (!Number.isFinite(amountValue)) {
    return tx.amount;
  }

  const convertedAmount = tx.kind === "deposit"
    ? amountValue
    : convertAmount(amountValue, "USD", currency);
  const sign = tx.kind === "purchase" ? "-" : "+";
  const formattedAmount = new Intl.NumberFormat(currency === "NGN" || currency === "CFA" ? "en-US" : currency === "GBP" ? "en-GB" : "en-US", {
    style: "currency",
    currency: currency === "CFA" ? "XOF" : currency,
    maximumFractionDigits: currency === "NGN" || currency === "CFA" ? 0 : 2,
  }).format(convertedAmount);

  return formattedAmount.replace(/^([^0-9.-]*)/, "$1" + sign);
}

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const currency = getStoredCurrency();

  useEffect(() => {
    const syncWallet = async () => {
      const wallet = getWalletState();
      setBalance(wallet.balance);
      setTransactions(wallet.transactions);

      try {
        const response = await fetch(`http://localhost:4000/api/wallet/transactions?userId=user_2`);
        if (response.ok) {
          const remoteTransactions = await response.json();
          if (Array.isArray(remoteTransactions)) {
            setTransactions(remoteTransactions as WalletTransaction[]);
          }
        }
      } catch {
        // fall back to local wallet state
      }
    };

    void syncWallet();
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
                <p className="text-3xl font-black tracking-tight sm:text-4xl">{formatCurrency(balance, getStoredCurrency())}</p>
                <span className="text-sm uppercase tracking-widest text-black/80">{getStoredCurrency()}</span>
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
                  <p className="text-base font-black text-slate-950">{formatTransactionAmount(tx, currency)}</p>
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
