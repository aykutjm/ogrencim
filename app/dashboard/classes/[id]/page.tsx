import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getClassById } from '@/lib/api/classes'
import { getStudentsByClass } from '@/lib/api/students'
import Link from 'next/link'
import RatingCard from '@/components/RatingCard'
import DashboardNav from '@/components/DashboardNav'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ClassDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const userRole = user.user_metadata?.role

  if (userRole !== 'teacher') {
    redirect('/dashboard')
  }

  let classData
  let students

  try {
    classData = await getClassById(params.id)
    students = await getStudentsByClass(params.id)

    // Her öğrenci için skill ratings'i al ve detaylı bilgi getir - paralel
    const studentsWithRatings = await Promise.all(
      students.map(async (student) => {
        const { data: ratings } = await supabase
          .from('skill_ratings')
          .select(`
            *,
            subject:subjects(name),
            teacher:teachers(full_name)
          `)
          .eq('student_id', student.id)
          .eq('visibility', true)
          .order('created_at', { ascending: false })

        // En yüksek puanlı branşı bul
        let topSkill = null
        let topRating = 0

        if (ratings && ratings.length > 0) {
          const avgBySubject: Record<string, { sum: number; count: number }> = {}
          
          ratings.forEach((r: any) => {
            const subjectName = r.subject?.name || 'Diğer'
            if (!avgBySubject[subjectName]) {
              avgBySubject[subjectName] = { sum: 0, count: 0 }
            }
            avgBySubject[subjectName].sum += r.rating
            avgBySubject[subjectName].count += 1
          })

          Object.entries(avgBySubject).forEach(([subject, { sum, count }]) => {
            const avg = sum / count
            if (avg > topRating) {
              topRating = avg
              topSkill = subject
            }
          })
        }

        // Branş bazlı gruplama
        const ratingsBySubject = (ratings || []).reduce((acc: any, rating: any) => {
          const subjectName = rating.subject?.name || 'Diğer'
          if (!acc[subjectName]) {
            acc[subjectName] = []
          }
          acc[subjectName].push(rating)
          return acc
        }, {})

        return {
          ...student,
          topSkill,
          topRating,
          totalRatings: ratings?.length || 0,
          ratingsBySubject,
          allRatings: ratings || [],
        }
      })
    )

    students = studentsWithRatings
  } catch (error) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardNav showBackButton />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in-up">
        <div className="mb-6">
          <Link 
            href="/dashboard/classes"
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Sınıflar
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Sınıf {classData.name}
              </h1>
              <p className="text-gray-600">
                {students.length} öğrenci
              </p>
            </div>
            <div className="text-5xl">🎓</div>
          </div>
        </div>

        {students.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Bu sınıfta henüz öğrenci bulunmuyor</p>
          </div>
        )}

        {students.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>👥</span>
                <span>Sınıf Listesi</span>
              </h2>
            </div>

            <div className="divide-y-2 divide-gray-200">
              {students.map((student: any) => (
                <Link
                  key={student.id}
                  href={`/dashboard/students/${student.id}`}
                  className="block px-6 py-4 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {student.first_name[0]}{student.last_name[0]}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {student.first_name} {student.last_name}
                        </h3>
                        
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          {student.student_number && (
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <span>🔢</span>
                              <span>{student.student_number}</span>
                            </span>
                          )}
                          
                          {(student as any).is_bilsem && (
                            <span className="inline-flex items-center gap-1 bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full font-bold text-xs">
                              <span>🎓</span>
                              <span>BİLSEM</span>
                            </span>
                          )}
                          
                          {student.topSkill && (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold text-xs">
                              <span>⭐</span>
                              <span>{student.topSkill}: {student.topRating.toFixed(1)}/5</span>
                            </span>
                          )}
                          
                          <span className="text-xs text-gray-500">
                            {student.totalRatings} değerlendirme
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-gray-400 group-hover:text-blue-600 transition-colors ml-4">
                      <span className="text-xl">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
