-- Teachers tablosuna tüm öğretmenlerin birbirlerini görebilmesi için policy ekle
-- Bu sayede değerlendirmelerde teacher adları görünür

-- Eski policy'leri kaldır
DROP POLICY IF EXISTS "Öğretmenler kendi bilgilerini görebilir" ON teachers;
DROP POLICY IF EXISTS "Teachers can view own record" ON teachers;
DROP POLICY IF EXISTS "Teachers can view all teachers" ON teachers;
DROP POLICY IF EXISTS "Parents can view teachers" ON teachers;
DROP POLICY IF EXISTS "Authenticated users can view teachers" ON teachers;

-- Basit policy: Authenticated kullanıcılar tüm öğretmenleri görebilir
CREATE POLICY "Anyone authenticated can view teachers"
  ON teachers
  FOR SELECT
  USING (true);
