-- Aykut Yıldırım'a superadmin rolü ver
-- E-posta: y.aykut7455@gmail.com

-- 1. Kullanıcıyı bul ve superadmin rolü ata
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"superadmin"'
)
WHERE email = 'y.aykut7455@gmail.com';

-- 2. Kontrol: Kullanıcının rolünü göster
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'full_name' as full_name,
  created_at
FROM auth.users
WHERE email = 'y.aykut7455@gmail.com';
