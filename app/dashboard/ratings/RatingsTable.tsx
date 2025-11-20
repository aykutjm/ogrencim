'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface RatingsTableProps {
  students: any[]
  subjects: any[]
}

type SortField = 'name' | 'class' | 'rating-asc' | 'rating-desc'
type SortDirection = 'asc' | 'desc'

export default function RatingsTable({ students, subjects }: RatingsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [showUnrated, setShowUnrated] = useState(false)
  const [showBilsemOnly, setShowBilsemOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortField>('class')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Sıralama başlığına tıklama
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      // Aynı alana tıklanırsa yönü değiştir
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Farklı alana tıklanırsa yeni alan ve varsayılan yön
      setSortBy(field)
      setSortDirection('asc')
    }
  }

  // Arama ve filtreleme
  const filteredStudents = useMemo(() => {
    let result = students.filter(student => {
      const fullName = `${student.first_name} ${student.last_name}`.toLowerCase()
      const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                           student.student_number?.toLowerCase().includes(searchTerm.toLowerCase())
      
      // BİLSEM filtresi - öğrencinin BİLSEM değerlendirmesi var mı kontrol et
      if (showBilsemOnly) {
        const hasBilsemRating = student.ratings?.some((r: any) => r.is_bilsem_rating)
        if (!hasBilsemRating) {
          return false
        }
      }
      
      // Değerlendirilmemiş filtresi
      if (showUnrated) {
        const hasNoRatings = !student.ratings || student.ratings.length === 0
        return matchesSearch && hasNoRatings
      }
      
      return matchesSearch
    })

    // Sıralama
    result.sort((a, b) => {
      let compareValue = 0
      
      if (sortBy === 'name') {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase()
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase()
        compareValue = nameA.localeCompare(nameB, 'tr')
      } else if (sortBy === 'class') {
        const classA = a.class?.name || ''
        const classB = b.class?.name || ''
        compareValue = classA.localeCompare(classB, 'tr', { numeric: true, sensitivity: 'base' })
      } else if (sortBy === 'rating-asc' || sortBy === 'rating-desc') {
        const avgA = calculateOverallAverage(a)
        const avgB = calculateOverallAverage(b)
        compareValue = avgA - avgB
        if (sortBy === 'rating-desc') compareValue = -compareValue
      }
      
      return sortDirection === 'asc' ? compareValue : -compareValue
    })

    return result
  }, [students, searchTerm, showUnrated, showBilsemOnly, sortBy, sortDirection])

  // Genel ortalama hesapla
  const calculateOverallAverage = (student: any) => {
    if (!student.ratings || student.ratings.length === 0) return 0
    const sum = student.ratings.reduce((acc: number, r: any) => acc + r.rating, 0)
    return sum / student.ratings.length
  }

  // Her öğrenci için branş bazlı ortalama hesapla
  const calculateStudentData = (student: any) => {
    const subjectAverages: Record<string, { sum: number; count: number; ratings: any[] }> = {}
    
    student.ratings?.forEach((rating: any) => {
      const subjectId = rating.subject?.id
      if (!subjectId) return
      
      if (!subjectAverages[subjectId]) {
        subjectAverages[subjectId] = { sum: 0, count: 0, ratings: [] }
      }
      subjectAverages[subjectId].sum += rating.rating
      subjectAverages[subjectId].count += 1
      subjectAverages[subjectId].ratings.push(rating)
    })

    return subjectAverages
  }

  // Renk kodlaması
  const getRatingColor = (avg: number) => {
    if (avg >= 4.5) return 'bg-green-600 text-white font-bold'
    if (avg >= 4.0) return 'bg-green-500 text-white font-bold'
    if (avg >= 3.5) return 'bg-blue-500 text-white font-bold'
    if (avg >= 3.0) return 'bg-yellow-500 text-white font-bold'
    if (avg >= 2.0) return 'bg-orange-500 text-white font-bold'
    return 'bg-red-500 text-white font-bold'
  }

  const getRatingText = (avg: number) => {
    if (avg >= 4.5) return '⭐ Çok İyi'
    if (avg >= 4.0) return '👍 İyi'
    if (avg >= 3.5) return '✓ Orta+'
    if (avg >= 3.0) return '○ Orta'
    if (avg >= 2.0) return '△ Gelişmeli'
    return '✕ Zayıf'
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filtreler */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 border-2 border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label htmlFor="search" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">
              🔍 Öğrenci Ara
            </label>
            <input
              type="text"
              id="search"
              placeholder="İsim, soyisim veya numara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white font-medium text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">
              📚 Branş Filtrele
            </label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white font-medium text-sm sm:text-base"
            >
              <option value="all">Tüm Branşlar</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">
              🔀 Hızlı Sıralama
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortField)
                setSortDirection('asc')
              }}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white font-medium text-sm sm:text-base"
            >
              <option value="class">Sınıf</option>
              <option value="name">İsim (A-Z)</option>
              <option value="rating-desc">Puan (Yüksek → Düşük)</option>
              <option value="rating-asc">Puan (Düşük → Yüksek)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">
              ⚠️ Filtreler
            </label>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="checkbox"
                  checked={showUnrated}
                  onChange={(e) => setShowUnrated(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-gray-900">
                  Değerlendirilmemiş
                </span>
              </label>
              <label className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-yellow-300 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition">
                <input
                  type="checkbox"
                  checked={showBilsemOnly}
                  onChange={(e) => setShowBilsemOnly(e.target.checked)}
                  className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                  <span>🎓</span>
                  <span>Sadece BİLSEM</span>
                </span>
              </label>
            </div>
          </div>
        </div>
        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
          <span className="font-semibold">{filteredStudents.length}</span> öğrenci bulundu
          {showUnrated && <span className="ml-2 text-orange-600 font-semibold">(Değerlendirilmemiş)</span>}
          {showBilsemOnly && <span className="ml-2 text-yellow-600 font-semibold">(🎓 BİLSEM)</span>}
        </div>
      </div>

      {/* Renk Açıklaması */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 border-2 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">🎨 Renk Kodlaması</h3>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <span className="px-2 sm:px-3 py-1 rounded bg-green-600 text-white font-bold text-xs sm:text-sm">⭐ 4.5-5.0 Çok İyi</span>
          <span className="px-2 sm:px-3 py-1 rounded bg-green-500 text-white font-bold text-xs sm:text-sm">👍 4.0-4.4 İyi</span>
          <span className="px-2 sm:px-3 py-1 rounded bg-blue-500 text-white font-bold text-xs sm:text-sm">✓ 3.5-3.9 Orta+</span>
          <span className="px-2 sm:px-3 py-1 rounded bg-yellow-500 text-white font-bold text-xs sm:text-sm">○ 3.0-3.4 Orta</span>
          <span className="px-2 sm:px-3 py-1 rounded bg-orange-500 text-white font-bold text-xs sm:text-sm">△ 2.0-2.9 Gelişmeli</span>
          <span className="px-2 sm:px-3 py-1 rounded bg-red-500 text-white font-bold text-xs sm:text-sm">✕ 1.0-1.9 Zayıf</span>
        </div>
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                <th 
                  onClick={() => handleSort('name')}
                  className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-white border-r-2 border-blue-800 sticky left-0 bg-blue-600 z-10 cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span>Öğrenci</span>
                    {sortBy === 'name' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('class')}
                  className="px-4 py-4 text-center text-sm font-bold text-white border-r-2 border-blue-800 cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Sınıf</span>
                    {sortBy === 'class' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                {(selectedSubject === 'all' ? subjects : subjects.filter(s => s.id === selectedSubject)).map((subject) => (
                  <th key={subject.id} className="px-4 py-4 text-center text-sm font-bold text-white border-r-2 border-blue-800 min-w-[150px]">
                    {subject.name}
                  </th>
                ))}
                <th className="px-4 py-4 text-center text-sm font-bold text-white border-r-2 border-blue-800 min-w-[150px] bg-yellow-600">
                  🎓 BİLSEM
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-200">
              {filteredStudents.map((student) => {
                const subjectData = calculateStudentData(student)
                const displaySubjects = selectedSubject === 'all' ? subjects : subjects.filter(s => s.id === selectedSubject)
                
                // Genel ortalama hesapla
                let totalSum = 0
                let totalCount = 0
                Object.values(subjectData).forEach((data: any) => {
                  totalSum += data.sum
                  totalCount += data.count
                })
                const generalAvg = totalCount > 0 ? totalSum / totalCount : 0

                return (
                  <tr key={student.id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3 border-r-2 border-gray-200 sticky left-0 bg-white hover:bg-blue-50 z-10">
                      <Link 
                        href={`/dashboard/students/${student.id}`}
                        className="block font-bold text-blue-600 hover:text-blue-800"
                      >
                        {student.first_name} {student.last_name}
                      </Link>
                      {student.student_number && (
                        <span className="text-xs text-gray-500">#{student.student_number}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 font-medium border-r-2 border-gray-200">
                      {student.class?.name || '-'}
                    </td>
                    {displaySubjects.map((subject) => {
                      const data = subjectData[subject.id]
                      
                      if (!data || data.count === 0) {
                        return (
                          <td key={subject.id} className="px-4 py-3 text-center border-r-2 border-gray-200">
                            <span className="text-gray-400 text-sm">-</span>
                          </td>
                        )
                      }
                      const avg = data.sum / data.count
                      
                      return (
                        <td key={subject.id} className="px-4 py-3 text-center border-r-2 border-gray-200 relative">
                          <div className="space-y-1">
                            <div className={`inline-block px-3 py-1 rounded-lg text-sm ${getRatingColor(avg)}`}>
                              {avg.toFixed(1)} ★
                            </div>
                            {data.ratings.map((rating: any, idx: number) => (
                              rating.comment && rating.comment.trim() && (
                                <div key={idx} className="text-xs text-left bg-gray-50 p-2 rounded border border-gray-200 mt-1">
                                  <div className="font-bold text-gray-700 mb-1">
                                    👨‍🏫 {rating.teacher?.full_name || 'Öğretmen'}
                                  </div>
                                  <div className="text-gray-900 italic">
                                    {rating.comment}
                                  </div>
                                </div>
                              )
                            ))}
                          </div>
                        </td>
                      )
                    })}
                    {/* BİLSEM Sütunu */}
                    <td className="px-4 py-3 text-center border-r-2 border-gray-200 bg-yellow-50 relative">
                      {(() => {
                        // BİLSEM değerlendirmelerini bul
                        const bilsemRatings = student.ratings?.filter((r: any) => r.is_bilsem_rating) || []
                        
                        if (bilsemRatings.length === 0) {
                          return <span className="text-gray-400 text-sm">-</span>
                        }

                        // BİLSEM ortalama hesapla
                        const bilsemSum = bilsemRatings.reduce((sum: number, r: any) => sum + r.rating, 0)
                        const bilsemAvg = bilsemSum / bilsemRatings.length

                        // BİLSEM branşlarını topla
                        const bilsemSubjects = Array.from(new Set(bilsemRatings
                          .map((r: any) => r.bilsem_subject)
                          .filter((s: string) => s && s.trim())
                        ))

                        return (
                          <div className="space-y-1">
                            <div className={`inline-block px-3 py-1 rounded-lg text-sm ${getRatingColor(bilsemAvg)}`}>
                              🎓 {bilsemAvg.toFixed(1)} ★
                            </div>
                            {bilsemSubjects.length > 0 && (
                              <div className="text-xs text-yellow-700 font-semibold">
                                {bilsemSubjects.slice(0, 2).join(', ')}
                                {bilsemSubjects.length > 2 && ` +${bilsemSubjects.length - 2}`}
                              </div>
                            )}
                            {bilsemRatings.map((rating: any, idx: number) => (
                              rating.comment && rating.comment.trim() && (
                                <div key={idx} className="text-xs text-left bg-yellow-50 p-2 rounded border border-yellow-300 mt-1">
                                  {rating.bilsem_subject && (
                                    <div className="font-bold text-yellow-800 mb-1">
                                      🎓 {rating.bilsem_subject}
                                    </div>
                                  )}
                                  <div className="font-bold text-gray-700 mb-1">
                                    👨‍🏫 {rating.teacher?.full_name || 'Öğretmen'}
                                  </div>
                                  <div className="text-gray-900 italic">
                                    {rating.comment}
                                  </div>
                                </div>
                              )
                            ))}
                          </div>
                        )
                      })()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border-2 border-gray-200">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Öğrenci bulunamadı</h3>
          <p className="text-gray-600">
            {students.length === 0 
              ? 'Sistemde hiç öğrenci bulunmuyor.' 
              : 'Arama kriterlerinizi değiştirerek tekrar deneyin'
            }
          </p>
          {students.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Toplam öğrenci sayısı: {students.length}
            </p>
          )}
        </div>
      )}

      {/* Debug info */}
      {students.length > 0 && subjects.length === 0 && (
        <div className="bg-yellow-50 rounded-lg shadow-md p-6 text-center border-2 border-yellow-200">
          <div className="text-4xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Branş bulunamadı</h3>
          <p className="text-yellow-700">
            Değerlendirmeleri görüntülemek için önce branş eklemeniz gerekiyor.
          </p>
        </div>
      )}
    </div>
  )
}
