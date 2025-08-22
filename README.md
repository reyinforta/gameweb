# 🎮 Playora App - Platform Jual Beli Aplikasi dan Game

## 📖 Deskripsi
Playora App adalah platform modern untuk jual beli aplikasi dan game dengan fitur lengkap seperti pencarian, filter kategori, halaman detail, dan sistem order.

## ✨ Fitur Utama

### 🏠 Halaman Utama (index.html)
- ✅ Tampilan grid aplikasi dan game
- ✅ Pencarian real-time
- ✅ Filter kategori (Aplikasi/Game)
- ✅ Pagination dinamis
- ✅ Loading indicator
- ✅ Responsive design

### 📱 Halaman Detail (detail.html)
- ✅ Informasi lengkap aplikasi/game
- ✅ Tombol **Demo App** (buka demo)
- ✅ Tombol **Order** (proses pemesanan)
- ✅ Rating dan review
- ✅ Screenshot gallery
- ✅ Aplikasi serupa
- ✅ Informasi developer

### 🗄️ Database (Supabase)
- ✅ Tabel applications dengan 16 data sample
- ✅ 6 Aplikasi: WhatsApp Business, Canva Pro, Shopee Seller, Adobe Photoshop, Zoom Pro, Spotify Premium
- ✅ 8 Game: Mobile Legends, PUBG Mobile, Genshin Impact, Call of Duty, Minecraft, Among Us, Free Fire MAX, Clash Royale
- ✅ Full-text search
- ✅ Category filtering
- ✅ Row Level Security (RLS)

## 🚀 Cara Setup Database

### 1. Setup Supabase (WAJIB)
1. Buka [supabase.com](https://supabase.com) dan buat akun
2. Buat project baru dengan nama `playora-app`
3. Di SQL Editor, jalankan script dari file `database_setup.sql`
4. Copy **Project URL** dan **anon public key** dari Settings > API

### 2. Konfigurasi Database
Buka file `js/database.js` dan ganti:
```javascript
// GANTI INI dengan data dari Supabase Anda
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

**Contoh:**
```javascript
const SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5...';
```

### 3. Jalankan Website
```bash
# Buka terminal di folder project
cd gameweb

# Jalankan server lokal
python -m http.server 8000

# Buka browser ke http://localhost:8000
```

## 📁 Struktur File

```
gameweb/
├── index.html              # Halaman utama
├── detail.html             # Halaman detail aplikasi
├── database_setup.sql      # Script setup database
├── SETUP_SUPABASE.md      # Panduan detail setup
├── js/
│   ├── database.js         # Konfigurasi dan fungsi database
│   └── plugins.js          # Library JavaScript
├── css/
│   ├── bootstrap.min.css   # Framework CSS
│   └── templatemo-style.css # Style custom
├── img/                    # Folder gambar
└── fontawesome/           # Icon fonts
```

## 🎯 Cara Menggunakan

### Halaman Utama
1. **Pencarian**: Ketik nama aplikasi/game di search box
2. **Filter**: Pilih "Aplikasi" atau "Game" dari dropdown
3. **Detail**: Klik "View more" untuk melihat detail

### Halaman Detail
1. **Demo App**: Klik untuk membuka demo aplikasi (jika tersedia)
2. **Order**: Klik untuk memulai proses pemesanan
3. **Info**: Lihat rating, ukuran, developer, dll
4. **Serupa**: Lihat aplikasi/game serupa

## 🛠️ Teknologi

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 4
- **Database**: Supabase (PostgreSQL)
- **Icons**: Font Awesome
- **Responsive**: Mobile-first design

## 📊 Data Sample

### Aplikasi (6 items)
1. **WhatsApp Business** - Gratis - 4.8★
2. **Canva Pro** - Rp 150.000 - 4.7★
3. **Shopee Seller Center** - Gratis - 4.5★
4. **Adobe Photoshop Express** - Rp 75.000 - 4.6★
5. **Zoom Pro** - Rp 200.000 - 4.4★
6. **Spotify Premium** - Rp 65.000 - 4.9★

### Game (8 items)
1. **Mobile Legends: Bang Bang** - Gratis - 4.5★
2. **PUBG Mobile** - Gratis - 4.3★
3. **Genshin Impact** - Gratis - 4.7★
4. **Call of Duty: Mobile** - Gratis - 4.4★
5. **Minecraft Premium** - Rp 350.000 - 4.8★
6. **Among Us** - Rp 45.000 - 4.2★
7. **Free Fire MAX** - Gratis - 4.1★
8. **Clash Royale** - Gratis - 4.6★

## 🔧 Troubleshooting

### Error: "Database functions not loaded"
**Solusi**: Pastikan konfigurasi Supabase di `js/database.js` sudah benar

### Error: "Failed to fetch"
**Solusi**: 
1. Cek koneksi internet
2. Pastikan SUPABASE_URL dan SUPABASE_ANON_KEY benar
3. Pastikan project Supabase aktif

### Data tidak muncul
**Solusi**:
1. Jalankan script `database_setup.sql` di Supabase
2. Cek tabel `applications` di Table Editor
3. Pastikan RLS policy sudah aktif

### Gambar tidak muncul
**Solusi**: Pastikan file gambar ada di folder `img/` atau upload ke Supabase Storage

## 💰 Biaya

**Gratis untuk development:**
- Supabase Free Tier: 500MB database, 50K API requests/bulan
- GitHub Pages: Hosting gratis
- Netlify: Hosting gratis dengan custom domain

## 🔗 Link Penting

- [Panduan Setup Detail](SETUP_SUPABASE.md)
- [Supabase Documentation](https://supabase.com/docs)
- [Bootstrap Documentation](https://getbootstrap.com/docs/4.6/)

## 📞 Support

Jika ada pertanyaan atau error:
1. Cek file `SETUP_SUPABASE.md` untuk panduan detail
2. Cek troubleshooting di atas
3. Pastikan semua file sudah di-upload dengan benar

---

**🎉 Selamat! Website Playora App siap digunakan!**

*Jangan lupa setup Supabase terlebih dahulu agar database berfungsi dengan baik.*