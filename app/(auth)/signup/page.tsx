"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/lib/hooks/use-toast";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Tidak Cocok",
        description: "Pastikan password dan konfirmasi password sama.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password Terlalu Pendek",
        description: "Password minimal 6 karakter!",
      });
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: undefined, // Skip email confirmation
        },
      });

      if (authError) {
        toast({
          variant: "destructive",
          title: "Pendaftaran Gagal",
          description: authError.message,
        });
        return;
      }

      if (!authData.user) {
        toast({
          variant: "destructive",
          title: "Pendaftaran Gagal",
          description: "Gagal membuat user. Silakan coba lagi.",
        });
        return;
      }

      const user = authData.user;

      // Step 2: Manual create profile (bypass trigger)
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: email,
          full_name: name,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Continue anyway, will be created on login
      }

      // Step 3: Manual create default categories (bypass trigger)
      const defaultCategories = [
        { name: 'Makanan & Minuman', type: 'expense', icon: '🍔', color: '#EF4444' },
        { name: 'Transportasi', type: 'expense', icon: '🚗', color: '#F59E0B' },
        { name: 'Belanja', type: 'expense', icon: '🛒', color: '#8B5CF6' },
        { name: 'Hiburan', type: 'expense', icon: '🎬', color: '#EC4899' },
        { name: 'Tagihan', type: 'expense', icon: '💳', color: '#6366F1' },
        { name: 'Kesehatan', type: 'expense', icon: '⚕️', color: '#10B981' },
        { name: 'Pendidikan', type: 'expense', icon: '📚', color: '#3B82F6' },
        { name: 'Lainnya', type: 'expense', icon: '📌', color: '#6B7280' },
        { name: 'Gaji', type: 'income', icon: '💰', color: '#10B981' },
        { name: 'Freelance', type: 'income', icon: '💼', color: '#3B82F6' },
        { name: 'Investasi', type: 'income', icon: '📈', color: '#8B5CF6' },
        { name: 'Hadiah', type: 'income', icon: '🎁', color: '#EC4899' },
        { name: 'Lainnya', type: 'income', icon: '💵', color: '#6B7280' },
      ];

      const categoriesToInsert = defaultCategories.map(cat => ({
        user_id: user.id,
        ...cat,
      }));

      const { error: categoriesError } = await supabase
        .from("categories")
        .insert(categoriesToInsert);

      if (categoriesError) {
        console.error("Categories creation error:", categoriesError);
        // Continue anyway
      }

      toast({
        variant: "success",
        title: "Pendaftaran Berhasil!",
        description: "Silakan login dengan akun Anda.",
      });
      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4">
      <div className="absolute inset-0 bg-black/10"></div>
      <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-sm bg-white/95 relative z-10">
        <CardHeader className="text-center space-y-3 pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
            <span className="text-3xl">💰</span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Daftar Akun Baru
          </CardTitle>
          <CardDescription className="text-base">
            Mulai kelola keuangan Anda hari ini
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Nama Lengkap</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="h-11 border-2 focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-11 border-2 focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
                className="h-11 border-2 focus:border-indigo-500 transition-colors"
              />
              <p className="text-xs text-muted-foreground">Minimal 6 karakter</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
                className="h-11 border-2 focus:border-indigo-500 transition-colors"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sedang mendaftar...</span>
                </div>
              ) : (
                "Daftar"
              )}
            </Button>

            <div className="text-center text-sm pt-2">
              <span className="text-muted-foreground">Sudah punya akun? </span>
              <Link href="/login" className="text-indigo-600 hover:text-indigo-700 hover:underline font-semibold">
                Masuk di sini
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
