"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/adminShell";
import { PageTitle } from "@/components/shell";
import { getAdminStats } from "@/lib/api";
import { Package, UserCircle, Wallet } from "@phosphor-icons/react/dist/ssr";

export default function AdminPage() {
  const [stats, setStats] = useState<{ products: number; users: number; activeUsers: number; orders: number; totalSales: number; totalDeposits: number; walletTransactions: number; notifications: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const refreshStats = async () => {
    try {
      const nextStats = await getAdminStats();
      setStats(nextStats);
    } catch {
      setStatusMessage("The admin API is not reachable yet. Please start the backend server first.");
    }
  };

  useEffect(() => {
    void refreshStats();
  }, []);

  const metrics = useMemo(
    () => [
      { label: "Products", value: stats?.products ?? 0, icon: <Package size={20} weight="fill" /> },
      { label: "Users", value: stats?.users ?? 0, icon: <UserCircle size={20} weight="fill" /> },
      { label: "Total sales", value: stats?.totalSales ?? 0, icon: <Wallet size={20} weight="fill" /> },
    ],
    [stats]
  );

  const chartData = useMemo(() => [24, 32, 28, 44, 38, 52, 48, 58, 64, 72, 68, 82], []);
  const chartMax = Math.max(...chartData, 100);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-30">
        <PageTitle eyebrow="Admin dashboard" title="Pulse of the app" description="Track sales, active customers, deposits, and app activity in one place." />

        {statusMessage ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {statusMessage}
          </div>
        ) : null}

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{metric.label}</p>
                  <p className="mt-3 text-3xl font-black text-slate-950">{metric.value.toLocaleString()}</p>
                </div>
                <div className="rounded-3xl bg-[#a3f45f]/20 p-3 text-[#0f766e]">{metric.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#1a73e8]">Overview</p>
                <h2 className="mt-2 text-xl font-black text-slate-950">Sales performance</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">A live revenue trend for the app, presented with a clean area chart and quick range controls.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 rounded-full bg-slate-100 p-1.5 shadow-sm">
                {['1D', '1W', '1M', '6M', '1Y'].map((range, idx) => (
                  <button
                    key={range}
                    type="button"
                    className={`rounded-full px-4 py-2 text-xs font-black transition ${idx === 2 ? 'bg-[#071426] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-[#fcfffb] p-5 shadow-inner">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">15 Sep 2022 21:59</p>
                  <p className="mt-2 text-3xl font-black text-[#0f766e]">$20,101.46</p>
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-slate-500 shadow">Monthly</div>
              </div>

              <div className="relative mt-8 h-[320px] overflow-hidden rounded-[1.5rem] bg-white p-4">
                <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-b from-white via-[#ecfdf5]/60 to-white/0" />
                <div className="absolute inset-x-0 top-0 h-0.5 bg-slate-200/70" />
                <div className="absolute inset-x-0 top-[25%] h-0.5 bg-slate-200/40" />
                <div className="absolute inset-x-0 top-[50%] h-0.5 bg-slate-200/40" />
                <div className="absolute inset-x-0 top-[75%] h-0.5 bg-slate-200/40" />

                <svg viewBox="0 0 560 280" className="relative h-full w-full">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0f766e" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0f766e" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M28 220 C 78 185 138 200 188 175 S 278 140 328 152 S 378 128 428 92 S 498 70 532 82"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M28 220 C 78 185 138 200 188 175 S 278 140 328 152 S 378 128 428 92 S 498 70 532 82 L 532 280 L 28 280 Z"
                    fill="url(#areaGradient)"
                  />
                  <circle cx="428" cy="92" r="8" fill="#0f766e" stroke="#ffffff" strokeWidth="3" />
                  <circle cx="428" cy="92" r="3" fill="#a3f45f" />
                </svg>

                <div className="absolute left-[76%] top-[14%] flex -translate-x-1/2 flex-col items-center gap-2 text-center">
                  <div className="rounded-full border border-[#0f766e]/10 bg-white px-3 py-1 text-xs font-semibold text-[#0f766e] shadow-sm">
                    $20,101.46
                  </div>
                  <div className="h-3 w-3 rounded-full bg-[#0f766e] shadow-lg" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-3 text-sm text-slate-500">
                <div className="rounded-3xl bg-[#f4fdf8] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Today</p>
                  <p className="mt-2 text-lg font-black text-slate-950">$1,213</p>
                </div>
                <div className="rounded-3xl bg-[#f4fdf8] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Week</p>
                  <p className="mt-2 text-lg font-black text-slate-950">$5,924</p>
                </div>
                <div className="rounded-3xl bg-[#f4fdf8] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Month</p>
                  <p className="mt-2 text-lg font-black text-slate-950">$20,101</p>
                </div>
                <div className="rounded-3xl bg-[#f4fdf8] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Change</p>
                  <p className="mt-2 text-lg font-black text-slate-950">+14.8%</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
