"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/adminShell";
import { PageTitle } from "@/components/shell";
import { createNotification, getNotifications, getUsers } from "@/lib/api";
import { BellRinging, PaperPlaneTilt, UserCircle } from "@phosphor-icons/react/dist/ssr";

type NotificationItem = {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
};

type UserOption = {
  id: string;
  name: string;
  email: string;
};

const emptyForm = {
  userId: "all",
  title: "",
  message: "",
  type: "info",
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = async () => {
    try {
      const [items, userItems] = await Promise.all([getNotifications(), getUsers()]);
      setNotifications(items as NotificationItem[]);
      setUsers((userItems as any[]).map((user) => ({ id: user.id, name: user.name, email: user.email })));
    } catch {
      setStatusMessage({ type: "error", text: "Unable to load notifications right now." });
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      await createNotification({
        userId: form.userId,
        title: form.title,
        message: form.message,
        type: form.type,
      });
      window.localStorage.setItem("joelink-notifications-sync", `${Date.now()}`);
      window.dispatchEvent(new Event("joelink-notifications-updated"));
      window.dispatchEvent(new Event("joelink-account-updated"));
      setForm(emptyForm);
      setStatusMessage({ type: "success", text: form.userId === "all" ? "Notification broadcast sent." : "Notification sent to the selected user." });
      await loadData();
    } catch {
      setStatusMessage({ type: "error", text: "Unable to send notification." });
    } finally {
      setLoading(false);
    }
  };

  const summary = useMemo(() => ({
    total: notifications.length,
    broadcasts: notifications.filter((item) => item.userId === "all").length,
    targeted: notifications.filter((item) => item.userId !== "all").length,
  }), [notifications]);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-30">
        <PageTitle eyebrow="Admin" title="Notifications" description="Broadcast updates to all users or send targeted alerts to a specific user." />

        {statusMessage ? (
          <div className={`mb-6 rounded-2xl px-4 py-3 text-sm font-semibold ${statusMessage.type === "success" ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-rose-200 bg-rose-50 text-rose-700"}`}>
            {statusMessage.text}
          </div>
        ) : null}

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Total</p>
            <p className="mt-2 text-xl font-black text-slate-950">{summary.total}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Broadcasts</p>
            <p className="mt-2 text-xl font-black text-slate-950">{summary.broadcasts}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Targeted</p>
            <p className="mt-2 text-xl font-black text-slate-950">{summary.targeted}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#a3f45f]/20 text-[#0f766e]">
                <BellRinging size={20} weight="fill" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1a73e8]">Compose</p>
                <p className="mt-1 text-base font-black text-slate-950">Send a new notification</p>
              </div>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-slate-700">
                Recipients
                <select
                  value={form.userId}
                  onChange={(event) => setForm((prev) => ({ ...prev, userId: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                >
                  <option value="all">All users</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Message type
                <select
                  value={form.type}
                  onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="discount">Discount</option>
                  <option value="security">Security</option>
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Title
                <input
                  required
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                  placeholder="New discount available"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Message
                <textarea
                  required
                  value={form.message}
                  onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                  className="mt-2 min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                  placeholder="Tell users what they need to know"
                />
              </label>

              <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-2xl bg-[#a3f45f] px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-[#94dc4d] disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? "Sending..." : "Send notification"}
                <PaperPlaneTilt size={16} weight="bold" />
              </button>
            </form>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#e0f2fe] text-[#0369a1]">
                <UserCircle size={20} weight="fill" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1a73e8]">History</p>
                <p className="mt-1 text-base font-black text-slate-950">Recent admin messages</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No messages yet.</div>
              ) : (
                notifications.slice(0, 8).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-slate-950 truncate">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-600 line-clamp-2">{item.message}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {item.userId === "all" ? "All users" : "Targeted"}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-500">
                      <span className="capitalize">{item.type}</span>
                      <span className="text-right">{new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
