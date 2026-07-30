"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bell, ArrowRight, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Shell, PageTitle } from "@/components/shell";
import { getCurrentUser, getNotifications, getWalletTransactions } from "@/lib/api";
import { markNotificationsAsRead, type WalletTransaction } from "@/lib/wallet";
import { convertAmount, getStoredCurrency } from "@/lib/currency";

type RemoteNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  type: string;
  userId: string;
};

type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: "success" | "info";
  source: "wallet" | "message";
  createdAt: string;
};

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
  const tone: "success" | "info" = isDeposit ? "success" : "info";

  return {
    title,
    detail,
    time: item.time ? `${item.date} · ${item.time}` : item.date,
    tone,
  };
}

export default function NotificationsPage() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [messages, setMessages] = useState<RemoteNotification[]>([]);

  useEffect(() => {
    const syncNotifications = async () => {
      try {
        const response = await getCurrentUser();
        const currentUser = response?.user;
        if (!currentUser?.id) {
          setTransactions([]);
          setMessages([]);
          return;
        }

        const walletItems = await getWalletTransactions(String(currentUser.id));
        setTransactions(walletItems);

        try {
          const items = await getNotifications(String(currentUser.id));
          setMessages((items as RemoteNotification[]) || []);
        } catch {
          setMessages([]);
        }
      } catch {
        setTransactions([]);
        setMessages([]);
      }
    };

    void syncNotifications();
    window.addEventListener("joelink-account-updated", syncNotifications);
    window.addEventListener("joelink-notifications-updated", syncNotifications);
    window.addEventListener("storage", syncNotifications);

    return () => {
      window.removeEventListener("joelink-account-updated", syncNotifications);
      window.removeEventListener("joelink-notifications-updated", syncNotifications);
      window.removeEventListener("storage", syncNotifications);
    };
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      markNotificationsAsRead(transactions);
      window.dispatchEvent(new Event("joelink-account-updated"));
    }
  }, [transactions.length]);

  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      const latestId = messages[0]?.id ?? null;
      if (latestId) {
        window.localStorage.setItem("joelink-remote-notifications-last-seen", latestId);
      }
      window.dispatchEvent(new Event("joelink-account-updated"));
    }
  }, [messages]);

  const currency = getStoredCurrency();
  const notifications = useMemo<NotificationItem[]>(() => {
    const walletItems: NotificationItem[] = transactions.map((item) => {
      const amountValue = typeof item.amountValue === "number" && Number.isFinite(item.amountValue)
        ? item.amountValue
        : typeof item.amount === "number"
          ? item.amount
          : Number(String(item.amount).replace(/[^0-9.-]/g, ""));
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
        : String(item.amount);

      return {
        ...buildNotification(item),
        detail: `${item.type} via ${item.method} • ${amountText}`,
        source: "wallet",
        createdAt: item.createdAt ?? new Date().toISOString(),
        id: item.id,
      };
    });

    const messageItems: NotificationItem[] = messages.map((item) => ({
      id: item.id,
      title: item.title,
      detail: item.message,
      time: new Date(item.createdAt).toLocaleString(),
      tone: "info",
      source: "message",
      createdAt: item.createdAt,
    }));

    return [...walletItems, ...messageItems].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  }, [transactions, messages, currency]);

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <PageTitle
          eyebrow="Updates"
          title="Notifications"
          description="View your recent wallet activity, purchases, and admin updates in one place."
        />

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[#071426] text-white">
                <Bell size={20} weight="fill" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-950">Latest activity</h2>
                <p className="text-sm text-slate-500">You currently have {notifications.length} updates and messages.</p>
              </div>
            </div>
            <Link href="/wallet" className="inline-flex items-center gap-2 rounded-xl bg-[#a3f45f] px-4 py-2.5 text-center text-sm font-black text-black">
              Go to wallet <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {notifications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No updates yet. Wallet activity and admin messages will appear here automatically.
              </div>
            ) : (
              notifications.map((item) => (
                <article key={`${item.source}-${item.id}`} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 grid h-10 w-10 place-items-center rounded-2xl ${item.tone === "success" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"}`}>
                      <Sparkle size={18} weight="fill" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-950">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{item.detail}</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-400 sm:text-right">
                    <div>{item.time}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-slate-400">
                      {item.source === "message" ? "Admin update" : "Wallet update"}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </Shell>
  );
}
