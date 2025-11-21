import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { Institution } from '@/lib/types'
import { getCurrentUserRole } from '@/lib/auth/roles'

// Service role client for superadmin bypass
function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export async function getInstitutions() {
  const userRole = await getCurrentUserRole()
  
  // Superadmin uses service role to bypass RLS
  if (userRole === 'superadmin') {
    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data as Institution[]
  }
  
  // Regular users use normal client
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data as Institution[]
}

export async function getInstitutionById(id: string) {
  const userRole = await getCurrentUserRole()
  const supabase = userRole === 'superadmin' ? getServiceClient() : await createClient()
  
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data as Institution
}

export async function createInstitution(institution: Partial<Institution>) {
  const userRole = await getCurrentUserRole()
  const supabase = userRole === 'superadmin' ? getServiceClient() : await createClient()
  
  const { data, error } = await supabase
    .from('institutions')
    .insert(institution)
    .select()
    .single()
  
  if (error) throw error
  return data as Institution
}

export async function updateInstitution(id: string, updates: Partial<Institution>) {
  const userRole = await getCurrentUserRole()
  const supabase = userRole === 'superadmin' ? getServiceClient() : await createClient()
  
  const { data, error } = await supabase
    .from('institutions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Institution
}

export async function deleteInstitution(id: string) {
  const userRole = await getCurrentUserRole()
  const supabase = userRole === 'superadmin' ? getServiceClient() : await createClient()
  
  const { error } = await supabase
    .from('institutions')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Kurum istatistikleri
export async function getInstitutionStats(institutionId: string) {
  const supabase = await createClient()
  
  // Öğretmen sayısı
  const { count: teacherCount } = await supabase
    .from('teachers')
    .select('*', { count: 'exact', head: true })
    .eq('institution_id', institutionId)
  
  // Öğrenci sayısı
  const { count: studentCount } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('institution_id', institutionId)
  
  // Sınıf sayısı
  const { count: classCount } = await supabase
    .from('classes')
    .select('*', { count: 'exact', head: true })
    .eq('institution_id', institutionId)
  
  // Veli sayısı
  const { count: parentCount } = await supabase
    .from('parents')
    .select('*', { count: 'exact', head: true })
    .eq('institution_id', institutionId)
  
  return {
    teachers: teacherCount || 0,
    students: studentCount || 0,
    classes: classCount || 0,
    parents: parentCount || 0,
  }
}
