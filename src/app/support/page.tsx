import { Shell, PageTitle } from "@/components/shell";
import {
  EnvelopeSimple,
  WhatsappLogo,
  TelegramLogo,
} from "@phosphor-icons/react/dist/ssr";

const supportChannels = [
  {
    icon: <EnvelopeSimple size={18} weight="bold" className="text-[#0f766e]" />,
    title: "Email",
    text: "support@joelinkdigital.com",
    href: "mailto:support@joelinkdigital.com",
    action: "Send",
  },
  {
    icon: <WhatsappLogo size={18} weight="bold" className="text-[#0f766e]" />,
    title: "WhatsApp",
    text: "Live chat",
    href: "https://wa.me/1234567890",
    action: "Chat",
  },
  {
    icon: <TelegramLogo size={18} weight="bold" className="text-[#0f766e]" />,
    title: "Telegram",
    text: "Support group",
    href: "https://t.me/joelinksupport",
    action: "Join",
  },
];

const faqs = [
  {
    question: "How long to receive accounts?",
    answer: "Usually within minutes after payment.",
  },
  {
    question: "What payment methods?",
    answer: "Cards, mobile money, and crypto accepted.",
  },
  {
    question: "Account not working?",
    answer: "Contact support with your order ID for replacement or refund.",
  },
];

export default function SupportPage() {
  return (
    <Shell>
      <div className="mx-auto w-full px-4 py-8 sm:max-w-2xl sm:px-6 lg:max-w-3xl lg:px-8 mb-30">
        <PageTitle
          eyebrow="We are here to help"
          title="Support center"
          description="Contact us or check FAQs for quick answers."
        />

        {/* Support Channels */}
        <section className="rounded-2xl border border-[#d4f6d6]  p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">Contact us</h2>

          <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 sm:grid-cols-3">
            {supportChannels.map((channel) => (
              <SupportCard key={channel.title} channel={channel} />
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-6">
          <h2 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">Quick answers</h2>

          <div className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4 text-sm"
              >
                <summary className="cursor-pointer font-semibold text-slate-900">
                  {faq.question}
                </summary>
                <p className="mt-2 text-xs text-slate-600 sm:text-sm">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function SupportCard({
  channel,
}: {
  channel: {
    icon: React.ReactNode;
    title: string;
    text: string;
    href: string;
    action: string;
  };
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs transition hover:shadow-md sm:p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/18 flex-shrink-0">
          {channel.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-950 truncate">{channel.title}</h3>
          <p className="text-xs text-slate-500 truncate">{channel.text}</p>
        </div>
      </div>
      <a
        href={channel.href}
        className="inline-flex items-center justify-center rounded-lg bg-black/18  px-3 py-1.5 text-xs font-bold text-[#09120b] shadow-xs transition  w-full"
      >
        {channel.action}
      </a>
    </article>
  );
}
