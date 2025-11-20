import { createClient } from '@/lib/supabase/server'
import type { Subject } from '@/lib/types'

export async function getSubjects() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('name')

  if (error) throw error
  return data as Subject[]
}
