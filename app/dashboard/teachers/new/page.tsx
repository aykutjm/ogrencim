'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewTeacherPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    subject_id: '',
  })

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('subjects')
      .select('id, name')
      .order('name')
    
    if (data) setSubjects(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // 1. Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: undefined,
          data: {
            full_name: formData.full_name,
            role: 'teacher'
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Kullanıcı oluşturulamadı')

      // 2. Create teacher record
      const { error: teacherError } = await supabase
        .from('teachers')
        .insert({
          user_id: authData.user.id,
          full_name: formData.full_name,
          email: formData.email,
          subject_id: formData.subject_id || null,
        })

      // Eğer duplicate key hatası varsa, kullanıcı zaten kayıtlı demektir
      if (teacherError) {
        if (teacherError.message.includes('duplicate key') && teacherError.message.includes('user_id')) {
          // Kullanıcı zaten kayıtlı, başarı mesajı göster
          console.log('Teacher already exists, redirecting...')
        } else {
          // Başka bir hata varsa fırlat
          throw teacherError
        }
      }

      router.push('/dashboard/teachers')
      router.refresh()
    } catch (err: any) {
      // Hata mesajlarını kullanıcı dostu hale getir
      let errorMessage = err.message
      
      if (errorMessage.includes('duplicate key') && errorMessage.includes('user_id')) {
        errorMessage = 'Bu e-posta adresi ile zaten bir öğretmen hesabı mevcut.'
      } else if (errorMessage.includes('duplicate key') && errorMessage.includes('email')) {
        errorMessage = 'Bu e-posta adresi zaten kullanılıyor.'
      } else if (errorMessage.includes('User already registered')) {
        errorMessage = 'Bu e-posta adresi ile zaten bir hesap oluşturulmuş. Farklı bir e-posta kullanın.'
      } else if (errorMessage.includes('rate limit')) {
        errorMessage = 'Çok fazla deneme yaptınız. Lütfen 1 dakika bekleyin ve tekrar deneyin.'
      }
      
      setError(errorMessage)
      setLoading(false)
    }
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
              <span className="text-2xl sm:text-3xl">➕</span>
              <span>Yeni Öğretmen Ekle</span>
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Sisteme yeni bir öğretmen kaydı oluşturun
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

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  E-posta *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base text-gray-900"
                  placeholder="ornek@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                  Şifre *
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base text-gray-900"
                  placeholder="En az 6 karakter"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 6 karakter olmalıdır
                </p>
              </div>

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
                  <option value="" className="text-gray-900">Branş seçin (opsiyonel)</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id} className="text-gray-900">
                      {subject.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Öğretmenin branşını belirtebilirsiniz
                </p>
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
                      <span>Öğretmen Ekle</span>
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
          </div>
        </div>
      </div>
    </main>
  )
}
