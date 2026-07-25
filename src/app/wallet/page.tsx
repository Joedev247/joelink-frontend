"use client";

import { useState } from "react";
import { Shell, PageTitle } from "@/components/shell";

const transactions = [
  {
    id: "1",
    type: "Deposit",
    method: "Add fund",
    amount: "+$120.00",
    status: "Completed",
    date: "Jul 22",
  },
  {
    id: "2",
    type: "Deposit",
    method: "Add fund",
    amount: "+$45.00",
    status: "Completed",
    date: "Jul 20",
  },
  {
    id: "3",
    type: "Purchase",
    method: "Order",
    amount: "-$32.50",
    status: "Pending",
    date: "Jul 21",
  },
];

export default function WalletPage() {
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [paymentFormType, setPaymentFormType] = useState<"Card" | "MOMO">("Card");

  return (
    <Shell>
      <div className="mx-auto w-full px-4 py-8 sm:max-w-2xl sm:px-6 lg:max-w-3xl lg:px-8 mb-30">
        <PageTitle
          eyebrow="Your account"
          title="Wallet"
          description="Manage balance, add funds, and track transactions."
        />

        {/* Balance Card */}
        <section className="rounded-2xl bg-[#a3f45f]  p-5 text-black shadow-lg sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-black/90">Balance</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-black tracking-tight sm:text-4xl">$0.00</p>
                <span className="text-sm uppercase tracking-widest text-black/80">USD</span>
              </div>
            </div>
            <p className="text-right text-xs uppercase tracking-widest text-black">
              {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </p>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setShowAddFundsModal(true)}
              className="w-full rounded-lg bg-black/80 px-4 py-2 text-sm font-bold text-white transition sm:px-5 sm:py-3"
            >
              Add funds
            </button>
          </div>
        </section>

        {/* Payment Options */}
        {/* Transaction History */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-6">
          <h2 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">Transactions</h2>

          <div className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
                {/* Top Row: Type (left) + Status (right) */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-bold text-slate-950">{tx.type}</p>
                    <p className="text-xs text-slate-500">{tx.method}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
                    tx.status === "Pending"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {tx.status}
                  </span>
                </div>

                {/* Bottom Row: Amount (left) + Date (right) */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200/50">
                  <p className="text-base font-black text-slate-950">{tx.amount}</p>
                  <p className="text-xs text-slate-500">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Add funds</p>
                <h3 className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">Choose payment type</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddFundsModal(false)}
                className="text-2xl font-bold text-slate-400 transition hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentFormType("Card")}
                className={`rounded-3xl border px-4 py-3 text-left transition ${
                  paymentFormType === "Card"
                    ? "border-[#0f766e] bg-[#ecfdf5]"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <p className="text-sm font-black text-slate-950">Bank / Card</p>
                <p className="mt-1 text-xs text-slate-500">Visa, Mastercard, Verve</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentFormType("MOMO")}
                className={`rounded-3xl border px-4 py-3 text-left transition ${
                  paymentFormType === "MOMO"
                    ? "border-[#0f766e] bg-[#ecfdf5]"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <p className="text-sm font-black text-slate-950">E-Payment</p>
                <p className="mt-1 text-xs text-slate-500">MTN MOMO, Airtel, Gcash</p>
              </button>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">Payment details</p>
                  <p className="mt-2 text-sm text-slate-700">Fill in the form below to complete your top-up.</p>
                </div>
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
                  {paymentFormType}
                </span>
              </div>

              {paymentFormType === "Card" ? (
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Card number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Expiry date</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Amount</label>
                    <input
                      type="text"
                      placeholder="$100.00"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Mobile number</label>
                    <input
                      type="text"
                      placeholder="+234 801 234 5678"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Network</label>
                    <select className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10">
                      <option>MTN MOMO</option>
                      <option>Airtel</option>
                      <option>Gcash</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Amount</label>
                    <input
                      type="text"
                      placeholder="$100.00"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setShowAddFundsModal(false)}
                className="rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-3xl bg-[#a3f45f]  px-4 py-3 text-sm font-black text-white transition hover:bg-[#0a5c52]"
              >
                Continue to pay
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
