import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { products } from "@/lib/store";
import { ProductDetailClient } from "./product-detail-client";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === Number(id));
  if (!product) notFound();

  return (
    <Shell>
      <ProductDetailClient product={product} />
    </Shell>
  );
}
