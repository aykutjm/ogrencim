'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardNav from '@/components/DashboardNav'

interface Student {
  id: string
  first_name: string
  last_name: string
  student_number?: string
  is_bilsem?: boolean
  class?: { name: string }
  parent?: { full_name: string }
}

const ITEMS_PER_PAGE = 50

export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [displayedStudents, setDisplayedStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function loadStudents() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        const userRole = user.user_metadata?.role
        if (userRole !== 'teacher') {
          router.push('/dashboard')
          return
        }

        // Tüm öğrencileri yükle (arama için)
        const { data, error: fetchError } = await supabase
          .from('students')
          .select(`
            id,
            first_name,
            last_name,
            student_number,
            is_bilsem,
            class:classes!inner(name),
            parent:parents!inner(full_name)
          `)
          .order('first_name')

        if (fetchError) throw fetchError
        
        // Sınıfa göre sıralama (alfanumerik)
        const sortedData = ((data as any) || []).sort((a: any, b: any) => {
          const classA = a.class?.name || ''
          const classB = b.class?.name || ''
          
          // Alfanumerik sıralama için localeCompare kullan
          return classA.localeCompare(classB, 'tr', { numeric: true, sensitivity: 'base' })
        })
        
        setStudents(sortedData)
        setFilteredStudents(sortedData)
        setDisplayedStudents(sortedData.slice(0, ITEMS_PER_PAGE))
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [router])

  // Arama - tüm öğrencilerde ara
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students)
      setDisplayedStudents(students.slice(0, ITEMS_PER_PAGE))
      setCurrentPage(1)
      return
    }

    // Türkçe karakterleri normalize et
    const normalizeText = (text: string) => {
      return text
        .toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
    }

    const query = normalizeText(searchQuery)
    const filtered = students.filter(student => {
      const firstName = normalizeText(student.first_name || '')
      const lastName = normalizeText(student.last_name || '')
      const studentNumber = normalizeText(student.student_number || '')
      const className = normalizeText((student.class as any)?.name || '')
      const parentFullName = normalizeText((student.parent as any)?.full_name || '')
      const motherName = normalizeText((student.parent as any)?.mother_name || '')
      const fatherName = normalizeText((student.parent as any)?.father_name || '')
      
      return (
        firstName.includes(query) ||
        lastName.includes(query) ||
        studentNumber.includes(query) ||
        className.includes(query) ||
        parentFullName.includes(query) ||
        motherName.includes(query) ||
        fatherName.includes(query)
      )
    })
    
    setFilteredStudents(filtered)
    setDisplayedStudents(filtered.slice(0, ITEMS_PER_PAGE))
    setCurrentPage(1)
  }, [searchQuery, students])

  // Sayfalama
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE)

  const loadMore = () => {
    const nextPage = currentPage + 1
    const startIndex = 0
    const endIndex = nextPage * ITEMS_PER_PAGE
    setDisplayedStudents(filteredStudents.slice(startIndex, endIndex))
    setCurrentPage(nextPage)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <DashboardNav showBackButton />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">Yükleniyor...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardNav showBackButton />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8 fade-in-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
              Öğrenciler
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {filteredStudents.length} öğrenci {searchQuery && '(filtrelenmiş)'}
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/dashboard/students/bulk"
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium text-center"
            >
              📄 Toplu Ekle
            </Link>
            <Link
              href="/dashboard/students/new"
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs sm:text-sm font-medium text-center"
            >
              + Yeni Öğrenci
            </Link>
          </div>
        </div>

        {/* Arama */}
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="🔍 Öğrenci ara (ad, soyad, numara, sınıf, veli)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base md:text-lg text-gray-900"
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <p className="font-semibold">Hata:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!error && students.length === 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 md:p-12 text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">📚</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Henüz öğrenci eklenmemiş
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              İlk öğrenciyi eklemek için yukarıdaki butona tıklayın
            </p>
            <Link
              href="/dashboard/students/new"
              className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
            >
              İlk Öğrenciyi Ekle
            </Link>
          </div>
        )}

        {!error && filteredStudents.length === 0 && students.length > 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 md:p-12 text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Sonuç bulunamadı
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              &quot;{searchQuery}&quot; araması için öğrenci bulunamadı
            </p>
          </div>
        )}

        {!error && displayedStudents.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {displayedStudents.map((student) => (
                <Link
                  key={student.id}
                  href={`/dashboard/students/${student.id}`}
                  className="group bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        👤
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                          {student.first_name} {student.last_name}
                        </h3>
                        <div className="space-y-0.5 sm:space-y-1">
                          {student.student_number && (
                            <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                              <span className="text-gray-400">№</span>
                              <span>{student.student_number}</span>
                            </div>
                          )}
                          {(student.class as any)?.name && (
                            <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                              <span>🎓</span>
                              <span>{(student.class as any).name}</span>
                            </div>
                          )}
                          {(student.parent as any)?.full_name && (
                            <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                              <span>👤</span>
                              <span className="truncate">{(student.parent as any).full_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {student.is_bilsem && (
                      <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-gray-100">
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                          ⭐ BİLSEM
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 border-t border-gray-100 group-hover:bg-blue-50 transition-colors">
                    <span className="text-xs sm:text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      Detay Görüntüle →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Daha Fazla Yükle Butonu */}
            {displayedStudents.length < filteredStudents.length && (
              <div className="mt-6 sm:mt-8 text-center">
                <button
                  onClick={loadMore}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-sm sm:text-base"
                >
                  Daha Fazla Yükle ({displayedStudents.length} / {filteredStudents.length})
                </button>
              </div>
            )}

            {/* Sayfa Bilgisi */}
            {displayedStudents.length >= filteredStudents.length && filteredStudents.length > ITEMS_PER_PAGE && (
              <div className="mt-6 sm:mt-8 text-center text-gray-600 text-sm sm:text-base">
                Tüm öğrenciler gösteriliyor ({filteredStudents.length})
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
