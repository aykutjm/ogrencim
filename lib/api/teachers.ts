import { createClient } from '@/lib/supabase/server'
import type { Teacher } from '@/lib/types'

export async function getTeachers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('full_name')

  if (error) throw error
  return data as Teacher[]
}

export async function getTeacherByUserId(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data as Teacher
}
