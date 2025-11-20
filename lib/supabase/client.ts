import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Geliştirme ortamında keys eksikse uyarı göster
  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl === 'your-project-url-here' || 
      supabaseKey === 'your-anon-key-here') {
    console.error('⚠️  SUPABASE YAPILANDIRMA HATASI!')
    console.error('📋 .env.local dosyasını düzenleyin ve Supabase keys\'inizi ekleyin')
    console.error('📖 Detaylı kurulum için SUPABASE_SETUP.md dosyasına bakın')
    
    // Geçici placeholder döndür (hata yerine)
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
