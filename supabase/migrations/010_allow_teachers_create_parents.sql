-- Öğretmenlerin toplu yükleme sırasında veli oluşturmasına izin ver

-- user_id alanını NULL yapılabilir yap (toplu yükleme için)
ALTER TABLE parents ALTER COLUMN user_id DROP NOT NULL;

-- Anne ve baba bilgilerini ayrı tutmak için yeni kolonlar ekle
ALTER TABLE parents ADD COLUMN IF NOT EXISTS mother_name TEXT;
ALTER TABLE parents ADD COLUMN IF NOT EXISTS mother_phone TEXT;
ALTER TABLE parents ADD COLUMN IF NOT EXISTS father_name TEXT;
ALTER TABLE parents ADD COLUMN IF NOT EXISTS father_phone TEXT;

-- Önce mevcut policy'yi sil (varsa)
DROP POLICY IF EXISTS "Öğretmenler veli ekleyebilir" ON parents;

-- Öğretmenler veli ekleyebilir
CREATE POLICY "Öğretmenler veli ekleyebilir"
  ON parents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );

-- Öğretmenler velileri görüntüleyebilir (students üzerinden)
DROP POLICY IF EXISTS "Öğretmenler velileri görebilir" ON parents;

CREATE POLICY "Öğretmenler velileri görebilir"
  ON parents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );
