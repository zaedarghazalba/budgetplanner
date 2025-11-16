import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Plus, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { BudgetList } from "@/components/budget/budget-list";
import { CreateBudgetButton } from "@/components/budget/create-budget-button";

// Enable Next.js caching with revalidation
export const revalidate = 30; // Revalidate every 30 seconds

export default async function BudgetPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get active budget plans
  const { data: budgetPlans } = await supabase
    .from("budget_plans")
    .select(`
      *,
      categories (name, icon, color)
    `)
    .eq("user_id", user?.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Get current month transactions for each budget
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Calculate spending for each budget plan
  const budgetWithSpending = await Promise.all(
    (budgetPlans || []).map(async (budget) => {
      const query = supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", user?.id)
        .eq("type", "expense")
        .gte("date", budget.start_date)
        .lte("date", budget.end_date);

      if (budget.category_id) {
        query.eq("category_id", budget.category_id);
      }

      const { data: transactions } = await query;

      const currentSpending = transactions?.reduce(
        (sum, t) => sum + Number(t.amount),
        0
      ) || 0;

      const percentage = (currentSpending / Number(budget.amount)) * 100;
      const isOverBudget = currentSpending > Number(budget.amount);
      const isNearLimit = percentage >= Number(budget.alert_threshold) && !isOverBudget;

      return {
        ...budget,
        currentSpending,
        percentage: Math.min(percentage, 100),
        isOverBudget,
        isNearLimit,
        remaining: Number(budget.amount) - currentSpending,
      };
    })
  );

  // Calculate summary statistics
  const totalBudget = budgetWithSpending.reduce((sum, b) => sum + Number(b.amount), 0);
  const totalSpent = budgetWithSpending.reduce((sum, b) => sum + b.currentSpending, 0);
  const budgetsOverLimit = budgetWithSpending.filter(b => b.isOverBudget).length;
  const budgetsNearLimit = budgetWithSpending.filter(b => b.isNearLimit).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 -m-3 sm:-m-4 md:-m-6 mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Budget Planning</h1>
            <p className="text-blue-100 mt-1 text-sm sm:text-base">
              Rencanakan dan pantau anggaran bulanan Anda
            </p>
          </div>
          <CreateBudgetButton />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Budget</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalBudget)}
            </div>
            <p className="text-xs text-blue-600/70 mt-1">
              {budgetWithSpending.length} budget aktif
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Terpakai</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalSpent)}
            </div>
            <p className="text-xs text-purple-600/70 mt-1">
              {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}% dari total
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Mendekati Batas</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {budgetsNearLimit}
            </div>
            <p className="text-xs text-orange-600/70 mt-1">Budget perlu perhatian</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Melebihi Budget</CardTitle>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {budgetsOverLimit}
            </div>
            <p className="text-xs text-red-600/70 mt-1">Budget terlampaui</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget List */}
      <BudgetList budgets={budgetWithSpending} />
    </div>
  );
}
