"use client";

import { useState } from "react";
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
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";

export function CreateBudgetButton() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    category_id: "",
    amount: "",
    period_type: "monthly",
    alert_threshold: "80",
  });

  // Load categories when dialog opens
  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && categories.length === 0) {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      setCategories(data || []);
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

      // Check if budget plan already exists for this category
      const categoryId = formData.category_id || null;

      console.log("🔍 Checking for existing budget with category_id:", categoryId);

      let query = supabase
        .from("budget_plans")
        .select("id, categories(name, icon)")
        .eq("user_id", user.id)
        .eq("is_active", true);

      // Use .is() for null check, .eq() for value comparison
      if (categoryId === null) {
        query = query.is("category_id", null);
      } else {
        query = query.eq("category_id", categoryId);
      }

      const { data: existingBudgets } = await query;

      console.log("🔍 Found existing budgets:", existingBudgets);

      if (existingBudgets && existingBudgets.length > 0) {
        const category = existingBudgets[0].categories as unknown as { name: string; icon: string } | null;
        const categoryName = category
          ? `${category.icon} ${category.name}`
          : "Semua Kategori";

        toast({
          variant: "destructive",
          title: "Budget Plan Sudah Ada",
          description: `Budget plan untuk "${categoryName}" sudah ada. Satu kategori hanya bisa memiliki 1 budget plan aktif. Silakan edit budget plan yang sudah ada.`,
        });
        setLoading(false);
        return;
      }

      // Calculate start and end dates based on period type
      const now = new Date();
      let startDate, endDate;

      if (formData.period_type === "weekly") {
        startDate = new Date(now);
        endDate = new Date(now.setDate(now.getDate() + 7));
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      }

      const { error } = await supabase.from("budget_plans").insert({
        user_id: user.id,
        category_id: categoryId,
        amount: parseFloat(formData.amount),
        period_type: formData.period_type,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        alert_threshold: parseFloat(formData.alert_threshold),
        is_active: true,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Gagal Membuat Budget",
          description: error.message,
        });
        return;
      }

      toast({
        variant: "success",
        title: "Budget Berhasil Dibuat!",
        description: "Budget plan baru telah ditambahkan.",
      });
      setOpen(false);
      setFormData({
        category_id: "",
        amount: "",
        period_type: "monthly",
        alert_threshold: "80",
      });
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
        <Button className="bg-white text-indigo-600 hover:bg-white/90 shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Buat Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px] max-w-[95vw]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Buat Budget Plan Baru</DialogTitle>
            <DialogDescription className="text-sm">
              Atur batas pengeluaran untuk periode tertentu
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
                min="0"
                max="100"
                className="h-10 sm:h-11"
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
                "Buat Budget"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
