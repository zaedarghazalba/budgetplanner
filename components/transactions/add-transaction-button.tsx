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

interface AddTransactionButtonProps {
  categories: any[];
}

export function AddTransactionButton({ categories }: AddTransactionButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: "expense",
    category_id: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

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

      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        type: formData.type,
        category_id: formData.category_id,
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Gagal Menambah Transaksi",
          description: error.message,
        });
        return;
      }

      toast({
        variant: "success",
        title: "Transaksi Berhasil Ditambahkan!",
        description: "Transaksi baru telah dicatat.",
      });
      setOpen(false);
      setFormData({
        type: "expense",
        category_id: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
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

  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.type
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-indigo-600 hover:bg-white/90 shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Transaksi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px] max-w-[95vw]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Tambah Transaksi Baru</DialogTitle>
            <DialogDescription className="text-sm">
              Catat transaksi pemasukan atau pengeluaran
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="type" className="text-sm sm:text-base">Tipe Transaksi</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value, category_id: "" })
                }
                className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={loading}
              >
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="category" className="text-sm sm:text-base">Kategori</Label>
              <select
                id="category"
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
              <Label htmlFor="amount" className="text-sm sm:text-base">Jumlah</Label>
              <Input
                id="amount"
                type="number"
                placeholder="50000"
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
              <Label htmlFor="description" className="text-sm sm:text-base">Deskripsi</Label>
              <Input
                id="description"
                type="text"
                placeholder="Makan siang"
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
              <Label htmlFor="date" className="text-sm sm:text-base">Tanggal</Label>
              <Input
                id="date"
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
                "Tambah Transaksi"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
