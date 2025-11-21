-- Migration 013 Fix - Eksik kısımları tamamla
-- Trigger hatası aldıysanız, bu migration eksik parçaları tamamlar

-- 1. Kontrol: institutions tablosu var mı?
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'institutions') THEN
    CREATE TABLE institutions (
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
  END IF;
END $$;

-- 2. Kontrol: roles tablosu var mı?
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'roles') THEN
    CREATE TABLE roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- 3. Rolleri ekle
INSERT INTO roles (name, description) VALUES
  ('superadmin', 'Tüm kurumları yönetir, sistem geneli yetkiler'),
  ('admin', 'Kendi kurumunu yönetir, idareci yetkiler'),
  ('teacher', 'Öğretmen, sınırlı erişim - sadece kendi öğrencileri'),
  ('parent', 'Veli, sadece kendi çocuklarını görür')
ON CONFLICT (name) DO NOTHING;

-- 4. Institution_id kolonlarını ekle (IF NOT EXISTS ile)
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL;
ALTER TABLE students ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL;
ALTER TABLE parents ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL;

-- 5. Varsayılan kurum oluştur
INSERT INTO institutions (name, email, is_active)
VALUES ('MAFEN Eğitim', 'info@mafen.com', true)
ON CONFLICT DO NOTHING;

-- 6. Mevcut kayıtları varsayılan kuruma bağla
DO $$
DECLARE
  default_institution_id UUID;
BEGIN
  SELECT id INTO default_institution_id FROM institutions LIMIT 1;
  
  IF default_institution_id IS NOT NULL THEN
    UPDATE teachers SET institution_id = default_institution_id WHERE institution_id IS NULL;
    UPDATE students SET institution_id = default_institution_id WHERE institution_id IS NULL;
    UPDATE parents SET institution_id = default_institution_id WHERE institution_id IS NULL;
    UPDATE classes SET institution_id = default_institution_id WHERE institution_id IS NULL;
    UPDATE subjects SET institution_id = default_institution_id WHERE institution_id IS NULL;
  END IF;
END $$;

-- 7. İndeksler
CREATE INDEX IF NOT EXISTS idx_teachers_institution ON teachers(institution_id);
CREATE INDEX IF NOT EXISTS idx_students_institution ON students(institution_id);
CREATE INDEX IF NOT EXISTS idx_parents_institution ON parents(institution_id);
CREATE INDEX IF NOT EXISTS idx_classes_institution ON classes(institution_id);
CREATE INDEX IF NOT EXISTS idx_subjects_institution ON subjects(institution_id);

-- 8. RLS aktif et
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

-- 9. RLS Politikaları (DROP IF EXISTS ile önce sil, sonra oluştur)
DROP POLICY IF EXISTS "Superadmin can view all institutions" ON institutions;
DROP POLICY IF EXISTS "Users can view own institution" ON institutions;
DROP POLICY IF EXISTS "Superadmin can insert institutions" ON institutions;
DROP POLICY IF EXISTS "Superadmin can update institutions" ON institutions;

CREATE POLICY "Superadmin can view all institutions"
  ON institutions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'superadmin'
    )
  );

CREATE POLICY "Users can view own institution"
  ON institutions FOR SELECT
  USING (
    id IN (
      SELECT institution_id FROM teachers WHERE user_id = auth.uid()
      UNION
      SELECT institution_id FROM parents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Superadmin can insert institutions"
  ON institutions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'superadmin'
    )
  );

CREATE POLICY "Superadmin can update institutions"
  ON institutions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'superadmin'
    )
  );

-- 10. Kontrol sorgusu
SELECT 
  'institutions' as table_name,
  COUNT(*) as count
FROM institutions
UNION ALL
SELECT 
  'roles' as table_name,
  COUNT(*) as count
FROM roles;
