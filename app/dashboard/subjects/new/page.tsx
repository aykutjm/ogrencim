import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function NewSubjectPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  async function createSubject(formData: FormData) {
    'use server'
    
    const supabase = await createClient()
    
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    
    const { error } = await supabase
      .from('subjects')
      .insert([
        {
          name,
          description: description || null
        }
      ])
    
    if (error) {
      console.error('Subject creation error:', error)
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Yeni Branş Ekle</h1>
          <p className="text-gray-700">Değerlendirme yapmak istediğiniz branşı ekleyin</p>
        </div>

        <form action={createSubject} className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
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
                ✅ Branşı Kaydet
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
