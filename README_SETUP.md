# Database Setup - Budget Planner

## 🚀 Quick Setup (Recommended)

Gunakan script otomatis untuk mengecek status database:

```bash
npm run setup:db
```

Script ini akan:
- ✅ Mengecek apakah semua tabel sudah ada
- ✅ Menampilkan status setiap tabel
- ✅ Memberikan instruksi jika ada tabel yang hilang

## 📋 Output Example

Jika database sudah setup:
```
🚀 Starting database setup...

📋 Checking existing tables...
✅ Table "categories" already exists
ℹ️  Database appears to be already set up

🔍 Verifying all tables...

📊 Table Status:
  ✅ profiles
  ✅ categories
  ✅ transactions
  ✅ budget_plans
  ✅ budget_alerts

✅ All tables exist! Database is ready.
```

Jika database belum setup:
```
🚀 Starting database setup...

📋 Checking existing tables...
❌ Table "categories" does not exist

⚠️  Note: Supabase API has limitations for complex SQL execution.
📋 Please follow these steps to complete setup:

1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: uqgfdxfttmdkqblxcqmi
3. Click "SQL Editor" in the sidebar
4. Click "New Query"
5. Copy the contents of: SETUP_DATABASE_COMPLETE.sql
6. Paste into the SQL Editor
7. Click "Run" (or press Ctrl+Enter)

📖 For detailed instructions, see: README_FIX_DATABASE.md

✅ After running the SQL, your database will be ready!
```

## 🔧 Manual Setup

Jika Anda prefer setup manual atau script gagal:

### Step 1: Buka Supabase Dashboard
1. Pergi ke https://supabase.com/dashboard
2. Login dan pilih project Anda

### Step 2: Run SQL File
1. Klik **"SQL Editor"** di sidebar
2. Klik **"New Query"**
3. Copy isi file `SETUP_DATABASE_COMPLETE.sql`
4. Paste ke SQL Editor
5. Klik **"Run"**

### Step 3: Verify
Jalankan script untuk memverifikasi:
```bash
npm run setup:db
```

## 🛠️ Troubleshooting

### Error: "Missing Supabase credentials"

Pastikan file `.env.local` ada dan berisi:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Error: "Table already exists"

Ini **normal**. Script mendeteksi tabel sudah ada dan skip creation.

### Some tables missing

Script akan menampilkan tabel mana yang hilang. Jalankan `SETUP_DATABASE_COMPLETE.sql` di Supabase Dashboard.

## 📁 Files Structure

```
Budget/
├── scripts/
│   └── setup-database.js          # Auto setup script
├── SETUP_DATABASE_COMPLETE.sql    # Complete SQL schema
├── README_FIX_DATABASE.md         # Detailed troubleshooting
└── README_SETUP.md                # This file
```

## 🎯 What Gets Created

Script/SQL akan membuat:

1. **Tables:**
   - `profiles` - User profiles
   - `categories` - Transaction categories
   - `transactions` - Income/expense transactions
   - `budget_plans` - Budget planning
   - `budget_alerts` - Budget alerts

2. **Security:**
   - Row Level Security (RLS) policies
   - User-specific data isolation

3. **Automation:**
   - Auto-create profile on signup
   - Auto-update timestamps
   - Auto-check budget thresholds

## 📞 Need Help?

1. Check the script output untuk instruksi spesifik
2. Baca `README_FIX_DATABASE.md` untuk troubleshooting detail
3. Check Supabase dashboard logs di "Database" → "Logs"

## ✅ Next Steps After Setup

1. Run `npm run setup:db` untuk verify
2. Test signup di aplikasi
3. Mulai gunakan aplikasi! 🎉

---

**Note:** Script ini aman dijalankan berkali-kali. Tidak akan menghapus atau duplicate data.
