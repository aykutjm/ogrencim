import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // NEXT_PUBLIC_ prefix makes these available in browser
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createBrowserClient(supabaseUrl, supabaseKey)
}
