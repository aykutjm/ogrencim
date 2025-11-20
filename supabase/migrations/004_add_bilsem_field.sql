-- Add is_bilsem field to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS is_bilsem BOOLEAN DEFAULT false;

-- Add comment
COMMENT ON COLUMN students.is_bilsem IS 'Indicates if student is in BILSEM (Science and Art Center) program';
