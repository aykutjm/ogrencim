'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Institution {
  id: string
  name: string
}

interface User {
  id: string
  email: string
  role: string
  created_at: string
  institution_id?: string
  institution_name?: string
}

interface UserRoleManagerProps {
  institutions: Institution[]
  teacherData: Map<string, { institution_id: string; institution_name: string }>
}

const ROLES = [
  { value: 'superadmin', label: '🔴 Süper Admin', color: 'red' },
  { value: 'admin', label: '🟠 Kurum Yöneticisi', color: 'orange' },
  { value: 'teacher', label: '🔵 Öğretmen', color: 'blue' },
  { value: 'parent', label: '🟢 Veli', color: 'green' },
]

export default function UserRoleManager({ institutions, teacherData }: UserRoleManagerProps) {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Kullanıcı rolünü ${newRole} olarak değiştirmek istediğinize emin misiniz?`)) {
      return
    }

    setUpdatingUserId(userId)

    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        throw new Error('Role update failed')
      }

      // Refresh users
      await fetchUsers()
      router.refresh()
      
      alert('✓ Kullanıcı rolü başarıyla güncellendi!')
    } catch (error) {
      console.error('Role update error:', error)
      alert('✗ Rol güncellenirken bir hata oluştu.')
    } finally {
      setUpdatingUserId(null)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !roleFilter || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: string) => {
    const roleConfig = ROLES.find(r => r.value === role)
    return roleConfig?.color || 'gray'
  }

  const getRoleLabel = (role: string) => {
    const roleConfig = ROLES.find(r => r.value === role)
    return roleConfig?.label || role
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Kullanıcılar yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔍 Ara
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="E-posta ile ara..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎭 Rol Filtrele
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
            >
              <option value="">Tüm Roller</option>
              {ROLES.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
          <div className="text-gray-600 text-sm mb-1">Toplam Kullanıcı</div>
          <div className="text-3xl font-bold text-gray-900">{users.length}</div>
        </div>
        
        {ROLES.map(role => {
          const count = users.filter(u => u.role === role.value).length
          return (
            <div key={role.value} className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="text-gray-600 text-sm mb-1">{role.label}</div>
              <div className="text-3xl font-bold text-gray-900">{count}</div>
            </div>
          )
        })}
      </div>

      {/* User List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">E-posta</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Rol</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Kurum</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Kayıt Tarihi</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">📭</div>
                    Kullanıcı bulunamadı
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const teacherInfo = teacherData.get(user.id)
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{user.email}</div>
                        <div className="text-xs text-gray-500">{user.id.slice(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getRoleColor(user.role)}-100 text-${getRoleColor(user.role)}-700`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {teacherInfo?.institution_name || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(user.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={updatingUserId === user.id}
                          className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {ROLES.map(role => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
