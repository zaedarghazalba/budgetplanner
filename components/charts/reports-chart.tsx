"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ReportsChartProps {
  data: Array<{
    month: string;
    income: number;
    expense: number;
    balance: number;
  }>;
}

export function ReportsChart({ data }: ReportsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="month"
          className="text-xs"
          tick={{ fill: "#64748b" }}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: "#64748b" }}
          tickFormatter={(value) => {
            if (value >= 1000000) {
              return `${(value / 1000000).toFixed(1)}jt`;
            } else if (value >= 1000) {
              return `${(value / 1000).toFixed(0)}rb`;
            }
            return value;
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
          formatter={(value: number) => {
            return new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(value);
          }}
          labelStyle={{ color: "#1e293b", fontWeight: 600 }}
        />
        <Legend
          wrapperStyle={{
            paddingTop: "20px",
          }}
        />
        <Bar
          dataKey="income"
          fill="#06b6d4"
          name="Pemasukan"
          radius={[8, 8, 0, 0]}
        />
        <Bar
          dataKey="expense"
          fill="#ec4899"
          name="Pengeluaran"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
