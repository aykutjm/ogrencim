import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/auth/roles'

// PUT - Update institution
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
    const { name, address, phone, email, is_active } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Kurum adı gereklidir' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update institution
    const { data, error } = await supabase
      .from('institutions')
      .update({
        name,
        address: address || null,
        phone: phone || null,
        email: email || null,
        is_active: is_active ?? true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Kurum güncellenirken bir hata oluştu' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      institution: data,
    })
  } catch (error) {
    console.error('Update institution error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

// DELETE - Delete institution
export async function DELETE(
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

    const supabase = await createClient()

    // Check if institution has users
    const { count: teachersCount } = await supabase
      .from('teachers')
      .select('*', { count: 'exact', head: true })
      .eq('institution_id', params.id)

    const { count: studentsCount } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('institution_id', params.id)

    if ((teachersCount || 0) > 0 || (studentsCount || 0) > 0) {
      return NextResponse.json(
        { 
          error: 'Bu kurum silinemez. Önce kuruma bağlı kullanıcıları silmelisiniz.',
          teachersCount,
          studentsCount,
        },
        { status: 400 }
      )
    }

    // Delete institution
    const { error } = await supabase
      .from('institutions')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Kurum silinirken bir hata oluştu' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Kurum başarıyla silindi',
    })
  } catch (error) {
    console.error('Delete institution error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
