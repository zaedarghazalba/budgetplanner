import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency to locale mapping
const CURRENCY_LOCALE_MAP: Record<string, string> = {
  IDR: "id-ID",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  JPY: "ja-JP",
  CNY: "zh-CN",
  SGD: "en-SG",
  MYR: "ms-MY",
  THB: "th-TH",
  AUD: "en-AU",
  CAD: "en-CA",
  INR: "en-IN",
};

export function formatCurrency(amount: number, currency: string = "IDR"): string {
  const locale = CURRENCY_LOCALE_MAP[currency] || "id-ID";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

// Simplified format without currency symbol (just number)
export function formatNumber(amount: number, locale: string = "id-ID"): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function getMonthName(monthIndex: number): string {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return months[monthIndex];
}

export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
}

/**
 * Validates that a value is a valid UUID
 * Prevents "invalid input syntax for type uuid" errors
 */
export function isValidUUID(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Safely gets a UUID or throws an error
 * Use this before passing to .eq() queries
 */
export function requireUUID(value: unknown, fieldName: string = 'ID'): string {
  if (!isValidUUID(value)) {
    throw new Error(`${fieldName} is required and must be a valid UUID`);
  }
  return value;
}
