'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

interface DeleteSubjectButtonProps {
  subjectId: string
  subjectName: string
}

export default function DeleteSubjectButton({ subjectId, subjectName }: DeleteSubjectButtonProps) {
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleDelete = async () => {
    const confirmed = confirm(
      `"${subjectName}" branşını silmek istediğinizden emin misiniz?\n\n⚠️ Bu branşa ait tüm değerlendirmeler silinecektir ve bu işlem geri alınamaz!`
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', subjectId)

    if (error) {
      alert('Hata: ' + error.message)
      return
    }

    router.push('/dashboard/subjects')
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-bold shadow-md"
    >
      🗑️ Branşı Sil
    </button>
  )
}
