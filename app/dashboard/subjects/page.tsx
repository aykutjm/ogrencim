import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SubjectsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch subjects
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*')
    .order('name')

  if (error) {
    console.error('Subjects fetch error:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <Link 
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Branşlar</h1>
              <p className="text-gray-700 mt-1">Değerlendirme yapılacak branşları yönetin</p>
            </div>
            <Link
              href="/dashboard/subjects/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
            >
              + Yeni Branş Ekle
            </Link>
          </div>
        </div>

        {subjects && subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject: any) => (
              <div
                key={subject.id}
                className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:border-blue-400 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{subject.name}</h3>
                  <span className="text-2xl">📚</span>
                </div>
                
                {subject.description && (
                  <p className="text-gray-600 text-sm mb-4">{subject.description}</p>
                )}
                
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/subjects/${subject.id}/edit`}
                    className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                  >
                    ✏️ Düzenle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz branş eklenmemiş</h3>
            <p className="text-gray-600 mb-6">Öğrenci değerlendirmesi yapmak için önce branş eklemelisiniz</p>
            <Link
              href="/dashboard/subjects/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              + İlk Branşı Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
