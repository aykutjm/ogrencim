'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100">
          {/* Logo ve Başlık */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={120} 
                height={120} 
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hoş Geldiniz
            </h1>
            <p className="text-gray-600 text-sm mt-2">Öğrenci Takip Sistemi</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl text-sm font-medium animate-fadeIn">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                📧 E-posta
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white font-medium transition-all hover:border-gray-400"
                placeholder="ornek@okul.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-900 mb-2">
                🔒 Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white font-medium transition-all hover:border-gray-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Giriş yapılıyor...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  🚀 Giriş Yap
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            <div className="flex items-center justify-center gap-1">
              <span>Hesabınız yok mu?</span>
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                Kayıt Ol
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 2025 Öğrenci Takip Sistemi</p>
        </div>
      </div>
    </main>
  )
}
