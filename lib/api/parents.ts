import { createClient } from '@/lib/supabase/server'
import type { Parent } from '@/lib/types'

export async function getParents() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parents')
    .select('*')
    .order('full_name')

  if (error) throw error
  return data as Parent[]
}

export async function getParentByUserId(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parents')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data as Parent
}
