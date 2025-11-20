import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-5xl w-full space-y-8">
        {/* Ana İçerik */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-6">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={150} 
              height={150} 
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Öğrencim
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light">
            Öğretmenler arası bilgi paylaşımı ve öğrenci yetenek takip sistemi
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          <Link
            href="/auth/login"
            className="group w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all text-center font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-1"
          >
            <span className="flex items-center justify-center gap-2">
              🚀 Giriş Yap
            </span>
          </Link>
          <Link
            href="/auth/signup"
            className="group w-full sm:w-auto px-10 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all text-center font-bold text-lg transform hover:-translate-y-1"
          >
            <span className="flex items-center justify-center gap-2">
              ✨ Kayıt Ol
            </span>
          </Link>
        </div>

        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="group p-8 bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/20 hover:bg-white/15 transition-all hover:border-blue-400/50 transform hover:-translate-y-2">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-bold text-xl mb-3 text-white">Yetenek Takibi</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Öğrencilerin farklı branşlardaki yeteneklerini 1-5 arası puanlayın ve takip edin
            </p>
          </div>
          <div className="group p-8 bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/20 hover:bg-white/15 transition-all hover:border-purple-400/50 transform hover:-translate-y-2">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="font-bold text-xl mb-3 text-white">İşbirliği</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Öğretmenler arası bilgi paylaşımı yaparak öğrenciyi daha iyi tanıyın
            </p>
          </div>
          <div className="group p-8 bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/20 hover:bg-white/15 transition-all hover:border-pink-400/50 transform hover:-translate-y-2">
            <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="font-bold text-xl mb-3 text-white">Veli Erişimi</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Veliler çocuklarının gelişimini kolayca takip edebilir
            </p>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="pt-12 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Öğrenci Takip Sistemi • Modern Eğitim Teknolojisi
          </p>
        </div>
      </div>
    </main>
  )
}
