"use client";

import { memo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  date: string;
}

interface ExpenseChartProps {
  transactions: Transaction[];
}

export const ExpenseChart = memo(function ExpenseChart({ transactions }: ExpenseChartProps) {
  // Group transactions by date (keep original date for sorting)
  const groupedData: { [key: string]: { income: number; expense: number; originalDate: string } } = {};

  transactions.forEach((transaction) => {
    const dateObj = new Date(transaction.date);
    const formattedDate = dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    });

    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = {
        income: 0,
        expense: 0,
        originalDate: transaction.date // Keep original date for sorting
      };
    }

    if (transaction.type === "income") {
      groupedData[formattedDate].income += Number(transaction.amount);
    } else {
      groupedData[formattedDate].expense += Number(transaction.amount);
    }
  });

  const chartData = Object.entries(groupedData)
    .map(([date, data]) => ({
      date,
      Pemasukan: data.income,
      Pengeluaran: data.expense,
      originalDate: data.originalDate,
    }))
    .sort((a, b) => new Date(a.originalDate).getTime() - new Date(b.originalDate).getTime()) // Sort by original date
    .slice(-7); // Last 7 days

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Belum ada data transaksi
      </div>
    );
  }

  // Format large numbers to abbreviated form (e.g. 1.5jt, 500rb)
  const formatYAxis = (value: number) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}jt`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 0)}rb`;
    }
    return value.toString();
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={12} tick={{ fontSize: 11 }} />
        <YAxis
          width={55}
          tickFormatter={formatYAxis}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(value)
          }
        />
        <Legend />
        <Bar dataKey="Pemasukan" fill="#10B981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Pengeluaran" fill="#EF4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
});
