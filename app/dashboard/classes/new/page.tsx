import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DashboardNav from '@/components/DashboardNav'

export default function NewClassPage() {
  async function createClass(formData: FormData) {
    'use server'
    
    const supabase = await createClient()
    
    const name = formData.get('name') as string
    
    const { error } = await supabase
      .from('classes')
      .insert({
        name,
        grade_level: null,
        academic_year: '2024-2025'
      })
    
    if (error) {
      console.error('Sınıf oluşturma hatası:', error)
      return
    }
    
    redirect('/dashboard/classes')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardNav showBackButton />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in-up">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Yeni Sınıf Ekle</h1>
          
          <form action={createClass} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Sınıf Adı *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Örn: 5-A, 8-B, 11-C"
                className="w-full px-4 py-3 text-base text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none placeholder:text-gray-400"
              />
              <p className="mt-1 text-sm text-gray-500">Sınıf adını giriniz</p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm"
              >
                ✓ Sınıf Oluştur
              </button>
              <Link
                href="/dashboard/classes"
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center shadow-sm"
              >
                ✕ İptal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
