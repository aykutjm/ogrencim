import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseAdminInstance: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
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
}

// Backward compatibility
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    const admin = getSupabaseAdmin()
    return (admin as any)[prop]
  }
})

export default supabaseAdmin
