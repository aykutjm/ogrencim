import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getParentByUserId } from '@/lib/api/parents'
import Link from 'next/link'
import RatingCard from '@/components/RatingCard'

export default async function MyChildrenPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const userRole = user.user_metadata?.role

  if (userRole !== 'parent') {
    redirect('/dashboard')
  }

  let parent
  let children
  let error = null

  try {
    parent = await getParentByUserId(user.id)
    
    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select(`
        *,
        class:classes(*)
      `)
      .eq('parent_id', parent.id)

    if (studentsError) throw studentsError
    children = studentsData || []

    // Her çocuk için skill ratings al
    const childrenWithRatings = await Promise.all(
      children.map(async (child: any) => {
        const { data: ratings } = await supabase
          .from('skill_ratings')
          .select(`
            *,
            teacher:teachers(full_name),
            subject:subjects(name)
          `)
          .eq('student_id', child.id)
          .eq('visibility', true)

        return {
          ...child,
          ratings: ratings || [],
        }
      })
    )

    children = childrenWithRatings
  } catch (e: any) {
    error = e.message
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-xl font-bold text-primary-700">
              Öğrencim
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-800">
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Çocuklarım
          </h1>
          <p className="text-gray-600">
            Çocuklarınızın gelişim raporlarını görüntüleyin
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <p className="font-semibold">Hata:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!error && children && children.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Henüz öğrenci kaydı bulunmuyor
            </h3>
            <p className="text-gray-600">
              Lütfen okul yönetimiyle iletişime geçin.
            </p>
          </div>
        )}

        {!error && children && children.length > 0 && (
          <div className="space-y-6">
            {children.map((child: any) => (
              <div key={child.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-primary-50 border-b border-primary-100 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {child.first_name} {child.last_name}
                      </h2>
                      <div className="text-sm text-gray-600 mt-1">
                        {child.class?.name && <span>Sınıf: {child.class.name}</span>}
                        {child.student_number && <span className="ml-4">Numara: {child.student_number}</span>}
                      </div>
                    </div>
                    <div className="text-5xl">👤</div>
                  </div>
                </div>

                <div className="p-6">
                  {child.ratings.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Henüz değerlendirme bulunmuyor
                    </p>
                  )}

                  {child.ratings.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-xl text-gray-900 mb-4">
                        Branş Değerlendirmeleri
                      </h3>
                      
                      {/* Branş bazlı gruplama */}
                      {(() => {
                        const ratingsBySubject = child.ratings.reduce((acc: any, rating: any) => {
                          const subjectName = rating.subject?.name || 'Diğer'
                          if (!acc[subjectName]) {
                            acc[subjectName] = []
                          }
                          acc[subjectName].push(rating)
                          return acc
                        }, {})

                        return Object.entries(ratingsBySubject).map(([subjectName, subjectRatings]: [string, any]) => (
                          <div key={subjectName} className="border-b-2 border-gray-300 pb-6 last:border-0">
                            <h4 className="font-bold text-xl text-gray-900 mb-4 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-600">
                              📚 {subjectName}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {subjectRatings.map((rating: any) => (
                                <RatingCard key={rating.id} rating={rating} />
                              ))}
                            </div>
                          </div>
                        ))
                      })()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
