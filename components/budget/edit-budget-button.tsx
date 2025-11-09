"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Loader2 } from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";

interface EditBudgetButtonProps {
  budget: any;
}

export function EditBudgetButton({ budget }: EditBudgetButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    category_id: budget.category_id || "",
    amount: budget.amount?.toString() || "",
    period_type: budget.period_type || "monthly",
    alert_threshold: budget.alert_threshold?.toString() || "80",
  });

  // Load categories and reset form data when dialog opens
  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Reset form data with current budget values
      setFormData({
        category_id: budget.category_id || "",
        amount: budget.amount?.toString() || "",
        period_type: budget.period_type || "monthly",
        alert_threshold: budget.alert_threshold?.toString() || "80",
      });

      // Load categories if not loaded yet
      if (categories.length === 0) {
        const { data } = await supabase
          .from("categories")
          .select("*")
          .order("name");
        setCategories(data || []);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Login Diperlukan",
          description: "Anda harus login terlebih dahulu.",
        });
        return;
      }

      // Check if changing category to one that already has a budget plan
      const newCategoryId = formData.category_id || null;
      const oldCategoryId = budget.category_id || null;

      // Only check if category is being changed
      if (newCategoryId !== oldCategoryId) {
        let query = supabase
          .from("budget_plans")
          .select("id, categories(name, icon)")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .neq("id", budget.id); // Exclude current budget

        // Use .is() for null check, .eq() for value comparison
        if (newCategoryId === null) {
          query = query.is("category_id", null);
        } else {
          query = query.eq("category_id", newCategoryId);
        }

        const { data: existingBudgets } = await query;

        if (existingBudgets && existingBudgets.length > 0) {
          const category = existingBudgets[0].categories as unknown as { name: string; icon: string } | null;
          const categoryName = category
            ? `${category.icon} ${category.name}`
            : "Semua Kategori";

          toast({
            variant: "destructive",
            title: "Budget Plan Sudah Ada",
            description: `Budget plan untuk "${categoryName}" sudah ada. Satu kategori hanya bisa memiliki 1 budget plan aktif. Silakan hapus budget plan yang lain terlebih dahulu.`,
          });
          setLoading(false);
          return;
        }
      }

      // Calculate new start and end dates based on period type
      const now = new Date();
      let startDate, endDate;

      if (formData.period_type === "weekly") {
        startDate = new Date(now);
        endDate = new Date(now.setDate(now.getDate() + 7));
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      }

      const updateData = {
        category_id: newCategoryId,
        amount: parseFloat(formData.amount),
        period_type: formData.period_type,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        alert_threshold: parseFloat(formData.alert_threshold),
      };

      console.log("🔍 Updating budget with data:", updateData);

      const { data, error } = await supabase
        .from("budget_plans")
        .update(updateData)
        .eq("id", budget.id)
        .select();

      if (error) {
        console.error("❌ Update error:", error);
        toast({
          variant: "destructive",
          title: "Gagal Mengupdate Budget",
          description: error.message,
        });
        return;
      }

      console.log("✅ Budget updated successfully:", data);
      toast({
        variant: "success",
        title: "Budget Berhasil Diupdate!",
        description: "Perubahan telah disimpan.",
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description: "Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px] max-w-[95vw]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit Budget Plan</DialogTitle>
            <DialogDescription className="text-sm">
              Update budget plan Anda
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="category" className="text-sm sm:text-base">Kategori (Opsional)</Label>
              <select
                id="category"
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={loading}
              >
                <option value="">Semua Kategori</option>
                {categories
                  .filter((cat) => cat.type === "expense")
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Kosongkan untuk budget keseluruhan
              </p>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="amount" className="text-sm sm:text-base">Jumlah Budget</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1000000"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
                disabled={loading}
                min="0"
                step="1000"
                className="h-10 sm:h-11"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="period" className="text-sm sm:text-base">Periode</Label>
              <select
                id="period"
                value={formData.period_type}
                onChange={(e) =>
                  setFormData({ ...formData, period_type: e.target.value })
                }
                className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={loading}
              >
                <option value="weekly">Mingguan</option>
                <option value="monthly">Bulanan</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="threshold" className="text-sm sm:text-base">Alert Threshold (%)</Label>
              <Input
                id="threshold"
                type="number"
                value={formData.alert_threshold}
                onChange={(e) =>
                  setFormData({ ...formData, alert_threshold: e.target.value })
                }
                required
                disabled={loading}
                className="h-10 sm:h-11"
                min="0"
                max="100"
              />
              <p className="text-xs text-muted-foreground">
                Akan mengirim alert jika pengeluaran mencapai persentase ini
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Update Budget"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
