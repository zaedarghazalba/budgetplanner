import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budget Planner - Kelola Keuangan Anda dengan Mudah",
  description: "Aplikasi budget planner modern untuk mencatat pengeluaran, memantau pemasukan, dan mengatur budget. Gratis dengan Google Sign-in. Visualisasi data, alert budget, dan laporan keuangan lengkap.",
  alternates: {
    canonical: "https://budgetplanner.vercel.app",
  },
  openGraph: {
    title: "Budget Planner - Kelola Keuangan Anda dengan Mudah",
    description: "Aplikasi budget planner modern untuk mencatat pengeluaran dan mengatur budget",
    url: "https://budgetplanner.vercel.app",
    siteName: "Budget Planner",
    type: "website",
    locale: "id_ID",
  },
};

export default function LandingPage() {
  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Budget Planner',
    description: 'Aplikasi budget planner modern untuk mencatat pengeluaran, memantau pemasukan, dan mengatur budget',
    url: 'https://budgetplanner.vercel.app',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
    },
    featureList: [
      'Visualisasi Data Keuangan',
      'Alert Budget',
      'Laporan Bulanan',
      'Responsive Design',
      'Data Aman & Private',
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">💰 Budget Planner</div>
          </div>
          <Link href="/login">
            <Button variant="outline">Masuk</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Kelola Keuangan Anda dengan Mudah
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Budget Planner membantu Anda mencatat pengeluaran, memantau pemasukan,
            dan mengatur budget dengan lebih efektif. Gratis untuk semua pengguna.
          </p>
          <Link href="/login">
            <Button size="lg" className="text-lg px-8 py-6">
              Mulai Gratis dengan Google
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">📊</div>
              <CardTitle>Visualisasi Data</CardTitle>
              <CardDescription>
                Lihat laporan keuangan Anda dalam bentuk grafik yang mudah dipahami
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">🔔</div>
              <CardTitle>Alert Budget</CardTitle>
              <CardDescription>
                Dapatkan notifikasi ketika pengeluaran mendekati batas budget Anda
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">📱</div>
              <CardTitle>Responsive & Modern</CardTitle>
              <CardDescription>
                Akses dari mana saja, kapan saja dengan tampilan yang responsif
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">🔒</div>
              <CardTitle>Aman & Private</CardTitle>
              <CardDescription>
                Data Anda dilindungi dengan enkripsi dan Row Level Security
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">📈</div>
              <CardTitle>Laporan Bulanan</CardTitle>
              <CardDescription>
                Analisis pengeluaran dan pemasukan Anda setiap bulan
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">⚡</div>
              <CardTitle>Cepat & Ringan</CardTitle>
              <CardDescription>
                Dibangun dengan teknologi modern untuk performa optimal
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">Siap mengatur keuangan Anda?</p>
          <Link href="/login">
            <Button size="lg" variant="default">
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 Budget Planner. Built with Next.js & Supabase.</p>
          <p className="text-sm mt-2">
            <Link href="/sitemap.xml" className="hover:underline">Sitemap</Link>
            {" • "}
            <Link href="/robots.txt" className="hover:underline">Robots</Link>
          </p>
        </div>
      </footer>
      </div>
    </>
  );
}
