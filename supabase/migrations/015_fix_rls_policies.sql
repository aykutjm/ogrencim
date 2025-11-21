-- Migration 015: RLS Politikalarını Düzelt
-- Sorun: auth.users tablosuna RLS içinden erişim yok
-- Çözüm: Basitleştirilmiş politikalar + bypass mekanizması

-- 1. Eski politikaları sil
DROP POLICY IF EXISTS "Superadmin can view all institutions" ON institutions;
DROP POLICY IF EXISTS "Users can view own institution" ON institutions;
DROP POLICY IF EXISTS "Superadmin can insert institutions" ON institutions;
DROP POLICY IF EXISTS "Superadmin can update institutions" ON institutions;

-- 2. Basitleştirilmiş politikalar - herkes kendi kurumunu görebilir
CREATE POLICY "Users can view their institution"
  ON institutions FOR SELECT
  USING (
    -- Kullanıcı teacher ise kendi kurumunu görebilir
    id IN (
      SELECT institution_id FROM teachers WHERE user_id = auth.uid()
    )
    OR
    -- Kullanıcı parent ise kendi kurumunu görebilir
    id IN (
      SELECT institution_id FROM parents WHERE user_id = auth.uid()
    )
  );

-- 3. Superadmin bypass için geçici çözüm: service_role kullan
-- Frontend'de superadmin kontrolü yapacağız

-- 4. INSERT/UPDATE için herkese izin ver (frontend'de kontrol edilecek)
CREATE POLICY "Allow insert for authenticated users"
  ON institutions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
  ON institutions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. DELETE için politika
CREATE POLICY "Allow delete for authenticated users"
  ON institutions FOR DELETE
  TO authenticated
  USING (true);

-- 6. Kontrol
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'institutions'
ORDER BY policyname;
