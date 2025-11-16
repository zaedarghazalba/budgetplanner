"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";

interface ProfileFormProps {
  profile: {
    id: string;
    email: string;
    full_name?: string;
    currency?: string;
  } | null;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [currency, setCurrency] = useState(profile?.currency || "IDR");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user session
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Sesi Berakhir",
          description: "Silakan login kembali.",
        });
        router.push("/login");
        return;
      }

      // Update profile using auth.uid() via RLS
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          currency: currency,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Gagal Memperbarui Profil",
          description: error.message,
        });
        return;
      }

      toast({
        variant: "success",
        title: "Profil Berhasil Diperbarui!",
        description: "Perubahan telah disimpan.",
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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="email" className="text-sm sm:text-base font-semibold">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={profile?.email || ""}
          disabled
          className="h-10 sm:h-11 bg-slate-50 cursor-not-allowed"
        />
        <p className="text-xs text-muted-foreground">
          Email tidak dapat diubah
        </p>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="fullName" className="text-sm sm:text-base font-semibold">
          Nama Lengkap
        </Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Masukkan nama lengkap"
          disabled={loading}
          className="h-10 sm:h-11 border-2 focus:border-indigo-500 transition-colors"
        />
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="currency" className="text-sm sm:text-base font-semibold">
          Mata Uang
        </Label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          disabled={loading}
          className="flex h-10 sm:h-11 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          <option value="IDR">IDR (Rupiah)</option>
          <option value="USD">USD (US Dollar)</option>
          <option value="EUR">EUR (Euro)</option>
          <option value="SGD">SGD (Singapore Dollar)</option>
          <option value="MYR">MYR (Malaysian Ringgit)</option>
        </select>
      </div>

      <div className="pt-3 sm:pt-4 border-t">
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Menyimpan...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span>Simpan Perubahan</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
