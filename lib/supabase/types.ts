export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: "expense" | "income";
          icon: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: "expense" | "income";
          icon: string;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: "expense" | "income";
          icon?: string;
          color?: string;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          type: "expense" | "income";
          amount: number;
          description: string;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          type: "expense" | "income";
          amount: number;
          description: string;
          date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          type?: "expense" | "income";
          amount?: number;
          description?: string;
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      budget_plans: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          amount: number;
          period_type: "weekly" | "monthly";
          start_date: string;
          end_date: string;
          alert_threshold: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          amount: number;
          period_type: "weekly" | "monthly";
          start_date: string;
          end_date: string;
          alert_threshold?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          amount?: number;
          period_type?: "weekly" | "monthly";
          start_date?: string;
          end_date?: string;
          alert_threshold?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      budget_alerts: {
        Row: {
          id: string;
          user_id: string;
          budget_plan_id: string;
          current_spending: number;
          budget_limit: number;
          alert_message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          budget_plan_id: string;
          current_spending: number;
          budget_limit: number;
          alert_message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          budget_plan_id?: string;
          current_spending?: number;
          budget_limit?: number;
          alert_message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      transaction_type: "expense" | "income";
      period_type: "weekly" | "monthly";
    };
  };
}
