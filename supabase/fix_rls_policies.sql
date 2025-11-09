-- =====================================================
-- FIX RLS POLICIES FOR PROFILES TABLE
-- =====================================================
-- Run this in Supabase SQL Editor to fix permission errors
-- =====================================================

-- Step 1: Check current policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Step 2: Drop existing policies (if any issues)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- Step 3: Recreate policies with correct permissions
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

-- Optional: Allow users to delete their own profile
-- CREATE POLICY "Users can delete own profile"
--   ON profiles FOR DELETE
--   USING (auth.uid() = id);

-- Step 4: Verify RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Verify policies are created
SELECT
    tablename,
    policyname,
    cmd as operation,
    CASE
        WHEN qual IS NOT NULL THEN 'USING: ' || qual
        ELSE 'No USING clause'
    END as using_clause,
    CASE
        WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check
        ELSE 'No WITH CHECK clause'
    END as with_check_clause
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Step 6: Test if auth.uid() returns value (must be run as authenticated user)
SELECT
    auth.uid() as current_user_id,
    CASE
        WHEN auth.uid() IS NULL THEN '❌ Not authenticated'
        ELSE '✅ Authenticated as: ' || auth.uid()::text
    END as auth_status;

-- =====================================================
-- VERIFICATION COMPLETE
-- =====================================================

SELECT '✅ RLS Policies Fixed!' as status;
