import { createClient } from '@supabase/supabase-js'

// SECURITY: Never hardcode service_role key!
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!url || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
})

export default supabaseAdmin
