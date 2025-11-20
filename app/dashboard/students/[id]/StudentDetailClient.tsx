'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RatingCard from '@/components/RatingCard'
import AddRatingFormWrapper from './AddRatingFormWrapper'
import MeetingsList from './meetings/MeetingsList'

interface Props {
  student: any
  ratings: any[]
  subjects: any[]
  currentTeacher: any
  meetings: any[]
  userRole: string
  studentId: string
  siblings: any[]
}

export default function StudentDetailClient({
  student,
  ratings: initialRatings,
  subjects,
  currentTeacher,
  meetings,
  userRole,
  studentId,
  siblings
}: Props) {
  const router = useRouter()
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date')
  const [ratings, setRatings] = useState(initialRatings)

  // Sıralama
  const sortedRatings = [...ratings].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    } else {
      return b.score - a.score
    }
  })

  // Branş bazlı gruplama
  const ratingsBySubject = sortedRatings.reduce((acc: any, rating: any) => {
    const subjectName = rating.subject?.name || 'Diğer'
    if (!acc[subjectName]) {
      acc[subjectName] = []
    }
    acc[subjectName].push(rating)
    return acc
  }, {})

  const handleRatingChange = () => {
    // Sayfayı yenile
    router.refresh()
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('📋 Telefon numarası kopyalandı!')
    } catch (err) {
      console.error('Kopyalama hatası:', err)
    }
  }

  return (
    <>
      {/* Öğrenci Bilgileri - Kompakt Tasarım */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-xl shadow-lg overflow-hidden mb-4">
        <div className="p-3 sm:p-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl sm:text-2xl border-2 border-white/30 flex-shrink-0">
                👤
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold truncate">
                  {student.first_name} {student.last_name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-xs mt-1">
                  {student.student_number && (
                    <span className="bg-white/20 px-2 py-0.5 rounded">No: {student.student_number}</span>
                  )}
                  {(student.class as any)?.name && (
                    <span className="bg-white/20 px-2 py-0.5 rounded">{(student.class as any).name}</span>
                  )}
                  {(student as any).is_bilsem && (
                    <span className="bg-yellow-400 text-gray-900 px-2 py-0.5 rounded font-bold">🎓 BİLSEM</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 flex-shrink-0">
              {userRole === 'teacher' && currentTeacher && (
                <AddRatingFormWrapper
                  studentId={studentId}
                  teacherId={currentTeacher.id}
                  subjects={subjects}
                />
              )}
              <Link
                href={`/dashboard/students/${studentId}/edit`}
                className="bg-white text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition font-bold text-xs flex items-center gap-1 whitespace-nowrap"
              >
                <span>✏️</span>
                <span className="hidden sm:inline">Düzenle</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Veli Bilgileri */}
      {student.parent && (
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 rounded-lg sm:rounded-xl shadow-lg border-2 border-purple-300 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg md:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-2xl md:text-3xl">👨‍👩‍👧‍👦</span>
            <span>Veli Bilgileri</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {student.parent.mother_name && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                <div className="text-white/70 text-xs font-semibold mb-1 uppercase tracking-wide">Anne</div>
                <div className="text-white text-sm sm:text-base md:text-lg font-bold mb-1">{student.parent.mother_name}</div>
                {student.parent.mother_phone && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="text-white/80 text-xs sm:text-sm flex-1">{student.parent.mother_phone}</div>
                    <button
                      onClick={() => copyToClipboard(student.parent.mother_phone)}
                      className="bg-white/20 hover:bg-white/30 p-1.5 sm:p-2 rounded transition-all"
                      title="Telefonu kopyala"
                    >
                      <span className="text-white text-xs">📋</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            {student.parent.father_name && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                <div className="text-white/70 text-xs font-semibold mb-1 uppercase tracking-wide">Baba</div>
                <div className="text-white text-sm sm:text-base md:text-lg font-bold mb-1">{student.parent.father_name}</div>
                {student.parent.father_phone && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="text-white/80 text-xs sm:text-sm flex-1">{student.parent.father_phone}</div>
                    <button
                      onClick={() => copyToClipboard(student.parent.father_phone)}
                      className="bg-white/20 hover:bg-white/30 p-1.5 sm:p-2 rounded transition-all"
                      title="Telefonu kopyala"
                    >
                      <span className="text-white text-xs">📋</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            {!student.parent.mother_name && !student.parent.father_name && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 col-span-2">
                <div className="text-white/70 text-xs font-semibold mb-1 uppercase tracking-wide">Veli</div>
                <div className="text-white text-sm sm:text-base md:text-lg font-bold mb-1">{student.parent.full_name}</div>
                {student.parent.phone && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="text-white/80 text-xs sm:text-sm flex-1">{student.parent.phone}</div>
                    <button
                      onClick={() => copyToClipboard(student.parent.phone)}
                      className="bg-white/20 hover:bg-white/30 p-1.5 sm:p-2 rounded transition-all"
                      title="Telefonu kopyala"
                    >
                      <span className="text-white text-xs">📋</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Kardeş Bilgileri */}
      {siblings && siblings.length > 0 && (
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-teal-700 rounded-lg sm:rounded-xl shadow-lg border-2 border-green-300 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg md:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-2xl md:text-3xl">👨‍👩‍👧‍👦</span>
            <span>{siblings.length === 1 ? 'Kardeşi' : 'Kardeşleri'}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {siblings.map((sibling: any) => (
              <Link
                key={sibling.id}
                href={`/dashboard/students/${sibling.id}`}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <div className="text-white text-lg font-bold">
                  {sibling.first_name} {sibling.last_name}
                </div>
                <div className="text-white/80 text-sm mt-1">
                  {sibling.class?.name || 'Sınıf bilgisi yok'}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Değerlendirmeler - Modern Tasarım */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-3xl">📊</span>
            <span>Tüm Değerlendirmeler</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sıralama:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Tarihe Göre</option>
              <option value="score">Puana Göre</option>
            </select>
          </div>
        </div>

        {ratings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Henüz değerlendirme eklenmemiş</p>
          </div>
        )}

        {ratings.length > 0 && (
          <div className="space-y-6">
            {Object.entries(ratingsBySubject).map(([subjectName, subjectRatings]: [string, any]) => (
              <div key={subjectName} className="border-b-2 border-gray-300 pb-6 last:border-0">
                <h3 className="font-bold text-xl text-gray-900 mb-4 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-600">
                  📚 {subjectName}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjectRatings.map((rating: any) => (
                    <RatingCard 
                      key={rating.id} 
                      rating={rating}
                      onDelete={handleRatingChange}
                      onUpdate={handleRatingChange}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Veli Görüşme Raporları */}
      {userRole === 'teacher' && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-3xl">👥</span>
              <span>Veli Görüşme Raporları</span>
            </h2>
            <Link
              href={`/dashboard/students/${studentId}/meetings/new`}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-bold text-sm flex items-center gap-2"
            >
              <span>➕</span>
              <span>Yeni Görüşme Ekle</span>
            </Link>
          </div>
          <MeetingsList meetings={meetings} studentId={studentId} />
        </div>
      )}
    </>
  )
}
