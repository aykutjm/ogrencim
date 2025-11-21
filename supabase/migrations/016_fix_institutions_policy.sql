-- Migration 016: Fix institutions SELECT policy to apply to authenticated users

-- Drop existing policy if any
DROP POLICY IF EXISTS "Users can view their institution" ON institutions;

-- Recreate so only authenticated users (not public) can SELECT their own institution
CREATE POLICY "Users can view their institution"
  ON institutions FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT institution_id FROM teachers WHERE user_id = auth.uid()
      UNION
      SELECT institution_id FROM parents WHERE user_id = auth.uid()
    )
  );

-- Optional: list policies for verification
SELECT 
  schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'institutions'
ORDER BY policyname;
