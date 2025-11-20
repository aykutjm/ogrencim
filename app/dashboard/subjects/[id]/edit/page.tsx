import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import DeleteSubjectButton from './DeleteSubjectButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EditSubjectPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch subject
  const { data: subject, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !subject) {
    notFound()
  }

  async function updateSubject(formData: FormData) {
    'use server'
    
    const supabase = await createClient()
    
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    
    const { error } = await supabase
      .from('subjects')
      .update({
        name,
        description: description || null
      })
      .eq('id', params.id)
    
    if (error) {
      console.error('Subject update error:', error)
      throw error
    }
    
    redirect('/dashboard/subjects')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <Link 
            href="/dashboard/subjects"
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Branşlar
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Branşı Düzenle</h1>
          <p className="text-gray-700">{subject.name} branşını düzenleyin</p>
        </div>

        <form action={updateSubject} className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 mb-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                Branş Adı *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={subject.name}
                placeholder="Örn: Matematik, Türkçe, Müzik..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white font-medium"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-bold text-gray-900 mb-2">
                Açıklama (Opsiyonel)
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={subject.description || ''}
                placeholder="Bu branş hakkında kısa açıklama..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white resize-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <a
                href="/dashboard/subjects"
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-bold text-center"
              >
                İptal
              </a>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold shadow-md"
              >
                ✅ Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </form>

        <div className="bg-red-50 rounded-lg shadow-md p-6 border-2 border-red-200">
          <h3 className="text-lg font-bold text-red-900 mb-2">⚠️ Tehlikeli Bölge</h3>
          <p className="text-red-700 text-sm mb-4">
            Bu branşı silmek, ona ait tüm değerlendirmeleri de silecektir. Bu işlem geri alınamaz!
          </p>
          <DeleteSubjectButton subjectId={subject.id} subjectName={subject.name} />
        </div>
      </div>
    </div>
  )
}
