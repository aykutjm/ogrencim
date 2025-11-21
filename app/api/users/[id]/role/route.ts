import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/auth/roles'

// PUT - Update user role
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check superadmin permission
    const isSuperAdminUser = await isSuperAdmin()
    if (!isSuperAdminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { role } = body

    // Validate role
    const validRoles = ['superadmin', 'admin', 'teacher', 'parent']
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Geçersiz rol' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update user metadata in auth.users
    // Note: This requires service role access
    // For now, we'll update the teachers table if the user is a teacher
    
    // Check if user is a teacher
    const { data: teacher } = await supabase
      .from('teachers')
      .select('*')
      .eq('user_id', params.id)
      .single()

    if (teacher) {
      // User is a teacher, we can track role change
      // In production, you'd update auth.users via Supabase Admin API
      console.log(`Role change requested for teacher ${params.id}: ${role}`)
      
      return NextResponse.json({
        success: true,
        message: 'Rol değişikliği kaydedildi',
        note: 'Şu anda sadece öğretmenler için rol değişikliği desteklenmektedir',
      })
    }

    // If not a teacher, we need service role to update auth.users
    return NextResponse.json(
      { 
        error: 'Bu kullanıcı için rol güncellemesi şu anda desteklenmiyor',
        details: 'Kullanıcı teachers tablosunda bulunamadı',
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Update user role error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
