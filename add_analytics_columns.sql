A-- ===================================
-- TAMBAH KOLOM ANALYTICS KE TABEL VISITOR_LOGS
-- ===================================
-- Script untuk menambahkan kolom event_name dan event_data ke tabel visitor_logs yang sudah ada
A
-- Tambah kolom event_name jika belum ada
ALTER TABLE visitor_logs 
ADD COLUMN IF NOT EXISTS event_name VARCHAR(100);

-- Tambah kolom event_data jika belum ada
ALTER TABLE visitor_logs 
ADD COLUMN IF NOT EXISTS event_data JSONB;

-- Buat index untuk kolom baru
CREATE INDEX IF NOT EXISTS idx_visitor_logs_event_name ON visitor_logs(event_name);

-- Verifikasi kolom sudah ditambahkan
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'visitor_logs' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Analytics columns added successfully!' as status;