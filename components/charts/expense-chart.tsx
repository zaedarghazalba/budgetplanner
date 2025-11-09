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

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
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
        <Bar dataKey="Pemasukan" fill="#10B981" />
        <Bar dataKey="Pengeluaran" fill="#EF4444" />
      </BarChart>
    </ResponsiveContainer>
  );
});
