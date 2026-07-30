"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/adminShell";
import { PageTitle } from "@/components/shell";
import { getUsers, getWalletTransactions, getOrders } from "@/lib/api";
import { getStoredCurrency } from "@/lib/currency";
import { money } from "@/lib/store";
import { UserCircle, Wallet, ShoppingCart, CalendarDots, ArrowClockwise } from "@phosphor-icons/react/dist/ssr";

type AdminUser = {
  id: string;
  name: string;
  username?: string;
  email: string;
  role?: string;
  walletBalance?: number;
  createdAt?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const refreshData = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const [usersResponse, ordersResponse, transactionsResponse] = await Promise.all([
        getUsers(),
        getOrders(),
        getWalletTransactions(),
      ]);
      setUsers(usersResponse as AdminUser[]);
      setOrders(ordersResponse as any[]);
      setTransactions(transactionsResponse as any[]);
    } catch {
      setStatusMessage("Unable to load users. Please start the backend server first.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshData();
  }, []);

  const getUserActivity = (userId: string) => {
    const userOrders = orders.filter((order) => String(order.userId) === String(userId));
    const userTransactions = transactions.filter((transaction) => String(transaction.userId) === String(userId));
    return { orders: userOrders.length, transactions: userTransactions.length };
  };

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => {
      const haystack = `${user.name} ${user.email} ${user.username ?? ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [searchTerm, users]);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-30">
        <PageTitle eyebrow="Admin" title="Users" description="Manage every registered user and monitor their activity, wallet balance, and join date." />

        {statusMessage ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {statusMessage}
          </div>
        ) : null}

        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name or email"
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
            />
            <button onClick={() => void refreshData()} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
              <ArrowClockwise size={16} weight="bold" /> Refresh
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading && users.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No users match your search.</div>
          ) : (
            filteredUsers.map((user) => {
              const activity = getUserActivity(user.id);
              return (
                <div key={user.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-black text-slate-950">{user.name}</p>
                      <p className="mt-1 text-sm text-slate-500">@{user.username ?? user.id}</p>
                      <p className="mt-1 text-sm text-slate-600 truncate">{user.email}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end sm:ml-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                        {user.role ?? "customer"}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Wallet size={16} weight="fill" />
                        <span className="text-xs font-semibold">Balance</span>
                      </div>
                      <p className="mt-2 text-sm font-black text-slate-950">{money(Number(user.walletBalance ?? 0), getStoredCurrency())}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-slate-700">
                        <ShoppingCart size={16} weight="fill" />
                        <span className="text-xs font-semibold">Orders</span>
                      </div>
                      <p className="mt-2 text-sm font-black text-slate-950">{activity.orders}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-slate-700">
                        <CalendarDots size={16} weight="fill" />
                        <span className="text-xs font-semibold">Joined</span>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-slate-950">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminShell>
  );
}
