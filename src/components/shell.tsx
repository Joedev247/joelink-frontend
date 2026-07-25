"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  House,
  Wallet as WalletIcon,
  ShoppingBagOpen,
  Storefront,
  Headset,
} from "@phosphor-icons/react/dist/ssr";

const nav = [
  {
    href: "/",
    icon: <House size={20} weight="bold" key="home-icon" />,
    label: "Home",
  },
  {
    href: "/products",
    icon: <Storefront size={20} weight="bold" key="products-icon" />,
    label: "Accounts",
  },
  {
    href: "/wallet",
    icon: <WalletIcon size={22} weight="bold" key="wallet-icon" />,
    label: "Wallet",
  },
  {
    href: "/orders",
    icon: <ShoppingBagOpen size={22} weight="bold" key="orders-icon" />,
    label: "Orders",
  },
  {
    href: "/support",
    icon: <Headset size={20} weight="bold" key="support-icon" />,
    label: "Support",
  },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hasAccount, setHasAccount] = useState(false);
  const hideShellExtras = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    const syncAccount = () =>
      setHasAccount(
        window.localStorage.getItem("joelink-account-created") === "true",
      );
    syncAccount();
    window.addEventListener("joelink-account-updated", syncAccount);
    window.addEventListener("storage", syncAccount);
    return () => {
      window.removeEventListener("joelink-account-updated", syncAccount);
      window.removeEventListener("storage", syncAccount);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      {!hideShellExtras && (
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
          <div className="mx-auto flex h-[62px] max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <Image
                src="/joelinklogo.png"
                alt="JoeLink Digital"
                width={200}
                height={50}
                priority
                className="h-12 w-auto object-contain"
              />
            </Link>
            <nav className="hidden items-center gap-0.5 rounded-xl border border-slate-200 bg-slate-50/80 p-0.5 md:flex">
              {nav.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${pathname === href ? "nav-active text-[#09120b] shadow-sm" : "text-slate-500 hover:bg-white/70 hover:text-slate-900"}`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              {!hasAccount ? (
                <div className="auth-switcher flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                  <Link
                    href="/login"
                    className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold transition ${pathname === "/login" ? "nav-active text-[#09120b] shadow-sm" : "text-black/70 hover:text-slate-900"}`}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className={`rounded-md px-2.5 py-1.5 text-[11px] bg-[#a3f45f] font-bold transition ${pathname === "/register" ? "nav-active text-[#09120b] shadow-sm" : "text-black/70 hover:text-slate-900"}`}
                  >
                    Create account
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    href="/orders"
                    className="hidden text-xs font-bold text-slate-500 hover:text-[#1a73e8] sm:block"
                  >
                    My dashboard
                  </Link>
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#071426] text-[10px] font-black text-[#a3f45f] shadow-sm">
                    JD
                  </span>
                </>
              )}
            </div>
          </div>
        </header>
      )}
      <main>{children}</main>
      {!hideShellExtras && (
        <>
          <nav className="fixed bottom-4 left-1/2 z-30 w-[min(96%,720px)] -translate-x-1/2 md:hidden ">
            <div className="relative">
              <div className="flex items-center justify-between rounded-full bg-[#071426]/95 px-4 py-3 shadow-lg">
                {nav.map(({ href, icon, label }, idx) => (
                  <div key={href} className="flex-1">
                    {idx === 2 ? (
                      <div className="h-10" />
                    ) : (
                      <Link
                        href={href}
                        className={`flex flex-col items-center gap-0.5 py-1 text-[11px] font-semibold text-slate-400 transition ${pathname === href ? "text-[#a3f45f]" : "text-slate-400"}`}
                      >
                        <span className="text-lg">{icon}</span>
                        <span className="text-[10px]">{label}</span>
                        {pathname === href && (
                          <span className="mt-1 h-1 w-6 rounded-full bg-[#3be06a]" />
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                <Link
                  href={nav[2].href}
                  className="relative flex items-center justify-center"
                >
                  <div className="h-14 w-14 rounded-full bg-[#a3f45f]  p-0.5 shadow-[0_12px_30px_rgba(163,244,95,0.18)]">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white/10 text-black text-xl font-black">
                      {nav[2].icon}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </nav>
          <footer className="hidden border-t border-slate-200 bg-white md:block">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-8 text-sm text-slate-500">
              <span>© 2026 JoeLink Digital</span>
              <span>Secure delivery · 24/7 support · Buyer protection</span>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-9">
      <div className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#1a73e8]">
        {eyebrow}
      </div>
      <h1 className="text-xl font-black tracking-tight text-slate-950 md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-2xl text-slate-500 text-sm">{description}</p>
      )}
    </div>
  );
}
