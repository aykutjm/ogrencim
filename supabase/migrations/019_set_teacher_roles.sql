-- Migration: Set role for existing users based on teachers table
-- This will set user_metadata.role = 'teacher' for all users in teachers table

-- Note: This requires direct database access
-- You need to run this in Supabase SQL Editor

-- Update all users who are in teachers table
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"role": "teacher"}'::jsonb
    ELSE raw_user_meta_data || '{"role": "teacher"}'::jsonb
  END
WHERE id IN (SELECT user_id FROM public.teachers)
AND (raw_user_meta_data->>'role' IS NULL OR raw_user_meta_data->>'role' != 'superadmin');

-- Note: We exclude superadmin to not override existing superadmin role
