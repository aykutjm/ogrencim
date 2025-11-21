import { supabaseAdmin } from '../../../../lib/supabase/adminClient'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.split(' ')[1]
    if (!token) return new Response(JSON.stringify({ error: 'Missing token' }), { status: 401 })

    // Verify token and fetch user via admin client
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !userData?.user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 })

    const user = userData.user
  const rawMeta = (user as any).raw_user_meta_data || (user as any).user_metadata || {}
  const role = rawMeta.role
    if (role !== 'superadmin') return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })

    // As superadmin, return all institutions using service role (bypasses RLS)
    const { data: institutions, error } = await supabaseAdmin.from('institutions').select('*')
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

    return new Response(JSON.stringify(institutions), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500 })
  }
}
