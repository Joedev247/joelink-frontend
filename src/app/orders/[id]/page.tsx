"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Shell, PageTitle } from "@/components/shell";
import { getOrders as getLocalOrders, products as fallbackProducts, type Order, type Product } from "@/lib/store";
import { getRemoteOrders, getProducts as getRemoteProducts } from "@/lib/api";
import { OrderDetailsContent } from "./order-details-content";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    const syncOrders = async () => {
      try {
        const [remoteOrders, remoteProducts] = await Promise.all([getRemoteOrders(), getRemoteProducts()]);
        setOrders(remoteOrders);
        setProducts(remoteProducts);
      } catch {
        setOrders(getLocalOrders());
        setProducts(fallbackProducts);
      }
    };

    void syncOrders();
    window.addEventListener("storage", syncOrders);
    window.addEventListener("joelink-account-updated", syncOrders);

    return () => {
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("joelink-account-updated", syncOrders);
    };
  }, []);

  const order = orders.find((entry) => entry.id === id || String(entry.id) === id);
  const product = products.find((entry) => {
    const requestedProductId = typeof order?.productId === "number"
      ? order.productId
      : typeof order?.productId === "string"
        ? Number(order.productId)
        : NaN;

    return (
      (Number.isFinite(requestedProductId) && entry.id === requestedProductId) ||
      entry.name === order?.product
    );
  });

  if (!order) {
    return (
      <Shell>
        <div className="mx-auto w-full px-4 py-8 sm:max-w-2xl sm:px-6 lg:max-w-3xl lg:px-8 mb-30">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <h1 className="text-xl font-black text-slate-950">Order not found</h1>
            <p className="mt-2 text-sm text-slate-500">The order you requested could not be located.</p>
            <Link href="/orders" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#a3f45f] px-4 py-2 text-sm font-bold text-[#09120b]">
              <ArrowLeft size={16} weight="bold" />
              Back to orders
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto w-full px-4 py-8 sm:max-w-3xl sm:px-6 lg:px-8 mb-30">
        <Link href="/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f766e]">
          <ArrowLeft size={16} weight="bold" />
          Back to orders
        </Link>

        <PageTitle
          title={product?.name ?? order.product}
          description="Review your purchase summary and secure access details."
        />

        <OrderDetailsContent order={order} product={product} />
      </div>
    </Shell>
  );
}
