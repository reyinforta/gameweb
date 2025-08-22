-- ===================================
-- SETUP DATABASE SUPABASE UNTUK PLAYORA APP
-- ===================================
-- Jalankan script ini di SQL Editor Supabase

-- 1. Buat tabel applications
CREATE TABLE IF NOT EXISTS applications (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('app', 'game')),
    price NUMERIC(10,2) DEFAULT 0,
    image_url TEXT,
    detail_image_url TEXT,
    demo_url TEXT,
    download_url TEXT,
    rating NUMERIC(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    downloads INTEGER DEFAULT 0,
    size_mb NUMERIC(8,2),
    version TEXT DEFAULT '1.0.0',
    developer TEXT,
    requirements TEXT,
    features TEXT[],
    screenshots TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Buat index untuk performa yang lebih baik
CREATE INDEX IF NOT EXISTS idx_applications_category ON applications(category);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_rating ON applications(rating DESC);
CREATE INDEX IF NOT EXISTS idx_applications_featured ON applications(is_featured, is_active);

-- 3. Buat function untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Buat trigger untuk auto-update timestamp
CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- INSERT DATA SAMPLE
-- ===================================

-- Data sample untuk APLIKASI
INSERT INTO applications (
    title, description, category, price, image_url, demo_url, rating, downloads, size_mb, developer, requirements, features, is_featured
) VALUES 
(
    'WhatsApp Business',
    'Aplikasi WhatsApp khusus untuk bisnis dengan fitur katalog produk, pesan otomatis, dan statistik pesan. Cocok untuk UMKM dan bisnis online.',
    'app',
    0,
    'img/img-01.jpg',
    'https://demo.whatsappbusiness.com',
    4.8,
    15420,
    45.2,
    'Meta Platforms',
    'Android 5.0+, RAM 2GB',
    ARRAY['Katalog Produk', 'Pesan Otomatis', 'Statistik', 'Multi Device'],
    true
),
(
    'Canva Pro',
    'Aplikasi desain grafis profesional dengan ribuan template, font premium, dan fitur AI. Buat poster, logo, presentasi dengan mudah.',
    'app',
    150000,
    'img/img-02.jpg',
    'https://demo.canva.com',
    4.7,
    8930,
    120.5,
    'Canva Pty Ltd',
    'Android 6.0+, RAM 3GB',
    ARRAY['Template Premium', 'AI Design', 'Cloud Storage', 'Team Collaboration'],
    true
),
(
    'Shopee Seller Center',
    'Aplikasi untuk mengelola toko online di Shopee. Kelola produk, pesanan, chat pembeli, dan analisis penjualan dalam satu aplikasi.',
    'app',
    0,
    'img/img-03.jpg',
    'https://demo.shopee.co.id/seller',
    4.5,
    12340,
    67.8,
    'Shopee Singapore',
    'Android 5.0+, RAM 2GB',
    ARRAY['Kelola Produk', 'Chat Pembeli', 'Analisis Penjualan', 'Promosi Toko'],
    false
),
(
    'Adobe Photoshop Express',
    'Editor foto profesional dengan filter premium, tools retouching, dan fitur AI untuk editing foto yang sempurna.',
    'app',
    75000,
    'img/img-04.jpg',
    'https://demo.adobe.com/photoshop',
    4.6,
    6780,
    89.3,
    'Adobe Inc.',
    'Android 7.0+, RAM 4GB',
    ARRAY['Filter Premium', 'AI Retouching', 'RAW Support', 'Cloud Sync'],
    false
),
(
    'Zoom Pro',
    'Aplikasi video conference premium dengan fitur recording, virtual background, dan meeting room unlimited.',
    'app',
    200000,
    'img/img-05.jpg',
    'https://demo.zoom.us',
    4.4,
    9560,
    78.9,
    'Zoom Video Communications',
    'Android 6.0+, RAM 3GB',
    ARRAY['HD Video', 'Recording', 'Virtual Background', 'Screen Share'],
    false
),
(
    'Spotify Premium',
    'Streaming musik premium tanpa iklan, download offline, dan kualitas audio tinggi dengan jutaan lagu.',
    'app',
    65000,
    'img/img-06.jpg',
    'https://demo.spotify.com',
    4.9,
    25670,
    95.4,
    'Spotify AB',
    'Android 5.0+, RAM 2GB',
    ARRAY['No Ads', 'Offline Download', 'High Quality', 'Unlimited Skip'],
    true
);

-- Data sample untuk GAME
INSERT INTO applications (
    title, description, category, price, image_url, demo_url, rating, downloads, size_mb, developer, requirements, features, is_featured
) VALUES 
(
    'Mobile Legends: Bang Bang',
    'Game MOBA 5v5 terpopuler dengan hero-hero unik, gameplay seru, dan turnamen esports. Mainkan bersama teman!',
    'game',
    0,
    'img/img-07.jpg',
    'https://demo.mobilelegends.com',
    4.5,
    45230,
    3200.0,
    'Moonton',
    'Android 4.1+, RAM 3GB',
    ARRAY['5v5 MOBA', '100+ Heroes', 'Ranked Mode', 'Esports Tournament'],
    true
),
(
    'PUBG Mobile',
    'Battle Royale game dengan 100 pemain, map luas, senjata realistis, dan mode permainan yang beragam.',
    'game',
    0,
    'img/img-08.jpg',
    'https://demo.pubgmobile.com',
    4.3,
    38940,
    2800.0,
    'Tencent Games',
    'Android 5.1+, RAM 4GB',
    ARRAY['Battle Royale', 'Multiple Maps', 'Team Mode', 'Custom Rooms'],
    true
),
(
    'Genshin Impact',
    'Open-world action RPG dengan grafis anime yang memukau, sistem gacha, dan petualangan yang tak terbatas.',
    'game',
    0,
    'img/img-09.jpg',
    'https://demo.genshinimpact.com',
    4.7,
    28560,
    15000.0,
    'miHoYo',
    'Android 7.0+, RAM 6GB',
    ARRAY['Open World', 'Gacha System', 'Co-op Mode', 'Regular Updates'],
    true
),
(
    'Call of Duty: Mobile',
    'FPS game dengan mode Battle Royale dan Multiplayer, senjata ikonik, dan map klasik dari seri Call of Duty.',
    'game',
    0,
    'img/img-10.jpg',
    'https://demo.callofduty.com',
    4.4,
    32180,
    1900.0,
    'Activision',
    'Android 5.1+, RAM 3GB',
    ARRAY['Battle Royale', 'Multiplayer', 'Classic Maps', 'Weapon Customization'],
    false
),
(
    'Minecraft Premium',
    'Game sandbox kreatif dengan unlimited blocks, multiplayer server, dan mod support untuk kreativitas tanpa batas.',
    'game',
    350000,
    'img/img-11.jpg',
    'https://demo.minecraft.net',
    4.8,
    18750,
    450.0,
    'Mojang Studios',
    'Android 4.2+, RAM 2GB',
    ARRAY['Creative Mode', 'Multiplayer', 'Mod Support', 'Regular Updates'],
    false
),
(
    'Among Us',
    'Game multiplayer social deduction yang viral. Temukan impostor di antara crewmate dalam permainan yang seru!',
    'game',
    45000,
    'img/img-12.jpg',
    'https://demo.amongus.com',
    4.2,
    22340,
    250.0,
    'InnerSloth',
    'Android 4.4+, RAM 1GB',
    ARRAY['Multiplayer', 'Social Deduction', 'Custom Rooms', 'Voice Chat'],
    false
),
(
    'Free Fire MAX',
    'Battle Royale game dengan grafis HD, efek visual yang memukau, dan gameplay yang smooth untuk pengalaman gaming terbaik.',
    'game',
    0,
    'img/img-13.jpg',
    'https://demo.freefire.com',
    4.1,
    41200,
    1200.0,
    'Garena',
    'Android 4.1+, RAM 2GB',
    ARRAY['HD Graphics', 'Battle Royale', 'Character System', 'Guild Wars'],
    false
),
(
    'Clash Royale',
    'Strategy game real-time dengan kartu koleksi, arena battle, dan clan wars. Kumpulkan kartu dan menangkan pertarungan!',
    'game',
    0,
    'img/img-14.jpg',
    'https://demo.clashroyale.com',
    4.6,
    19870,
    180.0,
    'Supercell',
    'Android 4.1+, RAM 1GB',
    ARRAY['Card Collection', 'Real-time Strategy', 'Clan Wars', 'Tournament'],
    false
);

-- ===================================
-- SETUP ROW LEVEL SECURITY (RLS)
-- ===================================

-- Enable RLS pada tabel applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policy untuk read (semua orang bisa baca data yang aktif)
CREATE POLICY "Allow public read access" ON applications
    FOR SELECT
    USING (is_active = true);

-- Policy untuk insert/update/delete (hanya authenticated users)
CREATE POLICY "Allow authenticated users to manage" ON applications
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Policy untuk anonymous users (untuk demo/development)
CREATE POLICY "Allow anonymous users to manage" ON applications
    FOR ALL
    USING (auth.role() = 'anon');

-- ===================================
-- VIEWS UNTUK KEMUDAHAN QUERY
-- ===================================

-- View untuk aplikasi populer
CREATE OR REPLACE VIEW popular_applications AS
SELECT *
FROM applications
WHERE is_active = true
ORDER BY downloads DESC, rating DESC
LIMIT 10;

-- View untuk aplikasi featured
CREATE OR REPLACE VIEW featured_applications AS
SELECT *
FROM applications
WHERE is_active = true AND is_featured = true
ORDER BY created_at DESC;

-- View untuk statistik kategori
CREATE OR REPLACE VIEW category_stats AS
SELECT 
    category,
    COUNT(*) as total_apps,
    AVG(rating) as avg_rating,
    SUM(downloads) as total_downloads
FROM applications
WHERE is_active = true
GROUP BY category;

-- ===================================
-- FUNCTIONS UNTUK SEARCH
-- ===================================

-- Function untuk full-text search
CREATE OR REPLACE FUNCTION search_applications(search_term TEXT)
RETURNS TABLE(
    id BIGINT,
    title TEXT,
    description TEXT,
    category TEXT,
    price NUMERIC,
    image_url TEXT,
    rating NUMERIC,
    downloads INTEGER,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id, a.title, a.description, a.category, a.price,
        a.image_url, a.rating, a.downloads, a.created_at
    FROM applications a
    WHERE a.is_active = true
    AND (
        a.title ILIKE '%' || search_term || '%'
        OR a.description ILIKE '%' || search_term || '%'
        OR a.developer ILIKE '%' || search_term || '%'
    )
    ORDER BY 
        CASE WHEN a.title ILIKE '%' || search_term || '%' THEN 1 ELSE 2 END,
        a.downloads DESC,
        a.rating DESC;
END;
$$ LANGUAGE plpgsql;

-- ===================================
-- SELESAI!
-- ===================================
-- Database setup selesai!
-- Jangan lupa untuk:
-- 1. Ganti SUPABASE_URL dan SUPABASE_ANON_KEY di database.js
-- 2. Upload gambar ke Supabase Storage atau gunakan URL eksternal
-- 3. Test koneksi database dari aplikasi