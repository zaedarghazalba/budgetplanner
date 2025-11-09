"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, CheckCircle, Calendar } from "lucide-react";
import { EditBudgetButton } from "./edit-budget-button";
import { DeleteBudgetButton } from "./delete-budget-button";

interface BudgetListProps {
  budgets: Array<any>;
}

export function BudgetList({ budgets }: BudgetListProps) {
  if (!budgets || budgets.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-lg font-bold mb-2">Belum Ada Budget Plan</h3>
          <p className="text-muted-foreground">
            Buat budget plan pertama Anda untuk mulai mengatur keuangan
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {budgets.map((budget) => {
        const category = budget.categories as unknown as { name: string; icon: string; color: string } | null;
        return (
        <Card
          key={budget.id}
          className={`border-0 shadow-lg transition-all hover:shadow-xl ${
            budget.isOverBudget
              ? "bg-gradient-to-br from-red-50 to-rose-50"
              : budget.isNearLimit
              ? "bg-gradient-to-br from-orange-50 to-yellow-50"
              : "bg-gradient-to-br from-blue-50 to-indigo-50"
          }`}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {category && (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                    style={{ backgroundColor: category.color + "30" }}
                  >
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                )}
                <div>
                  <CardTitle className="text-lg">
                    {category?.name || "Semua Kategori"}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span className="capitalize">{budget.period_type}</span>
                  </CardDescription>
                </div>
              </div>
              {budget.isOverBudget ? (
                <AlertCircle className="h-6 w-6 text-red-600" />
              ) : budget.isNearLimit ? (
                <AlertCircle className="h-6 w-6 text-orange-600" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {formatCurrency(budget.currentSpending)}
                </span>
                <span className="text-muted-foreground">
                  dari {formatCurrency(budget.amount)}
                </span>
              </div>
              <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    budget.isOverBudget
                      ? "bg-gradient-to-r from-red-500 to-rose-500"
                      : budget.isNearLimit
                      ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500"
                  }`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`font-semibold ${
                    budget.isOverBudget
                      ? "text-red-600"
                      : budget.isNearLimit
                      ? "text-orange-600"
                      : "text-blue-600"
                  }`}
                >
                  {budget.percentage.toFixed(1)}%
                </span>
                <span
                  className={`${
                    budget.remaining < 0 ? "text-red-600" : "text-green-600"
                  } font-medium`}
                >
                  {budget.remaining < 0 ? "Melebihi " : "Sisa "}
                  {formatCurrency(Math.abs(budget.remaining))}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t space-y-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Periode: {new Date(budget.start_date).toLocaleDateString("id-ID")} -{" "}
                  {new Date(budget.end_date).toLocaleDateString("id-ID")}
                </div>
                <div className="text-xs text-muted-foreground">
                  Alert Threshold: <span className="font-semibold text-foreground">{budget.alert_threshold}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <EditBudgetButton budget={budget} />
                <DeleteBudgetButton budgetId={budget.id} budgetName={category?.name || "Semua Kategori"} />
              </div>
            </div>
          </CardContent>
        </Card>
      );
      })}
    </div>
  );
}
