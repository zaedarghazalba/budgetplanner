/**
 * TypeScript Type Definitions
 * Centralized type definitions for the application
 */

// Database Tables

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
}

export type TransactionType = "income" | "expense";

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
}

export type BudgetPeriod = "weekly" | "monthly";

export interface BudgetPlan {
  id: string;
  user_id: string;
  category_id: string | null;
  name: string;
  amount: number;
  period: BudgetPeriod;
  start_date: string;
  end_date: string;
  alert_threshold: number;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
}

export interface BudgetAlert {
  id: string;
  user_id: string;
  budget_plan_id: string;
  message: string;
  percentage: number;
  is_read: boolean;
  created_at: string;
  budget_plans?: BudgetPlan | null;
}

// Extended Types (with relations)

export interface TransactionWithCategory extends Transaction {
  categories: Category;
}

export interface BudgetPlanWithCategory extends BudgetPlan {
  categories: Category;
}

export interface BudgetPlanWithSpending extends BudgetPlan {
  spending: number;
  percentage: number;
  isOverBudget: boolean;
  isNearThreshold: boolean;
}

export interface BudgetAlertWithPlan extends BudgetAlert {
  budget_plans: BudgetPlan;
}

// Form Data Types

export interface TransactionFormData {
  type: TransactionType;
  category_id: string;
  amount: string;
  description: string;
  date: string;
}

export interface CategoryFormData {
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface BudgetPlanFormData {
  category_id: string;
  name: string;
  amount: string;
  period: BudgetPeriod;
  start_date: string;
  end_date: string;
  alert_threshold: string;
}

export interface ProfileFormData {
  full_name: string;
  currency: string;
}

// API Response Types

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  totalPages: number;
}

// Search & Filter Types

export interface TransactionFilters {
  search?: string;
  type?: TransactionType | "all";
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
}

export interface BudgetFilters {
  period?: BudgetPeriod | "all";
  status?: "all" | "normal" | "warning" | "over";
}

// Statistics Types

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface CategorySpending {
  category: Category;
  total: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

// Component Prop Types

export interface CategoryListProps {
  categories: Category[];
  type: TransactionType;
}

export interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
}

export interface BudgetListProps {
  budgets: BudgetPlanWithSpending[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

// Tour Types

export interface TourStep {
  title: string;
  description: string;
  icon: string;
  example: string;
}

// Color & Icon Types

export interface ColorOption {
  name: string;
  value: string;
}

export type CategoryIcon = string;

// Error Types

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
}

// Auth Types

export interface User {
  id: string;
  email: string;
  email_confirmed_at?: string;
  created_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

// Export all types as a namespace for convenience
export namespace Types {
  export type TProfile = Profile;
  export type TCategory = Category;
  export type TTransaction = Transaction;
  export type TBudgetPlan = BudgetPlan;
  export type TBudgetAlert = BudgetAlert;
  export type TTransactionType = TransactionType;
  export type TBudgetPeriod = BudgetPeriod;
}
