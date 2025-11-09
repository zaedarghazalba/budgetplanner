"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  transactions: Array<{
    date: string;
    type: string;
    amount: number;
    description: string;
    categories?: {
      name: string;
    };
  }>;
}

export function ExportButton({ transactions }: ExportButtonProps) {
  const handleExport = () => {
    // Create CSV content
    const headers = ["Tanggal", "Tipe", "Kategori", "Deskripsi", "Jumlah"];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString("id-ID"),
      t.type === "income" ? "Pemasukan" : "Pengeluaran",
      t.categories?.name || "-",
      t.description,
      t.amount.toString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `laporan-keuangan-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={handleExport}
      className="bg-white text-indigo-600 hover:bg-white/90 shadow-lg"
    >
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
}
