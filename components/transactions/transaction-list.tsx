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
import { Pencil, Trash2, Loader2 } from "lucide-react";

interface TransactionListProps {
  transactions: any[];
  categories: any[];
}

export function TransactionList({ transactions, categories }: TransactionListProps) {
  const router = useRouter();
  const supabase = createClient();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [formData, setFormData] = useState({
    type: "",
    category_id: "",
    amount: "",
    description: "",
    date: "",
  });

  const handleEdit = (transaction: any) => {
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

  const handleDelete = (transaction: any) => {
    setSelectedTransaction(transaction);
    setDeleteOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        alert("Gagal mengupdate transaksi: " + error.message);
        return;
      }

      alert("Transaksi berhasil diupdate!");
      setEditOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", selectedTransaction.id);

      if (error) {
        alert("Gagal menghapus transaksi: " + error.message);
        return;
      }

      alert("Transaksi berhasil dihapus!");
      setDeleteOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📝</div>
        <h3 className="text-lg font-bold mb-2">Belum Ada Transaksi</h3>
        <p className="text-muted-foreground">
          Tambahkan transaksi pertama Anda
        </p>
      </div>
    );
  }

  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.type
  );

  return (
    <>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              {transaction.categories && (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: transaction.categories.color + "20",
                  }}
                >
                  <span className="text-xl">{transaction.categories.icon}</span>
                </div>
              )}
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.categories?.name} • {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-2">
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
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleUpdateSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Transaksi</DialogTitle>
              <DialogDescription>
                Ubah detail transaksi Anda
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Tipe Transaksi</Label>
                <select
                  id="edit-type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value, category_id: "" })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={loading}
                >
                  <option value="expense">Pengeluaran</option>
                  <option value="income">Pemasukan</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Kategori</Label>
                <select
                  id="edit-category"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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

              <div className="space-y-2">
                <Label htmlFor="edit-amount">Jumlah</Label>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Input
                  id="edit-description"
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-date">Tanggal</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
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
