import { createClient } from '@/lib/supabase/server'
import type { ParentMeeting } from '@/lib/types'

export async function getParentMeetingsByStudent(studentId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parent_meetings')
    .select(`
      *,
      teacher:teachers(full_name),
      student:students(first_name, last_name)
    `)
    .eq('student_id', studentId)
    .order('meeting_date', { ascending: false })

  if (error) throw error
  return data as ParentMeeting[]
}

export async function getParentMeetingById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parent_meetings')
    .select(`
      *,
      teacher:teachers(full_name),
      student:students(first_name, last_name)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as ParentMeeting
}

export async function createParentMeeting(meeting: {
  student_id: string
  teacher_id: string
  meeting_date: string
  meeting_type: 'in-person' | 'phone' | 'online'
  subject: string
  notes?: string
  participants?: string
  follow_up_required?: boolean
  follow_up_date?: string
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parent_meetings')
    .insert(meeting)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateParentMeeting(id: string, updates: Partial<ParentMeeting>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parent_meetings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteParentMeeting(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('parent_meetings')
    .delete()
    .eq('id', id)

  if (error) throw error
}
