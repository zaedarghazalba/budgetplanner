"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Folder,
  FileText,
  Settings,
  LogOut,
  User,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/lib/hooks/use-toast";
import { ErrorHandler } from "@/lib/error-handler";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Ringkasan keuangan Anda",
  },
  {
    title: "Transaksi",
    href: "/dashboard/transactions",
    icon: Receipt,
    description: "Kelola transaksi harian",
  },
  {
    title: "Budget Plan",
    href: "/dashboard/budget",
    icon: PiggyBank,
    description: "Atur rencana budget",
  },
  {
    title: "Kategori",
    href: "/dashboard/categories",
    icon: Folder,
    description: "Kelola kategori",
  },
  {
    title: "Laporan",
    href: "/dashboard/reports",
    icon: FileText,
    description: "Analisis dan laporan",
  },
  {
    title: "Pengaturan",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Pengaturan akun",
  },
];

interface SidebarProps {
  onNavigate?: () => void;
}

interface UserProfile {
  email: string;
  full_name: string | null;
}

export function Sidebar({ onNavigate }: SidebarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email, full_name")
            .eq("id", user.id)
            .single();

          if (profile) {
            setUserProfile(profile);
          } else {
            // Fallback to auth user email
            setUserProfile({
              email: user.email || "",
              full_name: null,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [supabase]);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      toast({
        title: "Berhasil Logout",
        description: "Anda telah keluar dari akun.",
      });

      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast(ErrorHandler.getToastConfig(error));
      setIsLoggingOut(false);
      setLogoutDialogOpen(false);
    }
  };

  const handleLinkClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  // Check if route is active (including nested routes)
  const isRouteActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  // Get initials from name or email
  const getInitials = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (userProfile?.email) {
      return userProfile.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      <div className="flex h-full flex-col bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 border-r border-indigo-100">
        {/* Logo */}
        <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <Link
            href="/dashboard"
            onClick={handleLinkClick}
            prefetch={true}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <span className="font-bold text-lg text-white block">Budget Planner</span>
              <span className="text-xs text-blue-100">Manage Your Finances</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = isRouteActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                prefetch={true}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all relative",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                    : "text-indigo-700 hover:bg-white hover:shadow-md"
                )}
                title={item.description}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-white" : "text-indigo-600 group-hover:text-indigo-700"
                )} />
                <span className="flex-1">{item.title}</span>

                {/* Active indicator */}
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-indigo-100 bg-white/50">
          {loadingProfile ? (
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
              </div>
            </div>
          ) : userProfile ? (
            <Link
              href="/dashboard/settings"
              onClick={handleLinkClick}
              prefetch={true}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white transition-all group"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {getInitials()}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {userProfile.full_name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userProfile.email}
                </p>
              </div>

              {/* Arrow */}
              <Settings className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </Link>
          ) : null}
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-indigo-100">
          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-pink-600 transition-all hover:bg-pink-50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoggingOut ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
            )}
            <span>{isLoggingOut ? "Logging out..." : "Keluar"}</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari akun?
              <br />
              <br />
              Anda perlu login kembali untuk mengakses aplikasi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              disabled={isLoggingOut}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                "Ya, Keluar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
