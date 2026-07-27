import { formatCurrencyWithSymbol, getStoredCurrency, type CurrencyCode } from "./currency";

export type Product = { id: number; name: string; category: string; description: string; price: number; originalPrice: number; stock: number; icon?: string; color: string; features: string[] };
export type Order = { id: string; product: string; date: string; amount: number; status: string };
export type WishlistItem = { id: number; name: string; price: number; category: string; tag: string };

export const categories = ["All accounts", "Social media", "Streaming", "Productivity", "Gaming"];

export const products: Product[] = [
  { id: 1, name: "Instagram Premium", category: "Social media", description: "Verified, aged Instagram account ready for your next project.", price: 18, originalPrice: 25, stock: 12, icon: "instagram", color: "from-pink-500 to-orange-400", features: ["Aged account", "Email included", "Instant delivery"] },
  { id: 2, name: "TikTok Creator", category: "Social media", description: "Established TikTok profile with an authentic creator history.", price: 24, originalPrice: 32, stock: 8, icon: "tiktok", color: "from-slate-950 to-cyan-500", features: ["Creator ready", "Recovery details", "Instant delivery"] },
  { id: 3, name: "Netflix Premium", category: "Streaming", description: "Premium streaming access delivered securely to your dashboard.", price: 9, originalPrice: 14, stock: 24, icon: "netflix", color: "from-red-600 to-red-400", features: ["Premium plan", "Private profile", "30-day warranty"] },
  { id: 4, name: "Canva Pro", category: "Productivity", description: "Design faster with a ready-to-use Canva Pro workspace.", price: 12, originalPrice: 18, stock: 16, icon: "canva", color: "from-cyan-500 to-blue-500", features: ["Pro templates", "Team features", "Instant delivery"] },
  { id: 5, name: "Spotify Premium", category: "Streaming", description: "Ad-free music and offline listening for your personal devices.", price: 7, originalPrice: 11, stock: 31, icon: "spotify", color: "from-green-600 to-emerald-400", features: ["Ad-free listening", "Offline mode", "30-day warranty"] },
  { id: 6, name: "YouTube Premium", category: "Streaming", description: "Enjoy uninterrupted video and YouTube Music access.", price: 10, originalPrice: 15, stock: 19, icon: "youtube", color: "from-red-600 to-rose-400", features: ["No adverts", "Music included", "Instant delivery"] },
];

const seedOrders: Order[] = [
  { id: "JL-10482", product: "Instagram Premium", date: "Jul 18, 2026", amount: 18, status: "Completed" },
  { id: "JL-10471", product: "Canva Pro", date: "Jul 13, 2026", amount: 12, status: "Completed" },
  { id: "JL-10454", product: "Netflix Premium", date: "Jul 04, 2026", amount: 9, status: "Completed" },
];

export const ORDERS_STORAGE_KEY = "joelink-orders";
export const WISHLIST_STORAGE_KEY = "joelink-wishlist";
export const orders = seedOrders;

export function getOrders() {
  if (typeof window === "undefined") {
    return seedOrders;
  }

  const storedOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!storedOrders) {
    return seedOrders;
  }

  try {
    const parsed = JSON.parse(storedOrders);
    return Array.isArray(parsed) ? (parsed as Order[]) : seedOrders;
  } catch {
    return seedOrders;
  }
}

export function saveOrders(nextOrders: Order[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(nextOrders));
}

export function createOrderFromProduct(product: Product) {
  const order: Order = {
    id: `JL-${Date.now().toString().slice(-5)}`,
    product: product.name,
    date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
    amount: product.price,
    status: "Completed",
  };

  const nextOrders = [order, ...getOrders()].slice(0, 8);
  saveOrders(nextOrders);
  removeWishlistProduct(product.id);
  return nextOrders;
}

export function getWishlistProductIds() {
  if (typeof window === "undefined") {
    return [] as number[];
  }

  const stored = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);

    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => Number(item))
        .filter((item) => Number.isFinite(item) && item > 0);
    }

    const singleValue = Number(parsed);
    return Number.isFinite(singleValue) && singleValue > 0 ? [singleValue] : [];
  } catch {
    return [];
  }
}

export function toggleWishlistProduct(productId: number) {
  const current = getWishlistProductIds();
  const next = current.includes(productId)
    ? current.filter((itemId) => itemId !== productId)
    : [productId, ...current.filter((itemId) => itemId !== productId)];

  if (typeof window !== "undefined") {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("joelink-account-updated"));
  }

  return next;
}

export function removeWishlistProduct(productId: number) {
  const current = getWishlistProductIds();
  const next = current.filter((itemId) => itemId !== productId);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("joelink-account-updated"));
  }

  return next;
}

export function isProductFavorite(productId: number) {
  return getWishlistProductIds().includes(productId);
}

export function getWishlistItems(): WishlistItem[] {
  const savedIds = getWishlistProductIds();

  return products
    .filter((product) => savedIds.includes(product.id))
    .map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      tag: product.category === "Social media" ? "Private account" : "Instant delivery",
    }));
}

export const money = (amount: number, currency?: CurrencyCode) => {
  const selectedCurrency = currency ?? getStoredCurrency();
  return formatCurrencyWithSymbol(amount, selectedCurrency);
};