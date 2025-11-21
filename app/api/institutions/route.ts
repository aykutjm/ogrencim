import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/auth/roles'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .order('name')
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Kurumlar getirilemedi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Superadmin kontrolü
    const isSuperAdminUser = await isSuperAdmin()
    if (!isSuperAdminUser) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 403 }
      )
    }
    
    const supabase = await createClient()
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('institutions')
      .insert(body)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Kurum eklenemedi' },
      { status: 500 }
    )
  }
}
