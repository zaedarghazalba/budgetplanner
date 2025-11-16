"use client";

import dynamic from "next/dynamic";

interface ReportsChartWrapperProps {
  data: Array<{
    month: string;
    income: number;
    expense: number;
    balance: number;
  }>;
}

// Lazy load chart for better performance
const ReportsChart = dynamic(
  () => import("./reports-chart").then((mod) => ({ default: mod.ReportsChart })),
  {
    loading: () => (
      <div className="h-[350px] flex items-center justify-center text-muted-foreground">
        <div className="animate-pulse">Memuat grafik...</div>
      </div>
    ),
    ssr: false, // Disable SSR for chart - reduce bundle size
  }
);

export function ReportsChartWrapper({ data }: ReportsChartWrapperProps) {
  return <ReportsChart data={data} />;
}
