"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bank, CreditCard, Phone, CheckCircle, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { Shell, PageTitle } from "@/components/shell";
import { addWalletDeposit, formatCurrency, getWalletState } from "@/lib/wallet";
import { getStoredCurrency } from "@/lib/currency";
import { createWalletDeposit } from "@/lib/api";

export default function WalletAddFundsPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [balance, setBalance] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"Card" | "MOMO">("Card");
  const [amountInput, setAmountInput] = useState("100");
  const [network, setNetwork] = useState("MTN MOMO");
  const [depositState, setDepositState] = useState<"idle" | "processing" | "success">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const syncWallet = () => {
      const accountCreated = window.localStorage.getItem("joelink-account-created") === "true";
      setHasAccount(accountCreated);

      if (accountCreated) {
        setBalance(getWalletState().balance);
      } else {
        setBalance(0);
      }
    };

    syncWallet();
    setIsHydrated(true);
    window.addEventListener("joelink-account-updated", syncWallet);
    window.addEventListener("storage", syncWallet);

    return () => {
      window.removeEventListener("joelink-account-updated", syncWallet);
      window.removeEventListener("storage", syncWallet);
    };
  }, []);

  const amount = Number(amountInput);
  const amountValid = Number.isFinite(amount) && amount > 0;

  function handleDeposit() {
    if (!amountValid) {
      setError("Enter a valid amount to continue.");
      return;
    }

    setError("");
    setDepositState("processing");

    window.setTimeout(() => {
      void (async () => {
        const depositLabel = paymentMethod === "MOMO" ? `Mobile money (${network})` : "Card";

        try {
          await createWalletDeposit({
            userId: "user_2",
            type: "deposit",
            amount,
            description: depositLabel,
          });
        } catch {
          // fall back to local wallet update if the backend is unavailable
        }

        const nextState = addWalletDeposit(amount, depositLabel);
        setBalance(nextState.balance);
        window.dispatchEvent(new Event("joelink-account-updated"));
        setDepositState("success");
      })();
    }, 1100);
  }

  if (!isHydrated) {
    return null;
  }

  return (
    <Shell>
      <div className="mx-auto w-full px-4 py-8 sm:max-w-2xl sm:px-6 lg:max-w-3xl lg:px-8 mb-30">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-slate-700">
            <Link href="/wallet" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950">
              <ArrowLeft size={18} weight="bold" />
              Back to wallet
            </Link>
          </div>
        </div>

        <PageTitle
          eyebrow="Wallet"
          title="Add funds"
          description="Choose a payment method, enter your deposit amount, and complete the top-up securely."
        />

        {!hasAccount ? (
          <section className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">Account required</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Sign in to add funds</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              You need an active JoeLink account before adding money to your wallet.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/login" className="rounded-xl bg-[#a3f45f] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:bg-[#86c85d]">
                Log in
              </Link>
              <Link href="/register" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-700 transition hover:bg-slate-100">
                Create account
              </Link>
            </div>
          </section>
        ) : (
          <div className="space-y-6">
            <section className="rounded-2xl bg-[#a3f45f] p-5 text-black shadow-lg sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-black/90">Balance</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-3xl font-black tracking-tight sm:text-4xl">{formatCurrency(balance, getStoredCurrency())}</p>
                    <span className="text-sm uppercase tracking-widest text-black/80">{getStoredCurrency()}</span>
                  </div>
                </div>
                <p className="text-right text-xs uppercase tracking-widest text-black">
                  {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-4">
                <div className="flex items-center justify-between rounded-2xl bg-black/80 px-4 py-3 text-white">
                  <span className="text-sm font-black uppercase tracking-[0.18em]">Instant top-up</span>
                  <span className="text-sm uppercase tracking-[0.18em] text-slate-200">
                    {paymentMethod === "Card" ? "Card" : "MOMO"}
                  </span>
                </div>

                <div className="flex flex-row flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Card")}
                    className={`inline-flex min-w-[calc(50%-0.75rem)] flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-black uppercase tracking-[0.14em] transition ${
                      paymentMethod === "Card" ? "bg-black text-white" : "bg-white text-slate-900 shadow-sm hover:bg-slate-100"
                    }`}
                  >
                    <Bank size={16} weight="bold" />
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("MOMO")}
                    className={`inline-flex min-w-[calc(50%-0.75rem)] flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-black uppercase tracking-[0.14em] transition ${
                      paymentMethod === "MOMO" ? "bg-black text-white" : "bg-white text-slate-900 shadow-sm hover:bg-slate-100"
                    }`}
                  >
                    <Phone size={16} weight="bold" />
                    MOMO
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-5 shadow-xl sm:p-6">
              <div className="grid gap-4">
                {paymentMethod === "MOMO" ? (
                  <div className="grid gap-4">
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                      Mobile number
                      <input
                        type="text"
                        placeholder="+234 801 234 5678"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-950 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                      Network
                      <select
                        value={network}
                        onChange={(event) => setNetwork(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-950 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                      >
                        <option>MTN MOMO</option>
                        <option>Orange Money</option>
                       
                      </select>
                    </label>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                      Card number
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-950 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                      />
                    </label>
                    <div className="flex flex-row flex-wrap gap-3">
                      <label className="block min-w-[calc(50%-0.75rem)] flex-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        Expiry date
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-950 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                        />
                      </label>
                      <label className="block min-w-[calc(50%-0.75rem)] flex-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        CVC
                        <input
                          type="text"
                          placeholder="123"
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-950 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                        />
                      </label>
                    </div>
                  </div>
                )}

                <div className="grid gap-4">
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                    Amount
                    <input
                      type="number"
                      min="1"
                      value={amountInput}
                      onChange={(event) => setAmountInput(event.target.value)}
                      placeholder="$100.00"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-950 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                    />
                  </label>
                  {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                 
                  <button
                    type="button"
                    onClick={handleDeposit}
                    className="inline-flex items-center justify-center rounded-xl bg-[#a3f45f] px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:bg-[#86c85d] mt-7"
                  >
                    {depositState === "processing" ? (
                      <>
                        <CircleNotch size={18} weight="bold" className="mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Continue to pay"
                    )}
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {depositState !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 px-4 pb-6 pt-24 sm:px-6">
          <div className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_100px_rgba(15,118,110,0.16)]">
            <div className="rounded-[2rem] bg-[#f8fdfa] p-8 text-center">
              {depositState === "processing" ? (
                <>
                  <div className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-full bg-[#a3f45f] text-black shadow-inner">
                    <CircleNotch size={40} weight="bold" className="animate-spin" />
                  </div>
                  <h2 className="text-xl font-black text-slate-950">Processing...</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Your payment is being confirmed. Please wait while we update your wallet.
                  </p>
                </>
              ) : (
                <>
                  <div className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-full bg-[#a3f45f] text-black shadow-[0_15px_30px_rgba(15,118,110,0.24)]">
                    <CheckCircle size={44} weight="bold" />
                  </div>
                  <h2 className="text-xl font-black text-slate-950">Payment complete</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Your wallet has been topped up successfully. The amount is now available in your balance.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setDepositState("idle");
                      router.push("/wallet");
                    }}
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#a3f45f] px-6 py-3 text-sm font-black text-black shadow-[0_12px_30px_rgba(15,118,110,0.28)] transition"
                  >
                    Back to wallet
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
