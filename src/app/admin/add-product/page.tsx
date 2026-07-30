"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/adminShell";
import { PageTitle } from "@/components/shell";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/api";
import { ArrowRight, Pencil, Trash } from "@phosphor-icons/react/dist/ssr";

const emptyForm = {
  name: "",
  category: "Social media",
  price: "",
  stock: "",
  description: "",
  image: "",
  featured: false,
  credentials: {
    username: "",
    password: "",
    email: "",
    recoveryEmail: "",
    notes: "",
  },
};

export default function AddProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; type: "success" | "error"; text: string }[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>(emptyForm);

  const addToast = (type: "success" | "error", text: string) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
    setToasts((prev) => [{ id, type, text }, ...prev]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  useEffect(() => {
    const load = async () => {
      try {
        const items = await getProducts();
        setProducts(items);
      } catch (err) {
        addToast("error", "Unable to load products. Start the backend and try again.");
      }
    };
    void load();
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setIsAddOpen(true);
  };

  const openEdit = (product: any) => {
    setEditing(product);
    setForm({
      name: product.name ?? "",
      category: product.category ?? "Social media",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      description: product.description ?? "",
      image: product.image ?? "",
      featured: product.featured ?? false,
      credentials: product.credentials ?? { username: "", password: "", email: "", recoveryEmail: "", notes: "" },
    });
    setIsAddOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      setLoading(true);
      await deleteProduct(String(id));
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      addToast("success", "Product deleted.");
    } catch {
      addToast("error", "Unable to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // client-side validation
    if (!form.name || String(form.name).trim().length === 0) {
      addToast("error", "Product name is required.");
      setLoading(false);
      return;
    }
    const priceVal = Number(form.price);
    if (Number.isNaN(priceVal) || priceVal <= 0) {
      addToast("error", "Price must be a number greater than 0.");
      setLoading(false);
      return;
    }
    const stockVal = Number(form.stock);
    if (Number.isNaN(stockVal) || stockVal < 0) {
      addToast("error", "Stock must be 0 or more.");
      setLoading(false);
      return;
    }
    try {
      const payload: any = {
        name: form.name,
        category: form.category,
        description: form.description,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        image: form.image,
        featured: !!form.featured,
        credentials: form.credentials,
      };

      if (editing) {
        const updated = await updateProduct(String(editing.id), payload);
        setProducts((prev) => prev.map((p) => (String(p.id) === String(editing.id) ? updated : p)));
        addToast("success", "Product updated.");
      } else {
        const created = await createProduct(payload);
        setProducts((prev) => [created, ...prev]);
        addToast("success", "Product created.");
      }

      setIsAddOpen(false);
      setEditing(null);
      setForm(emptyForm);
    } catch (err) {
      addToast("error", "Unable to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Toasts container */}
        <div aria-live="polite" className="fixed right-6 top-6 z-50 space-y-2">
          {toasts.map((t) => (
            <div key={t.id} className={`max-w-sm rounded-2xl px-4 py-3 text-sm font-semibold shadow ${t.type === "success" ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-rose-200 bg-rose-50 text-rose-700"}`}>
              <div className="flex items-start justify-between gap-4">
                <div>{t.text}</div>
                <button onClick={() => removeToast(t.id)} className="text-xs font-bold opacity-70">x</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1a73e8]">Products</p>
              <p className="mt-1 text-lg font-black text-slate-950">All items in the marketplace</p>
              <p className="mt-1 font-black font-light text-sm text-slate-500">Create, edit and remove marketplace products.</p>
              </div>
           </div>
            <div className="w-full md:w-auto">
            <button onClick={openAdd} className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#a3f45f] px-4 py-2 text-sm font-black text-slate-950 hover:bg-[#8dd247] transition">
              Add product
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">No products yet.</div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 truncate">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{product.category}</p>
                    </div>
                    <div className="text-sm font-black text-slate-900 shrink-0">${product.price}</div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{product.description?.slice(0, 80)}</p>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => openEdit(product)} className="flex-1 inline-flex items-center justify-center gap-1 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100 transition">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="flex-1 inline-flex items-center justify-center gap-1 rounded-2xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 shadow-sm hover:bg-rose-100 transition">
                      <Trash size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {isAddOpen ? (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto py-12 px-4 sm:px-6 lg:px-8 bg-black/40">
            <div className="w-full max-w-4xl rounded-2xl bg-white p-6">
              <h3 className="text-lg font-bold">{editing ? "Edit product" : "Add product"}</h3>
              <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <label className="block text-sm font-semibold text-slate-700">
                    Product name
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm((p: any) => ({ ...p, name: e.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Category
                    <select
                      value={form.category}
                      onChange={(e) => setForm((p: any) => ({ ...p, category: e.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                    >
                      <option>Social media</option>
                      <option>Streaming</option>
                      <option>Productivity</option>
                      <option>Gaming</option>
                      <option>Design</option>
                      <option>Business</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Price
                    <input
                      required
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(event) => setForm((prev: any) => ({ ...prev, price: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Stock
                    <input
                      required
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(event) => setForm((prev: any) => ({ ...prev, stock: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                    />
                  </label>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                  <label className="block text-sm font-semibold text-slate-700">
                    Description
                    <textarea
                      required
                      value={form.description}
                      onChange={(event) => setForm((prev: any) => ({ ...prev, description: event.target.value }))}
                      className="mt-2 min-h-[150px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Image URL
                    <input
                      value={form.image}
                      onChange={(event) => setForm((prev: any) => ({ ...prev, image: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                      placeholder="https://..."
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-black uppercase tracking-[0.24em] text-[#1a73e8]">Product credentials</p>
                      <p className="mt-1 text-sm text-slate-500">Optional customer access credentials for this product.</p>
                    </div>
                    <label className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={!!form.featured}
                        onChange={(event) => setForm((prev: any) => ({ ...prev, featured: event.target.checked }))}
                        className="h-4 w-4 rounded border-slate-300 text-[#0f766e]"
                      />
                      Feature on homepage
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Username
                      <input
                        value={form.credentials?.username ?? ""}
                        onChange={(event) => setForm((prev: any) => ({ ...prev, credentials: { ...(prev.credentials ?? {}), username: event.target.value } }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Password
                      <input
                        type="password"
                        value={form.credentials?.password ?? ""}
                        onChange={(event) => setForm((prev: any) => ({ ...prev, credentials: { ...(prev.credentials ?? {}), password: event.target.value } }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45e]/30"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Email
                      <input
                        type="email"
                        value={form.credentials?.email ?? ""}
                        onChange={(event) => setForm((prev: any) => ({ ...prev, credentials: { ...(prev.credentials ?? {}), email: event.target.value } }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Recovery email
                      <input
                        type="email"
                        value={form.credentials?.recoveryEmail ?? ""}
                        onChange={(event) => setForm((prev: any) => ({ ...prev, credentials: { ...(prev.credentials ?? {}), recoveryEmail: event.target.value } }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45e]/30"
                      />
                    </label>
                  </div>

                  <label className="block text-sm font-semibold text-slate-700">
                    Notes
                    <textarea
                      value={form.credentials?.notes ?? ""}
                      onChange={(event) => setForm((prev: any) => ({ ...prev, credentials: { ...(prev.credentials ?? {}), notes: event.target.value } }))}
                      className="mt-2 min-h-[100px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                      placeholder="Optional product access instructions or delivery notes"
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">Only admin users can add products here.</p>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => { setIsAddOpen(false); setEditing(null); }} className="rounded-2xl px-4 py-2">Cancel</button>
                    <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#a3f45f] px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-[#94dc4d] disabled:cursor-not-allowed disabled:opacity-70">
                      {loading ? "Saving..." : editing ? "Save changes" : "Create product"}
                      <ArrowRight size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </AdminShell>
  );
}
