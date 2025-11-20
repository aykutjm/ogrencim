-- Remove unique constraint on skill_ratings to allow multiple ratings for same student-teacher-subject combination
-- This allows teachers to add multiple evaluations over time for the same student and subject

ALTER TABLE skill_ratings 
DROP CONSTRAINT IF EXISTS skill_ratings_student_id_teacher_id_subject_id_key;

-- Add a comment explaining the change
COMMENT ON TABLE skill_ratings IS 'Stores skill ratings/evaluations. Multiple ratings allowed for same student-teacher-subject to track progress over time.';
