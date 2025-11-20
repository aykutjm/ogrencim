'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditStudentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [classes, setClasses] = useState<any[]>([])
  const [student, setStudent] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    student_number: '',
    date_of_birth: '',
    class_id: '',
    is_bilsem: false,
  })

  useEffect(() => {
    fetchClasses()
    fetchStudent()
  }, [])

  const fetchClasses = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('classes')
      .select('id, name')
      .order('name')
    
    if (data) setClasses(data)
  }

  const fetchStudent = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('students')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (data) {
      setStudent(data)
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        student_number: data.student_number || '',
        date_of_birth: data.date_of_birth || '',
        class_id: data.class_id || '',
        is_bilsem: data.is_bilsem || false,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      const studentData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        student_number: formData.student_number || null,
        date_of_birth: formData.date_of_birth || null,
        class_id: formData.class_id || null,
        is_bilsem: formData.is_bilsem,
      }

      const { error: updateError } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', params.id)

      if (updateError) throw updateError

      router.push(`/dashboard/students/${params.id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (!student) {
    return <div className="p-6">Yükleniyor...</div>
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4">
          <Link 
            href={`/dashboard/students/${params.id}`}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <span>←</span>
            <span>Geri</span>
          </Link>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-gray-200/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">✏️</span>
              <span>Öğrenciyi Düzenle</span>
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              {student.first_name} {student.last_name}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-bold text-gray-700 mb-2">
                    Ad *
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base"
                    placeholder="Adını girin"
                  />
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-bold text-gray-700 mb-2">
                    Soyad *
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base"
                    placeholder="Soyadını girin"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="student_number" className="block text-sm font-bold text-gray-700 mb-2">
                  Öğrenci Numarası
                </label>
                <input
                  id="student_number"
                  type="text"
                  value={formData.student_number}
                  onChange={(e) => setFormData({ ...formData, student_number: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base"
                  placeholder="Örn: 12345"
                />
              </div>

              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-bold text-gray-700 mb-2">
                  Doğum Tarihi
                </label>
                <input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base"
                />
              </div>

              <div>
                <label htmlFor="class_id" className="block text-sm font-bold text-gray-700 mb-2">
                  Sınıf
                </label>
                <select
                  id="class_id"
                  value={formData.class_id}
                  onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-base"
                >
                  <option value="">Sınıf seçin (opsiyonel)</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bilsem Checkbox */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4 shadow-sm">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_bilsem}
                    onChange={(e) => setFormData({ ...formData, is_bilsem: e.target.checked })}
                    className="w-6 h-6 text-yellow-600 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <span className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <span className="text-xl">🎓</span>
                      <span>BİLSEM Öğrencisi</span>
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Bu öğrenci Bilim ve Sanat Merkezi (BİLSEM) programına kayıtlıdır
                    </p>
                  </div>
                </label>
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
                  href={`/dashboard/students/${params.id}`}
                  className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-bold text-base text-center border-2 border-gray-200"
                >
                  İptal
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
