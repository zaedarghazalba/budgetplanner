/**
 * Application Constants
 * Centralized configuration for magic numbers and hardcoded values
 */

// Pagination
export const PAGINATION = {
  TRANSACTIONS_PER_PAGE: 20,
  MAX_PAGES_TO_SHOW: 5,
} as const;

// Limits
export const LIMITS = {
  MAX_TRANSACTIONS_DISPLAY: 100,
  MAX_RECENT_TRANSACTIONS: 5,
  MAX_BUDGET_ALERTS: 10,
  MAX_CATEGORY_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 200,
} as const;

// Timing (in milliseconds)
export const TIMING = {
  TOUR_DELAY: 500,
  TOUR_AUTO_ADVANCE: 10000, // 10 seconds
  TOAST_DURATION: 5000,
  DEBOUNCE_SEARCH: 300,
} as const;

// Currency & Locale
export const CURRENCY = {
  DEFAULT: "IDR",
  SYMBOL: "Rp",
} as const;

export const LOCALE = {
  DEFAULT: "id-ID",
  DATE_FORMAT: "dd MMM yyyy",
} as const;

// Budget Thresholds
export const BUDGET = {
  DEFAULT_THRESHOLD: 80, // 80%
  CRITICAL_THRESHOLD: 100, // 100%
  MIN_THRESHOLD: 50,
  MAX_THRESHOLD: 100,
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

// Budget Plan Periods
export const BUDGET_PERIODS = {
  WEEKLY: "weekly",
  MONTHLY: "monthly",
} as const;

// Toast Variants
export const TOAST_VARIANTS = {
  DEFAULT: "default",
  DESTRUCTIVE: "destructive",
  SUCCESS: "success",
} as const;

// API/Database
export const DATABASE = {
  MAX_RETRIES: 3,
  TIMEOUT: 30000, // 30 seconds
} as const;

// File Upload (for future use)
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/jpg"],
} as const;

// Validation
export const VALIDATION = {
  MIN_AMOUNT: 0,
  MAX_AMOUNT: 999999999999, // 1 trillion - 1
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 100,
} as const;

// Category Icons & Colors
export const CATEGORY_ICONS = [
  "🍔", "🍕", "🍜", "☕", "🍱", "🍰", // Food
  "🚗", "🚌", "🚕", "✈️", "🚲", "⛽", // Transport
  "🏠", "💡", "💧", "📱", "💻", "📺", // Bills & Electronics
  "🎮", "🎬", "🎵", "🎨", "📚", "⚽", // Entertainment
  "💊", "🏥", "💪", "🧘", "🏃", "🧴", // Health
  "👕", "👗", "👟", "👜", "💄", "💍", // Shopping
  "🎓", "📖", "✏️", "🎒", "🖊️", "📝", // Education
  "💰", "💵", "💸", "💳", "🏦", "📊", // Finance
  "🎁", "🎉", "❤️", "🌟", "✨", "🔧", // Other
] as const;

export const CATEGORY_COLORS = [
  { name: "Biru", value: "#3B82F6" },
  { name: "Hijau", value: "#10B981" },
  { name: "Merah", value: "#EF4444" },
  { name: "Kuning", value: "#F59E0B" },
  { name: "Ungu", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Orange", value: "#F97316" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Indigo", value: "#6366F1" },
] as const;

// Export all as a single object for convenience
export const CONSTANTS = {
  PAGINATION,
  LIMITS,
  TIMING,
  CURRENCY,
  LOCALE,
  BUDGET,
  TRANSACTION_TYPES,
  BUDGET_PERIODS,
  TOAST_VARIANTS,
  DATABASE,
  FILE_UPLOAD,
  VALIDATION,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
} as const;

export default CONSTANTS;
