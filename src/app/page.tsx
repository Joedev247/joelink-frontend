"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  MagnifyingGlass,
  ShieldCheck,
  ShoppingBagOpen,
  Lightning,
  Wallet,
  Headset,
  Quotes,
  Star,
  SealCheck,
} from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { money, products as fallbackProducts } from "@/lib/store";
import { getProducts } from "@/lib/api";
import { getStoredCurrency } from "@/lib/currency";

const platforms = [
  { name: "Instagram", logo: "/social/instagram.svg" },
  { name: "TikTok", logo: "/social/tiktok.svg" },
  { name: "YouTube", logo: "/social/youtube.svg" },
  { name: "Facebook", logo: "/social/facebook.svg" },
  { name: "Telegram", logo: "/social/telegram.svg" },
  { name: "WhatsApp", logo: "/social/whatsapp.svg" },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState(fallbackProducts.slice(0, 4));

  useEffect(() => {
    void getProducts()
      .then((products) => setFeaturedProducts(products.slice(0, 4)))
      .catch(() => setFeaturedProducts(fallbackProducts.slice(0, 4)));
  }, []);

  return (
    <Shell>
      <div className="mb-30">
      <section className="hero-grid relative overflow-hidden bg-[#030815] text-white">
        <div className="hero-orb hero-orb-blue" />
        <div className="hero-orb hero-orb-green" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-14 sm:px-8 lg:pb-20 lg:pt-20">
          <FloatingSocials />
          <div className="flex justify-center text-center">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-bold text-emerald-300">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-300" />{" "}
                Premium digital access, simplified
              </div>
              <h1 className="text-2xl font-black leading-[1.06] tracking-[-.04em] sm:text-3xl lg:text-[2.25rem]">
                Grow faster with the right{" "}
                <span className="hero-gradient-text block">
                  digital accounts.
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Verified accounts for creators, marketers, and modern teams —
                securely delivered to your JoeLink dashboard.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/products"
                  className="rounded-lg bg-[#a3f45f]  px-5 py-3 text-sm font-black text-[#09120b] shadow-[0_0_28px_rgba(163,244,95,.22)] transition bg-lime-300 inline-flex items-center"
                >
                  Browse inventory
                  <ArrowRight size={16} weight="bold" className="ml-2" />
                </Link>
                <Link
                  href="/support"
                  className="rounded-lg border border-white/15 bg-white/[.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  How it works
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] text-slate-400">
                <span>
                  <b className="text-white">10k+</b> accounts delivered
                </span>
                <span>
                  <b className="text-white">99.8%</b> success rate
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{" "}
                  Live support
                </span>
              </div>
            </div>
          </div>

          <div className="logo-carousel mt-7 rounded-2xl bg-white/[.035] px-3 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] sm:px-5">
            <div className="logo-track">
              {[...platforms, ...platforms].map((platform, index) => (
                <span key={`${platform.name}-${index}`} className="logo-item">
                  <span className="logo-icon-wrap">
                    <img
                      src={platform.logo}
                      alt={`${platform.name} logo`}
                      className="logo-icon"
                    />
                  </span>
                  <span>{platform.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f7f9fc] px-5 py-14 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[.2em] text-[#1a73e8]">
                Live inventory
              </p>
              <h2 className="text font-black tracking-tight text-slate-950 sm:text-4xl">
                Top accounts this week
              </h2>
            </div>
            <Link
              href="/products"
              className="view-all-button group inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-black text-[#09120b] shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:px-4 sm:py-3 sm:text-sm"
            >
              <span className="hidden sm:inline">Explore inventory</span>
              <span className="sm:hidden ">View all</span>
              <ArrowRight
                size={14}
                weight="bold"
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fc] px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Simple by design"
              title="From discovery to delivery in minutes"
              description="Everything you need to find, purchase, and manage digital accounts in one secure place."
            />
           
          </div>
          <div className="process-grid relative mt-10 grid gap-4 md:grid-cols-3">
            <div className="process-line hidden md:block" />
            <Step
              number="01"
              title="Choose an account"
              text="Browse verified inventory with clear pricing, stock, and delivery details."
              icon={<MagnifyingGlass size={25} weight="duotone" />}
            />
            <Step
              number="02"
              title="Pay securely"
              text="Use your wallet or preferred payment method with protected checkout."
              icon={<ShieldCheck size={25} weight="duotone" />}
            />
            <Step
              number="03"
              title="Get instant access"
              text="Your credentials appear in your dashboard as soon as the order is complete."
              icon={<ShoppingBagOpen size={25} weight="duotone" />}
            />
          </div>
        </div>
      </section>
      <section className="bg-white px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <SectionHeading
              eyebrow="Why JoeLink"
              title="Built for people who move fast"
              description="Skip unreliable sellers and scattered conversations. JoeLink gives you a clean, dependable way to access the tools your work needs."
            />
            
          </div>
          <div className="benefit-grid grid gap-4 sm:grid-cols-2">
            <Benefit
              icon={<CheckCircle size={24} weight="duotone" />}
              title="Verified inventory"
              text="Each listing is reviewed before it reaches the marketplace."
            />
            <Benefit
              icon={<Lightning size={24} weight="duotone" />}
              title="Instant delivery"
              text="No waiting around. Access your order from your dashboard."
            />
            <Benefit
              icon={<Wallet size={24} weight="duotone" />}
              title="Secure wallet"
              text="Keep your balance ready and track every transaction clearly."
            />
            <Benefit
              icon={<Headset size={24} weight="duotone" />}
              title="Human support"
              text="Get practical help whenever you need it, day or night."
            />
          </div>
        </div>
      </section>
      <section className="bg-[#f7f9fc] px-5 py-12 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Customer stories"
            title="Loved by digital-first teams"
            description="Real feedback from people using JoeLink to move their work forward."
          />
          <div className="testimonial-grid mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Testimonial
              quote="The delivery was genuinely instant. I had the account details in my dashboard before I finished setting up my workspace."
              name="Maya Okafor"
              role="Content creator"
              initials="MO"
              tone="lime"
            />
            <Testimonial
              quote="JoeLink makes buying digital tools feel organized and professional. The stock labels and order history are especially useful."
              name="Daniel Reed"
              role="Growth marketer"
              initials="DR"
              tone="blue"
            />
            <Testimonial
              quote="I like that support is easy to reach and every purchase stays in one place. It saves our team a lot of time."
              name="Aisha Bello"
              role="Agency owner"
              initials="AB"
              tone="teal"
            />
            <Testimonial
              quote="Every purchase was fast and reliable. The dashboard gives us exactly the visibility our team needs."
              name="Luis Mendes"
              role="Brand strategist"
              initials="LM"
              tone="blue"
            />
          </div>
        </div>
      </section>
      <section className="px-5 py-10 sm:px-8 lg:py-14">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.75rem]  bg-[#071426] px-6 py-8 text-white shadow-[0_24px_80px_rgba(0,0,0,.28)] sm:px-8 sm:py-10">
          <div className="cta-glow absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#a3f45f]/22 to-transparent blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[.24em] text-[#a3f45f]">
                Ready when you are
              </p>
              <h2 className="mt-3 text-xl font-black tracking-tight text-white sm:text-[2.6rem]">
                Find the account that gives your work an edge.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
                Explore live inventory and get secure access without the usual
                friction.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#a3f45f]  px-5 py-3 text-sm font-black text-[#09120b] shadow-[0_18px_36px_rgba(163,244,95,.22)] transition hover:bg-lime-300"
                >
                  Explore inventory
                  <ArrowRight className="ml-2" size={18} weight="bold" />
                </Link>
                <Link
                  href="/support"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-[#a3f45f]/50 hover:bg-white/10"
                >
                  Talk to support
                  <Headset className="ml-2" size={18} weight="bold" />
                </Link>
              </div>
            </div>
            <div className="grid gap-3 rounded-[1.5rem]  bg-white/5 p-4 shadow-[0_16px_30px_rgba(0,0,0,.14)] backdrop-blur-md">
              <div className="flex items-start gap-3 rounded-3xl  bg-white/10 p-3">
                <span className="grid h-15 w-15 place-items-center  text-[#a3f45f]">
                  <Lightning size={20} weight="bold" />
                </span>
                <div>
                  <p className="text-sm font-black text-white">
                    Instant delivery
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">
                    Orders appear in your dashboard immediately.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-3xl  bg-white/10 p-3">
                <span className="grid h-15 w-15 place-items-center text-[#79d8d0]">
                  <ShieldCheck size={20} weight="bold" />
                </span>
                <div>
                  <p className="text-sm font-black text-white">
                    Secure checkout
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">
                    Payments are protected and easy to manage.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-3xl  bg-white/10 p-3">
                <span className="grid h-15 w-15 place-items-center  text-[#60a5fa]">
                  <Wallet size={20} weight="bold" />
                </span>
                <div>
                  <p className="text-sm font-black text-white">
                    Clear account history
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">
                    Track every purchase and balance in one view.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </Shell>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
        {value}
      </p>
      <p className="mt-1 text-[11px] text-slate-500">{label}</p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-xl">
      <p className="mb-2 text-[10px] font-black uppercase tracking-[.2em] text-[#1a73e8]">
        {eyebrow}
      </p>
      <h2 className="text font-black tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
      )}
    </div>
  );
}

function Step({
  number,
  title,
  text,
  icon,
}: {
  number: string;
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="process-card group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#a3f45f] hover:shadow-lg">
      <div className="relative z-10 mb-6 flex items-start justify-between">
        <span className="process-icon grid h-10 w-10 place-items-center rounded-full text-[#09120b] transition group-hover:scale-105">
          {icon}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black tracking-[.18em] text-slate-400">
          STEP {number}
        </span>
      </div>
      <h3 className="text-base font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
      <div className="mt-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-emerald-600">
        <CheckCircle size={15} weight="fill" /> Ready when you are
      </div>
    </div>
  );
}

function Benefit({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="benefit-card group relative overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#a3f45f] hover:shadow-lg">
      <div className="benefit-accent" />
      <div className="relative z-10">
        <span className="benefit-icon grid h-10 w-10 place-items-center rounded-full text-[#09120b] transition group-hover:scale-105">
          {icon}
        </span>
        <h3 className="mt-5 text-sm font-black text-slate-950">{title}</h3>
        <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
        <div className="mt-5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-emerald-600">
          <CheckCircle size={14} weight="fill" /> Included
        </div>
      </div>
    </div>
  );
}

function Testimonial({
  quote,
  name,
  role,
  initials,
  tone,
}: {
  quote: string;
  name: string;
  role: string;
  initials: string;
  tone: "lime" | "blue" | "teal";
}) {
  return (
    <article
      className={`testimonial-card testimonial-${tone} group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="testimonial-orb" />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1 text-[#f59e0b]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={14} weight="fill" />
            ))}
          </div>
          <Quotes
            size={28}
            weight="duotone"
            className="text-slate-200 transition group-hover:text-[#79d8d0]"
          />
        </div>
        <p className="mt-5 min-h-[105px] text-sm leading-6 text-slate-600">
          “{quote}”
        </p>
        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
          <span className="testimonial-avatar grid h-10 w-10 place-items-center rounded-full text-xs font-black text-[#09120b]">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-xs font-black text-slate-950">
              {name}{" "}
              <SealCheck size={14} weight="fill" className="text-[#1a73e8]" />
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">{role}</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-600">
            Verified
          </span>
        </div>
      </div>
    </article>
  );
}

function FloatingSocials() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      <div className="social-float social-float-left-1">
        <img className="social-logo" src="/social/instagram.svg" alt="" />
      </div>
      <div className="social-float social-float-left-2">
        <img className="social-logo" src="/social/youtube.svg" alt="" />
      </div>
      <div className="social-float social-float-left-3">
        <img className="social-logo" src="/social/tiktok.svg" alt="" />
      </div>
      <div className="social-float social-float-right-1">
        <img className="social-logo" src="/social/facebook.svg" alt="" />
      </div>
      <div className="social-float social-float-right-2">
        <img className="social-logo" src="/social/telegram.svg" alt="" />
      </div>
      <div className="social-float social-float-right-3">
        <img className="social-logo" src="/social/whatsapp.svg" alt="" />
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: (typeof fallbackProducts)[number] }) {
  const logo = productLogo(product.name);
  const originalPrice = product.originalPrice ?? product.price * 1.35;
  const savings = Math.round((1 - product.price / originalPrice) * 100);

  return (
    <Link
      href={`/product/${product.id}`}
      className="account-card group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl"
    >
      <div
        className={`relative mb-4 flex aspect-[1.45] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${product.color}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,.25),transparent_45%)]" />
        <div className="relative grid h-20 w-20 place-items-center rounded-[1.4rem] bg-white/95 p-3 shadow-2xl ring-4 ring-white/20 transition duration-300 group-hover:scale-105">
          <Image
            src={logo}
            alt={`${product.name} logo`}
            width={56}
            height={56}
            className="h-full w-full rounded-xl object-contain"
          />
        </div>
      </div>
      <div className="flex items-start justify-between gap-3 px-1">
        <div>
          <h3 className="text-sm font-black text-slate-950">{product.name}</h3>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Verified listing · Instant delivery
          </p>
        </div>
        <span className="mt-0.5 flex items-center gap-1 text-[9px] font-black text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> LIVE
        </span>
      </div>
      <p className="mt-3 line-clamp-2 min-h-10 px-1 text-xs leading-5 text-slate-500">
        {product.description}
      </p>
      <div className="mt-4 flex items-end justify-between border-t border-slate-100 px-1 pt-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="account-price text-lg font-black">
              {money(product.price, getStoredCurrency())}
            </span>
            <span className="text-[10px] text-slate-400 line-through">
              {money(product.originalPrice ?? product.price * 1.35, getStoredCurrency())}
            </span>
          </div>
          <span className="account-savings text-[10px] font-bold">
            Save {savings}% today
          </span>
        </div>
        <span className="account-card-button rounded-lg px-3 py-2 text-[11px] font-black text-[#09120b] transition group-hover:brightness-110">
          View account{" "}
        </span>
      </div>
    </Link>
  );
}

function productLogo(name: string) {
  if (name.startsWith("Instagram")) return "/social/instagram.svg";
  if (name.startsWith("TikTok")) return "/social/tiktok.svg";
  if (name.startsWith("Netflix")) return "/social/netflix.svg";
  if (name.startsWith("Canva")) return "/social/canva.svg";
  if (name.startsWith("Spotify")) return "/social/spotify.svg";
  return "/social/youtube.svg";
}
