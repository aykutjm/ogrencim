'use client'

import { useState } from 'react'
import AddRatingForm from './AddRatingForm'

interface AddRatingFormWrapperProps {
  studentId: string
  teacherId: string
  subjects: any[]
}

export default function AddRatingFormWrapper({ studentId, teacherId, subjects }: AddRatingFormWrapperProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white/90 text-blue-600 px-3 py-2 rounded-lg hover:bg-white transition font-bold text-xs flex items-center gap-1 whitespace-nowrap backdrop-blur-sm border border-white/50"
          title="Yeni Değerlendirme Ekle"
        >
          <span>➕</span>
          <span className="hidden sm:inline">Değerlendir</span>
        </button>
      ) : (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>➕</span>
                <span>Yeni Değerlendirme</span>
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
                title="Kapat"
              >
                ✕
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <AddRatingForm
                studentId={studentId}
                teacherId={teacherId}
                subjects={subjects}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
