import { redirect } from 'next/navigation'
import { isSuperAdmin } from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import InstitutionEditForm from './InstitutionEditForm'
import type { Institution } from '@/lib/types'

async function getInstitution(id: string): Promise<Institution | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Failed to fetch institution:', error)
    return null
  }
  
  return data
}

async function getInstitutionStats(id: string) {
  const supabase = await createClient()
  
  const [teachers, students, classes, parents] = await Promise.all([
    supabase.from('teachers').select('*', { count: 'exact', head: true }).eq('institution_id', id),
    supabase.from('students').select('*', { count: 'exact', head: true }).eq('institution_id', id),
    supabase.from('classes').select('*', { count: 'exact', head: true }).eq('institution_id', id),
    supabase.from('parents').select('*', { count: 'exact', head: true }).eq('institution_id', id),
  ])
  
  return {
    teachers: teachers.count || 0,
    students: students.count || 0,
    classes: classes.count || 0,
    parents: parents.count || 0,
  }
}

export default async function InstitutionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const isSuperAdminUser = await isSuperAdmin()
  
  if (!isSuperAdminUser) {
    redirect('/dashboard')
  }
  
  const institution = await getInstitution(params.id)
  
  if (!institution) {
    redirect('/dashboard/superadmin/institutions')
  }
  
  const stats = await getInstitutionStats(params.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/superadmin/institutions"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <span>←</span>
            <span>Kurumlara Geri Dön</span>
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏫</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {institution.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  Kurum bilgilerini görüntüleyin ve düzenleyin
                </p>
              </div>
            </div>
            
            <span
              className={`px-6 py-3 rounded-xl text-sm font-semibold ${
                institution.is_active
                  ? 'bg-green-100 text-green-700 border-2 border-green-200'
                  : 'bg-red-100 text-red-700 border-2 border-red-200'
              }`}
            >
              {institution.is_active ? '✓ Aktif' : '✗ Pasif'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900">İstatistikler</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👨‍🏫</span>
                    <span className="text-sm font-medium text-gray-700">Öğretmenler</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{stats.teachers}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👨‍🎓</span>
                    <span className="text-sm font-medium text-gray-700">Öğrenciler</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats.students}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    <span className="text-sm font-medium text-gray-700">Sınıflar</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{stats.classes}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👨‍👩‍👧</span>
                    <span className="text-sm font-medium text-gray-700">Veliler</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">{stats.parents}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Hızlı İşlemler</h3>
              
              <div className="space-y-2">
                <Link
                  href={`/dashboard/superadmin/institutions/${institution.id}/users`}
                  className="block w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition text-sm font-medium"
                >
                  👥 Kullanıcıları Görüntüle
                </Link>
                
                <Link
                  href={`/dashboard/superadmin/institutions/${institution.id}/stats`}
                  className="block w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition text-sm font-medium"
                >
                  📊 Detaylı İstatistikler
                </Link>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <InstitutionEditForm institution={institution} />
          </div>
        </div>
      </div>
    </div>
  )
}
