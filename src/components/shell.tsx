"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CaretDown,
  House,
  Wallet as WalletIcon,
  ShoppingBagOpen,
  Storefront,
  Headset,
  SignOut,
  UserCircle,
  ArrowRight,
  
} from "@phosphor-icons/react/dist/ssr";
import { formatCurrency, getUnreadNotificationCount, getWalletState, type WalletTransaction } from "@/lib/wallet";
import { getStoredCurrency } from "@/lib/currency";
import { getCurrentUser, getNotifications, logoutUser } from "@/lib/api";

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
  const [balance, setBalance] = useState(0);
  const [notifications, setNotifications] = useState<WalletTransaction[]>([]);
  const [remoteNotifications, setRemoteNotifications] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const hideShellExtras = pathname === "/login" || pathname === "/register";

  const unreadCount = useMemo(() => {
    const walletUnread = getUnreadNotificationCount(notifications);
    const lastSeenRemoteId = typeof window !== "undefined"
      ? window.localStorage.getItem("joelink-remote-notifications-last-seen")
      : null;

    if (!remoteNotifications.length) {
      return walletUnread;
    }

    if (!lastSeenRemoteId) {
      return walletUnread + remoteNotifications.length;
    }

    const unseenRemote = remoteNotifications.filter((item) => item.id !== lastSeenRemoteId).length;
    return walletUnread + unseenRemote;
  }, [notifications, remoteNotifications]);

  useEffect(() => {
    const syncState = async () => {
      try {
        const me = await getCurrentUser();
        const user = me?.user;
        const accountCreated = Boolean(user || window.localStorage.getItem("joelink-account-created") === "true");
        setHasAccount(accountCreated);
        if (accountCreated && user) {
          const wallet = getWalletState();
          setBalance(wallet.balance);
          setNotifications(wallet.transactions);
          try {
            const items = await getNotifications(user.id);
            setRemoteNotifications(items || []);
          } catch {
            setRemoteNotifications([]);
          }
          return;
        }
      } catch {
        // fall back to local storage state below
      }

      const accountCreated = window.localStorage.getItem("joelink-account-created") === "true";
      setHasAccount(accountCreated);
      if (accountCreated) {
        const wallet = getWalletState();
        setBalance(wallet.balance);
        setNotifications(wallet.transactions);

        const currentUserId = window.localStorage.getItem("joelink-account-user-id") || "user_2";
        try {
          const items = await getNotifications(currentUserId);
          setRemoteNotifications(items || []);
        } catch {
          setRemoteNotifications([]);
        }
      } else {
        setBalance(0);
        setNotifications([]);
        setRemoteNotifications([]);
      }
    };

    void syncState();
    window.addEventListener("joelink-account-updated", syncState);
    window.addEventListener("joelink-notifications-updated", syncState);
    window.addEventListener("storage", syncState);
    return () => {
      window.removeEventListener("joelink-account-updated", syncState);
      window.removeEventListener("joelink-notifications-updated", syncState);
      window.removeEventListener("storage", syncState);
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
            <div className="flex items-center gap-2 sm:gap-3">
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
                    href="/wallet"
                    className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 sm:flex"
                  >
                    <WalletIcon size={16} weight="bold" className="text-[#0f766e]" />
                    <span>{formatCurrency(balance, getStoredCurrency())}</span>
                  </Link>

                  <div className="relative">
                    <Link
                      href="/notifications"
                      className="relative grid h-9 w-9 place-items-center rounded-full  p-1.5 shadow bg-slate-50 text-slate-700 transition"
                      aria-label="Notifications"
                    >
                      <Bell size={18} weight="fill" />
                      {unreadCount > 0 && (
                        <span className="absolute right-1 top-1 min-h-4 min-w-4 rounded-full bg-[#a3f45f]  px-1 text-[10px] font-black text-black">
                          {Math.min(unreadCount, 9)}
                        </span>
                      )}
                    </Link>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMenuOpen((prev) => !prev)}
                      className="flex items-center gap-2 rounded-full p-1.5 pr-3 shadow text-sm font-semibold text-slate-700 transition"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#071426] text-[10px] font-black text-[#a3f45f] shadow-sm">
                        JD
                      </span>
                      <span className="hidden sm:block">Profile</span>
                      <CaretDown size={14} weight="bold" />
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 top-12 z-40 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                        <Link href="/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>
                          <UserCircle size={16} weight="fill" className="text-[#0f766e]" />
                          My profile
                        </Link>
                        <Link href="/profile#wishlist" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>
                          <ShoppingBagOpen size={16} weight="fill" className="text-[#0f766e]" />
                          My wishlist
                        </Link>
                        <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={async () => {
                          try {
                            await logoutUser();
                          } catch {
                            // ignore and proceed with local cleanup
                          }
                          window.localStorage.removeItem("joelink-account-created");
                          window.localStorage.removeItem("joelink-account-role");
                          window.localStorage.removeItem("joelink-account-user-id");
                          window.localStorage.removeItem("joelink-account-name");
                          window.localStorage.removeItem("joelink-account-email");
                          window.localStorage.removeItem("joelink-account-password");
                          window.dispatchEvent(new Event("joelink-account-updated"));
                          setMenuOpen(false);
                        }}>
                          <SignOut size={16} weight="bold" className="text-[#0f766e]" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
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
        <p className="mt-2 max-w-2xl text-slate-500 text-sm">{description}</p>
      )}
    </div>
  );
}
