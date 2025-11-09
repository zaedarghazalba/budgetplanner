-- =====================================================
-- FIX: Profiles Table Permission Error
-- =====================================================
-- Jalankan script ini di Supabase SQL Editor:
-- 1. Buka https://supabase.com/dashboard
-- 2. Pilih project Anda (uqgfdxfttmdkqblxcqmi)
-- 3. Klik "SQL Editor" di sidebar
-- 4. Copy paste SEMUA script ini
-- 5. Klik "RUN" atau tekan Ctrl+Enter
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recreate policies dengan konfigurasi yang benar
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

-- Pastikan RLS enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Verify policies
SELECT
  '✅ BERHASIL! Policies telah diperbaiki' as status,
  COUNT(*) || ' policies aktif untuk table profiles' as result
FROM pg_policies
WHERE tablename = 'profiles';

-- Test query (opsional - untuk verify)
SELECT
  'Current user dapat mengakses profile:' as test,
  COUNT(*) as profile_count
FROM profiles
WHERE id = auth.uid();
