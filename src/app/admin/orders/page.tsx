"use client";

import AdminShell from "@/components/adminShell";
import { PageTitle } from "@/components/shell";

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <div className="px-4 py-6">
        <PageTitle eyebrow="Admin" title="Orders" description="View and manage customer orders." />
        <div className="rounded-2xl border border-slate-200 bg-white p-4">Orders management coming soon.</div>
      </div>
    </AdminShell>
  );
}
