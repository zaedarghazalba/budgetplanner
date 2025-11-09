"use client";

import dynamic from "next/dynamic";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  date: string;
}

interface ExpenseChartWrapperProps {
  transactions: Transaction[];
}

// Lazy load chart untuk performa lebih baik
const ExpenseChart = dynamic(
  () => import("./expense-chart").then((mod) => ({ default: mod.ExpenseChart })),
  {
    loading: () => (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <div className="animate-pulse">Memuat grafik...</div>
      </div>
    ),
    ssr: false, // Disable SSR untuk chart - reduce bundle size
  }
);

export function ExpenseChartWrapper({ transactions }: ExpenseChartWrapperProps) {
  return <ExpenseChart transactions={transactions} />;
}
