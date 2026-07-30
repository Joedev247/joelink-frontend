"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/adminShell";
import { PageTitle } from "@/components/shell";
import { getWalletTransactions } from "@/lib/api";
import { CreditCard } from "@phosphor-icons/react/dist/ssr";

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setDeposits(await getWalletTransactions(undefined, "deposit"));
      } catch {
        setStatusMessage("Unable to load deposits. Start the backend and try again.");
      }
    }
    void load();
  }, []);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-30">
        <PageTitle eyebrow="Deposits" title="User deposit history" description="Review all user deposits across the app." />

        {statusMessage ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {statusMessage}
          </div>
        ) : null}

        

        <div className="space-y-3">
          {deposits.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">No deposits available yet.</div>
          ) : (
            deposits.map((deposit) => (
              <div key={deposit.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">Deposit</p>
                      <p className="mt-1 text-xs text-slate-600 truncate">{deposit.description}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-black text-slate-900">${deposit.amount}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>User: <span className="font-semibold text-slate-700">{deposit.userId}</span></span>
                      <span className="text-slate-500">{new Date(deposit.createdAt).toLocaleDateString()} {new Date(deposit.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}
