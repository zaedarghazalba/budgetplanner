"use client";

import { memo } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  categories?: {
    name: string;
    icon: string;
    color: string;
  } | null;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions = memo(function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Belum ada transaksi
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-3">
            {/* Category Icon */}
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: `${transaction.categories?.color}20` }}
            >
              {transaction.categories?.icon || "📌"}
            </div>

            {/* Transaction Details */}
            <div>
              <p className="font-medium text-sm">{transaction.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{transaction.categories?.name || "Tanpa Kategori"}</span>
                <span>•</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-center gap-1">
            {transaction.type === "income" ? (
              <ArrowUpIcon className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-600" />
            )}
            <span
              className={`font-semibold ${
                transaction.type === "income" ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(Number(transaction.amount))}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
});
