import Link from 'next/link'
import Image from 'next/image'

interface DashboardNavProps {
  showBackButton?: boolean
}

export default function DashboardNav({ showBackButton = false }: DashboardNavProps) {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b-4 border-gradient-to-r from-blue-600 to-purple-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20 py-2">
          <Link href="/dashboard" className="flex items-center gap-1.5 sm:gap-2 md:gap-3 group flex-shrink-0">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={56} 
                height={56} 
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 bg-clip-text text-transparent truncate">
                Öğrencim
              </span>
            </div>
          </Link>
          
          <div className="hidden xl:flex items-center flex-1 justify-center px-4">
            <div className="text-center max-w-2xl">
              <p className="text-xs lg:text-sm font-semibold text-gray-700 italic leading-snug">
                &quot;Öğretmenler, yeni nesil sizin eseriniz olacaktır&quot;
              </p>
              <p className="text-xs text-gray-600 font-medium mt-0.5">
                Mustafa Kemal Atatürk
              </p>
            </div>
          </div>

          {showBackButton && (
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md sm:rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-xs shadow-md hover:shadow-lg"
              >
                <span>←</span>
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
