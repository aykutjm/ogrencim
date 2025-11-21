-- Migration 017: RLS'i tekrar aktif et
-- Service-role client kullanıyoruz, artık RLS güvenli şekilde çalışabilir

ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

-- Kontrol
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'institutions';
