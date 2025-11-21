import { createClient } from '@supabase/supabase-js'

// Production fallback
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sup-ogrencim.edu-ai.online'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2MzQ4OTQwMCwiZXhwIjo0OTE5MTYzMDAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.fQc7SiHi9BPY01yl4bVNMv_nDAU7KmQZc8HVhKnlyd4'

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
})

export default supabaseAdmin
