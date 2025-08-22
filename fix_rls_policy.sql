-- ===================================
-- FIX RLS POLICY UNTUK ANONYMOUS USERS
-- ===================================
-- Jalankan script ini di SQL Editor Supabase untuk memperbaiki masalah delete

-- Hapus policy lama jika ada
DROP POLICY IF EXISTS "Allow anonymous users to manage" ON applications;

-- Buat policy baru untuk anonymous users
CREATE POLICY "Allow anonymous users to manage" ON applications
    FOR ALL
    USING (auth.role() = 'anon');

-- Verifikasi policy yang aktif
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'applications';

-- Alternatif: Jika masih bermasalah, nonaktifkan RLS sementara (untuk development)
-- ALTER TABLE applications DISABLE ROW LEVEL SECURITY;