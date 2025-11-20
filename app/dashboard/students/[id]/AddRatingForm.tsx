'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import StarRating from '@/components/StarRating'
import type { Subject } from '@/lib/types'

interface AddRatingFormProps {
  studentId: string
  teacherId: string
  subjects: Subject[]
}

export default function AddRatingForm({ studentId, teacherId, subjects }: AddRatingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    subject_id: '',
    rating: 3,
    comment: '',
    is_bilsem_rating: false,
    bilsem_subject: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      
      const { error: insertError } = await supabase
        .from('skill_ratings')
        .insert({
          student_id: studentId,
          teacher_id: teacherId,
          subject_id: formData.subject_id,
          rating: formData.rating,
          comment: formData.comment?.trim() || null,
          visibility: true,
          is_bilsem_rating: formData.is_bilsem_rating,
          bilsem_subject: formData.is_bilsem_rating ? (formData.bilsem_subject?.trim() || null) : null,
        })

      if (insertError) throw insertError

      setSuccess(true)
      setFormData({
        subject_id: '',
        rating: 3,
        comment: '',
        is_bilsem_rating: false,
        bilsem_subject: '',
      })
      
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          Değerlendirme başarıyla eklendi!
        </div>
      )}

      <div>
        <label htmlFor="subject_id" className="block text-sm font-bold text-gray-900 mb-2">
          Branş *
        </label>
        <select
          id="subject_id"
          required
          value={formData.subject_id}
          onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 font-medium"
        >
          <option value="">Branş seçin</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Yetenek Puanı *
        </label>
        <StarRating
          value={formData.rating}
          onChange={(rating) => setFormData({ ...formData, rating })}
          size="lg"
        />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-bold text-gray-900 mb-2">
          Açıklama
        </label>
        <textarea
          id="comment"
          rows={4}
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-white text-gray-900 font-medium"
          placeholder="Bu branştaki gözlemlerinizi yazın..."
        />
      </div>

      {/* BİLSEM Değerlendirmesi */}
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-5 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_bilsem_rating}
            onChange={(e) => setFormData({ ...formData, is_bilsem_rating: e.target.checked, bilsem_subject: e.target.checked ? formData.bilsem_subject : '' })}
            className="w-6 h-6 mt-1 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
          />
          <div className="flex-1">
            <span className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>🎓</span>
              <span>BİLSEM Değerlendirmesi</span>
            </span>
            <p className="text-sm text-gray-700 mt-1">
              Bu değerlendirme BİLSEM (Bilim ve Sanat Merkezi) performansı içindir
            </p>
          </div>
        </label>

        {formData.is_bilsem_rating && (
          <div className="pl-9 animate-fadeIn">
            <label htmlFor="bilsem_subject" className="block text-sm font-bold text-gray-900 mb-2">
              BİLSEM Branşı/Alanı *
            </label>
            <input
              id="bilsem_subject"
              type="text"
              required={formData.is_bilsem_rating}
              value={formData.bilsem_subject}
              onChange={(e) => setFormData({ ...formData, bilsem_subject: e.target.value })}
              className="w-full px-4 py-3 border-2 border-yellow-400 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none bg-white text-gray-900 font-medium"
              placeholder="Örn: Matematik, Fen Bilimleri, Görsel Sanatlar..."
            />
            <p className="text-xs text-gray-600 mt-2">
              💡 BİLSEM&apos;de çalıştığı özel branşı veya alanı belirtin
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-md"
      >
        {loading ? '⏳ Kaydediliyor...' : '✅ Değerlendirme Ekle'}
      </button>
    </form>
  )
}
