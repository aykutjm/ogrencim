-- Row Level Security (RLS) Politikaları

-- Teachers tablosu RLS
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Öğretmenler kendi bilgilerini görebilir"
  ON teachers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Öğretmenler kendi bilgilerini güncelleyebilir"
  ON teachers FOR UPDATE
  USING (auth.uid() = user_id);

-- Parents tablosu RLS
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Veliler kendi bilgilerini görebilir"
  ON parents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Veliler kendi bilgilerini güncelleyebilir"
  ON parents FOR UPDATE
  USING (auth.uid() = user_id);

-- Classes tablosu RLS
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes sınıfları görebilir"
  ON classes FOR SELECT
  TO authenticated
  USING (true);

-- Subjects tablosu RLS
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes branşları görebilir"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

-- Students tablosu RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Öğretmenler tüm öğrencileri görebilir"
  ON students FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );

CREATE POLICY "Veliler sadece kendi çocuklarını görebilir"
  ON students FOR SELECT
  TO authenticated
  USING (
    parent_id IN (
      SELECT id FROM parents WHERE parents.user_id = auth.uid()
    )
  );

-- Skill ratings tablosu RLS
ALTER TABLE skill_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Öğretmenler tüm değerlendirmeleri görebilir"
  ON skill_ratings FOR SELECT
  TO authenticated
  USING (
    visibility = true AND
    EXISTS (
      SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );

CREATE POLICY "Veliler sadece kendi çocuklarının değerlendirmelerini görebilir"
  ON skill_ratings FOR SELECT
  TO authenticated
  USING (
    visibility = true AND
    student_id IN (
      SELECT id FROM students 
      WHERE parent_id IN (
        SELECT id FROM parents WHERE parents.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Öğretmenler değerlendirme ekleyebilir"
  ON skill_ratings FOR INSERT
  TO authenticated
  WITH CHECK (
    teacher_id IN (
      SELECT id FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );

CREATE POLICY "Öğretmenler kendi değerlendirmelerini güncelleyebilir"
  ON skill_ratings FOR UPDATE
  TO authenticated
  USING (
    teacher_id IN (
      SELECT id FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );

CREATE POLICY "Öğretmenler kendi değerlendirmelerini silebilir"
  ON skill_ratings FOR DELETE
  TO authenticated
  USING (
    teacher_id IN (
      SELECT id FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );

-- Audit logs tablosu RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sadece adminler audit logları görebilir"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'admin'
  );
