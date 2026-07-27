"use client";

import { useState } from "react";
import AdminShell from "@/components/adminShell";
import { PageTitle } from "@/components/shell";
import { createProduct } from "@/lib/api";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

const initialForm = {
  name: "",
  category: "Social media",
  price: "",
  stock: "",
  description: "",
  image: "",
  featured: false,
  username: "",
  password: "",
  email: "",
  recoveryEmail: "",
  notes: "",
};

export default function AddProductPage() {
  const [productForm, setProductForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleCreateProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await createProduct({
        name: productForm.name,
        category: productForm.category,
        description: productForm.description,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        image: productForm.image,
        featured: productForm.featured,
        credentials: {
          username: productForm.username,
          password: productForm.password,
          email: productForm.email,
          recoveryEmail: productForm.recoveryEmail,
          notes: productForm.notes,
        },
      });
      setMessage({ type: "success", text: "Product created successfully." });
      setProductForm(initialForm);
    } catch (error) {
      setMessage({ type: "error", text: "Unable to create the product. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell>
      <div className="flex min-h-[calc(100vh-80px)] items-start justify-center bg-[#f3f7fc] px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/20">
            <PageTitle eyebrow="Inventory" title="Add a product" description="Fill in the product details and credentials to add it to the marketplace." />

            {message ? (
              <div
                className={`mb-6 rounded-2xl px-4 py-3 text-sm font-semibold ${
                  message.type === "success"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {message.text}
              </div>
            ) : null}

            <form className="space-y-6" onSubmit={handleCreateProduct}>
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <label className="block text-sm font-semibold text-slate-700">
                  Product name
                  <input
                    required
                    value={productForm.name}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Category
                  <select
                    value={productForm.category}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, category: event.target.value }))}
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
                    value={productForm.price}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, price: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Stock
                  <input
                    required
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, stock: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                  />
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                <label className="block text-sm font-semibold text-slate-700">
                  Description
                  <textarea
                    required
                    value={productForm.description}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
                    className="mt-2 min-h-[150px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Image URL
                  <input
                    value={productForm.image}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, image: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                    placeholder="https://..."
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#1a73e8]">Product credentials</p>
                    <p className="mt-1 text-sm text-slate-500">Optional customer access credentials for this product.</p>
                  </div>
                  <label className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(event) => setProductForm((prev) => ({ ...prev, featured: event.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 text-[#0f766e]"
                    />
                    Feature on homepage
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Username
                    <input
                      value={productForm.username}
                      onChange={(event) => setProductForm((prev) => ({ ...prev, username: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Password
                    <input
                      type="password"
                      value={productForm.password}
                      onChange={(event) => setProductForm((prev) => ({ ...prev, password: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45e]/30"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Email
                    <input
                      type="email"
                      value={productForm.email}
                      onChange={(event) => setProductForm((prev) => ({ ...prev, email: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Recovery email
                    <input
                      type="email"
                      value={productForm.recoveryEmail}
                      onChange={(event) => setProductForm((prev) => ({ ...prev, recoveryEmail: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45e]/30"
                    />
                  </label>
                </div>

                <label className="block text-sm font-semibold text-slate-700">
                  Notes
                  <textarea
                    value={productForm.notes}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, notes: event.target.value }))}
                    className="mt-2 min-h-[100px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#a3f45f]/30"
                    placeholder="Optional product access instructions or delivery notes"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">Only admin users can add products here.</p>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#a3f45f] px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-[#94dc4d] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Saving..." : "Create product"}
                  <ArrowRight size={16} weight="bold" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
