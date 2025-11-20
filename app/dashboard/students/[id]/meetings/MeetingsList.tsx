'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

interface ParentMeeting {
  id: string
  meeting_date: string
  meeting_type: string
  subject: string
  notes?: string
  participants?: string
  follow_up_required: boolean
  follow_up_date?: string
  teacher?: { full_name: string }
}

interface MeetingsListProps {
  meetings: ParentMeeting[]
  studentId: string
}

export default function MeetingsList({ meetings, studentId }: MeetingsListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Bu görüşme kaydını silmek istediğinizden emin misiniz?')) return

    setDeletingId(id)
    try {
      const { error } = await supabase
        .from('parent_meetings')
        .delete()
        .eq('id', id)

      if (error) throw error

      router.refresh()
    } catch (err) {
      alert('Silme işlemi başarısız oldu')
    } finally {
      setDeletingId(null)
    }
  }

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'in-person': return '👥'
      case 'phone': return '📞'
      case 'online': return '💻'
      default: return '📝'
    }
  }

  const getMeetingTypeText = (type: string) => {
    switch (type) {
      case 'in-person': return 'Yüz Yüze'
      case 'phone': return 'Telefon'
      case 'online': return 'Online'
      default: return type
    }
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg font-medium">📭 Henüz görüşme kaydı yok</p>
        <p className="text-sm mt-2">Yeni görüşme eklemek için yukarıdaki butonu kullanın</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
        >
          <div
            className="p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => setExpandedId(expandedId === meeting.id ? null : meeting.id)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getMeetingTypeIcon(meeting.meeting_type)}</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{meeting.subject}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        📅 {new Date(meeting.meeting_date).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span>•</span>
                      <span>{getMeetingTypeText(meeting.meeting_type)}</span>
                      {meeting.teacher && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-blue-700">👨‍🏫 {meeting.teacher.full_name}</span>
                        </>
                      )}
                      {meeting.participants && (
                        <>
                          <span>•</span>
                          <span>👥 {meeting.participants}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {meeting.follow_up_required && (
                  <div className="mt-2 inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                    <span>⚠️</span>
                    <span>Takip Gerekli</span>
                    {meeting.follow_up_date && (
                      <span>• {new Date(meeting.follow_up_date).toLocaleDateString('tr-TR')}</span>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(meeting.id)
                }}
                disabled={deletingId === meeting.id}
                className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition font-bold text-sm disabled:opacity-50"
              >
                {deletingId === meeting.id ? '⏳' : '🗑️'}
              </button>
            </div>
          </div>

          {expandedId === meeting.id && meeting.notes && (
            <div className="border-t-2 border-gray-200 bg-gray-50 p-4">
              <h4 className="font-bold text-sm text-gray-700 mb-2">💬 Görüşme Notları:</h4>
              <p className="text-gray-900 whitespace-pre-wrap text-sm leading-relaxed">
                {meeting.notes}
              </p>
              {meeting.teacher && (
                <p className="text-xs text-gray-500 mt-3">
                  👨‍🏫 Görüşmeyi kaydeden: {meeting.teacher.full_name}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
