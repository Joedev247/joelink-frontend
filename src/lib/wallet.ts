export type WalletTransaction = {
  id: string;
  type: string;
  method: string;
  amount: string;
  status: string;
  date: string;
  kind: "deposit" | "purchase";
};

export const WALLET_BALANCE_KEY = "joelink-wallet-balance";
export const WALLET_TRANSACTIONS_KEY = "joelink-wallet-transactions";

export const defaultWalletTransactions: WalletTransaction[] = [
  {
    id: "txn-1",
    type: "Deposit",
    method: "Add fund",
    amount: "+$120.00",
    status: "Completed",
    date: "Jul 22",
    kind: "deposit",
  },
  {
    id: "txn-2",
    type: "Deposit",
    method: "Add fund",
    amount: "+$45.00",
    status: "Completed",
    date: "Jul 20",
    kind: "deposit",
  },
  {
    id: "txn-3",
    type: "Purchase",
    method: "Order",
    amount: "-$32.50",
    status: "Pending",
    date: "Jul 21",
    kind: "purchase",
  },
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function getWalletState() {
  if (typeof window === "undefined") {
    return { balance: 0, transactions: defaultWalletTransactions };
  }

  const storedBalance = window.localStorage.getItem(WALLET_BALANCE_KEY);
  const parsedBalance = Number(storedBalance ?? "0");
  const balance = Number.isFinite(parsedBalance) ? parsedBalance : 0;

  const storedTransactions = window.localStorage.getItem(WALLET_TRANSACTIONS_KEY);
  let transactions = defaultWalletTransactions;

  if (storedTransactions) {
    try {
      const parsed = JSON.parse(storedTransactions);
      if (Array.isArray(parsed)) {
        transactions = parsed as WalletTransaction[];
      }
    } catch {
      transactions = defaultWalletTransactions;
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

export function addWalletDeposit(amount: number, method: string = "Add fund") {
  const { balance, transactions } = getWalletState();
  const nextBalance = balance + amount;
  const nextTransaction: WalletTransaction = {
    id: `txn-${Date.now()}`,
    type: "Deposit",
    method,
    amount: `+$${amount.toFixed(2)}`,
    status: "Completed",
    date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    kind: "deposit",
  };
  const nextTransactions = [nextTransaction, ...transactions].slice(0, 6);
  setWalletState(nextBalance, nextTransactions);
  return { balance: nextBalance, transactions: nextTransactions };
}
