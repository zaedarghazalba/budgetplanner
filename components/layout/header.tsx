"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { useState } from "react";

interface HeaderProps {
  user?: {
    email?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export function Header({ user }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-indigo-100 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Menu Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-indigo-50">
                <Menu className="h-5 w-5 text-indigo-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div>
            <h2 className="text-sm sm:text-lg font-bold text-indigo-900">
              Halo, {user?.full_name || user?.email?.split("@")[0] || "User"}! 👋
            </h2>
            <p className="text-xs sm:text-sm text-indigo-600 hidden sm:block">
              Selamat datang di Budget Planner
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Bell */}
          <Button variant="ghost" size="icon" className="relative hover:bg-indigo-50">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-pink-500 rounded-full animate-pulse"></span>
          </Button>

          {/* User Avatar */}
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name || "User"}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-2 ring-indigo-500"
            />
          ) : (
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg text-sm sm:text-base">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
