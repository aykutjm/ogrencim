import { createClient } from '@/lib/supabase/server'
import type { SkillRating } from '@/lib/types'

export async function getSkillRatingsByStudent(studentId: string) {
  const supabase = await createClient()
  
  // İlk önce skill ratings'leri al
  const { data, error } = await supabase
    .from('skill_ratings')
    .select('*')
    .eq('student_id', studentId)
    .eq('visibility', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  if (!data || data.length === 0) return []
  
  // Unique teacher_id'leri topla
  const teacherIds = Array.from(new Set(data.map((r: any) => r.teacher_id).filter(Boolean)))
  
  console.log('DEBUG - teacherIds:', teacherIds)
  
  // Teachers bilgilerini çek
  const { data: teachers, error: teacherError } = await supabase
    .from('teachers')
    .select('id, full_name, email')
    .in('id', teacherIds)
  
  console.log('DEBUG - teachers from DB:', teachers)
  console.log('DEBUG - teacher error:', teacherError)
  
  // Unique subject_id'leri topla
  const subjectIds = Array.from(new Set(data.map((r: any) => r.subject_id).filter(Boolean)))
  
  // Subjects bilgilerini çek
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name')
    .in('id', subjectIds)
  
  // Teacher ve subject map'leri oluştur
  const teacherMap = new Map(teachers?.map(t => [t.id, t]) || [])
  const subjectMap = new Map(subjects?.map(s => [s.id, s]) || [])
  
  // Ratings'lere teacher ve subject bilgilerini ekle
  const enrichedData = data.map((rating: any) => ({
    ...rating,
    teacher: rating.teacher_id ? teacherMap.get(rating.teacher_id) || null : null,
    subject: rating.subject_id ? subjectMap.get(rating.subject_id) || null : null
  }))

  console.log('getSkillRatingsByStudent:', {
    studentId,
    count: enrichedData?.length,
    firstRating: enrichedData?.[0] ? {
      id: enrichedData[0].id,
      comment: enrichedData[0].comment?.substring(0, 30),
      teacher: enrichedData[0].teacher,
      teacher_id: enrichedData[0].teacher_id,
      has_teacher: !!enrichedData[0].teacher
    } : null
  })

  if (error) throw error
  return enrichedData as unknown as SkillRating[]
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
