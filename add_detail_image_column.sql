-- ===================================
-- TAMBAH KOLOM DETAIL_IMAGE_URL
-- ===================================
-- Jalankan script ini di SQL Editor Supabase untuk menambahkan kolom detail_image_url

-- Tambah kolom detail_image_url ke tabel applications
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS detail_image_url TEXT;

-- Verifikasi kolom sudah ditambahkan
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'applications' 
AND column_name IN ('image_url', 'detail_image_url')
ORDER BY column_name;

-- Optional: Update existing records to use image_url as detail_image_url if needed
-- UPDATE applications SET detail_image_url = image_url WHERE detail_image_url IS NULL;