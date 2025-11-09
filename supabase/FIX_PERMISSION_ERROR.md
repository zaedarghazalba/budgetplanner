# 🔧 Fix: "permission denied for table profiles"

## 🔍 Penyebab Masalah

Error **"permission denied for table profiles"** terjadi karena RLS (Row Level Security) Policy untuk UPDATE **tidak lengkap**.

### Masalah di Database:

Policy UPDATE hanya punya `USING` tanpa `WITH CHECK`:

```sql
-- ❌ SALAH (Policy lama)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Kenapa Error?

Untuk operation **UPDATE**, PostgreSQL RLS memerlukan **DUA** checks:
1. **USING** - Mengecek apakah user bisa mengakses row yang akan di-update
2. **WITH CHECK** - Memvalidasi apakah data baru yang akan disimpan valid

Tanpa `WITH CHECK`, PostgreSQL akan **menolak semua UPDATE operations**.

---

## ✅ Solusi - 3 Cara

### **Cara 1: Quick Fix (Recommended)** ⚡

**Langkah:**
1. Buka **Supabase Dashboard** → SQL Editor
2. Copy & paste script dari file: [`QUICK_FIX_PROFILES_RLS.sql`](./QUICK_FIX_PROFILES_RLS.sql)
3. Klik **RUN**
4. Selesai! ✅

**Script Quick Fix:**
```sql
-- Drop old policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recreate with BOTH USING and WITH CHECK
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
```

---

### **Cara 2: Via Supabase Dashboard UI** 🖱️

**Langkah:**
1. Buka **Supabase Dashboard** → Authentication → Policies
2. Pilih table **profiles**
3. Hapus policy "Users can update own profile"
4. Klik **New Policy** → **For UPDATE operations**
5. Isi:
   - **Policy name:** `Users can update own profile`
   - **USING expression:** `auth.uid() = id`
   - **WITH CHECK expression:** `auth.uid() = id`
6. Klik **Save**

---

### **Cara 3: Run Migration dari Awal** 🔄

**Langkah:**
1. Buka Supabase SQL Editor
2. Run migration file yang sudah diperbaiki: [`migrations/001_initial_schema.sql`](./migrations/001_initial_schema.sql)
3. Selesai!

**Note:** Migration file sudah diperbaiki dengan `WITH CHECK` clause.

---

## 🧪 Verifikasi Fix

Setelah apply fix, jalankan query ini di Supabase SQL Editor:

```sql
-- Check policies
SELECT
    policyname,
    cmd as operation,
    qual as using_clause,
    with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
```

**Expected Result:**

| policyname | operation | using_clause | with_check |
|------------|-----------|--------------|------------|
| Users can insert own profile | INSERT | NULL | (auth.uid() = id) |
| Users can select own profile | SELECT | (auth.uid() = id) | NULL |
| Users can update own profile | UPDATE | (auth.uid() = id) | **(auth.uid() = id)** ✅ |

---

## 🎯 Test di Aplikasi

Setelah fix:

1. **Login** ke aplikasi
2. Buka **Settings** (`/dashboard/settings`)
3. Update **Nama Lengkap** atau **Currency**
4. Klik **Simpan Perubahan**
5. Seharusnya muncul: ✅ **"Profil berhasil diperbarui!"**

---

## 📚 Penjelasan Technical

### RLS Policy Structure untuk UPDATE:

```sql
CREATE POLICY policy_name
  ON table_name
  FOR UPDATE
  USING (condition)      -- Siapa yang boleh UPDATE row ini?
  WITH CHECK (condition); -- Apakah data baru valid?
```

### Contoh Real World:

**Scenario:** User A (id=123) mencoba update profile User B (id=456)

```sql
-- Policy:
USING (auth.uid() = id)      -- Check: 123 ≠ 456 → ❌ Ditolak
WITH CHECK (auth.uid() = id)  -- Check: Tidak sampai sini karena USING gagal
```

**Scenario:** User A (id=123) update profile sendiri

```sql
-- Policy:
USING (auth.uid() = id)      -- Check: 123 = 123 → ✅ Lanjut
WITH CHECK (auth.uid() = id)  -- Check: 123 = 123 → ✅ Sukses!
```

---

## 🔐 Security Best Practices

### ✅ **BENAR** - Policy lengkap:

```sql
CREATE POLICY "update_own_profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

### ❌ **SALAH** - Hanya USING:

```sql
CREATE POLICY "update_own_profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);  -- ❌ Missing WITH CHECK
```

### ❌ **BAHAYA** - Tanpa validasi:

```sql
CREATE POLICY "update_any_profile" ON profiles
  FOR UPDATE
  USING (true)
  WITH CHECK (true);  -- ❌ Siapa saja bisa update profile siapa saja!
```

---

## 📖 Related Files

- ✅ [QUICK_FIX_PROFILES_RLS.sql](./QUICK_FIX_PROFILES_RLS.sql) - Quick fix script
- ✅ [migrations/001_initial_schema.sql](./migrations/001_initial_schema.sql) - Fixed migration
- ✅ [fix_rls_policies.sql](./fix_rls_policies.sql) - Diagnostic script
- 📝 [components/settings/profile-form.tsx](../components/settings/profile-form.tsx) - Fixed client code

---

## 🆘 Troubleshooting

### Error masih terjadi setelah fix?

**1. Verify auth session:**
```sql
SELECT auth.uid() as user_id;
```
- Jika `NULL` → User belum login
- Jika ada UUID → Session valid ✅

**2. Check RLS is enabled:**
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';
```
- `rowsecurity` harus `true` ✅

**3. Verify policies exist:**
```sql
SELECT COUNT(*) as policy_count
FROM pg_policies
WHERE tablename = 'profiles';
```
- Minimal harus ada **3 policies** (SELECT, INSERT, UPDATE) ✅

---

## 🎉 Done!

Setelah apply fix, error "permission denied" tidak akan muncul lagi.

**Happy Coding!** 🚀
