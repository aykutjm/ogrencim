-- Teachers tablosu için RLS politikaları

-- Önce mevcut politikaları temizle
DROP POLICY IF EXISTS "Teachers can view their own data" ON teachers;
DROP POLICY IF EXISTS "Teachers can update their own data" ON teachers;
DROP POLICY IF EXISTS "Allow teacher creation" ON teachers;
DROP POLICY IF EXISTS "Teachers full access" ON teachers;

-- Tüm öğretmenler kendi kayıtlarını görebilir
CREATE POLICY "Teachers can view own record"
  ON teachers
  FOR SELECT
  USING (auth.uid() = id);

-- Öğretmenler kendi kayıtlarını güncelleyebilir
CREATE POLICY "Teachers can update own record"
  ON teachers
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Kimlik doğrulaması yapılmış herkes teacher kaydı oluşturabilir (signup için gerekli)
CREATE POLICY "Allow authenticated users to insert teachers"
  ON teachers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Öğretmenler kendi kayıtlarını silebilir
CREATE POLICY "Teachers can delete own record"
  ON teachers
  FOR DELETE
  USING (auth.uid() = id);
