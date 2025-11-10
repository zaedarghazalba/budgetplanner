import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

// Lazy load Toaster to reduce initial bundle
const Toaster = dynamic(
  () => import("@/components/ui/toaster").then((mod) => ({ default: mod.Toaster })),
  { ssr: false }
);

// Optimize font loading with display swap and preload
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://budgetplanner.vercel.app'),
  title: {
    default: "Budget Planner - Kelola Keuangan Anda",
    template: "%s | Budget Planner",
  },
  description: "Aplikasi budget planner modern untuk mencatat pengeluaran dan pemasukan. Kelola budget, catat transaksi, dan analisis keuangan Anda dengan mudah.",
  manifest: "/manifest.json",
  applicationName: "Budget Planner",
  keywords: ["budget", "planner", "keuangan", "finance", "money", "expense", "income", "budget tracker", "expense tracker", "personal finance"],
  authors: [{ name: "Budget Planner Team" }],
  creator: "Budget Planner Team",
  publisher: "Budget Planner",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://budgetplanner.vercel.app',
    title: 'Budget Planner - Kelola Keuangan Anda',
    description: 'Aplikasi budget planner modern untuk mencatat pengeluaran dan pemasukan',
    siteName: 'Budget Planner',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Budget Planner - Kelola Keuangan Anda',
    description: 'Aplikasi budget planner modern untuk mencatat pengeluaran dan pemasukan',
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4F46E5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
