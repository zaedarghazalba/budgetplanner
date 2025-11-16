"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";
import { CATEGORY_ICONS, CATEGORY_COLORS, LIMITS } from "@/lib/constants";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
}

interface EditCategoryButtonProps {
  category: Category;
}

const EMOJI_OPTIONS = [...CATEGORY_ICONS];
const COLOR_OPTIONS = [...CATEGORY_COLORS];

export function EditCategoryButton({ category }: EditCategoryButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: category.name,
    type: category.type,
    icon: category.icon,
    color: category.color,
  });
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Check for duplicate category name (excluding current category)
      const { data: existing } = await supabase
        .from("categories")
        .select("id")
        .eq("user_id", user.id)
        .eq("name", formData.name.trim())
        .eq("type", formData.type)
        .neq("id", category.id)
        .single();

      if (existing) {
        toast({
          variant: "destructive",
          title: "Kategori Sudah Ada",
          description: `Kategori "${formData.name}" untuk ${formData.type === "income" ? "pemasukan" : "pengeluaran"} sudah ada.`,
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("categories")
        .update({
          name: formData.name.trim(),
          type: formData.type,
          icon: formData.icon,
          color: formData.color,
        })
        .eq("id", category.id);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: "Kategori berhasil diperbarui.",
      });

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        variant: "destructive",
        title: "Gagal Memperbarui Kategori",
        description: error instanceof Error ? error.message : "Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
            <DialogDescription>
              Perbarui informasi kategori Anda
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nama Kategori</Label>
              <Input
                id="edit-name"
                placeholder="Contoh: Kos, Internet, Gym"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                maxLength={LIMITS.MAX_CATEGORY_NAME_LENGTH}
              />
            </div>

            {/* Type */}
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Tipe</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as "income" | "expense" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">💰 Pemasukan</SelectItem>
                  <SelectItem value="expense">💸 Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Icon */}
            <div className="grid gap-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-9 gap-2 p-3 border rounded-lg max-h-32 overflow-y-auto">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    className={`text-2xl p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                      formData.icon === emoji ? "bg-blue-100 ring-2 ring-blue-500" : ""
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Icon terpilih: <span className="text-xl">{formData.icon}</span>
              </p>
            </div>

            {/* Color */}
            <div className="grid gap-2">
              <Label>Warna</Label>
              <div className="grid grid-cols-5 gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`h-10 rounded-lg border-2 hover:scale-110 transition-transform ${
                      formData.color === color.value ? "ring-2 ring-offset-2 ring-gray-400" : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Warna terpilih: {COLOR_OPTIONS.find(c => c.value === formData.color)?.name}
              </p>
            </div>

            {/* Preview */}
            <div className="grid gap-2">
              <Label>Preview</Label>
              <div
                className="flex items-center gap-3 p-4 rounded-xl border-2"
                style={{
                  borderColor: formData.color + "40",
                  backgroundColor: formData.color + "10"
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                  style={{ backgroundColor: formData.color + "30" }}
                >
                  {formData.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {formData.name || "Nama Kategori"}
                  </h4>
                  <p className="text-xs text-gray-500 capitalize">
                    {formData.type === "income" ? "Pemasukan" : "Pengeluaran"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
