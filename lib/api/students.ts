import { createClient } from '@/lib/supabase/server'
import type { Student, Class, Parent } from '@/lib/types'

export async function getStudents() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      class:classes(*),
      parent:parents(*)
    `)
    .order('first_name')

  if (error) throw error
  return data as Student[]
}

export async function getStudentById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      class:classes(*),
      parent:parents(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Student
}

export async function getStudentsByClass(classId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      class:classes(*),
      parent:parents(*)
    `)
    .eq('class_id', classId)
    .order('first_name')

  if (error) throw error
  return data as Student[]
}

export async function createStudent(student: {
  first_name: string
  last_name: string
  student_number?: string
  class_id?: string
  parent_id?: string
  date_of_birth?: string
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('students')
    .insert(student)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateStudent(id: string, updates: Partial<Student>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteStudent(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)

  if (error) throw error
}
