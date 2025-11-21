import { redirect } from 'next/navigation'
import { isAdminOrAbove, getCurrentUserInstitution } from '@/lib/auth/roles'
import { getInstitutionById, getInstitutionStats } from '@/lib/api/institutions'
import Link from 'next/link'

export default async function AdminDashboard() {
  const isAdmin = await isAdminOrAbove()
  
  if (!isAdmin) {
    redirect('/dashboard')
  }
  
  const institutionId = await getCurrentUserInstitution()
  
  if (!institutionId) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">
            Kurum Bulunamadı
          </h2>
          <p className="text-red-600">
            Hesabınız bir kuruma bağlı değil. Lütfen süper admin ile iletişime geçin.
          </p>
        </div>
      </div>
    )
  }
  
  const institution = await getInstitutionById(institutionId)
  const stats = await getInstitutionStats(institutionId)
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">🏫 İdareci Paneli</h1>
        <p className="text-gray-600 mt-2">
          {institution.name} - Kurum Yönetimi
        </p>
      </div>
      
      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-2">👨‍🏫</div>
          <div className="text-3xl font-bold mb-1">{stats.teachers}</div>
          <div className="text-blue-100 text-sm">Öğretmen</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-2">🎓</div>
          <div className="text-3xl font-bold mb-1">{stats.students}</div>
          <div className="text-green-100 text-sm">Öğrenci</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-2">🏛️</div>
          <div className="text-3xl font-bold mb-1">{stats.classes}</div>
          <div className="text-purple-100 text-sm">Sınıf</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-2">👪</div>
          <div className="text-3xl font-bold mb-1">{stats.parents}</div>
          <div className="text-orange-100 text-sm">Veli</div>
        </div>
      </div>
      
      {/* Yönetim Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/dashboard/admin/teachers"
          className="p-6 bg-white rounded-lg shadow-md border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition"
        >
          <div className="text-4xl mb-3">👨‍🏫</div>
          <h3 className="font-bold text-lg mb-1">Öğretmenler</h3>
          <p className="text-sm text-gray-600 mb-3">
            Öğretmen ekle, düzenle ve yönet
          </p>
          <div className="text-blue-600 font-semibold text-sm">
            {stats.teachers} öğretmen →
          </div>
        </Link>
        
        <Link
          href="/dashboard/classes"
          className="p-6 bg-white rounded-lg shadow-md border-2 border-gray-100 hover:border-green-300 hover:shadow-lg transition"
        >
          <div className="text-4xl mb-3">🏛️</div>
          <h3 className="font-bold text-lg mb-1">Sınıflar</h3>
          <p className="text-sm text-gray-600 mb-3">
            Sınıf ekle, düzenle ve yönet
          </p>
          <div className="text-green-600 font-semibold text-sm">
            {stats.classes} sınıf →
          </div>
        </Link>
        
        <Link
          href="/dashboard/students"
          className="p-6 bg-white rounded-lg shadow-md border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition"
        >
          <div className="text-4xl mb-3">🎓</div>
          <h3 className="font-bold text-lg mb-1">Öğrenciler</h3>
          <p className="text-sm text-gray-600 mb-3">
            Öğrenci kayıtlarını görüntüle
          </p>
          <div className="text-purple-600 font-semibold text-sm">
            {stats.students} öğrenci →
          </div>
        </Link>
        
        <Link
          href="/dashboard/subjects"
          className="p-6 bg-white rounded-lg shadow-md border-2 border-gray-100 hover:border-orange-300 hover:shadow-lg transition"
        >
          <div className="text-4xl mb-3">📚</div>
          <h3 className="font-bold text-lg mb-1">Branşlar</h3>
          <p className="text-sm text-gray-600 mb-3">
            Branş ekle ve düzenle
          </p>
          <div className="text-orange-600 font-semibold text-sm">
            Yönet →
          </div>
        </Link>
        
        <Link
          href="/dashboard/ratings"
          className="p-6 bg-white rounded-lg shadow-md border-2 border-gray-100 hover:border-pink-300 hover:shadow-lg transition"
        >
          <div className="text-4xl mb-3">⭐</div>
          <h3 className="font-bold text-lg mb-1">Değerlendirmeler</h3>
          <p className="text-sm text-gray-600 mb-3">
            Tüm değerlendirmeleri görüntüle
          </p>
          <div className="text-pink-600 font-semibold text-sm">
            Görüntüle →
          </div>
        </Link>
        
        <Link
          href="/dashboard/admin/reports"
          className="p-6 bg-white rounded-lg shadow-md border-2 border-gray-100 hover:border-indigo-300 hover:shadow-lg transition"
        >
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-bold text-lg mb-1">Raporlar</h3>
          <p className="text-sm text-gray-600 mb-3">
            Kurum raporları ve istatistikler
          </p>
          <div className="text-indigo-600 font-semibold text-sm">
            Görüntüle →
          </div>
        </Link>
      </div>
    </div>
  )
}
