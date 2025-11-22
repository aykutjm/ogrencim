import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Get from environment variables only
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createBrowserClient(supabaseUrl, supabaseKey)

  return createBrowserClient(supabaseUrl, supabaseKey)
}
