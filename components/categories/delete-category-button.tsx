"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";
import { ErrorHandler } from "@/lib/error-handler";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
}

interface DeleteCategoryButtonProps {
  category: Category;
}

export function DeleteCategoryButton({ category }: DeleteCategoryButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleDelete = async () => {
    setLoading(true);

    try {
      // Check if category is being used in transactions
      const { data: transactions, error: checkError } = await supabase
        .from("transactions")
        .select("id")
        .eq("category_id", category.id)
        .limit(1);

      if (checkError) throw checkError;

      if (transactions && transactions.length > 0) {
        toast({
          variant: "destructive",
          title: "Kategori Tidak Dapat Dihapus",
          description: "Kategori ini masih digunakan pada transaksi. Hapus atau ubah transaksi terkait terlebih dahulu.",
        });
        setLoading(false);
        setOpen(false);
        return;
      }

      // Check if category is being used in budget plans
      const { data: budgets, error: budgetCheckError } = await supabase
        .from("budget_plans")
        .select("id")
        .eq("category_id", category.id)
        .limit(1);

      if (budgetCheckError) throw budgetCheckError;

      if (budgets && budgets.length > 0) {
        toast({
          variant: "destructive",
          title: "Kategori Tidak Dapat Dihapus",
          description: "Kategori ini masih digunakan pada budget plan. Hapus atau ubah budget plan terkait terlebih dahulu.",
        });
        setLoading(false);
        setOpen(false);
        return;
      }

      // Delete the category
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", category.id);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: "Kategori berhasil dihapus.",
      });

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast(ErrorHandler.getToastConfig(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus kategori <strong>{category.icon} {category.name}</strong>?
            <br /><br />
            <span className="text-red-600 font-medium">
              Kategori yang masih digunakan pada transaksi atau budget plan tidak dapat dihapus.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
