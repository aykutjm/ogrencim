export interface Institution {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  logo_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type UserRole = 'superadmin' | 'admin' | 'teacher' | 'parent'

export interface Role {
  id: string
  name: UserRole
  description?: string
  created_at: string
}

export interface Teacher {
  id: string
  user_id: string
  full_name: string
  email: string
  subject_id?: string
  institution_id?: string
  created_at: string
  updated_at: string
  // Relations
  institution?: Institution
}

export interface Parent {
  id: string
  user_id?: string
  full_name: string
  email: string
  phone?: string
  mother_name?: string
  mother_phone?: string
  father_name?: string
  father_phone?: string
  institution_id?: string
  created_at: string
  updated_at: string
  // Relations
  institution?: Institution
}

export interface Class {
  id: string
  name: string
  grade_level?: number
  academic_year?: string
  institution_id?: string
  created_at: string
  updated_at: string
  // Relations
  institution?: Institution
}

export interface Subject {
  id: string
  name: string
  description?: string
  institution_id?: string
  created_at: string
  updated_at: string
  // Relations
  institution?: Institution
}

export interface Student {
  id: string
  first_name: string
  last_name: string
  student_number?: string
  class_id?: string
  parent_id?: string
  date_of_birth?: string
  institution_id?: string
  created_at: string
  updated_at: string
  // Relations
  class?: Class
  parent?: Parent
  institution?: Institution
}

export interface SkillRating {
  id: string
  student_id: string
  teacher_id: string
  subject_id: string
  rating: number // 1-5
  comment?: string
  visibility: boolean
  created_at: string
  updated_at: string
  // Relations
  student?: Student
  teacher?: Teacher
  subject?: Subject
}

export interface AuditLog {
  id: string
  user_id?: string
  action: string
  table_name: string
  record_id?: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  created_at: string
}

export interface ParentMeeting {
  id: string
  student_id: string
  teacher_id: string
  meeting_date: string
  meeting_type: 'in-person' | 'phone' | 'online'
  subject: string
  notes?: string
  participants?: string
  follow_up_required: boolean
  follow_up_date?: string
  created_at: string
  updated_at: string
  // Relations
  student?: Student
  teacher?: Teacher
}
