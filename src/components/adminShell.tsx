"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { House, PlusCircle, ShoppingCart, Bank, Bell, UserCircle, CaretDown, Receipt } from "@phosphor-icons/react/dist/ssr";
import { getNotifications } from "@/lib/api";
import { getWalletState } from "@/lib/wallet";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [balance, setBalance] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const role = typeof window !== "undefined" ? window.localStorage.getItem("joelink-account-role") : null;
    if (role !== "admin") {
      router.replace("/login");
      return;
    }

    setIsAdmin(true);
    const wallet = getWalletState();
    setBalance(wallet.balance);

    void fetchNotifications();
  }, [router]);

  async function fetchNotifications() {
    try {
      const items = await getNotifications();
      setNotifications(items);
    } catch {
      setNotifications([]);
    }
  }

  if (!isAdmin) return null;

  const bottomNav = [
    { href: "/admin", label: "Home", icon: <House size={20} weight="bold" /> },
    { href: "/admin/add-product", label: "Add", icon: <PlusCircle size={20} weight="bold" /> },
    { href: "/admin/transactions", label: "Txn", icon: <Receipt size={22} weight="bold" /> },
    { href: "/admin/orders", label: "Orders", icon: <ShoppingCart size={20} weight="bold" /> },
    { href: "/admin/deposits", label: "Deposits", icon: <Bank size={20} weight="bold" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[62px] max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <Link href="/admin" className="flex shrink-0 items-center gap-2.5">
            <Image src="/joelinklogo.png" alt="JoeLink" width={160} height={40} priority className="h-10 w-auto object-contain" />
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setNotifOpen((prev) => !prev);
                if (!notifOpen) {
                  void fetchNotifications();
                }
              }}
              className="relative grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:bg-slate-100"
              aria-label="Admin notifications"
            >
              <Bell size={20} weight="fill" />
              {notifications.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#a3f45f] px-1.5 text-[10px] font-black text-slate-950">
                  {Math.min(notifications.length, 99)}
                </span>
              )}
            </button>

            <div className="relative">
              <button onClick={() => setMenuOpen((p) => !p)} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#071426] text-[10px] font-black text-[#a3f45f]">AD</span>
                <span className="hidden sm:block">Admin profile</span>
                <CaretDown size={14} weight="bold" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-14 z-40 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <Link href="/admin/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <UserCircle size={16} weight="fill" /> Admin settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      window.localStorage.removeItem("joelink-account-role");
                      window.localStorage.removeItem("joelink-account-created");
                      router.push("/");
                    }}
                    className="w-full text-left rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {notifOpen && (
          <div className="absolute inset-x-0 top-[62px] z-40 mx-auto max-w-7xl px-5 lg:px-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
              <div className="flex items-center justify-between gap-3 pb-4">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#1a73e8]">Notifications</p>
                <button type="button" className="text-xs font-semibold text-slate-500" onClick={() => setNotifOpen(false)}>
                  Close
                </button>
              </div>
              {notifications.length === 0 ? (
                <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">No recent notifications yet.</p>
              ) : (
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-900">{notification.title}</p>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{notification.type}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{notification.message}</p>
                      <p className="mt-3 text-[11px] text-slate-400">{new Date(notification.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>

      <nav className="fixed bottom-4 left-1/2 z-30 w-[min(96%,720px)] -translate-x-1/2 md:hidden">
        <div className="relative">
          <div className="grid grid-cols-5 gap-2 rounded-full bg-[#071426]/95 px-3 py-3 shadow-lg">
            {bottomNav.map((item, index) => {
              const active = pathname === item.href;
              const isCenter = index === 2;
              if (isCenter) {
                return <div key={item.href} className="flex items-center justify-center" />;
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 rounded-3xl text-[10px] font-semibold transition ${active ? "text-[#a3f45f]" : "text-slate-400"} py-1`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[10px]">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            <Link href={bottomNav[2].href} className="relative flex items-center justify-center">
              <div className="h-14 w-14 rounded-full bg-[#a3f45f] p-0.5 shadow-[0_12px_30px_rgba(163,244,95,0.18)]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white/10 text-black text-xl font-black">
                  {bottomNav[2].icon}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <footer className="hidden md:block border-t border-slate-200 bg-white mt-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6 text-sm text-slate-500">Admin dashboard</div>
      </footer>
    </div>
  );
}

export default AdminShell;
