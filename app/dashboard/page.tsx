import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardNav from '@/components/DashboardNav'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const userRole = user.user_metadata?.role || 'teacher'
  const userName = user.user_metadata?.full_name || user.email

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <DashboardNav />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-6 md:py-8">
        {/* Hoş Geldin Kartı */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border-2 sm:border-4 border-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <div className="text-blue-100 text-xs sm:text-sm mb-1">Hoş geldin,</div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                {userName}
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm">
                {userRole === 'teacher' 
                  ? 'Öğrencilerin yeteneklerini takip edin ve değerlendirin'
                  : 'Çocuğunuzun gelişimini takip edin'}
              </p>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg transition-all font-semibold text-xs sm:text-sm border border-white/30"
              >
                🚪 Çıkış
              </button>
            </form>
          </div>
        </div>

        <div className="mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Kontrol Paneli
          </h2>
          <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {userRole === 'teacher' && (
            <>
              <Link
                href="/dashboard/students"
                className="group block p-4 sm:p-6 md:p-8 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-blue-400"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-2xl sm:text-3xl">👥</span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors">
                  Öğrenciler
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Öğrenci listesini görüntüleyin ve yönetin
                </p>
                <div className="mt-3 sm:mt-4 text-blue-600 font-semibold text-xs sm:text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  <span>Görüntüle</span>
                  <span>→</span>
                </div>
              </Link>

              <Link
                href="/dashboard/classes"
                className="group block p-4 sm:p-6 md:p-8 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-green-400"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-2xl sm:text-3xl">🏫</span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-green-600 transition-colors">
                  Sınıflar
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Sınıf bazında öğrenci değerlendirmeleri
                </p>
                <div className="mt-3 sm:mt-4 text-green-600 font-semibold text-xs sm:text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  <span>Görüntüle</span>
                  <span>→</span>
                </div>
              </Link>

              <Link
                href="/dashboard/subjects"
                className="group block p-4 sm:p-6 md:p-8 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-purple-400"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-2xl sm:text-3xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  Branşlar
                </h3>
                <p className="text-sm text-gray-600">
                  Branş bazında yetenek puanlaması
                </p>
                <div className="mt-4 text-purple-600 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  <span>Görüntüle</span>
                  <span>→</span>
                </div>
              </Link>

              <Link
                href="/dashboard/ratings"
                className="group block p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-orange-400"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  Değerlendirmeler
                </h3>
                <p className="text-sm text-gray-600">
                  Tüm öğrencilerin branş bazlı değerlendirmeleri
                </p>
                <div className="mt-4 text-orange-600 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  <span>Görüntüle</span>
                  <span>→</span>
                </div>
              </Link>

              <Link
                href="/dashboard/teachers"
                className="group block p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-pink-400"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-3xl">👨‍🏫</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                  Öğretmenler
                </h3>
                <p className="text-sm text-gray-600">
                  Öğretmen listesi ve branş bilgileri
                </p>
                <div className="mt-4 text-pink-600 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  <span>Görüntüle</span>
                  <span>→</span>
                </div>
              </Link>
            </>
          )}

          {userRole === 'parent' && (
            <Link
              href="/dashboard/my-children"
              className="group block p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-blue-400"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                Çocuklarım
              </h3>
              <p className="text-sm text-gray-600">
                Çocuklarınızın gelişim raporlarını görüntüleyin
              </p>
              <div className="mt-4 text-blue-600 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                <span>Görüntüle</span>
                <span>→</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
