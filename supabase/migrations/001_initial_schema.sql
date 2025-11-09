-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE transaction_type AS ENUM ('expense', 'income');
CREATE TYPE period_type AS ENUM ('weekly', 'monthly');

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'IDR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type transaction_type NOT NULL,
  icon TEXT DEFAULT '📌',
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);

-- RLS Policies for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  type transaction_type NOT NULL,
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);

-- RLS Policies for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- BUDGET PLANS TABLE
-- =====================================================
CREATE TABLE budget_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  period_type period_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  alert_threshold NUMERIC(5, 2) DEFAULT 80 CHECK (alert_threshold >= 0 AND alert_threshold <= 100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Indexes for faster queries
CREATE INDEX idx_budget_plans_user_id ON budget_plans(user_id);
CREATE INDEX idx_budget_plans_active ON budget_plans(is_active);
CREATE INDEX idx_budget_plans_dates ON budget_plans(start_date, end_date);

-- RLS Policies for budget_plans
ALTER TABLE budget_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budget plans"
  ON budget_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budget plans"
  ON budget_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budget plans"
  ON budget_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budget plans"
  ON budget_plans FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- BUDGET ALERTS TABLE
-- =====================================================
CREATE TABLE budget_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  budget_plan_id UUID NOT NULL REFERENCES budget_plans(id) ON DELETE CASCADE,
  current_spending NUMERIC(15, 2) NOT NULL,
  budget_limit NUMERIC(15, 2) NOT NULL,
  alert_message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_budget_alerts_user_id ON budget_alerts(user_id);
CREATE INDEX idx_budget_alerts_is_read ON budget_alerts(is_read);

-- RLS Policies for budget_alerts
ALTER TABLE budget_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budget alerts"
  ON budget_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budget alerts"
  ON budget_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budget alerts"
  ON budget_alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budget alerts"
  ON budget_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger for transactions
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to check budget and create alerts
CREATE OR REPLACE FUNCTION check_budget_threshold()
RETURNS TRIGGER AS $$
DECLARE
  v_budget_plan RECORD;
  v_current_spending NUMERIC;
  v_threshold_amount NUMERIC;
BEGIN
  -- Loop through active budget plans for this user
  FOR v_budget_plan IN
    SELECT * FROM budget_plans
    WHERE user_id = NEW.user_id
      AND is_active = TRUE
      AND NEW.date BETWEEN start_date AND end_date
      AND (category_id IS NULL OR category_id = NEW.category_id)
      AND NEW.type = 'expense'
  LOOP
    -- Calculate current spending for this period
    SELECT COALESCE(SUM(amount), 0) INTO v_current_spending
    FROM transactions
    WHERE user_id = NEW.user_id
      AND type = 'expense'
      AND date BETWEEN v_budget_plan.start_date AND v_budget_plan.end_date
      AND (v_budget_plan.category_id IS NULL OR category_id = v_budget_plan.category_id);

    -- Calculate threshold amount
    v_threshold_amount := v_budget_plan.amount * (v_budget_plan.alert_threshold / 100);

    -- Create alert if spending exceeds threshold
    IF v_current_spending >= v_threshold_amount THEN
      INSERT INTO budget_alerts (
        user_id,
        budget_plan_id,
        current_spending,
        budget_limit,
        alert_message
      )
      VALUES (
        NEW.user_id,
        v_budget_plan.id,
        v_current_spending,
        v_budget_plan.amount,
        'Pengeluaran Anda sudah mencapai ' ||
        ROUND((v_current_spending / v_budget_plan.amount) * 100, 0)::TEXT ||
        '% dari budget ' || v_budget_plan.period_type
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check budget after transaction insert/update
CREATE TRIGGER check_budget_after_transaction
  AFTER INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION check_budget_threshold();
