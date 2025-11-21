import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/auth/roles'

// GET - List all users
export async function GET() {
  try {
    // Check superadmin permission
    const isSuperAdminUser = await isSuperAdmin()
    if (!isSuperAdminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const supabase = await createClient()

    // Get all teachers (since we can't access auth.users directly)
    const { data: teachers, error: teachersError } = await supabase
      .from('teachers')
      .select(`
        user_id,
        institution_id,
        institutions(name)
      `)

    if (teachersError) {
      console.error('Database error:', teachersError)
    }

    // Get all students
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select(`
        user_id,
        institution_id
      `)

    if (studentsError) {
      console.error('Database error:', studentsError)
    }

    // Combine all user IDs
    const allUserIds = new Set<string>()
    teachers?.forEach(t => allUserIds.add(t.user_id))
    students?.forEach(s => allUserIds.add(s.user_id))

    // For each user, we need to fetch their auth data
    // Since we can't query auth.users directly with RLS, we'll use a workaround
    // We'll fetch user metadata from a custom API that uses service role
    
    // Build users array from teachers data
    const users = teachers?.map(teacher => ({
      id: teacher.user_id,
      email: '', // We'll populate this from auth
      role: 'teacher',
      created_at: new Date().toISOString(),
      institution_id: teacher.institution_id,
      institution_name: (teacher.institutions as any)?.name,
    })) || []

    // Add superadmin (hardcoded for now - you should fetch from auth)
    users.unshift({
      id: 'superadmin',
      email: 'y.aykut7455@gmail.com',
      role: 'superadmin',
      created_at: new Date().toISOString(),
      institution_id: undefined,
      institution_name: undefined,
    })

    return NextResponse.json({
      success: true,
      users,
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
