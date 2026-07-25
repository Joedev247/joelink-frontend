import Link from "next/link";
import { Shell, PageTitle } from "@/components/shell";
import { orders, money } from "@/lib/store";

export default function OrdersPage() {
  return (
    <Shell>
      <div className="mx-auto w-full px-4 py-8 sm:max-w-2xl sm:px-6 lg:max-w-3xl lg:px-8 mb-30">
        <PageTitle
          eyebrow="Your account"
          title="My orders"
          description="View your order history and account credentials."
        />

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">Order history</h2>
            <span className="rounded-full bg-white/10 /20 px-2.5 py-1 text-xs font-bold text-[#0f766e]">
              {orders.length} orders
            </span>
          </div>

          <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-4 rounded-xl border border-[#d4f6d6] bg-[#f9fffb] p-4 shadow-xs"
              >
                {/* Top Row: Account Type (left) + Status (right) */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="text-sm font-bold text-slate-950">{order.product}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 font-semibold text-xs whitespace-nowrap ${
                      order.status === "Delivered"
                        ? "bg-[#d1f2d4] text-[#166a0a]"
                        : order.status === "Processing"
                        ? "bg-[#fef3c7] text-[#92400e]"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Second Row: ID (left) + Date (right) */}
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs text-slate-500">ID: {order.id}</p>
                  <p className="text-xs text-slate-500 whitespace-nowrap">{order.date}</p>
                </div>

                {/* Bottom Row: Amount (left) + View Details (right) */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200/50">
                  <p className="text-base font-black text-slate-950">{money(order.amount)}</p>
                  <button className="rounded-lg bg-[#a3f45f]  px-3 py-2 text-xs font-bold text-[#09120b] shadow-xs transition hover:bg-[#94d34c] whitespace-nowrap">
                    View details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-5 rounded-xl border border-[#d4f6d6] bg-[#f0fef2] p-3 text-xs text-[#0f766e] sm:mt-6 sm:p-4 sm:text-sm">
          Credentials are available after payment in your order details.
        </div>

        {orders.length === 0 && (
          <Link
            href="/products"
            className="mt-5 inline-block rounded-lg bg-[#a3f45f]  px-4 py-2 text-xs font-bold text-[#09120b] shadow-xs transition hover:bg-[#94d34c] sm:mt-6 sm:px-5 sm:py-3 sm:text-sm"
          >
            Start shopping
          </Link>
        )}
      </div>
    </Shell>
  );
}
