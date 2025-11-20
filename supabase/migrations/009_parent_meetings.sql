-- Veli görüşme raporları tablosu
CREATE TABLE IF NOT EXISTS parent_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  meeting_date DATE NOT NULL,
  meeting_type VARCHAR(50) DEFAULT 'in-person', -- 'in-person', 'phone', 'online'
  subject VARCHAR(255) NOT NULL,
  notes TEXT,
  participants TEXT, -- Anne, baba veya her ikisi
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler (IF NOT EXISTS ile güvenli oluşturma)
CREATE INDEX IF NOT EXISTS idx_parent_meetings_student ON parent_meetings(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_meetings_teacher ON parent_meetings(teacher_id);
CREATE INDEX IF NOT EXISTS idx_parent_meetings_date ON parent_meetings(meeting_date);

-- RLS Politikaları
ALTER TABLE parent_meetings ENABLE ROW LEVEL SECURITY;

-- Öğretmenler tüm görüşmeleri görebilir
CREATE POLICY "Öğretmenler tüm görüşmeleri görebilir"
  ON parent_meetings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );

-- Veliler sadece kendi çocuklarının görüşmelerini görebilir
CREATE POLICY "Veliler kendi çocuklarının görüşmelerini görebilir"
  ON parent_meetings FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students 
      WHERE parent_id IN (
        SELECT id FROM parents WHERE parents.user_id = auth.uid()
      )
    )
  );

-- Öğretmenler görüşme ekleyebilir
CREATE POLICY "Öğretmenler görüşme ekleyebilir"
  ON parent_meetings FOR INSERT
  TO authenticated
  WITH CHECK (
    teacher_id IN (
      SELECT id FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );

-- Öğretmenler görüşmeleri güncelleyebilir
CREATE POLICY "Öğretmenler görüşmeleri güncelleyebilir"
  ON parent_meetings FOR UPDATE
  TO authenticated
  USING (
    teacher_id IN (
      SELECT id FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );

-- Öğretmenler görüşmeleri silebilir
CREATE POLICY "Öğretmenler görüşmeleri silebilir"
  ON parent_meetings FOR DELETE
  TO authenticated
  USING (
    teacher_id IN (
      SELECT id FROM teachers WHERE teachers.user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_parent_meetings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER parent_meetings_updated_at
  BEFORE UPDATE ON parent_meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_parent_meetings_updated_at();

-- Yorum
COMMENT ON TABLE parent_meetings IS 'Öğretmen-veli görüşme raporları ve notları';
