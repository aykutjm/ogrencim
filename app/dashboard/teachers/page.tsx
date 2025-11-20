import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardNav from '@/components/DashboardNav'

export const dynamic = 'force-dynamic'

export default async function TeachersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const userRole = user.user_metadata?.role

  if (userRole !== 'teacher') {
    redirect('/dashboard')
  }

  // Fetch teachers with their subject information
  const { data: teachers, error: teachersError } = await supabase
    .from('teachers')
    .select(`
      *,
      subject:subjects(id, name)
    `)
    .order('full_name')
  
  if (teachersError) {
    console.error('Teachers fetch error:', teachersError)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <DashboardNav showBackButton />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl sm:text-3xl md:text-4xl">👨‍🏫</span>
                <span>Öğretmenler</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
                Öğretmen listesi ve branş bilgileri
              </p>
            </div>
            <Link
              href="/dashboard/teachers/new"
              className="w-full sm:w-auto px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <span className="text-base sm:text-lg md:text-xl">➕</span>
              <span>Yeni Öğretmen</span>
            </Link>
          </div>
        </div>

        {!teachers || teachers.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border-2 border-gray-200/50 p-6 sm:p-8 md:p-12 text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">👨‍🏫</div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Henüz öğretmen eklenmemiş
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6">
              Sistemde kayıtlı öğretmen bulunmuyor.
            </p>
            <Link
              href="/dashboard/teachers/new"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold shadow-lg text-sm sm:text-base"
            >
              <span>➕</span>
              <span>İlk Öğretmeni Ekle</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {teachers.map((teacher) => (
              <Link
                key={teacher.id}
                href={`/dashboard/teachers/${teacher.id}/edit`}
                className="block bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-gray-200/50 hover:shadow-2xl hover:border-blue-300 transition-all overflow-hidden group"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl sm:text-3xl border-2 border-white/30">
                      👨‍🏫
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-white truncate">
                        {teacher.full_name}
                      </h3>
                      {teacher.subject && (
                        <div className="text-xs sm:text-sm text-blue-100 truncate">
                          📚 {teacher.subject.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-start gap-2 text-xs sm:text-sm">
                    <span className="text-gray-500 shrink-0">�</span>
                    <span className="text-gray-700">
                      {teacher.subject ? teacher.subject.name : 'Branş atanmamış'}
                    </span>
                  </div>
                  
                  <div className="pt-2 flex items-center justify-end text-xs text-blue-600 group-hover:text-blue-700 font-medium">
                    <span>Düzenle</span>
                    <span className="ml-1 group-hover:ml-2 transition-all">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
