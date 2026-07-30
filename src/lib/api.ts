import type { Order, Product } from "./store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://joelink-backend.onrender.com";

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
  const rawId = raw.id;
  const numericId = typeof rawId === "number"
    ? rawId
    : typeof rawId === "string"
      ? Number(rawId)
      : NaN;
  const normalizedId = Number.isFinite(numericId) ? numericId : Date.now();

  return {
    id: normalizedId,
    name: String(raw.name ?? "Untitled product"),
    category: String(raw.category ?? "General"),
    description: String(raw.description ?? ""),
    price,
    originalPrice: Number.isFinite(originalPrice) ? originalPrice : price,
    stock: Number(raw.stock ?? 12),
    icon: typeof raw.icon === "string" ? raw.icon : undefined,
    color: typeof raw.color === "string" ? raw.color : "from-slate-900 to-sky-500",
    features: Array.isArray(raw.features) ? raw.features.map(String) : ["Instant delivery", "Secure checkout"],
    credentials: typeof raw.credentials === "object" && raw.credentials !== null
      ? {
          username: typeof (raw.credentials as Record<string, unknown>).username === "string" ? String((raw.credentials as Record<string, unknown>).username) : "",
          password: typeof (raw.credentials as Record<string, unknown>).password === "string" ? String((raw.credentials as Record<string, unknown>).password) : "",
          email: typeof (raw.credentials as Record<string, unknown>).email === "string" ? String((raw.credentials as Record<string, unknown>).email) : "",
          recoveryEmail: typeof (raw.credentials as Record<string, unknown>).recoveryEmail === "string" ? String((raw.credentials as Record<string, unknown>).recoveryEmail) : "",
          notes: typeof (raw.credentials as Record<string, unknown>).notes === "string" ? String((raw.credentials as Record<string, unknown>).notes) : "",
        }
      : undefined,
  };
}

export function normalizeOrder(raw: Partial<Order> & Record<string, unknown>): Order {
  const createdAt = typeof raw.createdAt === "string" ? raw.createdAt : undefined;
  const date = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : typeof raw.date === "string"
      ? raw.date
      : new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const time = createdAt
    ? new Date(createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : typeof raw.time === 'string'
      ? raw.time
      : new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return {
    id: String(raw.id ?? `JL-${Date.now().toString().slice(-5)}`),
    product: String(raw.product ?? raw.productId ?? "JoeLink product"),
    productId: raw.productId ?? undefined,
    date,
    time,
    amount: Number(raw.amount ?? 0),
    status: String(raw.status ?? "Completed"),
  };
}

export function normalizeWalletTransaction(raw: Record<string, unknown>) {
  const rawType = typeof raw.type === "string" ? raw.type.toLowerCase() : "deposit";
  const type = rawType === "purchase" ? "Purchase" : "Deposit";
  const createdAt = typeof raw.createdAt === "string" ? raw.createdAt : undefined;
  const date = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : typeof raw.date === "string"
      ? raw.date
      : new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const time = createdAt
    ? new Date(createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : typeof raw.time === 'string'
      ? raw.time
      : new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  const amount = typeof raw.amount === "number" ? raw.amount : Number(raw.amount ?? 0);
  const kind = rawType === "purchase" ? ("purchase" as const) : ("deposit" as const);
  return {
    id: String(raw.id ?? `txn-${Date.now()}`),
    type,
    method: String(raw.description ?? raw.method ?? (type === "Purchase" ? "Order" : "Add fund")),
    amount,
    amountValue: typeof raw.amountValue === "number" ? raw.amountValue : amount,
    status: String(raw.status ?? "Completed"),
    date,
    time,
    kind,
    createdAt: createdAt ?? new Date().toISOString(),
    description: String(raw.description ?? raw.method ?? ""),
    userId: String(raw.userId ?? ""),
  };
}

export async function getProducts(): Promise<Product[]> {
  const payload = await request<any[]>("/api/products");
  return payload.map((item) => normalizeProduct(item));
}

export async function getRemoteOrders(): Promise<Order[]> {
  const payload = await request<any[]>("/api/orders");
  return payload.map((item) => normalizeOrder(item));
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

export async function createNotification(notification: Record<string, unknown>) {
  return request<any>("/api/notifications", {
    method: "POST",
    body: JSON.stringify(notification),
  });
}

export async function getWalletTransactions(userId?: string, type?: string) {
  const query = [
    userId ? `userId=${encodeURIComponent(userId)}` : null,
    type ? `type=${encodeURIComponent(type)}` : null,
  ]
    .filter(Boolean)
    .join("&");
  const prefix = query.length ? `?${query}` : "";
  const payload = await request<any[]>(`/api/wallet/transactions${prefix}`);
  return payload.map(normalizeWalletTransaction);
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

export async function registerUser(user: Record<string, unknown>) {
  return request<any>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
    credentials: "include",
  });
}

export async function loginUser(credentials: Record<string, unknown>) {
  return request<any>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
    credentials: "include",
  });
}

export async function logoutUser() {
  return request<any>("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function getCurrentUser() {
  return request<any>("/api/auth/me", {
    credentials: "include",
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
