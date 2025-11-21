import { redirect } from 'next/navigation'
import { isSuperAdmin } from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Institution } from '@/lib/types'

async function getInstitutionsForSuperadmin(): Promise<Institution[]> {
  try {
    const supabase = await createClient()
    
    // RLS devre dışı olduğu için direkt okuyabiliriz
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Failed to fetch institutions:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Failed to fetch institutions:', error)
    return []
  }
}

export default async function SuperAdminDashboard() {
  const isSuperAdminUser = await isSuperAdmin()
  
  if (!isSuperAdminUser) {
    redirect('/dashboard')
  }
  
  const institutions = await getInstitutionsForSuperadmin()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👑</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Süper Admin Paneli
              </h1>
              <p className="text-gray-600 mt-1">
                Tüm kurumları ve sistem ayarlarını yönetin
              </p>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link
            href="/dashboard/superadmin/institutions"
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-bl-full"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🏫</span>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
                  {institutions.length}
                </span>
              </div>
              <h3 className="font-bold text-xl mb-1 text-gray-900">Kurumlar</h3>
              <p className="text-sm text-gray-600">Tüm eğitim kurumları</p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                Yönet <span className="ml-1">→</span>
              </div>
            </div>
          </Link>
          
          <Link
            href="/dashboard/superadmin/users"
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-bl-full"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-1 text-gray-900">Kullanıcılar</h3>
              <p className="text-sm text-gray-600">Kullanıcı yönetimi</p>
              <div className="mt-4 flex items-center text-green-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                Yönet <span className="ml-1">→</span>
              </div>
            </div>
          </Link>
          
          <Link
            href="/dashboard/superadmin/reports"
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-bl-full"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-1 text-gray-900">Raporlar</h3>
              <p className="text-sm text-gray-600">İstatistikler ve analizler</p>
              <div className="mt-4 flex items-center text-purple-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                Görüntüle <span className="ml-1">→</span>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Institutions List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Kurumlar</h2>
                <p className="text-sm text-gray-600 mt-1">{institutions.length} kayıtlı kurum</p>
              </div>
              <Link
                href="/dashboard/superadmin/institutions/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-medium"
              >
                <span>➕</span>
                Yeni Kurum Ekle
              </Link>
            </div>
          </div>
          
          {/* Institution Cards */}
          <div className="p-8">
            {institutions.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏫</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Henüz kurum eklenmemiş
                </h3>
                <p className="text-gray-500 mb-6">
                  İlk kurumunuzu ekleyerek başlayın
                </p>
                <Link
                  href="/dashboard/superadmin/institutions/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  <span>➕</span>
                  İlk Kurumu Ekle
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {institutions.map((institution) => (
                  <Link
                    key={institution.id}
                    href={`/dashboard/superadmin/institutions/${institution.id}`}
                    className="group block p-6 border-2 border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">🏫</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition">
                            {institution.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {institution.email && (
                              <span className="flex items-center gap-1">
                                <span>📧</span>
                                {institution.email}
                              </span>
                            )}
                            {institution.phone && (
                              <span className="flex items-center gap-1">
                                <span>📞</span>
                                {institution.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            institution.is_active
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}
                        >
                          {institution.is_active ? '✓ Aktif' : '✗ Pasif'}
                        </span>
                        <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                          <span className="text-xl">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
