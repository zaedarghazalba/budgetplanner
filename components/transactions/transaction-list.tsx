"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate } from "@/lib/utils";
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
} from "@/components/ui/dialog";
import { Pencil, Trash2, Loader2, Receipt } from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";
import { EmptyState } from "@/components/empty-state";
import type { Transaction, Category, TransactionFormData } from "@/lib/types";

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
}

export function TransactionList({ transactions, categories }: TransactionListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState<TransactionFormData>({
    type: "expense",
    category_id: "",
    amount: "",
    description: "",
    date: "",
  });

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      type: transaction.type,
      category_id: transaction.category_id,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date,
    });
    setEditOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDeleteOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransaction) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          type: formData.type,
          category_id: formData.category_id,
          amount: parseFloat(formData.amount),
          description: formData.description,
          date: formData.date,
        })
        .eq("id", selectedTransaction.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Gagal Mengupdate Transaksi",
          description: error.message,
        });
        return;
      }

      toast({
        variant: "success",
        title: "Transaksi Berhasil Diupdate!",
        description: "Perubahan telah disimpan.",
      });
      setEditOpen(false);
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

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", selectedTransaction.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Gagal Menghapus Transaksi",
          description: error.message,
        });
        return;
      }

      toast({
        variant: "success",
        title: "Transaksi Berhasil Dihapus!",
        description: "Transaksi telah dihapus.",
      });
      setDeleteOpen(false);
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

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="Belum Ada Transaksi"
        description="Mulai kelola keuangan Anda dengan mencatat transaksi pertama. Transaksi akan muncul di sini setelah Anda menambahkannya."
      />
    );
  }

  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.type
  );

  return (
    <>
      <div className="space-y-2">
        {transactions.map((transaction) => {
          const category = transaction.categories as unknown as { name: string; icon: string; color: string } | null;
          return (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 sm:p-4 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              {category && (
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: category.color + "20",
                  }}
                >
                  <span className="text-lg sm:text-xl">{category.icon}</span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base truncate">{transaction.description}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {category?.name} • {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              <div className="text-right mr-1 sm:mr-2">
                <p
                  className={`font-bold ${
                    transaction.type === "income"
                      ? "text-cyan-600"
                      : "text-pink-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(transaction)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(transaction)}
                className="h-8 w-8 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px] max-w-[95vw]">
          <form onSubmit={handleUpdateSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Edit Transaksi</DialogTitle>
              <DialogDescription className="text-sm">
                Ubah detail transaksi Anda
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="edit-type" className="text-sm sm:text-base">Tipe Transaksi</Label>
                <select
                  id="edit-type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as "income" | "expense", category_id: "" })
                  }
                  className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={loading}
                >
                  <option value="expense">Pengeluaran</option>
                  <option value="income">Pemasukan</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="edit-category" className="text-sm sm:text-base">Kategori</Label>
                <select
                  id="edit-category"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={loading}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="edit-amount" className="text-sm sm:text-base">Jumlah</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                  disabled={loading}
                  min="0"
                  step="100"
                  className="h-10 sm:h-11"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="edit-description" className="text-sm sm:text-base">Deskripsi</Label>
                <Input
                  id="edit-description"
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  disabled={loading}
                  className="h-10 sm:h-11"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="edit-date" className="text-sm sm:text-base">Tanggal</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                  disabled={loading}
                  className="h-10 sm:h-11"
                />
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
                  "Simpan Perubahan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Transaksi</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedTransaction && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedTransaction.description}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(selectedTransaction.amount)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
