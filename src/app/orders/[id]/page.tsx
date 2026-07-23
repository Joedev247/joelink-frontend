import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Shell, PageTitle } from "@/components/shell";
import { orders, products } from "@/lib/store";
import { OrderDetailsContent } from "./order-details-content";

export function generateStaticParams() {
  return orders.map((order) => ({ id: order.id }));
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const order = orders.find((entry) => entry.id === id);
  const product = products.find((entry) => entry.name === order?.product);

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
          title={order.product}
          description="Review your purchase summary and secure access details."
        />

        <OrderDetailsContent order={order} product={product} />
      </div>
    </Shell>
  );
}
