"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/shell";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Simple dev-side admin detection: exact match sends to admin
    const isAdmin = email === "admin@joelink.test" && password === "admin";
    window.localStorage.setItem("joelink-account-created", "true");
    window.localStorage.setItem("joelink-account-role", isAdmin ? "admin" : "customer");
    window.dispatchEvent(new Event("joelink-account-updated"));
    if (isAdmin) {
      router.push("/admin");
    } else {
      router.push("/");
    }
  }

  return (
    <Shell>
      <div className="min-h-screen bg-slate-50 px-0 py-0 flex flex-col justify-end">
        <div className="w-full">
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl">
            <div className="bg-[#a3f45f]  px-6 py-8 text-white sm:px-8">
              <h1 className="text-3xl text-center text-black/70 font-black tracking-tight ">Welcome back</h1>
            </div>

            <div className="border-t border-slate-200 bg-white px-6 py-7 sm:px-8">
              <form className="space-y-4" onSubmit={handleLogin}>
                <label className="block text-sm font-semibold text-slate-900">
                  Email
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="you@example.com"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-900">
                  Password
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="••••••••"
                  />
                </label>
                <button className="w-full rounded-xl bg-[#a3f45f]  px-5 py-3.5 text-sm font-black text-black transition ">
                  Sign in
                </button>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span className="font-semibold uppercase tracking-[0.24em]">or sign in with </span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition bg-slate-50"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center">
                    <svg viewBox="0 0 18 18" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.24-.17-1.82H9v3.44h4.84c-.21 1.11-.84 2.05-1.8 2.69v2.24h2.92c1.71-1.57 2.7-3.89 2.7-6.55z"/>
                      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.17l-2.92-2.24c-.81.54-1.85.86-3.04.86-2.34 0-4.33-1.58-5.04-3.7H.98v2.32C2.47 15.72 5.52 18 9 18z"/>
                      <path fill="#FBBC05" d="M3.96 10.75c-.18-.54-.28-1.12-.28-1.75s.1-1.21.28-1.75V4.93H.98C.35 6.34 0 7.9 0 9.5c0 1.6.35 3.16.98 4.57l2.98-2.32z"/>
                      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.43 1.33l2.57-2.57C13.43.97 11.43 0 9 0 5.52 0 2.47 2.28.98 4.93l2.98 2.32C4.67 5.15 6.66 3.58 9 3.58z"/>
                    </svg>
                  </span>
                   Google
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-500">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-semibold text-slate-900 hover:text-slate-700">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
