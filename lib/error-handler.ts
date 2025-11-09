/**
 * Error Handling Utilities
 * Centralized error handling and user-friendly error messages
 */

import type { AppError } from "./types";

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    // Handle Supabase errors
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }

    // Handle error with code
    if ("code" in error && typeof error.code === "string") {
      return getSupabaseErrorMessage(error.code);
    }
  }

  return "Terjadi kesalahan tidak terduga. Silakan coba lagi.";
}

/**
 * Get user-friendly error message for Supabase error codes
 */
export function getSupabaseErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    // Auth errors
    "invalid_credentials": "Email atau password salah",
    "user_not_found": "Pengguna tidak ditemukan",
    "email_not_confirmed": "Email belum dikonfirmasi. Periksa inbox Anda.",
    "weak_password": "Password terlalu lemah. Gunakan minimal 8 karakter.",
    "user_already_exists": "Email sudah terdaftar",

    // Database errors
    "23505": "Data sudah ada. Silakan gunakan nilai yang berbeda.",
    "23503": "Data terkait tidak ditemukan",
    "23502": "Field wajib tidak boleh kosong",
    "42501": "Anda tidak memiliki akses untuk operasi ini",

    // Connection errors
    "PGRST301": "Terlalu banyak permintaan. Silakan coba beberapa saat lagi.",
    "ECONNREFUSED": "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
    "ETIMEDOUT": "Koneksi timeout. Silakan coba lagi.",

    // Generic
    "PGRST116": "Data tidak ditemukan",
  };

  return errorMessages[code] || `Error: ${code}`;
}

/**
 * Create a standardized error object
 */
export function createAppError(
  message: string,
  code?: string,
  statusCode?: number
): AppError {
  const error = new Error(message) as AppError;
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

/**
 * Handle errors and return user-friendly message
 */
export function handleError(error: unknown, context?: string): string {
  const message = getErrorMessage(error);

  // Log error for debugging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.error(`[Error${context ? ` in ${context}` : ""}]:`, error);
  }

  return message;
}

/**
 * Format validation errors
 */
export function formatValidationError(field: string, rule: string): string {
  const validationMessages: Record<string, (field: string) => string> = {
    required: (f) => `${f} wajib diisi`,
    email: () => "Format email tidak valid",
    min: (f) => `${f} terlalu pendek`,
    max: (f) => `${f} terlalu panjang`,
    number: (f) => `${f} harus berupa angka`,
    positive: (f) => `${f} harus berupa angka positif`,
    url: () => "Format URL tidak valid",
  };

  const formatter = validationMessages[rule];
  return formatter ? formatter(field) : `${field} tidak valid`;
}

/**
 * Check if error is network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("ETIMEDOUT")
    );
  }
  return false;
}

/**
 * Check if error is authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error && typeof error === "object" && "code" in error) {
    const code = error.code as string;
    return (
      code.includes("auth") ||
      code === "invalid_credentials" ||
      code === "user_not_found" ||
      code === "42501"
    );
  }
  return false;
}

/**
 * Get toast notification config from error
 */
export function getErrorToastConfig(error: unknown) {
  const message = getErrorMessage(error);

  if (isNetworkError(error)) {
    return {
      variant: "destructive" as const,
      title: "Masalah Koneksi",
      description: message,
    };
  }

  if (isAuthError(error)) {
    return {
      variant: "destructive" as const,
      title: "Autentikasi Gagal",
      description: message,
    };
  }

  return {
    variant: "destructive" as const,
    title: "Terjadi Kesalahan",
    description: message,
  };
}

// Export all utilities as namespace
export const ErrorHandler = {
  getMessage: getErrorMessage,
  getSupabaseMessage: getSupabaseErrorMessage,
  create: createAppError,
  handle: handleError,
  formatValidation: formatValidationError,
  isNetwork: isNetworkError,
  isAuth: isAuthError,
  getToastConfig: getErrorToastConfig,
};

export default ErrorHandler;
