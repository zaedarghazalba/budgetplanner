"use client";

import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TourTriggerButton() {
  const handleClick = () => {
    // Remove the tour-shown flag to show tour again
    localStorage.removeItem("tour-shown");
    // Reload page to trigger tour
    window.location.reload();
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="sm"
      className="gap-1 sm:gap-2 text-xs sm:text-sm"
    >
      <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
      <span className="hidden sm:inline">Lihat Panduan Fitur</span>
      <span className="sm:hidden">Panduan</span>
    </Button>
  );
}
