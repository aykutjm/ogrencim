import { createClient } from '@/lib/supabase/server'
import { UserRole } from '@/lib/types'

/**
 * Kullanıcının rolünü auth.users.raw_user_meta_data.role'den getirir
 * Eğer metadata'da rol yoksa, teachers/parents tablosundan kontrol eder
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  // Önce metadata'dan role kontrol et
  let role = user.user_metadata?.role as UserRole
  
  // Eğer rol yoksa, teachers/parents tablosundan kontrol et
  if (!role) {
    // Teachers tablosunda var mı?
    const { data: teacher } = await supabase
      .from('teachers')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (teacher) {
      role = 'teacher'
    } else {
      // Parents tablosunda var mı?
      const { data: parent } = await supabase
        .from('parents')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (parent) {
        role = 'parent'
      }
    }
  }
  
  return role || null
}

/**
 * Kullanıcının kurumunu getirir (teachers veya parents tablosundan)
 */
export async function getCurrentUserInstitution(): Promise<string | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  // Önce teacher olarak kontrol et
  const { data: teacher } = await supabase
    .from('teachers')
    .select('institution_id')
    .eq('user_id', user.id)
    .single()
  
  if (teacher?.institution_id) {
    return teacher.institution_id
  }
  
  // Sonra parent olarak kontrol et
  const { data: parent } = await supabase
    .from('parents')
    .select('institution_id')
    .eq('user_id', user.id)
    .single()
  
  return parent?.institution_id || null
}

/**
 * Kullanıcının belirli bir role sahip olup olmadığını kontrol eder
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const currentRole = await getCurrentUserRole()
  return currentRole === role
}

/**
 * Kullanıcının belirli rollerden herhangi birine sahip olup olmadığını kontrol eder
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const currentRole = await getCurrentUserRole()
  return currentRole ? roles.includes(currentRole) : false
}

/**
 * Superadmin kontrolü
 */
export async function isSuperAdmin(): Promise<boolean> {
  return hasRole('superadmin')
}

/**
 * Admin veya superadmin kontrolü
 */
export async function isAdminOrAbove(): Promise<boolean> {
  return hasAnyRole(['superadmin', 'admin'])
}

/**
 * Teacher, admin veya superadmin kontrolü
 */
export async function isTeacherOrAbove(): Promise<boolean> {
  return hasAnyRole(['superadmin', 'admin', 'teacher'])
}

/**
 * Kullanıcı bilgilerini role ile birlikte getirir
 */
export async function getCurrentUserWithRole() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const role = await getCurrentUserRole()
  const institutionId = await getCurrentUserInstitution()
  
  return {
    ...user,
    role,
    institutionId,
  }
}

/**
 * Kullanıcıya rol atar (sadece superadmin yapabilir)
 */
export async function assignUserRole(userId: string, role: UserRole) {
  const supabase = await createClient()
  
  // Superadmin kontrolü
  const isSuperAdminUser = await isSuperAdmin()
  if (!isSuperAdminUser) {
    throw new Error('Sadece superadmin kullanıcı rolü atayabilir')
  }
  
  // auth.users tablosundaki user_metadata'yı güncelle
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role }
  })
  
  if (error) throw error
}
