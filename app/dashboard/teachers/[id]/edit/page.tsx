'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditTeacherPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<any[]>([])
  const [teacher, setTeacher] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    full_name: '',
    subject_id: '',
  })

  useEffect(() => {
    fetchSubjects()
    fetchTeacher()
  }, [])

  const fetchSubjects = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('subjects')
      .select('id, name')
      .order('name')
    
    if (data) setSubjects(data)
  }

  const fetchTeacher = async () => {
    const supabase = createClient()
    const { data, error: fetchError } = await supabase
      .from('teachers')
      .select('id, full_name, subject_id, user_id, created_at, updated_at')
      .eq('id', params.id)
      .single()
    
    if (fetchError) {
      console.error('Fetch teacher error:', fetchError)
      setError('Öğretmen yüklenirken hata oluştu')
      return
    }
    
    if (data) {
      setTeacher(data)
      setFormData({
        full_name: data.full_name || '',
        subject_id: data.subject_id || '',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      const { error: updateError } = await supabase
        .from('teachers')
        .update({
          full_name: formData.full_name,
          subject_id: formData.subject_id || null,
        })
        .eq('id', params.id)

      if (updateError) throw updateError

      router.push('/dashboard/teachers')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu öğretmeni silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Delete teacher record (user will be handled by Supabase cascade)
      const { error: deleteError } = await supabase
        .from('teachers')
        .delete()
        .eq('id', params.id)

      if (deleteError) throw deleteError

      router.push('/dashboard/teachers')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link href="/dashboard" className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Öğrencim
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4">
          <Link 
            href="/dashboard/teachers"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <span>←</span>
            <span>Öğretmenler</span>
          </Link>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-gray-200/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">✏️</span>
              <span>Öğretmeni Düzenle</span>
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              {teacher.full_name}
            </p>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2">
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="full_name" className="block text-sm font-bold text-gray-700 mb-2">
                  Ad Soyad *
                </label>
                <input
                  id="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base text-gray-900"
                  placeholder="Öğretmen adı ve soyadı"
                />
              </div>

              {teacher.user?.email && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    E-posta
                  </label>
                  <div className="px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-base text-gray-700">
                    {teacher.user.email}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    E-posta adresi değiştirilemez
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="subject_id" className="block text-sm font-bold text-gray-700 mb-2">
                  Branş
                </label>
                <select
                  id="subject_id"
                  value={formData.subject_id}
                  onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-base text-gray-900"
                >
                  <option value="">Branş seçin (opsiyonel)</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>Değişiklikleri Kaydet</span>
                    </>
                  )}
                </button>
                <Link
                  href="/dashboard/teachers"
                  className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-bold text-base text-center border-2 border-gray-200"
                >
                  İptal
                </Link>
              </div>
            </form>

            {/* Delete Section */}
            <div className="mt-8 pt-6 border-t-2 border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>⚠️</span>
                <span>Tehlikeli Bölge</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Öğretmeni kalıcı olarak silmek istiyorsanız aşağıdaki butonu kullanın. Bu işlem geri alınamaz.
              </p>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm"
              >
                🗑️ Öğretmeni Sil
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
