-- Rol ve Kurum Yönetim Sistemi
-- Bu migration, multi-tenant sistem için gerekli tabloları oluşturur

-- 1. INSTITUTIONS (Kurumlar) Tablosu
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ROLES (Roller) Tablosu
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Varsayılan rolleri ekle
INSERT INTO roles (name, description) VALUES
  ('superadmin', 'Tüm kurumları yönetir, sistem geneli yetkiler'),
  ('admin', 'Kendi kurumunu yönetir, idareci yetkiler'),
  ('teacher', 'Öğretmen, sınırlı erişim - sadece kendi öğrencileri'),
  ('parent', 'Veli, sadece kendi çocuklarını görür')
ON CONFLICT (name) DO NOTHING;

-- 4. TEACHERS tablosuna institution_id ekle
ALTER TABLE teachers 
ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL;

-- 5. STUDENTS tablosuna institution_id ekle
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL;

-- 6. PARENTS tablosuna institution_id ekle
ALTER TABLE parents 
ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL;

-- 7. CLASSES tablosuna institution_id ekle
ALTER TABLE classes 
ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL;

-- 8. SUBJECTS tablosuna institution_id ekle (her kurum kendi branşlarını yönetebilir)
ALTER TABLE subjects 
ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL;

-- 9. İlk kurum ve süperadmin için hazırlık
-- Varsayılan kurum oluştur (mevcut veriler için)
INSERT INTO institutions (name, email, is_active)
VALUES ('MAFEN Eğitim', 'info@mafen.com', true)
ON CONFLICT DO NOTHING
RETURNING id;

-- 10. Mevcut kayıtları varsayılan kuruma bağla
DO $$
DECLARE
  default_institution_id UUID;
BEGIN
  -- İlk kurumun ID'sini al
  SELECT id INTO default_institution_id FROM institutions LIMIT 1;
  
  IF default_institution_id IS NOT NULL THEN
    -- Tüm teachers'ı varsayılan kuruma bağla
    UPDATE teachers SET institution_id = default_institution_id WHERE institution_id IS NULL;
    
    -- Tüm students'ı varsayılan kuruma bağla
    UPDATE students SET institution_id = default_institution_id WHERE institution_id IS NULL;
    
    -- Tüm parents'ı varsayılan kuruma bağla
    UPDATE parents SET institution_id = default_institution_id WHERE institution_id IS NULL;
    
    -- Tüm classes'ı varsayılan kuruma bağla
    UPDATE classes SET institution_id = default_institution_id WHERE institution_id IS NULL;
    
    -- Tüm subjects'ı varsayılan kuruma bağla
    UPDATE subjects SET institution_id = default_institution_id WHERE institution_id IS NULL;
    
    RAISE NOTICE 'Mevcut kayıtlar varsayılan kuruma bağlandı: %', default_institution_id;
  END IF;
END $$;

-- 11. İndeksler oluştur (performans için)
CREATE INDEX IF NOT EXISTS idx_teachers_institution ON teachers(institution_id);
CREATE INDEX IF NOT EXISTS idx_students_institution ON students(institution_id);
CREATE INDEX IF NOT EXISTS idx_parents_institution ON parents(institution_id);
CREATE INDEX IF NOT EXISTS idx_classes_institution ON classes(institution_id);
CREATE INDEX IF NOT EXISTS idx_subjects_institution ON subjects(institution_id);

-- 12. Trigger fonksiyonu: updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_institution_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER institutions_updated_at
  BEFORE UPDATE ON institutions
  FOR EACH ROW
  EXECUTE FUNCTION update_institution_updated_at();

-- 13. RLS (Row Level Security) aktif et
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

-- 14. RLS Politikaları: Institutions
-- Süperadmin tüm kurumları görebilir
CREATE POLICY "Superadmin can view all institutions"
  ON institutions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'superadmin'
    )
  );

-- Admin ve teacher kendi kurumunu görebilir
CREATE POLICY "Users can view own institution"
  ON institutions
  FOR SELECT
  USING (
    id IN (
      SELECT institution_id FROM teachers WHERE user_id = auth.uid()
      UNION
      SELECT institution_id FROM parents WHERE user_id = auth.uid()
    )
  );

-- Sadece süperadmin kurum ekleyebilir
CREATE POLICY "Superadmin can insert institutions"
  ON institutions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'superadmin'
    )
  );

-- Sadece süperadmin kurum güncelleyebilir
CREATE POLICY "Superadmin can update institutions"
  ON institutions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'superadmin'
    )
  );

-- 15. Kontrol sorgusu
SELECT 
  'institutions' as table_name,
  COUNT(*) as count
FROM institutions
UNION ALL
SELECT 
  'roles' as table_name,
  COUNT(*) as count
FROM roles;
