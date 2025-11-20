-- Subjects tablosu için eksik RLS politikaları

-- Öğretmenler branş ekleyebilir
DROP POLICY IF EXISTS "Teachers can insert subjects" ON subjects;
CREATE POLICY "Teachers can insert subjects" 
  ON subjects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );

-- Öğretmenler branş güncelleyebilir
DROP POLICY IF EXISTS "Teachers can update subjects" ON subjects;
CREATE POLICY "Teachers can update subjects" 
  ON subjects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );

-- Öğretmenler branş silebilir
DROP POLICY IF EXISTS "Teachers can delete subjects" ON subjects;
CREATE POLICY "Teachers can delete subjects" 
  ON subjects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );

-- Classes tablosu için eksik RLS politikaları (zaten SELECT var)

-- Öğretmenler sınıf ekleyebilir
DROP POLICY IF EXISTS "Teachers can insert classes" ON classes;
CREATE POLICY "Teachers can insert classes" 
  ON classes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );

-- Öğretmenler sınıf güncelleyebilir
DROP POLICY IF EXISTS "Teachers can update classes" ON classes;
CREATE POLICY "Teachers can update classes" 
  ON classes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );

-- Öğretmenler sınıf silebilir
DROP POLICY IF EXISTS "Teachers can delete classes" ON classes;
CREATE POLICY "Teachers can delete classes" 
  ON classes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );
