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
  const productId = Number(id);
  let product = fallbackProducts.find((p) => p.id === productId);

  try {
    const remoteProducts = await getProducts();
    product = remoteProducts.find((item) => item.id === productId) ?? product;
  } catch {
    product = product ?? fallbackProducts.find((p) => p.id === productId);
  }

  if (!product) notFound();

  const normalizedProduct = normalizeProduct(product);

  return (
    <Shell>
      <ProductDetailClient product={normalizedProduct} />
    </Shell>
  );
}
