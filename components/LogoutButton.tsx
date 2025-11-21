'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md sm:rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold text-xs shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span>🚪</span>
      <span className="hidden sm:inline">{loading ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}</span>
    </button>
  )
}
