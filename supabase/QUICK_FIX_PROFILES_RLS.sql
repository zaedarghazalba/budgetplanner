-- =====================================================
-- QUICK FIX: PROFILES TABLE RLS POLICIES
-- =====================================================
-- Copy dan paste SEMUA script ini ke Supabase SQL Editor
-- Lalu klik RUN
-- =====================================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recreate with BOTH USING and WITH CHECK for UPDATE
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

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Verify
SELECT '✅ Policies Fixed!' as status,
       COUNT(*) || ' policies created' as result
FROM pg_policies
WHERE tablename = 'profiles';
