"use client";

import AdminShell from "@/components/adminShell";
import { PageTitle } from "@/components/shell";

export default function AdminDepositsPage() {
  return (
    <AdminShell>
      <div className="px-4 py-6">
        <PageTitle eyebrow="Admin" title="Deposits" description="Review user deposits and wallet events." />
        <div className="rounded-2xl border border-slate-200 bg-white p-4">Deposits and transaction history here.</div>
      </div>
    </AdminShell>
  );
}
