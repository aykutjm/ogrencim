-- Add is_bilsem_rating field to skill_ratings table
ALTER TABLE skill_ratings ADD COLUMN IF NOT EXISTS is_bilsem_rating BOOLEAN DEFAULT false;

-- Add bilsem_subject field for BİLSEM specific subject/branch
ALTER TABLE skill_ratings ADD COLUMN IF NOT EXISTS bilsem_subject VARCHAR(255);

-- Add comments
COMMENT ON COLUMN skill_ratings.is_bilsem_rating IS 'Indicates if this rating is specifically for BILSEM performance';
COMMENT ON COLUMN skill_ratings.bilsem_subject IS 'Specific BILSEM subject/branch if applicable';
