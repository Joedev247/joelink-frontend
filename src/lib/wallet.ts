import { convertAmount, formatCurrencyWithSymbol, getStoredCurrency, type CurrencyCode } from "./currency";

export type WalletTransaction = {
  id: string;
  type: string;
  method: string;
  amount: string | number;
  amountValue?: number;
  status: string;
  date: string;
  time?: string;
  createdAt?: string;
  kind: "deposit" | "purchase";
};

export const WALLET_BALANCE_KEY = "joelink-wallet-balance";
export const WALLET_TRANSACTIONS_KEY = "joelink-wallet-transactions";
export const NOTIFICATIONS_LAST_SEEN_KEY = "joelink-notifications-last-seen";

export function formatCurrency(value: number, currency?: CurrencyCode) {
  const selectedCurrency = currency ?? getStoredCurrency();
  return formatCurrencyWithSymbol(value, selectedCurrency);
}

export function getWalletState() {
  if (typeof window === "undefined") {
    return { balance: 0, transactions: [] as WalletTransaction[] };
  }

  const storedBalance = window.localStorage.getItem(WALLET_BALANCE_KEY);
  const parsedBalance = Number(storedBalance ?? "0");
  const balance = Number.isFinite(parsedBalance) ? parsedBalance : 0;

  const storedTransactions = window.localStorage.getItem(WALLET_TRANSACTIONS_KEY);
  let transactions: WalletTransaction[] = [];

  if (storedTransactions) {
    try {
      const parsed = JSON.parse(storedTransactions);
      if (Array.isArray(parsed)) {
        transactions = parsed as WalletTransaction[];
      }
    } catch {
      transactions = [];
    }
  }

  return { balance, transactions };
}

export function setWalletState(balance: number, transactions: WalletTransaction[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(WALLET_BALANCE_KEY, balance.toFixed(2));
  window.localStorage.setItem(WALLET_TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function getLastSeenNotificationId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(NOTIFICATIONS_LAST_SEEN_KEY);
}

export function setLastSeenNotificationId(id: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (id) {
    window.localStorage.setItem(NOTIFICATIONS_LAST_SEEN_KEY, id);
  } else {
    window.localStorage.removeItem(NOTIFICATIONS_LAST_SEEN_KEY);
  }
}

export function getUnreadNotificationCount(transactions: WalletTransaction[]) {
  if (!transactions.length) {
    return 0;
  }

  const lastSeenId = getLastSeenNotificationId();
  if (!lastSeenId) {
    return transactions.length;
  }

  const seenIndex = transactions.findIndex((transaction) => transaction.id === lastSeenId);
  if (seenIndex === -1) {
    return transactions.length;
  }

  return Math.max(0, seenIndex);
}

export function markNotificationsAsRead(transactions: WalletTransaction[]) {
  const latestId = transactions[0]?.id ?? null;
  setLastSeenNotificationId(latestId);
  return latestId;
}

export function addWalletDeposit(amount: number, method: string = "Add fund") {
  const { balance, transactions } = getWalletState();
  const selectedCurrency = getStoredCurrency();
  const amountInUsd = convertAmount(amount, selectedCurrency, "USD");
  const nextBalance = balance + amountInUsd;
  const nextTransaction: WalletTransaction = {
    id: `txn-${Date.now()}`,
    type: "Deposit",
    method,
    amount: `+${formatCurrency(amount, selectedCurrency)}`,
    amountValue: amount,
    status: "Completed",
    date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date().toISOString(),
    kind: "deposit",
  };
  const nextTransactions = [nextTransaction, ...transactions].slice(0, 6);
  setWalletState(nextBalance, nextTransactions);
  return { balance: nextBalance, transactions: nextTransactions };
}

export function applyPurchaseToWallet(amount: number, productName: string) {
  const { balance, transactions } = getWalletState();
  const selectedCurrency = getStoredCurrency();
  const nextBalance = Math.max(0, balance - amount);
  const nextTransaction: WalletTransaction = {
    id: `txn-${Date.now()}`,
    type: "Purchase",
    method: productName,
    amount: `-${formatCurrency(amount, selectedCurrency)}`,
    amountValue: amount,
    status: "Completed",
    date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date().toISOString(),
    kind: "purchase",
  };
  const nextTransactions = [nextTransaction, ...transactions].slice(0, 6);
  setWalletState(nextBalance, nextTransactions);
  return { balance: nextBalance, transactions: nextTransactions };
}
