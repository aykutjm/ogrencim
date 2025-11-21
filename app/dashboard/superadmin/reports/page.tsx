import { redirect } from 'next/navigation'
import { isSuperAdmin } from '@/lib/auth/roles'
import Link from 'next/link'

export default async function SuperadminReportsPage() {
  const isSuperAdminUser = await isSuperAdmin()
  
  if (!isSuperAdminUser) {
    redirect('/dashboard')
  }

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
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Sistem Raporları
              </h1>
              <p className="text-gray-600 mt-1">
                Sistem geneli istatistikler ve analizler
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16 text-center">
          <div className="text-8xl mb-6">📈</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Çok Yakında
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Detaylı raporlama ve analiz özellikleri şu anda geliştirme aşamasında. 
            Yakında sistem geneli istatistikleri, grafikler ve detaylı raporları 
            görüntüleyebileceksiniz.
          </p>
          <Link
            href="/dashboard/superadmin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium"
          >
            <span>←</span>
            Ana Panele Dön
          </Link>
        </div>
      </div>
    </div>
  )
}
