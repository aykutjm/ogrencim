'use client'

import { useState } from 'react'
import StarRating from './StarRating'
import { createClient } from '@/lib/supabase/client'

interface RatingCardProps {
  rating: {
    id: string
    rating: number
    comment?: string | null
    created_at: string
    teacher?: {
      full_name: string
    } | null
    is_bilsem_rating?: boolean
    bilsem_subject?: string | null
  }
  onDelete?: () => void
  onUpdate?: () => void
}

export default function RatingCard({ rating, onDelete, onUpdate }: RatingCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editRating, setEditRating] = useState(rating.rating)
  const [editComment, setEditComment] = useState(rating.comment || '')
  const [loading, setLoading] = useState(false)

  const hasComment = rating.comment && rating.comment.trim()

  const handleDelete = async () => {
    if (!confirm('Bu değerlendirmeyi silmek istediğinizden emin misiniz?')) {
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('skill_ratings')
        .delete()
        .eq('id', rating.id)

      if (error) throw error

      alert('Değerlendirme silindi')
      if (onDelete) onDelete()
    } catch (error: any) {
      alert('Hata: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('skill_ratings')
        .update({
          rating: editRating,
          comment: editComment || null
        })
        .eq('id', rating.id)

      if (error) throw error

      alert('Değerlendirme güncellendi')
      setIsEditing(false)
      if (onUpdate) onUpdate()
    } catch (error: any) {
      alert('Hata: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (isEditing) {
    return (
      <div className="rounded-lg p-5 border-2 border-blue-400 bg-blue-50 shadow-sm">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Puan</label>
            <StarRating 
              value={editRating} 
              onChange={setEditRating}
              size="lg"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Açıklama</label>
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              rows={3}
              placeholder="Değerlendirme açıklaması..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold text-sm"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 font-bold text-sm"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg p-5 border-2 shadow-sm hover:shadow-md transition-shadow ${
      rating.is_bilsem_rating 
        ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-400' 
        : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
    }`}>
      {rating.is_bilsem_rating && (
        <div className="mb-3 inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold text-xs">
          <span>🎓</span>
          <span>BİLSEM</span>
          {rating.bilsem_subject && <span>• {rating.bilsem_subject}</span>}
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-base font-bold text-gray-900">
            👨‍🏫 {rating.teacher?.full_name || 'Öğretmen'}
          </p>
          <p className="text-sm text-gray-600 font-medium">
            📅 {new Date(rating.created_at).toLocaleDateString('tr-TR')}
          </p>
        </div>
        <StarRating value={rating.rating} readonly size="sm" />
      </div>
      
      {hasComment && (
        <div className="mt-3 bg-white rounded-lg p-3 border-2 border-gray-300">
          <p className="text-sm font-semibold text-gray-700 mb-1">💬 Açıklama:</p>
          <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
            {rating.comment}
          </p>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 font-bold text-xs transition-colors"
        >
          ✏️ Düzenle
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 disabled:opacity-50 font-bold text-xs transition-colors"
        >
          {loading ? '...' : '🗑️ Sil'}
        </button>
      </div>
    </div>
  )
}
