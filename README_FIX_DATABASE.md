# Fix Database Error: "categories does not exist"

## Problem
Anda mendapatkan error saat signup:
```
ERROR: relation "categories" does not exist (SQLSTATE 42P01)
```

Ini berarti tabel `categories` belum dibuat di database Supabase Anda.

## Solution - Cara Memperbaiki

### Step 1: Buka Supabase Dashboard
1. Pergi ke https://supabase.com/dashboard
2. Login ke akun Anda
3. Pilih project Budget Planner Anda

### Step 2: Jalankan SQL Setup
1. Klik menu **"SQL Editor"** di sidebar kiri
2. Klik **"New Query"**
3. Copy seluruh isi file `SETUP_DATABASE_COMPLETE.sql`
4. Paste ke SQL Editor
5. Klik tombol **"Run"** (atau tekan Ctrl+Enter)

### Step 3: Verifikasi Setup
Setelah SQL selesai dijalankan, Anda akan melihat output seperti ini:

```
status          | profiles | categories | transactions | budget_plans | budget_alerts
----------------------------------------------------------------------------------
Tables exist:   | true     | true       | true         | true         | true
```

✅ **Jika semua kolom menunjukkan `true`, database sudah siap!**

### Step 4: Test Signup
1. Kembali ke aplikasi Anda (http://localhost:3000)
2. Coba signup dengan akun baru
3. Error seharusnya sudah hilang

## Apa yang Dilakukan File SQL Ini?

File `SETUP_DATABASE_COMPLETE.sql` akan:

1. ✅ Check apakah tabel categories sudah ada
2. ✅ Jika belum ada, buat semua tabel yang diperlukan:
   - `profiles` - Menyimpan data user
   - `categories` - Menyimpan kategori transaksi
   - `transactions` - Menyimpan transaksi
   - `budget_plans` - Menyimpan rencana budget
   - `budget_alerts` - Menyimpan alert budget
3. ✅ Setup RLS (Row Level Security) policies
4. ✅ Buat functions dan triggers yang diperlukan
5. ✅ Verifikasi bahwa semua tabel berhasil dibuat

## Troubleshooting

### Error: "permission denied"
Pastikan Anda menjalankan SQL di **SQL Editor** Supabase, bukan di local terminal.

### Tabel sudah ada tapi masih error
Jalankan query ini di SQL Editor untuk check RLS policies:
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'categories';
```

Harus ada 4 policies:
- Users can view own categories
- Users can insert own categories
- Users can update own categories
- Users can delete own categories

### Masih ada masalah?
1. Check apakah service role key di `.env.local` sudah benar
2. Pastikan Supabase project Anda aktif (tidak di-pause)
3. Coba restart aplikasi Next.js (`npm run dev`)

## Catatan Penting

⚠️ **File SQL ini aman dijalankan berkali-kali**
- Menggunakan `IF NOT EXISTS` untuk avoid duplicate
- Menggunakan `DROP POLICY IF EXISTS` sebelum create policy baru
- Tidak akan menghapus data yang sudah ada

✅ **Setelah setup berhasil, Anda tidak perlu menjalankan file ini lagi**

## Next Steps

Setelah database setup berhasil, user baru yang signup akan otomatis mendapatkan:
- ✅ Profile dibuat otomatis
- ✅ Default categories dibuat di signup page (via code)
- ✅ Siap untuk mulai mencatat transaksi

---

Jika masih ada masalah, silakan check console browser (F12) untuk melihat error detail.
