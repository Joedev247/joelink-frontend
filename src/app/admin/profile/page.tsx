"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/adminShell";
import { PageTitle } from "@/components/shell";

export default function AdminProfilePage() {
  const [adminUser, setAdminUser] = useState({ name: "Admin", email: "admin@joelink.test" });

  useEffect(() => {
    const role = typeof window !== "undefined" ? window.localStorage.getItem("joelink-account-role") : null;
    if (role !== "admin") {
      window.location.href = "/login";
    }
  }, []);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-30">
        <PageTitle eyebrow="Admin" title="Admin profile" description="Manage your admin access, notifications, and quick links." />

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1a73e8]">Profile</p>
              <h2 className="mt-3 text-2xl font-black text-slate-950">{adminUser.name}</h2>
              <p className="mt-1 text-sm text-slate-600">{adminUser.email}</p>
            </div>
            <button className="rounded-3xl bg-[#071426] px-5 py-3 text-sm font-black text-white hover:bg-slate-900">Update profile</button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">Role</p>
              <p className="mt-2 text-lg font-black text-slate-950">Administrator</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">Access</p>
              <p className="mt-2 text-lg font-black text-slate-950">Full app management</p>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
