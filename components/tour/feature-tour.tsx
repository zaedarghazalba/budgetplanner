"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TIMING } from "@/lib/constants";

interface TourStep {
  title: string;
  description: string;
  icon: string;
  example: string;
}

const tourSteps: TourStep[] = [
  {
    title: "📊 Dashboard",
    description: "Lihat ringkasan keuangan Anda secara real-time. Monitor pemasukan, pengeluaran, dan saldo dengan mudah.",
    icon: "📈",
    example: "Contoh: Lihat total pengeluaran bulan ini mencapai Rp 5.500.000 dari 10 transaksi"
  },
  {
    title: "💸 Transaksi",
    description: "Catat semua transaksi harian Anda. Tambah transaksi pemasukan atau pengeluaran dengan kategori yang jelas.",
    icon: "💰",
    example: "Contoh: Tambah transaksi 'Makan Siang Rp 50.000' kategori Makanan & Minuman"
  },
  {
    title: "🎯 Budget Planning",
    description: "Buat rencana budget untuk periode tertentu. Atur batas pengeluaran per kategori atau keseluruhan.",
    icon: "📝",
    example: "Contoh: Set budget bulanan Rp 3.000.000 untuk kategori Makanan & Minuman"
  },
  {
    title: "🔔 Alert System",
    description: "Dapatkan notifikasi otomatis saat pengeluaran mendekati batas budget yang telah ditentukan.",
    icon: "⚠️",
    example: "Contoh: Alert 'Pengeluaran mencapai 80% dari budget Makanan bulan ini'"
  },
  {
    title: "📂 Kategori",
    description: "Kelola kategori transaksi Anda. Gunakan kategori default atau buat custom sesuai kebutuhan.",
    icon: "🏷️",
    example: "Contoh: Kategori tersedia - Makanan 🍔, Transportasi 🚗, Hiburan 🎬, dll"
  },
  {
    title: "⚙️ Pengaturan",
    description: "Sesuaikan profil dan preferensi Anda. Ubah nama, mata uang, dan pengaturan lainnya.",
    icon: "🔧",
    example: "Contoh: Ganti mata uang dari IDR ke USD, update nama profil"
  }
];

export function FeatureTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Check if tour has been shown before
  useEffect(() => {
    // Always show tour on mount (for testing)
    // Remove the condition to always show
    const tourShown = localStorage.getItem("tour-shown");
    if (!tourShown) {
      // Delay to ensure page is loaded
      setTimeout(() => {
        setIsOpen(true);
      }, TIMING.TOUR_DELAY);
    }
  }, []);

  // Auto advance
  useEffect(() => {
    if (!isOpen || !autoPlay) return;

    const timer = setInterval(() => {
      if (currentStep < tourSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleComplete();
      }
    }, TIMING.TOUR_AUTO_ADVANCE);

    return () => clearInterval(timer);
  }, [isOpen, currentStep, autoPlay]);

  const handleComplete = () => {
    localStorage.setItem("tour-shown", "true");
    setIsOpen(false);
    setCurrentStep(0);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handlePrev = () => {
    setAutoPlay(false);
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setAutoPlay(false);
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  if (!isOpen) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 sm:p-6 text-white rounded-t-lg">
            <div className="flex items-start sm:items-center justify-between mb-2 gap-2">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <span className="text-2xl sm:text-4xl flex-shrink-0">{currentTourStep.icon}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-2xl font-bold truncate">{currentTourStep.title}</h2>
                  <p className="text-blue-100 text-xs sm:text-sm">
                    Langkah {currentStep + 1} dari {tourSteps.length}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSkip}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 flex-shrink-0"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2 mt-3 sm:mt-4">
              <div
                className="bg-white rounded-full h-1.5 sm:h-2 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-8">
            <p className="text-sm sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
              {currentTourStep.description}
            </p>

            {/* Example Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-semibold text-xs sm:text-sm flex-shrink-0">💡 Contoh:</span>
                <p className="text-xs sm:text-sm text-gray-700 flex-1">
                  {currentTourStep.example}
                </p>
              </div>
            </div>

            {/* Auto-play indicator */}
            {autoPlay && (
              <div className="mt-3 sm:mt-4 text-center">
                <p className="text-xs text-gray-500">
                  ⏱️ Otomatis lanjut dalam 10 detik...
                </p>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="border-t p-4 sm:p-6 bg-white rounded-b-lg">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <Button
                onClick={handlePrev}
                disabled={currentStep === 0}
                variant="outline"
                size="sm"
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Sebelumnya</span>
                <span className="xs:hidden">Prev</span>
              </Button>

              <div className="flex gap-1.5 sm:gap-2">
                {tourSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setAutoPlay(false);
                      setCurrentStep(index);
                    }}
                    className={`h-2 sm:h-2.5 rounded-full transition-all ${
                      index === currentStep
                        ? "bg-indigo-600 w-6 sm:w-8"
                        : index < currentStep
                        ? "bg-green-400 w-2 sm:w-2.5"
                        : "bg-gray-300 w-2 sm:w-2.5"
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>

              {currentStep === tourSteps.length - 1 ? (
                <Button
                  onClick={handleComplete}
                  size="sm"
                  className="gap-1 sm:gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-xs sm:text-sm px-2 sm:px-4"
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  Selesai
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  size="sm"
                  className="gap-1 sm:gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs sm:text-sm px-2 sm:px-4"
                >
                  <span className="hidden xs:inline">Selanjutnya</span>
                  <span className="xs:hidden">Next</span>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>

            <div className="mt-3 sm:mt-4 text-center">
              <Button
                onClick={handleSkip}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
              >
                Lewati Tour
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
