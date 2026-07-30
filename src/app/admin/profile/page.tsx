"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/adminShell";
import { PageTitle } from "@/components/shell";
import { getCurrentUser, getUsers, updateUser } from "@/lib/api";
import { ShieldCheck, UserCircle, Lock, ArrowRight } from "@phosphor-icons/react/dist/ssr";

type AdminProfileState = {
  id: string;
  name: string;
  email: string;
  password: string;
};

type StatusMessage = {
  type: "success" | "error";
  text: string;
} | null;

export default function AdminProfilePage() {
  const [adminUser, setAdminUser] = useState<AdminProfileState>({ id: "user_1", name: "Admin", email: "admin@joelink.test", password: "admin" });
  const [form, setForm] = useState({ name: "", email: "", currentPassword: "", newPassword: "", confirmPassword: "" });
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const syncProfile = async () => {
      if (typeof window === "undefined") return;
      try {
        const me = await getCurrentUser();
        const currentUser = me?.user;
        if (!currentUser || currentUser.role !== "admin") {
          window.location.href = "/login";
          return;
        }

        const storedId = window.localStorage.getItem("joelink-account-user-id") || currentUser.id;
        const storedName = window.localStorage.getItem("joelink-account-name") || currentUser.name || "Admin";
        const storedEmail = window.localStorage.getItem("joelink-account-email") || currentUser.email || "admin@joelink.test";
        const storedPassword = window.localStorage.getItem("joelink-account-password") || "";

        const users = await getUsers();
        const backendAdmin = users.find((user: any) => String(user.id) === String(storedId)) || users.find((user: any) => user.role === "admin");
        const resolvedName = backendAdmin?.name || storedName || "Admin";
        const resolvedEmail = backendAdmin?.email || storedEmail || "admin@joelink.test";
        const resolvedPassword = backendAdmin?.password || storedPassword || "";

        const nextAdmin = { id: String(backendAdmin?.id || storedId), name: resolvedName, email: resolvedEmail, password: resolvedPassword };
        setAdminUser(nextAdmin);
        setForm((prev) => ({ ...prev, name: resolvedName, email: resolvedEmail }));
      } catch {
        const storedId = window.localStorage.getItem("joelink-account-user-id") || "user_1";
        const storedName = window.localStorage.getItem("joelink-account-name") || "Admin";
        const storedEmail = window.localStorage.getItem("joelink-account-email") || "admin@joelink.test";
        const storedPassword = window.localStorage.getItem("joelink-account-password") || "";
        setAdminUser({ id: storedId, name: storedName, email: storedEmail, password: storedPassword });
        setForm((prev) => ({ ...prev, name: storedName, email: storedEmail }));
      }
    };

    void syncProfile();
  }, []);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (typeof window === "undefined") return;

    const nextName = form.name.trim() || adminUser.name;
    const nextEmail = form.email.trim() || adminUser.email;

    if (!nextName || !nextEmail) {
      setStatusMessage({ type: "error", text: "Please provide both your name and email." });
      return;
    }

    if (form.newPassword) {
      if (!form.currentPassword) {
        setStatusMessage({ type: "error", text: "Enter your current password before changing it." });
        return;
      }
      if (form.currentPassword !== adminUser.password) {
        setStatusMessage({ type: "error", text: "The current password you entered is incorrect." });
        return;
      }
      if (form.newPassword.length < 6) {
        setStatusMessage({ type: "error", text: "New password must be at least 6 characters." });
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        setStatusMessage({ type: "error", text: "New password and confirmation do not match." });
        return;
      }
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const nextPassword = form.newPassword || adminUser.password;
      const nextAdmin = { id: adminUser.id, name: nextName, email: nextEmail, password: nextPassword };

      await updateUser(nextAdmin.id, { name: nextName, email: nextEmail, password: nextPassword, role: "admin" });

      window.localStorage.setItem("joelink-account-name", nextName);
      window.localStorage.setItem("joelink-account-email", nextEmail);
      window.localStorage.setItem("joelink-account-password", nextPassword);
      window.dispatchEvent(new Event("joelink-account-updated"));

      setAdminUser(nextAdmin);
      setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      setStatusMessage({ type: "success", text: form.newPassword ? "Profile updated and password changed successfully." : "Profile updated successfully." });
    } catch {
      setStatusMessage({ type: "error", text: "Unable to save your changes right now." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell>
      <div className="mx-auto mb-24 max-w-5xl px-3 py-6 sm:px-6 lg:px-8">
        <PageTitle eyebrow="Admin" title="Profile" description="Manage your account details and password in one clean place." />

        {statusMessage ? (
          <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${statusMessage.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
            {statusMessage.text}
          </div>
        ) : null}

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#a3f45f]/20 text-[#0f766e]">
                <UserCircle size={24} weight="fill" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1a73e8]">Admin account</p>
                <h2 className="truncate text-lg font-black text-slate-950">{adminUser.name}</h2>
                <p className="truncate text-sm text-slate-500">{adminUser.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">Administrator</span>
              <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0f766e]">Active</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Profile</p>
                <h3 className="mt-1 text-base font-black text-slate-950">Personal details</h3>
              </div>
              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                Update
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Role</p>
                <p className="mt-1 text-sm font-black text-slate-950">Full access</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Access</p>
                <p className="mt-1 text-sm font-black text-slate-950">Products, orders, users</p>
              </div>
            </div>

            <form className="mt-4 space-y-3" onSubmit={handleSave}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Full name
                  <input
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                  />
                </label>
              </div>

              <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#a3f45f] px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-[#94dc4d] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">
                {loading ? "Saving..." : "Save profile"}
                <ArrowRight size={16} weight="bold" />
              </button>
            </form>
          </section>

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ecfdf5] text-[#0f766e]">
                <Lock size={20} weight="fill" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-950">Security</h3>
                <p className="text-sm text-slate-500">Change your password securely.</p>
              </div>
            </div>

            <form className="mt-4 space-y-3" onSubmit={handleSave}>
              <label className="block text-sm font-semibold text-slate-700">
                Current password
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={(event) => setForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                  placeholder="Enter current password"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                New password
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(event) => setForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                  placeholder="At least 6 characters"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Confirm password
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                  placeholder="Re-enter password"
                />
              </label>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <ShieldCheck size={16} weight="fill" className="mt-0.5 shrink-0 text-[#0f766e]" />
                  <span>Changing your password updates your admin login access immediately.</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">
                {loading ? "Updating..." : "Change password"}
                <ArrowRight size={16} weight="bold" />
              </button>
            </form>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
