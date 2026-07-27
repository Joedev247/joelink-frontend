import type { Product } from "./store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function normalizeProduct(raw: Partial<Product> & Record<string, unknown>): Product {
  const price = Number(raw.price ?? 0);
  const originalPrice = Number(raw.originalPrice ?? price * 1.35);

  return {
    id: Number(raw.id ?? Date.now()),
    name: String(raw.name ?? "Untitled product"),
    category: String(raw.category ?? "General"),
    description: String(raw.description ?? ""),
    price,
    originalPrice: Number.isFinite(originalPrice) ? originalPrice : price,
    stock: Number(raw.stock ?? 12),
    icon: typeof raw.icon === "string" ? raw.icon : undefined,
    color: typeof raw.color === "string" ? raw.color : "from-slate-900 to-sky-500",
    features: Array.isArray(raw.features) ? raw.features.map(String) : ["Instant delivery", "Secure checkout"],
  };
}

export async function getProducts(): Promise<Product[]> {
  const payload = await request<any[]>("/api/products");
  return payload.map((item) => normalizeProduct(item));
}

export async function createProduct(product: Record<string, unknown>) {
  return request<any>("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export async function createOrder(order: Record<string, unknown>) {
  return request<any>("/api/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export async function createWalletDeposit(deposit: Record<string, unknown>) {
  return request<any>("/api/wallet/deposit", {
    method: "POST",
    body: JSON.stringify(deposit),
  });
}

export async function getNotifications(userId?: string) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return request<any[]>(`/api/notifications${query}`);
}
export async function getWalletTransactions(userId?: string) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return request<any[]>(`/api/wallet/transactions${query}`);
}
export async function getUsers() {
  return request<any[]>("/api/users");
}

export async function createUser(user: Record<string, unknown>) {
  return request<any>("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export async function deleteUser(userId: string) {
  return request<any>(`/api/users/${userId}`, {
    method: "DELETE",
  });
}

export async function getOrders() {
  return request<any[]>("/api/orders");
}

export async function getAdminStats() {
  return request<any>("/api/admin/stats");
}

export async function deleteProduct(productId: string) {
  return request<any>(`/api/products/${productId}`, {
    method: "DELETE",
  });
}

export async function updateProduct(productId: string, product: Record<string, unknown>) {
  return request<any>(`/api/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export async function updateUser(userId: string, user: Record<string, unknown>) {
  return request<any>(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(user),
  });
}
