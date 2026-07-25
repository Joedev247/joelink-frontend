export type Product = { id: number; name: string; category: string; description: string; price: number; originalPrice: number; stock: number; icon?: string; color: string; features: string[] };

export const categories = ["All accounts", "Social media", "Streaming", "Productivity", "Gaming"];

export const products: Product[] = [
  { id: 1, name: "Instagram Premium", category: "Social media", description: "Verified, aged Instagram account ready for your next project.", price: 18, originalPrice: 25, stock: 12, icon: "instagram", color: "from-pink-500 to-orange-400", features: ["Aged account", "Email included", "Instant delivery"] },
  { id: 2, name: "TikTok Creator", category: "Social media", description: "Established TikTok profile with an authentic creator history.", price: 24, originalPrice: 32, stock: 8, icon: "tiktok", color: "from-slate-950 to-cyan-500", features: ["Creator ready", "Recovery details", "Instant delivery"] },
  { id: 3, name: "Netflix Premium", category: "Streaming", description: "Premium streaming access delivered securely to your dashboard.", price: 9, originalPrice: 14, stock: 24, icon: "netflix", color: "from-red-600 to-red-400", features: ["Premium plan", "Private profile", "30-day warranty"] },
  { id: 4, name: "Canva Pro", category: "Productivity", description: "Design faster with a ready-to-use Canva Pro workspace.", price: 12, originalPrice: 18, stock: 16, icon: "canva", color: "from-cyan-500 to-blue-500", features: ["Pro templates", "Team features", "Instant delivery"] },
  { id: 5, name: "Spotify Premium", category: "Streaming", description: "Ad-free music and offline listening for your personal devices.", price: 7, originalPrice: 11, stock: 31, icon: "spotify", color: "from-green-600 to-emerald-400", features: ["Ad-free listening", "Offline mode", "30-day warranty"] },
  { id: 6, name: "YouTube Premium", category: "Streaming", description: "Enjoy uninterrupted video and YouTube Music access.", price: 10, originalPrice: 15, stock: 19, icon: "youtube", color: "from-red-600 to-rose-400", features: ["No adverts", "Music included", "Instant delivery"] },
];

export const orders = [
  { id: "JL-10482", product: "Instagram Premium", date: "Jul 18, 2026", amount: 18, status: "Completed" },
  { id: "JL-10471", product: "Canva Pro", date: "Jul 13, 2026", amount: 12, status: "Completed" },
  { id: "JL-10454", product: "Netflix Premium", date: "Jul 04, 2026", amount: 9, status: "Completed" },
];

export const money = (amount: number) => `$${amount.toFixed(2)}`;