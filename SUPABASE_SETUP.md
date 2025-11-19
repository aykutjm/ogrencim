# Supabase Setup Rehberi

Bu dosya, Supabase projenizi adım adım nasıl kuracağınızı açıklar.

## 1. Supabase Hesabı Oluşturma

1. [https://supabase.com](https://supabase.com) adresine gidin
2. "Start your project" veya "Sign Up" butonuna tıklayın
3. GitHub, GitLab veya e-posta ile kayıt olun

## 2. Yeni Proje Oluşturma

1. Dashboard'da "New Project" butonuna tıklayın
2. Proje bilgilerini girin:
   - **Name**: ogrencim (veya istediğiniz bir isim)
   - **Database Password**: Güçlü bir şifre oluşturun (kaydedin!)
   - **Region**: Size en yakın bölgeyi seçin (örn: Europe West)
   - **Pricing Plan**: Free tier seçebilirsiniz
3. "Create new project" butonuna tıklayın
4. Proje oluşturulurken 1-2 dakika bekleyin

## 3. API Keys Alma

1. Sol menüden **Project Settings** (dişli ikonu) > **API** bölümüne gidin
2. Şu bilgileri kopyalayın:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` ile başlayan uzun key

## 4. Environment Variables Ayarlama

1. Proje klasöründe `.env.example` dosyasını `.env.local` olarak kopyalayın:
   ```powershell
   Copy-Item .env.example .env.local
   ```

2. `.env.local` dosyasını açıp değerleri yapıştırın:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

## 5. Veritabanı Şemasını Oluşturma

### Yöntem 1: SQL Editor (Önerilen)

1. Supabase Dashboard'da sol menüden **SQL Editor** seçin
2. "New Query" butonuna tıklayın
3. `supabase/migrations/001_initial_schema.sql` dosyasını açıp tüm içeriği kopyalayın
4. SQL Editor'e yapıştırıp "Run" butonuna tıklayın
5. Aynı işlemi sırasıyla şu dosyalar için tekrarlayın:
   - `002_rls_policies.sql`
   - `003_seed_data.sql`
   - `004_triggers_functions.sql`

### Yöntem 2: Supabase CLI (İleri Seviye)

1. Supabase CLI'yi yükleyin:
   ```powershell
   npm install -g supabase
   ```

2. Supabase'e login olun:
   ```powershell
   supabase login
   ```

3. Projenize link verin:
   ```powershell
   supabase link --project-ref your-project-id
   ```

4. Migration dosyalarını çalıştırın:
   ```powershell
   supabase db push
   ```

## 6. Authentication Ayarları

1. Supabase Dashboard > **Authentication** > **Settings**
2. **Site URL** ayarı:
   - Development: `http://localhost:3000`
   - Production: Vercel URL'iniz (örn: `https://ogrencim.vercel.app`)

3. **Redirect URLs** ayarı (opsiyonel):
   - `http://localhost:3000/**`
   - Production URL'iniz

4. **Email Templates** (opsiyonel):
   - Confirm signup, Reset password şablonlarını Türkçeleştirebilirsiniz

## 7. Verileri Kontrol Etme

1. Sol menüden **Table Editor** seçin
2. `subjects` ve `classes` tablolarında örnek verilerin geldiğini kontrol edin
3. `teachers`, `parents`, `students` tablolarının oluştuğunu kontrol edin

## 8. İlk Kullanıcıyı Test Etme

1. Uygulamanızı çalıştırın: `npm run dev`
2. `http://localhost:3000` adresini açın
3. "Kayıt Ol" ile bir öğretmen hesabı oluşturun
4. Supabase Dashboard > **Authentication** > **Users** bölümünde kullanıcının göründüğünü kontrol edin
5. **Table Editor** > `teachers` tablosunda kaydın otomatik oluştuğunu görün

## 🔐 Güvenlik Kontrolleri

### RLS (Row Level Security) Aktif mi?

1. Table Editor'de her tablonun yanında "RLS enabled" yazdığını kontrol edin
2. Eğer yazmıyorsa, `002_rls_policies.sql` dosyasını tekrar çalıştırın

### Policies Kontrol

1. Table Editor > herhangi bir tablo > "View Policies" butonuna tıklayın
2. Her tablo için policy'lerin eklendiğini görmelisiniz

## 🚨 Sık Karşılaşılan Sorunlar

### "new row violates row-level security policy"

**Çözüm**: RLS policy'leri eksik. `002_rls_policies.sql` dosyasını tekrar çalıştırın.

### "relation does not exist"

**Çözüm**: Tablolar oluşturulmamış. `001_initial_schema.sql` dosyasını çalıştırın.

### "duplicate key value violates unique constraint"

**Çözüm**: Aynı veriyi iki kez eklemeye çalışıyorsunuz. Tabloyu temizleyip tekrar seed data çalıştırın.

### Trigger çalışmıyor (kullanıcı kaydolunca teachers/parents'a eklenmiyor)

**Çözüm**: `004_triggers_functions.sql` dosyasını çalıştırın. Önceki kullanıcıları silin ve tekrar kayıt olun.

## 📊 Veritabanı Yapısı Özet

```
auth.users (Supabase Auth)
    ↓
├── teachers (öğretmenler)
├── parents (veliler)
│
students (öğrenciler)
    ↓
skill_ratings (yetenek puanları)
    ├── teacher_id → teachers
    ├── student_id → students
    └── subject_id → subjects

classes (sınıflar)
subjects (branşlar)
audit_logs (denetim kayıtları)
```

## 🎯 Sonraki Adımlar

Artık Supabase'iniz hazır! Şimdi:

1. Uygulamayı çalıştırın: `npm run dev`
2. İlk kullanıcıyı oluşturun
3. Öğrenci ekleme ve puanlama özelliklerini test edin

Sorunlarla karşılaşırsanız, README.md dosyasındaki troubleshooting bölümüne bakın veya issue açın.
