import { createClient } from '@supabase/supabase-js'

let supabaseAdminInstance: ReturnType<typeof createClient> | null = null

export const supabaseAdmin = (() => {
  if (!supabaseAdminInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceRoleKey) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
    }

    supabaseAdminInstance = createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    })
  }
  
  return supabaseAdminInstance
})()

export default supabaseAdmin
