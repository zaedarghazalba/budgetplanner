import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Download, Calendar, TrendingUp, TrendingDown, PieChart } from "lucide-react";
import { ReportsChartWrapper } from "@/components/charts/reports-chart-wrapper";
import { ExportButton } from "@/components/reports/export-button";

// Enable Next.js caching with revalidation
export const revalidate = 60; // Revalidate every 60 seconds

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get current year transactions
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear(), 11, 31);

  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      *,
      categories (name, icon, color, type)
    `)
    .eq("user_id", user?.id)
    .gte("date", startOfYear.toISOString().split("T")[0])
    .lte("date", endOfYear.toISOString().split("T")[0])
    .order("date", { ascending: false });

  // Calculate monthly data
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i;
    const monthTransactions = transactions?.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === month;
    }) || [];

    const income = monthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = monthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      month: new Date(now.getFullYear(), month).toLocaleDateString("id-ID", { month: "short" }),
      income,
      expense,
      balance: income - expense,
    };
  });

  // Calculate category breakdown
  const categoryBreakdown = transactions?.reduce((acc, t) => {
    const categoryName = t.categories?.name || "Lainnya";
    if (!acc[categoryName]) {
      acc[categoryName] = {
        name: categoryName,
        amount: 0,
        count: 0,
        icon: t.categories?.icon || "📌",
        color: t.categories?.color || "#6B7280",
        type: t.type,
      };
    }
    acc[categoryName].amount += Number(t.amount);
    acc[categoryName].count += 1;
    return acc;
  }, {} as Record<string, any>);

  const expenseCategories = Object.values(categoryBreakdown || {})
    .filter((cat: any) => cat.type === "expense")
    .sort((a: any, b: any) => b.amount - a.amount);

  const incomeCategories = Object.values(categoryBreakdown || {})
    .filter((cat: any) => cat.type === "income")
    .sort((a: any, b: any) => b.amount - a.amount);

  // Total calculations
  const totalIncome = transactions
    ?.filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const totalExpense = transactions
    ?.filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 -m-3 sm:-m-4 md:-m-6 mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Laporan Keuangan</h1>
            <p className="text-blue-100 mt-1 text-sm sm:text-base">
              Tahun {now.getFullYear()}
            </p>
          </div>
          <ExportButton transactions={transactions || []} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-700">Total Pemasukan</CardTitle>
            <TrendingUp className="h-5 w-5 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-cyan-600/70 mt-1">
              {transactions?.filter(t => t.type === "income").length || 0} transaksi
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-rose-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-pink-700">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-5 w-5 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">
              {formatCurrency(totalExpense)}
            </div>
            <p className="text-xs text-pink-600/70 mt-1">
              {transactions?.filter(t => t.type === "expense").length || 0} transaksi
            </p>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-lg ${netBalance >= 0 ? "bg-gradient-to-br from-blue-50 to-indigo-50" : "bg-gradient-to-br from-violet-50 to-purple-50"}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${netBalance >= 0 ? "text-blue-700" : "text-violet-700"}`}>
              Saldo Bersih
            </CardTitle>
            <PieChart className={`h-5 w-5 ${netBalance >= 0 ? "text-blue-600" : "text-violet-600"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? "text-blue-600" : "text-violet-600"}`}>
              {formatCurrency(netBalance)}
            </div>
            <p className={`text-xs mt-1 ${netBalance >= 0 ? "text-blue-600/70" : "text-violet-600/70"}`}>
              {netBalance >= 0 ? "Surplus" : "Defisit"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Grafik Bulanan {now.getFullYear()}</CardTitle>
          <CardDescription>Perbandingan pemasukan dan pengeluaran per bulan</CardDescription>
        </CardHeader>
        <CardContent>
          <ReportsChartWrapper data={monthlyData} />
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Expense Categories */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Pengeluaran per Kategori</CardTitle>
            <CardDescription>Top pengeluaran tertinggi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenseCategories.slice(0, 5).map((cat: any) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: cat.color + "20" }}
                    >
                      <span className="text-xl">{cat.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">{cat.count} transaksi</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-600">{formatCurrency(cat.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {((cat.amount / totalExpense) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Income Categories */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Pemasukan per Kategori</CardTitle>
            <CardDescription>Sumber pemasukan utama</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incomeCategories.slice(0, 5).map((cat: any) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: cat.color + "20" }}
                    >
                      <span className="text-xl">{cat.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">{cat.count} transaksi</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-cyan-600">{formatCurrency(cat.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {((cat.amount / totalIncome) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
