import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionList } from "@/components/transactions/transaction-list";
import { AddTransactionButton } from "@/components/transactions/add-transaction-button";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionPagination } from "@/components/transactions/transaction-pagination";
import { PAGINATION } from "@/lib/constants";

// Enable Next.js caching with revalidation
export const revalidate = 30; // Revalidate every 30 seconds

interface SearchParams {
  search?: string;
  type?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Build query
  let query = supabase
    .from("transactions")
    .select(`
      *,
      categories (name, icon, color)
    `, { count: "exact" })
    .eq("user_id", user?.id);

  // Apply filters
  if (searchParams.search) {
    query = query.ilike("description", `%${searchParams.search}%`);
  }

  if (searchParams.type && searchParams.type !== "all") {
    query = query.eq("type", searchParams.type);
  }

  if (searchParams.category && searchParams.category !== "all") {
    query = query.eq("category_id", searchParams.category);
  }

  if (searchParams.dateFrom) {
    query = query.gte("date", searchParams.dateFrom);
  }

  if (searchParams.dateTo) {
    query = query.lte("date", searchParams.dateTo);
  }

  // Pagination
  const page = parseInt(searchParams.page || "1");
  const itemsPerPage = PAGINATION.TRANSACTIONS_PER_PAGE;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // Build total query for calculating sums
  let totalQuery = supabase
    .from("transactions")
    .select("type, amount")
    .eq("user_id", user?.id);

  // Apply same filters to total calculation
  if (searchParams.search) {
    totalQuery = totalQuery.ilike("description", `%${searchParams.search}%`);
  }
  if (searchParams.type && searchParams.type !== "all") {
    totalQuery = totalQuery.eq("type", searchParams.type);
  }
  if (searchParams.category && searchParams.category !== "all") {
    totalQuery = totalQuery.eq("category_id", searchParams.category);
  }
  if (searchParams.dateFrom) {
    totalQuery = totalQuery.gte("date", searchParams.dateFrom);
  }
  if (searchParams.dateTo) {
    totalQuery = totalQuery.lte("date", searchParams.dateTo);
  }

  // Execute all queries in parallel for better performance
  const [
    { data: transactions, count },
    { data: categories },
    { data: allFilteredTransactions }
  ] = await Promise.all([
    query.order("date", { ascending: false }).range(from, to),
    supabase.from("categories").select("*").eq("user_id", user?.id).order("name"),
    totalQuery
  ]);

  const totalIncome = allFilteredTransactions
    ?.filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const totalExpense = allFilteredTransactions
    ?.filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const totalPages = Math.ceil((count || 0) / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 -m-3 sm:-m-4 md:-m-6 mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Semua Transaksi</h1>
            <p className="text-blue-100 mt-1 text-sm sm:text-base">
              Kelola semua transaksi keuangan Anda
            </p>
          </div>
          <AddTransactionButton categories={categories || []} />
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters categories={categories || []} />

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
              {count || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Riwayat Transaksi</CardTitle>
          <CardDescription>
            {count ? `Menampilkan ${transactions?.length || 0} dari ${count} transaksi` : "Belum ada transaksi"}
            {page > 1 && ` - Halaman ${page} dari ${totalPages}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionList
            transactions={transactions || []}
            categories={categories || []}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <TransactionPagination
                currentPage={page}
                totalPages={totalPages}
                searchParams={searchParams}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
