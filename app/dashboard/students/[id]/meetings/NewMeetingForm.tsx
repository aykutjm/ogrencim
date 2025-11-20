'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

interface NewMeetingFormProps {
  studentId: string
  teacherId: string
  studentName: string
}

export default function NewMeetingForm({ studentId, teacherId, studentName }: NewMeetingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [formData, setFormData] = useState({
    meeting_date: new Date().toISOString().split('T')[0],
    meeting_type: 'in-person' as 'in-person' | 'phone' | 'online',
    subject: '',
    participants: '',
    notes: '',
    follow_up_required: false,
    follow_up_date: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from('parent_meetings')
        .insert({
          student_id: studentId,
          teacher_id: teacherId,
          ...formData,
          follow_up_date: formData.follow_up_required && formData.follow_up_date ? formData.follow_up_date : null
        })

      if (insertError) throw insertError

      router.push(`/dashboard/students/${studentId}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <p className="text-sm font-bold text-blue-900">
          📚 Öğrenci: <span className="text-blue-700">{studentName}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-sm font-bold text-red-900">❌ {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            📅 Görüşme Tarihi *
          </label>
          <input
            type="date"
            required
            value={formData.meeting_date}
            onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            📞 Görüşme Türü *
          </label>
          <select
            required
            value={formData.meeting_type}
            onChange={(e) => setFormData({ ...formData, meeting_type: e.target.value as any })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white font-medium"
          >
            <option value="in-person">👥 Yüz Yüze</option>
            <option value="phone">📞 Telefon</option>
            <option value="online">💻 Online</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          📝 Görüşme Konusu *
        </label>
        <input
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Örn: Akademik başarı, davranış, devamsızlık..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white font-medium"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          👥 Katılımcılar
        </label>
        <input
          type="text"
          value={formData.participants}
          onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
          placeholder="Örn: Anne, Baba, İkisi birlikte..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white font-medium"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          💬 Görüşme Notları
        </label>
        <textarea
          rows={6}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Görüşme detayları, alınan kararlar, yapılacaklar..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white font-medium resize-none"
        />
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.follow_up_required}
            onChange={(e) => setFormData({ ...formData, follow_up_required: e.target.checked })}
            className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 mt-0.5"
          />
          <div className="flex-1">
            <span className="text-sm font-bold text-gray-900">⚠️ Takip görüşmesi gerekli</span>
            <p className="text-xs text-gray-600 mt-1">Bu görüşmenin tekrar yapılması gerekiyorsa işaretleyin</p>
          </div>
        </label>

        {formData.follow_up_required && (
          <div className="mt-4">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              📅 Takip Tarihi
            </label>
            <input
              type="date"
              value={formData.follow_up_date}
              onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900 bg-white font-medium"
            />
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-bold"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Kaydediliyor...' : '✅ Görüşmeyi Kaydet'}
        </button>
      </div>
    </form>
  )
}
