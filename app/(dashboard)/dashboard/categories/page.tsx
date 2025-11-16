import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryList } from "@/components/categories/category-list";
import { AddCategoryButton } from "@/components/categories/add-category-button";

// Enable Next.js caching with revalidation
export const revalidate = 60; // Revalidate every 60 seconds

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get all categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user?.id)
    .order("type", { ascending: true })
    .order("name", { ascending: true });

  // Separate by type
  const incomeCategories = categories?.filter(c => c.type === "income") || [];
  const expenseCategories = categories?.filter(c => c.type === "expense") || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 -m-3 sm:-m-4 md:-m-6 mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Kategori</h1>
            <p className="text-blue-100 mt-1 text-sm sm:text-base">
              Kelola kategori transaksi Anda
            </p>
          </div>
          <AddCategoryButton />
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-emerald-700">Kategori Pemasukan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {incomeCategories.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-pink-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-rose-700">Kategori Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {expenseCategories.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income Categories */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <span className="text-2xl">💰</span>
            Kategori Pemasukan
          </CardTitle>
          <CardDescription>Kelola kategori untuk transaksi pemasukan</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryList categories={incomeCategories} type="income" />
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <span className="text-2xl">💸</span>
            Kategori Pengeluaran
          </CardTitle>
          <CardDescription>Kelola kategori untuk transaksi pengeluaran</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryList categories={expenseCategories} type="expense" />
        </CardContent>
      </Card>
    </div>
  );
}
