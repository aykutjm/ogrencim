import { createClient } from '@/lib/supabase/server'
import type { Class } from '@/lib/types'

export async function getClasses() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('grade_level')
    .order('name')

  if (error) throw error
  return data as Class[]
}

export async function getClassById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Class
}
