import { redirect } from 'next/navigation'
import { isSuperAdmin } from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import UserRoleManager from './UserRoleManager'

async function getAllUsersData() {
  const supabase = await createClient()
  
  // Get all teachers with user info
  const { data: teachers } = await supabase
    .from('teachers')
    .select(`
      user_id,
      institution_id,
      institutions(name)
    `)
  
  // Get all auth users (we'll use service queries later)
  // For now, get users from teachers table
  const teacherMap = new Map()
  teachers?.forEach(t => {
    teacherMap.set(t.user_id, {
      institution_id: t.institution_id,
      institution_name: (t.institutions as any)?.name,
    })
  })
  
  return teacherMap
}

async function getInstitutions() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('institutions')
    .select('id, name')
    .order('name')
  
  return data || []
}

export default async function SuperadminUsersPage() {
  const isSuperAdminUser = await isSuperAdmin()
  
  if (!isSuperAdminUser) {
    redirect('/dashboard')
  }

  const [teacherData, institutions] = await Promise.all([
    getAllUsersData(),
    getInstitutions(),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/superadmin"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <span>←</span>
            <span>Geri Dön</span>
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Kullanıcı Yönetimi
                </h1>
                <p className="text-gray-600 mt-1">
                  Tüm kullanıcıları görüntüleyin ve yönetin
                </p>
              </div>
            </div>
          </div>
        </div>

        <UserRoleManager 
          institutions={institutions}
          teacherData={teacherData}
        />
      </div>
    </div>
  )
}
