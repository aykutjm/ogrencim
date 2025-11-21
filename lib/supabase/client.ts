import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Production fallback: environment variables yoksa hardcoded kullan
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sup-ogrencim.edu-ai.online'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2Mzc1OTg4MCwiZXhwIjo0OTE5NDMzNDgwLCJyb2xlIjoiYW5vbiJ9._0IxRpyumx4lNF7WEMMaV_PT5V3V8S8Od4mXkjRMwJs'

  // Geliştirme ortamında keys eksikse uyarı göster
  if (supabaseUrl === 'your-project-url-here' || 
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
