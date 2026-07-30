import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { products as fallbackProducts } from "@/lib/store";
import { getProducts, normalizeProduct } from "@/lib/api";
import { ProductDetailClient } from "./product-detail-client";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const requestedId = String(id).trim();
  const productId = Number(requestedId);
  let product = fallbackProducts.find((p) => p.id === productId || String(p.id) === requestedId);

  try {
    const remoteProducts = await getProducts();
    product = remoteProducts.find((item) => {
      const itemId = Number(item.id);
      return (Number.isFinite(itemId) && itemId === productId) || String(item.id) === requestedId;
    }) ?? product;
  } catch {
    product = product ?? fallbackProducts.find((p) => p.id === productId || String(p.id) === requestedId);
  }

  if (!product) notFound();

  const normalizedProduct = normalizeProduct(product);

  return (
    <Shell>
      <ProductDetailClient product={normalizedProduct} />
    </Shell>
  );
}
