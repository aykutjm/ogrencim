'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

interface StudentRow {
  fullName: string
  className: string
  motherName: string
  motherPhone: string
  fatherName: string
  fatherPhone: string
}

interface Class {
  id: string
  name: string
}

export default function BulkStudentUpload() {
  const router = useRouter()
  const [students, setStudents] = useState<StudentRow[]>([
    { fullName: '', className: '', motherName: '', motherPhone: '', fatherName: '', fatherPhone: '' }
  ])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchClasses = async () => {
    const { data } = await supabase
      .from('classes')
      .select('id, name')
      .order('name')
    
    if (data) setClasses(data)
  }

  useEffect(() => {
    fetchClasses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addRow = () => {
    setStudents([...students, { fullName: '', className: '', motherName: '', motherPhone: '', fatherName: '', fatherPhone: '' }])
  }

  const removeRow = (index: number) => {
    setStudents(students.filter((_, i) => i !== index))
  }

  const updateStudent = (index: number, field: keyof StudentRow, value: string) => {
    const updated = [...students]
    updated[index][field] = value
    setStudents(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/students/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students })
      })

      const data = await response.json()

      if (response.ok) {
        let msg = `✅ ${data.count} öğrenci başarıyla eklendi!`
        if (data.totalParents) {
          msg += `\n👨‍👩‍👧 ${data.totalParents} veli kaydı oluşturuldu.`
        }
        if (data.errors && data.errors.length > 0) {
          msg += `\n⚠️ ${data.errors.length} hata: ${data.errors.join(', ')}`
        }
        setMessage(msg)
        setTimeout(() => router.push('/dashboard/students'), 3000)
      } else {
        setMessage(`❌ Hata: ${data.error}${data.details ? '\n' + data.details.join('\n') : ''}`)
      }
    } catch (error) {
      setMessage('❌ Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      
      // Skip header row
      const dataLines = lines.slice(1)
      
      const parsedStudents: StudentRow[] = dataLines.map(line => {
        const [fullName, className, motherName, motherPhone, fatherName, fatherPhone] = line.split(',').map(s => s.trim())
        return { fullName, className, motherName, motherPhone, fatherName, fatherPhone }
      })

      setStudents(parsedStudents)
      setMessage(`📄 ${parsedStudents.length} öğrenci CSV'den yüklendi`)
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Toplu Öğrenci Ekle</h1>
            <a
              href="/dashboard/students"
              className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              ← Geri
            </a>
          </div>
          <p className="text-gray-700">Aşağıdaki tabloya öğrenci bilgilerini girin veya CSV dosyası yükleyin</p>
        </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg whitespace-pre-line ${message.startsWith('✅') ? 'bg-green-100 text-green-800' : message.startsWith('📄') ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-gray-200">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
              📄 CSV ile Toplu Yükleme
            </h2>
            <p className="text-sm text-gray-700 mb-3 font-medium">CSV dosyanız şu formatta olmalıdır:</p>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono border-2 border-gray-300 text-gray-900 whitespace-pre-wrap">Öğrenci Adı Soyadı,Sınıf,Anne Adı Soyadı,Anne Telefon,Baba Adı Soyadı,Baba Telefon
Ahmet Yılmaz,1-A,Ayşe Yılmaz,05551234567,Mehmet Yılmaz,05559876543</pre>
            <div className="flex gap-3 mt-4">
              <a 
                href="/ornek-ogrenci-listesi.csv" 
                download
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium text-sm"
              >
                ⬇️ Örnek Dosya İndir
              </a>
              <p className="text-xs text-blue-700 font-semibold bg-blue-50 p-2 rounded flex items-center">💡 İpucu: Örnek dosyayı indirip düzenleyin ve yükleyin</p>
            </div>
          </div>
          <label className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition flex items-center gap-2 font-medium shadow-md whitespace-nowrap">
            📄 CSV Yükle
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-bold text-white w-12">#</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-white">Öğrenci Adı Soyadı *</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-white">Sınıf *</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-white">Anne Adı Soyadı</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-white">Anne Telefon</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-white">Baba Adı Soyadı</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-white">Baba Telefon</th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-white w-20">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {students.map((student, index) => (
                  <tr key={index} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-700 font-semibold">{index + 1}</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={student.fullName}
                        onChange={(e) => updateStudent(index, 'fullName', e.target.value)}
                        required
                        placeholder="Ahmet Yılmaz"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={student.className}
                        onChange={(e) => updateStudent(index, 'className', e.target.value)}
                        required
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
                      >
                        <option value="">Sınıf seçin...</option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.name}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={student.motherName}
                        onChange={(e) => updateStudent(index, 'motherName', e.target.value)}
                        placeholder="Ayşe Yılmaz"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={student.motherPhone}
                        onChange={(e) => updateStudent(index, 'motherPhone', e.target.value)}
                        placeholder="05551234567"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={student.fatherName}
                        onChange={(e) => updateStudent(index, 'fatherName', e.target.value)}
                        placeholder="Mehmet Yılmaz"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={student.fatherPhone}
                        onChange={(e) => updateStudent(index, 'fatherPhone', e.target.value)}
                        placeholder="05559876543"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        disabled={students.length === 1}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-300 disabled:cursor-not-allowed text-lg transition"
                        title="Satırı Sil"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addRow}
            className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition flex items-center gap-2 shadow-md"
          >
            ➕ Satır Ekle
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-bold hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition shadow-lg text-lg"
          >
            {loading ? '⏳ Kaydediliyor...' : `✅ ${students.length} Öğrenciyi Kaydet`}
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}
