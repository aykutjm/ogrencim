'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

interface DeleteClassButtonProps {
  classId: string
  className: string
}

export default function DeleteClassButton({ classId, className }: DeleteClassButtonProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`"${className}" sınıfını silmek istediğinizden emin misiniz?`)) {
      return
    }

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId)

    if (error) {
      alert('Sınıf silinirken hata oluştu: ' + error.message)
      return
    }

    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
    >
      🗑️ Sınıfı Sil
    </button>
  )
}
