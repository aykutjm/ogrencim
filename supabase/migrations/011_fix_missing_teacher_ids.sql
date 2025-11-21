-- Fix missing teacher_id in skill_ratings
-- Bu migration, teacher bilgisi olmayan skill_ratings kayıtlarını düzeltir

-- Önce teacher_id NULL olan kayıtları kontrol et
DO $$
DECLARE
  missing_count INTEGER;
  gulsah_teacher_id UUID;
BEGIN
  -- Teacher_id NULL olan kayıt sayısını bul
  SELECT COUNT(*) INTO missing_count
  FROM skill_ratings
  WHERE teacher_id IS NULL;
  
  RAISE NOTICE 'Teacher_id NULL olan kayıt sayısı: %', missing_count;
  
  -- Gülşah Koku'nun teacher ID'sini bul
  SELECT id INTO gulsah_teacher_id
  FROM teachers
  WHERE email = 'gulsah@mafen.com'
  LIMIT 1;
  
  IF gulsah_teacher_id IS NOT NULL THEN
    RAISE NOTICE 'Gülşah Koku teacher ID: %', gulsah_teacher_id;
    
    -- Teacher_id NULL olan tüm kayıtları Gülşah'a ata
    UPDATE skill_ratings
    SET teacher_id = gulsah_teacher_id
    WHERE teacher_id IS NULL;
    
    RAISE NOTICE 'Güncellenen kayıt sayısı: %', missing_count;
  ELSE
    RAISE NOTICE 'Gülşah Koku teacher kaydı bulunamadı!';
  END IF;
END $$;

-- Sonuç kontrolü
SELECT 
  COUNT(*) as total_ratings,
  COUNT(teacher_id) as with_teacher,
  COUNT(*) - COUNT(teacher_id) as without_teacher
FROM skill_ratings;
