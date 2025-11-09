import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Bell, Palette } from "lucide-react";
import { ProfileForm } from "@/components/settings/profile-form";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect if not authenticated
  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 -m-3 sm:-m-4 md:-m-6 mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Pengaturan</h1>
        <p className="text-blue-100 mt-1 text-sm sm:text-base">
          Kelola profil dan preferensi akun Anda
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar Menu */}
        <div className="space-y-2">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-4">
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-medium shadow-lg">
                  <User className="h-5 w-5" />
                  Profil
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-700 hover:bg-white hover:shadow-md transition-all font-medium">
                  <Shield className="h-5 w-5" />
                  Keamanan
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-700 hover:bg-white hover:shadow-md transition-all font-medium">
                  <Bell className="h-5 w-5" />
                  Notifikasi
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-700 hover:bg-white hover:shadow-md transition-all font-medium">
                  <Palette className="h-5 w-5" />
                  Tampilan
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Informasi Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">User ID</p>
                <p className="font-mono text-xs">{user?.id.slice(0, 8)}...</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bergabung</p>
                <p className="font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  }) : "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Profil Saya</CardTitle>
              <CardDescription>
                Perbarui informasi profil dan pengaturan akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm profile={profile} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
