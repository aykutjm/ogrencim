import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getClasses } from '@/lib/api/classes'
import Link from 'next/link'
import DeleteClassButton from './DeleteClassButton'
import DashboardNav from '@/components/DashboardNav'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ClassesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const userRole = user.user_metadata?.role

  if (userRole !== 'teacher') {
    redirect('/dashboard')
  }

  let classes: Awaited<ReturnType<typeof getClasses>> = []
  let error: string | null = null

  try {
    classes = await getClasses()
  } catch (e: any) {
    error = e.message
  }

  // Her sınıf için öğrenci sayısını al - paralel olarak
  const classesWithCounts = await Promise.all(
    classes.map(async (classItem) => {
      const { count } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', classItem.id)
      
      return {
        ...classItem,
        studentCount: count || 0
      }
    })
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardNav showBackButton />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in-up">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Sınıflar
            </h1>
            <p className="text-gray-600">
              Sınıf seçerek öğrencileri ve öne çıkan yetenekleri görüntüleyin
            </p>
          </div>
          <Link
            href="/dashboard/classes/new"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            + Yeni Sınıf Ekle
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <p className="font-semibold">Hata:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!error && classesWithCounts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🏫</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Sınıf bulunamadı
            </h3>
            <p className="text-gray-600">
              Lütfen Supabase migration dosyalarını çalıştırdığınızdan emin olun.
            </p>
          </div>
        )}

        {!error && classesWithCounts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classesWithCounts.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
              >
                <Link
                  href={`/dashboard/classes/${classItem.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-primary-700">
                      {classItem.name}
                    </h3>
                    <span className="text-3xl">🎓</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <p className="flex items-center gap-2">
                      <span>👥</span>
                      <span className="font-semibold">{classItem.studentCount} öğrenci</span>
                    </p>
                  </div>
                </Link>
                
                <div className="mt-4 pt-4 border-t">
                  <DeleteClassButton classId={classItem.id} className={classItem.name} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
