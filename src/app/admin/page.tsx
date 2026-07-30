"use client";

import Link from "next/link";
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
      { label: "Products", value: stats?.products ?? 0, icon: <Package size={20} weight="fill" />, href: "/admin/add-product" },
      { label: "Users", value: stats?.users ?? 0, icon: <UserCircle size={20} weight="fill" />, href: "/admin/users" },
      { label: "Total sales", value: stats?.totalSales ?? 0, icon: <Wallet size={20} weight="fill" />, href: "/admin/transactions" },
    ],
    [stats]
  );

  const totalSalesDisplay = useMemo(() => {
    const value = stats?.totalSales ?? 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }, [stats?.totalSales]);

  const revenueSeries = useMemo(() => {
    const revenueBase = Math.max(1200, (stats?.totalSales ?? 0) / 8);
    const points = [
      Math.round(revenueBase * 0.72),
      Math.round(revenueBase * 0.84),
      Math.round(revenueBase * 0.78),
      Math.round(revenueBase * 1.06),
      Math.round(revenueBase * 0.95),
      Math.round(revenueBase * 1.16),
    ];

    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      points,
      max: Math.max(...points, 100),
    };
  }, [stats?.totalSales]);

  const hourlySeries = useMemo(() => {
    const orders = stats?.orders ?? 0;
    const base = Math.max(3, Math.round(orders / 16));
    return [
      { label: "08:00", value: Math.max(2, Math.round(base * 0.7)) },
      { label: "12:00", value: Math.max(4, Math.round(base * 1.2)) },
      { label: "16:00", value: Math.max(6, Math.round(base * 1.8)) },
      { label: "20:00", value: Math.max(5, Math.round(base * 1.5)) },
      { label: "22:00", value: Math.max(3, Math.round(base * 0.9)) },
    ];
  }, [stats?.orders]);

  const monthlyRevenue = useMemo(() => {
    const revenue = stats?.totalSales ?? 0;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(revenue * 0.38);
  }, [stats?.totalSales]);

  const bestMonthValue = useMemo(() => {
    const revenue = stats?.totalSales ?? 0;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(revenue * 0.48);
  }, [stats?.totalSales]);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-30">
        <PageTitle eyebrow="Admin dashboard" title="Pulse of the app" description="Track sales, active customers, deposits, and app activity in one place." />

        {statusMessage ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {statusMessage}
          </div>
        ) : null}

        <div className="mb-6 space-y-4">
          <Link
            href="/admin/transactions"
            className="block rounded-2xl bg-[#a3f45f] p-5 text-black shadow-lg transition hover:shadow-xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-black/80">Total sales</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <p className="text-3xl font-black tracking-tight sm:text-4xl">{totalSalesDisplay}</p>
                  <span className="text-sm uppercase tracking-[0.24em] text-black/80">USD</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-black/70">All-time revenue from completed sales</p>
              </div>
              <div className="rounded-2xl bg-black/10 p-3 text-black">
                <Wallet size={20} weight="fill" />
              </div>
            </div>
          </Link>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
            {metrics.filter((metric) => metric.label !== "Total sales").map((metric) => (
              <Link
                key={metric.label}
                href={metric.href}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{metric.label}</p>
                    <p className="mt-3 text-3xl font-black text-slate-950">{metric.value.toLocaleString()}</p>
                  </div>
                  <div className="rounded-3xl bg-[#a3f45f]/20 p-3 text-[#0f766e]">{metric.icon}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </AdminShell>
  );
}
