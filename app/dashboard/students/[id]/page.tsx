import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getStudentById } from '@/lib/api/students'
import { getSkillRatingsByStudent } from '@/lib/api/skill-ratings'
import { getSubjects } from '@/lib/api/subjects'
import { getTeacherByUserId } from '@/lib/api/teachers'
import { getParentMeetingsByStudent } from '@/lib/api/parent-meetings'
import Link from 'next/link'
import DashboardNav from '@/components/DashboardNav'
import StudentDetailClient from './StudentDetailClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StudentDetailPage({
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

  if (userRole !== 'teacher' && userRole !== 'parent') {
    redirect('/dashboard')
  }

  let student
  let ratings
  let subjects
  let currentTeacher
  let meetings: any[] = []
  let siblings: any[] = []

  try {
    student = await getStudentById(params.id)
    ratings = await getSkillRatingsByStudent(params.id)
    subjects = await getSubjects()
    
    // Kardeşleri bul (aynı anne/baba bilgilerine sahip diğer öğrenciler)
    if (student.parent) {
      const parent = student.parent as any
      
      // Önce parent_id ile dene
      if (student.parent_id) {
        const { data: siblingsData } = await supabase
          .from('students')
          .select('id, first_name, last_name, class:classes(name)')
          .eq('parent_id', student.parent_id)
          .neq('id', params.id)
          .order('first_name')
        
        if (siblingsData && siblingsData.length > 0) {
          siblings = siblingsData
        }
      }
      
      // Eğer parent_id ile bulunamadıysa, anne/baba bilgilerine göre ara
      if (siblings.length === 0) {
        const conditions = []
        
        // Anne telefonu varsa
        if (parent.mother_phone) {
          conditions.push(`parent.mother_phone.eq.${parent.mother_phone}`)
        }
        
        // Baba telefonu varsa
        if (parent.father_phone) {
          conditions.push(`parent.father_phone.eq.${parent.father_phone}`)
        }
        
        // Eski sistem: phone varsa
        if (parent.phone && !parent.mother_phone && !parent.father_phone) {
          conditions.push(`parent.phone.eq.${parent.phone}`)
        }
        
        if (conditions.length > 0) {
          // Tüm öğrencileri çek ve filtrele
          const { data: allStudents } = await supabase
            .from('students')
            .select('id, first_name, last_name, parent_id, class:classes(name), parent:parents(mother_phone, father_phone, phone, mother_name, father_name, full_name)')
            .neq('id', params.id)
            .order('first_name')
          
          if (allStudents) {
            siblings = allStudents.filter((s: any) => {
              if (!s.parent) return false
              
              // Anne telefonu eşleşiyor mu?
              if (parent.mother_phone && s.parent.mother_phone === parent.mother_phone) {
                return true
              }
              
              // Baba telefonu eşleşiyor mu?
              if (parent.father_phone && s.parent.father_phone === parent.father_phone) {
                return true
              }
              
              // Eski sistem telefon eşleşiyor mu?
              if (parent.phone && s.parent.phone === parent.phone) {
                return true
              }
              
              return false
            })
          }
        }
      }
    }
    
    if (userRole === 'teacher') {
      currentTeacher = await getTeacherByUserId(user.id)
      meetings = await getParentMeetingsByStudent(params.id)
    }
  } catch (error) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardNav showBackButton />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in-up">
        <div className="mb-6">
          <Link 
            href="/dashboard/students"
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Öğrenciler
          </Link>
        </div>

        <StudentDetailClient
          student={student}
          ratings={ratings}
          subjects={subjects}
          currentTeacher={currentTeacher}
          meetings={meetings}
          userRole={userRole}
          studentId={params.id}
          siblings={siblings}
        />
      </div>
    </main>
  )
}
