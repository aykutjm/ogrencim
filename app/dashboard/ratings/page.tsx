import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import RatingsTable from './RatingsTable'
import DashboardNav from '@/components/DashboardNav'

export default async function RatingsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const userRole = user.user_metadata?.role

  if (userRole !== 'teacher') {
    redirect('/dashboard')
  }

  // Tüm branşları çek
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name')
    .order('name')

  // Tüm öğrencileri ve değerlendirmelerini çek
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select(`
      id,
      first_name,
      last_name,
      student_number,
      class:classes(name),
      ratings:skill_ratings(
        rating,
        comment,
        created_at,
        is_bilsem_rating,
        bilsem_subject,
        subjects(id, name),
        teachers(id, full_name, email)
      )
    `)
    .order('first_name')

  if (studentsError) {
    console.error('Students error:', studentsError)
  }

  console.log('RAW students data:', JSON.stringify(students?.[0]?.ratings?.[0], null, 2))

  // Transform: teachers ve subjects object/array'lerini single object'e çevir
  const transformedStudents = students?.map(student => ({
    ...student,
    ratings: student.ratings?.map((rating: any) => ({
      ...rating,
      // Embedded query bazen object bazen array döner
      teacher: rating.teachers 
        ? (Array.isArray(rating.teachers) ? rating.teachers[0] : rating.teachers)
        : null,
      subject: rating.subjects
        ? (Array.isArray(rating.subjects) ? rating.subjects[0] : rating.subjects)
        : null,
      teachers: undefined,
      subjects: undefined
    }))
  }))
  
  console.log('TRANSFORMED rating:', JSON.stringify(transformedStudents?.[0]?.ratings?.[0], null, 2))

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <DashboardNav showBackButton userRole={userRole} />

      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Modern Başlık */}
        <div className="mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 border-2 sm:border-4 border-white">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl border-2 border-white/30 flex-shrink-0">
              📊
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg">
                Tüm Değerlendirmeler
              </h1>
              <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg font-medium">
                Tüm öğrencilerin branş bazlı değerlendirmelerini görüntüleyin
              </p>
            </div>
          </div>
        </div>

        <RatingsTable 
          students={transformedStudents || []} 
          subjects={subjects || []} 
        />
      </div>
    </main>
  )
}
