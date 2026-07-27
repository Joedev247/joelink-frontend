export type CurrencyCode = "NGN" | "USD" | "GBP" | "CFA";

export const SUPPORTED_CURRENCIES: CurrencyCode[] = ["NGN", "USD", "GBP", "CFA"];

const RATES: Record<CurrencyCode, number> = {
  USD: 1,
  NGN: 1600,
  GBP: 0.79,
  CFA: 600,
};

const SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  NGN: "₦",
  GBP: "£",
  CFA: "CFA ",
};

const LOCALE: Record<CurrencyCode, string> = {
  USD: "en-US",
  NGN: "en-NG",
  GBP: "en-GB",
  CFA: "fr-CM",
};

export function getStoredCurrency(): CurrencyCode {
  if (typeof window === "undefined") {
    return "CFA";
  }

  const stored = window.localStorage.getItem("joelink-profile-currency");
  return SUPPORTED_CURRENCIES.includes(stored as CurrencyCode) ? (stored as CurrencyCode) : "CFA";
}

export function formatAmount(value: number, currency: CurrencyCode = getStoredCurrency()) {
  const normalizedCurrency = SUPPORTED_CURRENCIES.includes(currency) ? currency : "CFA";
  const formatter = new Intl.NumberFormat(LOCALE[normalizedCurrency], {
    style: "currency",
    currency: normalizedCurrency === "CFA" ? "XOF" : normalizedCurrency,
    maximumFractionDigits: normalizedCurrency === "NGN" || normalizedCurrency === "CFA" ? 0 : 2,
  });

  const amount = value * (1 / RATES[normalizedCurrency]);
  return formatter.format(amount).replace(/\s+/g, " ").trim();
}

export function convertAmount(value: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode) {
  const usdValue = value / RATES[fromCurrency];
  return usdValue * RATES[toCurrency];
}

export function formatCurrencyWithSymbol(value: number, currency: CurrencyCode = getStoredCurrency()) {
  const normalizedCurrency = SUPPORTED_CURRENCIES.includes(currency) ? currency : "CFA";
  const amount = normalizedCurrency === "USD" ? value : convertAmount(value, "USD", normalizedCurrency);
  const formatter = new Intl.NumberFormat(LOCALE[normalizedCurrency], {
    maximumFractionDigits: normalizedCurrency === "NGN" || normalizedCurrency === "CFA" ? 0 : 2,
  });

  const amountText = formatter.format(amount);
  return `${SYMBOLS[normalizedCurrency]}${amountText}`;
}
