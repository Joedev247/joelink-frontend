"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/adminShell";
import { PageTitle } from "@/components/shell";
import { getWalletTransactions } from "@/lib/api";
import { Receipt } from "@phosphor-icons/react/dist/ssr";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setTransactions(await getWalletTransactions());
      } catch {
        setStatusMessage("Unable to load transactions. Start the backend and try again.");
      }
    }
    void load();
  }, []);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-30">
        <PageTitle eyebrow="Admin" title="Transaction feed" description="Review every app transaction from users across deposits and purchases." />

        {statusMessage ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {statusMessage}
          </div>
        ) : null}

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3 pb-4">
            <div className="grid h-12 w-12 place-items-center rounded-3xl bg-[#a3f45f]/15 text-[#0f766e]">
              <Receipt size={24} weight="bold" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1a73e8]">Transactions</p>
              <p className="mt-1 text-lg font-black text-slate-950">App-wide transaction activity</p>
            </div>
          </div>

          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">No transactions available yet.</div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-950">{transaction.type === "deposit" ? "Deposit" : "Purchase"}</p>
                      <p className="mt-1 text-sm text-slate-600">{transaction.description}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{new Date(transaction.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <span className="rounded-full bg-white px-3 py-1">User: {transaction.userId}</span>
                    <span className="rounded-full bg-white px-3 py-1">Amount: ${transaction.amount}</span>
                    <span className="rounded-full bg-white px-3 py-1">Type: {transaction.type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
