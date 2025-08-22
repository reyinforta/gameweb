-- ===================================
-- TABEL ANALYTICS UNTUK MONITORING TRAFIK
-- ===================================
-- Jalankan script ini di SQL Editor Supabase untuk membuat tabel analytics

-- Buat tabel visitor_logs untuk menyimpan data kunjungan
CREATE TABLE IF NOT EXISTS visitor_logs (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(45),
    page_url TEXT NOT NULL,
    page_title VARCHAR(255),
    user_agent TEXT,
    referrer TEXT,
    session_id VARCHAR(100),
    visit_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    country VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(50), -- desktop, mobile, tablet
    browser VARCHAR(100),
    os VARCHAR(100)
);

-- Buat index untuk performa query yang lebih baik
CREATE INDEX IF NOT EXISTS idx_visitor_logs_timestamp ON visitor_logs(visit_timestamp);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_page_url ON visitor_logs(page_url);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_ip ON visitor_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_session ON visitor_logs(session_id);

-- Buat tabel page_stats untuk statistik halaman
CREATE TABLE IF NOT EXISTS page_stats (
    id SERIAL PRIMARY KEY,
    page_url TEXT NOT NULL UNIQUE,
    page_title VARCHAR(255),
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    avg_time_on_page INTEGER DEFAULT 0, -- dalam detik
    bounce_rate DECIMAL(5,2) DEFAULT 0.00,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat tabel daily_stats untuk statistik harian
CREATE TABLE IF NOT EXISTS daily_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    total_visitors INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_session_duration INTEGER DEFAULT 0, -- dalam detik
    top_pages JSONB,
    top_referrers JSONB,
    device_breakdown JSONB,
    browser_breakdown JSONB
);

-- Verifikasi tabel sudah dibuat
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('visitor_logs', 'page_stats', 'daily_stats')
ORDER BY table_name;

-- Function untuk update statistik otomatis
CREATE OR REPLACE FUNCTION update_page_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update atau insert page stats
    INSERT INTO page_stats (page_url, page_title, total_views, unique_visitors)
    VALUES (NEW.page_url, NEW.page_title, 1, 1)
    ON CONFLICT (page_url) 
    DO UPDATE SET 
        total_views = page_stats.total_views + 1,
        last_updated = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk update otomatis
DROP TRIGGER IF EXISTS trigger_update_page_stats ON visitor_logs;
CREATE TRIGGER trigger_update_page_stats
    AFTER INSERT ON visitor_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_page_stats();

-- Sample data untuk testing (opsional)
-- INSERT INTO visitor_logs (ip_address, page_url, page_title, user_agent, device_type, browser, os)
-- VALUES 
-- ('192.168.1.1', '/index.html', 'Home - Game Store', 'Mozilla/5.0...', 'desktop', 'Chrome', 'Windows'),
-- ('192.168.1.2', '/admin.html', 'Admin Panel', 'Mozilla/5.0...', 'mobile', 'Safari', 'iOS');

SELECT 'Analytics tables created successfully!' as status;