import { redirect } from 'next/navigation'
import { isSuperAdmin } from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Institution } from '@/lib/types'

async function getInstitutionsWithStats() {
  try {
    const supabase = await createClient()
    
    // RLS devre dışı - direkt okuyabiliriz
    const { data: institutions, error } = await supabase
      .from('institutions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error || !institutions) {
      console.error('Failed to fetch institutions:', error)
      return []
    }
    
    // Her kurum için istatistikleri paralel al
    const institutionsWithStats = await Promise.all(
      institutions.map(async (institution) => {
        const [teachers, students, classes, parents] = await Promise.all([
          supabase.from('teachers').select('*', { count: 'exact', head: true }).eq('institution_id', institution.id),
          supabase.from('students').select('*', { count: 'exact', head: true }).eq('institution_id', institution.id),
          supabase.from('classes').select('*', { count: 'exact', head: true }).eq('institution_id', institution.id),
          supabase.from('parents').select('*', { count: 'exact', head: true }).eq('institution_id', institution.id),
        ])
        
        return {
          ...institution,
          stats: {
            teachers: teachers.count || 0,
            students: students.count || 0,
            classes: classes.count || 0,
            parents: parents.count || 0,
          }
        }
      })
    )
    
    return institutionsWithStats
  } catch (error) {
    console.error('Failed to fetch institutions with stats:', error)
    return []
  }
}

export default async function InstitutionsPage() {
  const isSuperAdminUser = await isSuperAdmin()
  
  if (!isSuperAdminUser) {
    redirect('/dashboard')
  }
  
  const institutionsWithStats = await getInstitutionsWithStats()
  
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">🏫 Kurumlar</h1>
          <p className="text-gray-600 mt-2">
            Sistemdeki tüm eğitim kurumlarını yönetin
          </p>
        </div>
        
        <Link
          href="/dashboard/superadmin/institutions/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Yeni Kurum Ekle
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {institutionsWithStats.map((institution) => (
          <div
            key={institution.id}
            className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-100 hover:border-blue-300 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{institution.name}</h3>
                <p className="text-sm text-gray-600">{institution.email}</p>
                {institution.phone && (
                  <p className="text-sm text-gray-600">📞 {institution.phone}</p>
                )}
                {institution.address && (
                  <p className="text-sm text-gray-600 mt-1">📍 {institution.address}</p>
                )}
              </div>
              
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  institution.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {institution.is_active ? '✓ Aktif' : '✗ Pasif'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {institution.stats.teachers}
                </div>
                <div className="text-xs text-gray-600">👨‍🏫 Öğretmen</div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {institution.stats.students}
                </div>
                <div className="text-xs text-gray-600">🎓 Öğrenci</div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {institution.stats.classes}
                </div>
                <div className="text-xs text-gray-600">🏛️ Sınıf</div>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {institution.stats.parents}
                </div>
                <div className="text-xs text-gray-600">👪 Veli</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link
                href={`/dashboard/superadmin/institutions/${institution.id}`}
                className="flex-1 text-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-semibold"
              >
                📝 Düzenle
              </Link>
              
              <Link
                href={`/dashboard/superadmin/institutions/${institution.id}/users`}
                className="flex-1 text-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-semibold"
              >
                👥 Kullanıcılar
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {institutionsWithStats.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🏫</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Henüz kurum eklenmemiş
          </h3>
          <p className="text-gray-600 mb-6">
            İlk kurumu ekleyerek başlayın
          </p>
          <Link
            href="/dashboard/superadmin/institutions/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Yeni Kurum Ekle
          </Link>
        </div>
      )}
    </div>
  )
}
