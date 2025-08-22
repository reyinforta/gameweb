# 🚀 Panduan Setup Database Supabase untuk Playora App

## 📋 Langkah-langkah Setup

### 1. Buat Akun Supabase
1. Kunjungi [supabase.com](https://supabase.com)
2. Klik "Start your project" atau "Sign Up"
3. Daftar menggunakan GitHub atau email
4. Verifikasi email jika diperlukan

### 2. Buat Project Baru
1. Setelah login, klik "New Project"
2. Pilih Organization (biasanya nama GitHub Anda)
3. Isi detail project:
   - **Name**: `playora-app`
   - **Database Password**: Buat password yang kuat (simpan baik-baik!)
   - **Region**: Pilih yang terdekat (Southeast Asia - Singapore)
4. Klik "Create new project"
5. Tunggu 2-3 menit hingga project selesai dibuat

### 3. Setup Database
1. Di dashboard Supabase, klik tab **"SQL Editor"** di sidebar kiri
2. Klik "New Query" atau gunakan template
3. Copy seluruh isi file `database_setup.sql` yang sudah dibuat
4. Paste ke SQL Editor
5. Klik **"Run"** untuk menjalankan script
6. Pastikan tidak ada error (akan muncul "Success. No rows returned")

### 4. Dapatkan API Keys
1. Klik tab **"Settings"** di sidebar kiri
2. Pilih **"API"** dari submenu
3. Copy informasi berikut:
   - **Project URL** (contoh: `https://abcdefgh.supabase.co`)
   - **anon public key** (key yang panjang dimulai dengan `eyJ...`)

### 5. Konfigurasi File JavaScript
1. Buka file `js/database.js`
2. Ganti bagian konfigurasi:
```javascript
// Ganti dengan URL dan API Key dari Supabase Anda
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

**Contoh:**
```javascript
const SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5...';
```

### 6. Upload Gambar (Opsional)
Jika ingin menggunakan gambar dari Supabase Storage:
1. Klik tab **"Storage"** di sidebar kiri
2. Klik "Create a new bucket"
3. Nama bucket: `app-images`
4. Set sebagai **Public bucket**
5. Upload gambar aplikasi dan game
6. Update URL gambar di database

### 7. Verifikasi Data
1. Klik tab **"Table Editor"** di sidebar kiri
2. Pilih tabel **"applications"**
3. Pastikan data sample sudah ada (16 records)
4. Cek kategori: 6 aplikasi dan 8 game

## 🔧 Troubleshooting

### Error: "Invalid API key"
- Pastikan SUPABASE_ANON_KEY sudah benar
- Jangan gunakan service_role key untuk frontend

### Error: "Failed to fetch"
- Cek SUPABASE_URL sudah benar
- Pastikan internet connection stabil

### Data tidak muncul
- Cek apakah script SQL sudah dijalankan
- Pastikan RLS (Row Level Security) sudah dikonfigurasi

### Gambar tidak muncul
- Pastikan path gambar di folder `img/` sudah benar
- Atau upload ke Supabase Storage dan update URL

## 📊 Struktur Database

### Tabel: applications
| Field | Type | Description |
|-------|------|-------------|
| id | BIGSERIAL | Primary key |
| title | TEXT | Nama aplikasi/game |
| description | TEXT | Deskripsi lengkap |
| category | TEXT | 'app' atau 'game' |
| price | NUMERIC | Harga (0 = gratis) |
| image_url | TEXT | URL gambar |
| demo_url | TEXT | URL demo |
| rating | NUMERIC | Rating 0-5 |
| downloads | INTEGER | Jumlah download |
| size_mb | NUMERIC | Ukuran file (MB) |
| developer | TEXT | Nama developer |
| features | TEXT[] | Array fitur |
| is_featured | BOOLEAN | Aplikasi unggulan |
| created_at | TIMESTAMPTZ | Tanggal dibuat |

## 🎯 Fitur Database

✅ **Sudah Tersedia:**
- Tabel applications dengan 16 data sample
- Index untuk performa query
- Row Level Security (RLS)
- Views untuk query populer
- Function untuk search
- Auto-update timestamp

✅ **Data Sample:**
- 6 Aplikasi: WhatsApp Business, Canva Pro, Shopee Seller, Adobe Photoshop, Zoom Pro, Spotify Premium
- 8 Game: Mobile Legends, PUBG Mobile, Genshin Impact, Call of Duty, Minecraft, Among Us, Free Fire MAX, Clash Royale

## 💰 Biaya

**Free Tier Supabase:**
- Database: 500MB storage
- API requests: 50,000/bulan
- Auth users: 50,000
- Storage: 1GB
- Bandwidth: 2GB

**Cukup untuk:**
- Website dengan ribuan pengunjung
- Ratusan aplikasi/game
- Testing dan development

## 🔗 Link Berguna

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [SQL Tutorial](https://supabase.com/docs/guides/database)

---

**Selamat! Database Supabase Anda sudah siap digunakan! 🎉**

Jika ada pertanyaan atau error, silakan cek troubleshooting di atas atau dokumentasi Supabase.