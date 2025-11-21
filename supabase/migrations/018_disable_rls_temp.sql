-- Migration 018: RLS'i kapat (geçici - custom domain sorunu)
-- Custom domain JWT tokenları çalışmıyor, RLS'i kapat

ALTER TABLE institutions DISABLE ROW LEVEL SECURITY;

-- Kontrol
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'institutions';
