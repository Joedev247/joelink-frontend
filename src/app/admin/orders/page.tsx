"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/adminShell";
import { PageTitle } from "@/components/shell";
import { getOrders, getProducts } from "@/lib/api";
import { getStoredCurrency } from "@/lib/currency";
import { money } from "@/lib/store";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersResponse, productsResponse] = await Promise.all([getOrders(), getProducts()]);
        const sortedOrders = [...ordersResponse].sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });
        setOrders(sortedOrders);
        setProducts(productsResponse);
      } catch {
        setStatusMessage("Unable to load orders. Start the backend and try again.");
      }
    };

    void load();
  }, []);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-30">
        <PageTitle eyebrow="ORDER" title="App-wide purchase history" description="View and manage customer orders." />

        {statusMessage ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {statusMessage}
          </div>
        ) : null}

        
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">No orders available yet.</div>
          ) : (
            orders.map((order) => {
              const productName = products.find((product) => String(product.id) === String(order.productId))?.name ?? String(order.productId ?? order.product ?? "Unknown product");
              return (
                <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{productName}</p>
                        <p className="mt-1 text-xs text-slate-600 truncate">Order ID: {order.id}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap shrink-0 ${
                        order.status === "completed" || order.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : order.status === "pending" || order.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {String(order.status).replace(/^./, (char) => char.toUpperCase())}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 text-xs text-slate-600">
                      <div className="flex items-center justify-between mt-3">
                        <span>User: <span className="font-semibold text-slate-700">{order.userId ?? "unknown"}</span></span>
                        <span className="font-semibold text-slate-900">{money(Number(order.amount ?? 0), getStoredCurrency())}</span>
                      </div>
                      {order.createdAt ? (
                        <div className="flex items-center justify-between pt-1">
                          <span></span>
                          <span className="text-slate-500 text-right">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminShell>
  );
}
