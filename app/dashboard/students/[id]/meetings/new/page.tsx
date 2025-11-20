import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getStudentById } from '@/lib/api/students'
import { getTeacherByUserId } from '@/lib/api/teachers'
import DashboardNav from '@/components/DashboardNav'
import NewMeetingForm from '../NewMeetingForm'

export const dynamic = 'force-dynamic'

export default async function NewMeetingPage({
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

  let student
  let currentTeacher

  try {
    student = await getStudentById(params.id)
    currentTeacher = await getTeacherByUserId(user.id)
  } catch (error) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardNav showBackButton />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-4xl">👥</span>
            <span>Yeni Veli Görüşmesi</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Veli görüşmesi kaydı oluşturun ve notlarınızı saklayın
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <NewMeetingForm
            studentId={params.id}
            teacherId={currentTeacher.id}
            studentName={`${student.first_name} ${student.last_name}`}
          />
        </div>
      </div>
    </main>
  )
}
