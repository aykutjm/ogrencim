'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Institution } from '@/lib/types'

interface InstitutionEditFormProps {
  institution: Institution
}

export default function InstitutionEditForm({ institution }: InstitutionEditFormProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [formData, setFormData] = useState({
    name: institution.name,
    address: institution.address || '',
    phone: institution.phone || '',
    email: institution.email || '',
    is_active: institution.is_active,
  })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(true)

    try {
      const response = await fetch(`/api/institutions/${institution.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Güncelleme başarısız')
      }

      alert('✓ Kurum başarıyla güncellendi!')
      router.refresh()
    } catch (error) {
      console.error('Update error:', error)
      alert('✗ Kurum güncellenirken bir hata oluştu.')
    } finally {
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/institutions/${institution.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Silme başarısız')
      }

      alert('✓ Kurum başarıyla silindi!')
      router.push('/dashboard/superadmin/institutions')
    } catch (error) {
      console.error('Delete error:', error)
      alert('✗ Kurum silinirken bir hata oluştu.')
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Kurum Bilgileri</h2>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Kurum Adı *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition text-gray-900"
            placeholder="Kurum adını girin"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            E-posta
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition text-gray-900"
            placeholder="ornek@kurum.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Telefon
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition text-gray-900"
            placeholder="+90 (___) ___ __ __"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Adres
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none text-gray-900"
            placeholder="Kurum adresini girin"
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-900 cursor-pointer">
            Kurum aktif
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
          <button
            type="submit"
            disabled={isEditing}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? '⏳ Güncelleniyor...' : '💾 Değişiklikleri Kaydet'}
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg border-2 border-red-200 transition"
          >
            🗑️ Sil
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Kurumu Silmek İstediğinize Emin misiniz?
              </h3>
              <p className="text-gray-600">
                <strong>{institution.name}</strong> kurumu ve tüm ilgili verileri kalıcı olarak silinecek. Bu işlem geri alınamaz!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? '⏳ Siliniyor...' : '✓ Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
