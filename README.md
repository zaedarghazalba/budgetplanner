# Budget Planner App

Aplikasi budget planner modern yang membantu Anda mengelola keuangan pribadi dengan mudah. Dibangun dengan Next.js 14, Supabase, dan Tailwind CSS.

## Fitur Utama

- ✅ **Autentikasi Google** - Login mudah dengan akun Google
- ✅ **Catat Transaksi** - Tambah, edit, dan hapus transaksi pengeluaran/pemasukan
- ✅ **Kategori Custom** - Kelola kategori dengan ikon dan warna
- ✅ **Grafik Interaktif** - Visualisasi keuangan dengan Recharts
- ✅ **Budget Plan** - Atur budget mingguan/bulanan
- ✅ **Alert System** - Notifikasi saat pengeluaran melebihi threshold
- ✅ **Dashboard Real-time** - Lihat ringkasan keuangan secara real-time
- ✅ **Responsive Design** - Tampilan optimal di semua perangkat
- ✅ **Dark Mode Ready** - Siap untuk implementasi dark mode

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Charts**: Recharts
- **State Management**: Zustand (optional)
- **Deployment**: Vercel

---

## Setup Lokal

### Prerequisites

- Node.js 18+ dan npm/pnpm/yarn
- Akun Supabase (gratis)
- Akun Vercel (gratis, untuk deployment)

### Langkah 1: Clone & Install Dependencies

```bash
# Clone repository (jika menggunakan Git)
git clone <repository-url>
cd budget-planner-app

# Install dependencies
npm install
```

### Langkah 2: Setup Supabase

1. **Buat Project Supabase**
   - Buka [https://app.supabase.com](https://app.supabase.com)
   - Klik "New Project"
   - Isi nama project, database password, dan region
   - Tunggu hingga project selesai dibuat (~2 menit)

2. **Jalankan Database Migration**
   - Buka Dashboard Supabase → SQL Editor
   - Klik "New Query"
   - Copy-paste isi file `supabase/migrations/001_initial_schema.sql`
   - Klik "Run" untuk eksekusi
   - Ulangi untuk file `supabase/migrations/002_seed_default_categories.sql`

3. **Setup Google OAuth**
   - Di Dashboard Supabase → Authentication → Providers
   - Klik Google
   - Aktifkan "Enable Sign in with Google"

   **Cara mendapatkan Google OAuth credentials:**
   - Buka [Google Cloud Console](https://console.cloud.google.com)
   - Buat project baru atau pilih existing
   - Aktifkan Google+ API
   - Buka Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID dan Client Secret
   - Paste ke Supabase Google provider settings
   - Klik Save

4. **Ambil API Keys**
   - Dashboard Supabase → Settings → API
   - Copy `Project URL` dan `anon public` key

### Langkah 3: Environment Variables

Buat file `.env.local` di root project:

```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan credentials Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Langkah 4: Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

**Testing:**
1. Klik "Masuk" → "Masuk dengan Google"
2. Login dengan akun Google
3. Anda akan diarahkan ke Dashboard
4. Coba tambah transaksi pengeluaran/pemasukan
5. Lihat grafik dan statistik di dashboard

---

## Deployment ke Vercel

### Langkah 1: Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Langkah 2: Deploy ke Vercel

1. **Import Project**
   - Buka [https://vercel.com](https://vercel.com)
   - Klik "Add New" → "Project"
   - Import repository dari GitHub
   - Select your repository

2. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Environment Variables**
   - Tambahkan semua env vars dari `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
   ```

   ⚠️ **PENTING**: Ubah `NEXT_PUBLIC_SITE_URL` dengan URL production Vercel Anda!

4. **Deploy**
   - Klik "Deploy"
   - Tunggu hingga build selesai (~2-3 menit)
   - Aplikasi live di `https://your-app.vercel.app`

### Langkah 3: Update Google OAuth Redirect

1. Kembali ke Google Cloud Console → Credentials
2. Edit OAuth 2.0 Client ID yang sudah dibuat
3. Tambahkan ke Authorized redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
4. Tambahkan ke Authorized JavaScript origins:
   ```
   https://your-app.vercel.app
   ```
5. Save

### Langkah 4: Update Supabase OAuth

1. Dashboard Supabase → Authentication → URL Configuration
2. Site URL: `https://your-app.vercel.app`
3. Redirect URLs: `https://your-app.vercel.app/**`
4. Save

---

## Struktur Database

### Tables

```sql
profiles         # User profiles (extends auth.users)
categories       # Expense/Income categories
transactions     # All transactions (expense/income)
budget_plans     # Weekly/Monthly budget plans
budget_alerts    # Budget threshold alerts
```

### Relationships

```
profiles (1) → (N) categories
profiles (1) → (N) transactions
profiles (1) → (N) budget_plans
categories (1) → (N) transactions
budget_plans (1) → (N) budget_alerts
```

Lihat `ARCHITECTURE.md` untuk detail lengkap schema dan RLS policies.

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

---

## Fitur Tambahan (Roadmap)

### Phase 2
- [ ] Export data ke CSV/Excel
- [ ] Recurring transactions (transaksi berulang)
- [ ] Multi-currency support
- [ ] Dark mode toggle
- [ ] Transaction search & advanced filters
- [ ] Savings goals tracker
- [ ] Category budget breakdown

### Phase 3 (PWA)
- [ ] Offline mode
- [ ] Push notifications
- [ ] Install to home screen
- [ ] Background sync
- [ ] Receipt upload (camera)

### Phase 4 (Advanced)
- [ ] AI expense insights
- [ ] Bill reminders
- [ ] Expense sharing (family mode)
- [ ] Financial reports (PDF)
- [ ] API webhooks

---

## Troubleshooting

### Error: "Invalid API key"
- Pastikan `.env.local` sudah ada dan benar
- Restart dev server setelah update env vars

### Error: "redirect_uri_mismatch" (Google OAuth)
- Pastikan authorized redirect URI di Google Cloud Console sudah benar
- Format: `https://your-project.supabase.co/auth/v1/callback`

### Error: "Row Level Security policy violation"
- Pastikan RLS policies sudah dijalankan dari migration files
- Cek di Supabase Dashboard → Database → Policies

### Transaksi tidak muncul di dashboard
- Hard refresh browser (Ctrl+Shift+R)
- Cek di Supabase Dashboard → Table Editor → transactions
- Pastikan `user_id` sesuai dengan user yang login

### Build error di Vercel
- Cek build logs untuk error message
- Pastikan semua dependencies sudah di `package.json`
- Run `npm run build` lokal untuk test

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## License

MIT

---

## Support

Jika ada pertanyaan atau issue, silakan buat issue di GitHub repository.

Happy budgeting! 💰
