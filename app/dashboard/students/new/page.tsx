'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardNav from '@/components/DashboardNav'

export default function NewStudentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [classes, setClasses] = useState<any[]>([])
  
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
  }, [])

  const fetchClasses = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('classes')
      .select('id, name')
      .order('name')
    
    if (data) setClasses(data)
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
        student_number: formData.student_number || undefined,
        date_of_birth: formData.date_of_birth || undefined,
        class_id: formData.class_id || undefined,
        is_bilsem: formData.is_bilsem,
      }

      const { error: insertError } = await supabase
        .from('students')
        .insert(studentData)

      if (insertError) throw insertError

      router.push('/dashboard/students')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardNav showBackButton />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in-up">
        <div className="mb-6">
          <Link 
            href="/dashboard/students"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition"
          >
            <span>←</span>
            <span>Öğrenciler</span>
          </Link>
        </div>

        {/* Modern Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl border-4 border-white/30">
              ➕
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Yeni Öğrenci Ekle
              </h1>
              <p className="text-blue-100">
                Sisteme yeni bir öğrenci kaydı ekleyin
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl text-sm font-medium">
              <span className="font-bold">❌ Hata:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ad Soyad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-bold text-gray-900 mb-2">
                  <span className="flex items-center gap-2">
                    <span>👤</span>
                    <span>Ad</span>
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  id="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Örn: Ahmet"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-900 font-medium placeholder:text-gray-400"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-bold text-gray-900 mb-2">
                  <span className="flex items-center gap-2">
                    <span>👤</span>
                    <span>Soyad</span>
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  id="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Örn: Yılmaz"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-900 font-medium placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Öğrenci Numarası ve Doğum Tarihi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="student_number" className="block text-sm font-bold text-gray-900 mb-2">
                  <span className="flex items-center gap-2">
                    <span>🔢</span>
                    <span>Öğrenci Numarası</span>
                  </span>
                </label>
                <input
                  id="student_number"
                  type="text"
                  value={formData.student_number}
                  onChange={(e) => setFormData({ ...formData, student_number: e.target.value })}
                  placeholder="Örn: 2024001"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-900 font-medium placeholder:text-gray-400"
                />
              </div>

              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-bold text-gray-900 mb-2">
                  <span className="flex items-center gap-2">
                    <span>📅</span>
                    <span>Doğum Tarihi</span>
                  </span>
                </label>
                <input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-900 font-medium"
                />
              </div>
            </div>

            {/* Sınıf */}
            <div>
              <label htmlFor="class_id" className="block text-sm font-bold text-gray-900 mb-2">
                <span className="flex items-center gap-2">
                  <span>🏫</span>
                  <span>Sınıf</span>
                </span>
              </label>
              <select
                id="class_id"
                value={formData.class_id}
                onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-900 font-medium"
              >
                <option value="">Sınıf seçin (opsiyonel)</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* BİLSEM Checkbox */}
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_bilsem}
                  onChange={(e) => setFormData({ ...formData, is_bilsem: e.target.checked })}
                  className="w-6 h-6 mt-1 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
                <div className="flex-1">
                  <span className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span>🎓</span>
                    <span>BİLSEM Öğrencisi</span>
                  </span>
                  <p className="text-sm text-gray-700 mt-1">
                    Bu öğrenci Bilim ve Sanat Merkezi (BİLSEM) programına kayıtlıdır
                  </p>
                </div>
              </label>
            </div>

            {/* Butonlar */}
            <div className="pt-6 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    <span>Kaydediliyor...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>✅</span>
                    <span>Kaydet</span>
                  </span>
                )}
              </button>
              <Link
                href="/dashboard/students"
                className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-center font-bold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>❌</span>
                <span>İptal</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
