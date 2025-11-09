"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";

interface DeleteBudgetButtonProps {
  budgetId: string;
  budgetName: string;
}

export function DeleteBudgetButton({ budgetId, budgetName }: DeleteBudgetButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from("budget_plans")
        .delete()
        .eq("id", budgetId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Gagal Menghapus Budget",
          description: error.message,
        });
        return;
      }

      toast({
        variant: "success",
        title: "Budget Berhasil Dihapus!",
        description: "Budget plan telah dihapus.",
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Budget Plan?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus budget plan untuk{" "}
            <span className="font-semibold text-foreground">{budgetName}</span>?
            <br />
            <br />
            Tindakan ini tidak dapat dibatalkan. Semua alert terkait budget ini juga akan dihapus.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
