import { createClient } from '@/lib/supabase/server'
import type { SkillRating } from '@/lib/types'

export async function getSkillRatingsByStudent(studentId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skill_ratings')
    .select(`
      *,
      teacher:teachers(full_name),
      subject:subjects(name)
    `)
    .eq('student_id', studentId)
    .eq('visibility', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as SkillRating[]
}

export async function createSkillRating(rating: {
  student_id: string
  teacher_id: string
  subject_id: string
  rating: number
  comment?: string
  visibility?: boolean
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skill_ratings')
    .insert({ visibility: true, ...rating })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSkillRating(id: string, updates: {
  rating?: number
  comment?: string
  visibility?: boolean
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skill_ratings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSkillRating(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('skill_ratings')
    .delete()
    .eq('id', id)

  if (error) throw error
}
