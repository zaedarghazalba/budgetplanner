import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionList } from "@/components/transactions/transaction-list";
import { AddTransactionButton } from "@/components/transactions/add-transaction-button";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get all transactions with categories
  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      *,
      categories (name, icon, color)
    `)
    .eq("user_id", user?.id)
    .order("date", { ascending: false })
    .limit(100);

  // Get categories for the form
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user?.id)
    .order("name");

  // Calculate totals
  const totalIncome = transactions
    ?.filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const totalExpense = transactions
    ?.filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 -m-6 mb-6 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Semua Transaksi</h1>
            <p className="text-blue-100 mt-1">
              Kelola semua transaksi keuangan Anda
            </p>
          </div>
          <AddTransactionButton categories={categories || []} />
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-cyan-700">Total Pemasukan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">
              Rp {totalIncome.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-rose-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-pink-700">Total Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">
              Rp {totalExpense.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700">Total Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {transactions?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Riwayat Transaksi</CardTitle>
          <CardDescription>100 transaksi terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionList
            transactions={transactions || []}
            categories={categories || []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
