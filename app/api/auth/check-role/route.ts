import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Login sonrası rol kontrolü ve otomatik rol ataması
 */
export async function POST() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Kullanıcının zaten rolü varsa, hiçbir şey yapma
    const currentRole = user.user_metadata?.role
    
    if (currentRole) {
      return NextResponse.json({
        success: true,
        role: currentRole,
        message: 'Role already set',
      })
    }

    // Kullanıcının rolü yoksa, teachers veya parents tablosundan kontrol et
    const { data: teacher } = await supabase
      .from('teachers')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (teacher) {
      // Teacher olarak işaretle (metadata güncellemesi için service role gerekli)
      // Bu yüzden sadece bilgi döndürüyoruz
      return NextResponse.json({
        success: true,
        role: 'teacher',
        message: 'User is a teacher but role not set in metadata',
        needsUpdate: true,
      })
    }

    const { data: parent } = await supabase
      .from('parents')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (parent) {
      return NextResponse.json({
        success: true,
        role: 'parent',
        message: 'User is a parent but role not set in metadata',
        needsUpdate: true,
      })
    }

    // Hiçbir tabloda bulunamadı
    return NextResponse.json({
      success: false,
      message: 'User not found in any role table',
    }, { status: 404 })

  } catch (error) {
    console.error('Role check error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
