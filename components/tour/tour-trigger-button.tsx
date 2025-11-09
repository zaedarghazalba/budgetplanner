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
      className="gap-2"
    >
      <HelpCircle className="h-4 w-4" />
      Lihat Panduan Fitur
    </Button>
  );
}
