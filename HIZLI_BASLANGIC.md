# ⚡ Hızlı Başlangıç - 10 Dakikada Çalıştır

Bu rehber, uygulamayı **10 dakikada** çalışır hale getirmek için gereken adımları içerir.

## 🎯 Önkoşullar

- ✅ Node.js 18+ yüklü
- ✅ Bir web tarayıcısı
- ✅ Ücretsiz Supabase hesabı

---

## 📝 Adım 1: Supabase Projesi Oluştur (3 dakika)

### 1.1 Hesap Oluştur
1. [https://supabase.com](https://supabase.com) adresine git
2. "Start your project" veya "Sign Up" butonuna tıkla
3. GitHub ile giriş yap (en hızlısı) veya e-posta ile kayıt ol

### 1.2 Yeni Proje Oluştur
1. Dashboard'da "New Project" butonuna tıkla
2. Bilgileri doldur:
   ```
   Name: ogrencim
   Database Password: [güçlü bir şifre - KAYDET!]
   Region: Europe West (veya size en yakın)
   Plan: Free
   ```
3. "Create new project" butonuna tıkla
4. **1-2 dakika bekle** (proje oluşturuluyor...)

### 1.3 API Keys'leri Al
1. Sol menüden ⚙️ **Project Settings** > **API** bölümüne git
2. İki değeri kopyala:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon public**: `eyJhbGc...` ile başlayan uzun key

---

## 🔧 Adım 2: Proje Yapılandırması (2 dakika)

### 2.1 Environment Variables
1. Proje klasöründe `.env.local` dosyasını aç (VS Code'da zaten oluşturuldu)
2. İçeriği düzenle:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```
3. **Kopyaladığınız değerleri yapıştırın**
4. **KAYDET!** (Ctrl+S)

### 2.2 Development Server'ı Yeniden Başlat
```powershell
# Terminal'de Ctrl+C ile durdurun
# Sonra tekrar başlatın:
npm run dev
```

---

## 🗄️ Adım 3: Veritabanı Kurulumu (4 dakika)

### 3.1 SQL Editor'ü Aç
1. Supabase Dashboard'a dön
2. Sol menüden 🛠️ **SQL Editor** seçin
3. "New query" butonuna tıklayın

### 3.2 Migration Dosyalarını Çalıştır

**Sırasıyla** şu dosyaları çalıştırın:

#### ① Tabloları Oluştur
1. VS Code'da `supabase/migrations/001_initial_schema.sql` dosyasını aç
2. **Tüm içeriği kopyala** (Ctrl+A, Ctrl+C)
3. Supabase SQL Editor'e **yapıştır** (Ctrl+V)
4. **RUN** butonuna tıkla
5. ✅ Success yazısını bekle

#### ② Güvenlik Politikaları (RLS)
1. VS Code'da `supabase/migrations/002_rls_policies.sql` dosyasını aç
2. Tüm içeriği kopyala → SQL Editor'e yapıştır → **RUN**
3. ✅ Success

#### ③ Örnek Veriler
1. VS Code'da `supabase/migrations/003_seed_data.sql` dosyasını aç
2. Tüm içeriği kopyala → SQL Editor'e yapıştır → **RUN**
3. ✅ Success

#### ④ Trigger ve Fonksiyonlar
1. VS Code'da `supabase/migrations/004_triggers_functions.sql` dosyasını aç
2. Tüm içeriği kopyala → SQL Editor'e yapıştır → **RUN**
3. ✅ Success

### 3.3 Kontrol Et
1. Sol menüden 📊 **Table Editor** seçin
2. Şu tabloları görmelisiniz:
   - students
   - teachers
   - parents
   - classes ✅ (1-A, 2-B gibi 8 sınıf olmalı)
   - subjects ✅ (Matematik, Müzik gibi 10 branş olmalı)
   - skill_ratings
   - audit_logs

---

## 🎉 Adım 4: İlk Testi Yap (1 dakika)

### 4.1 Uygulamayı Aç
```
http://localhost:3000
```

### 4.2 Hesap Oluştur
1. "Kayıt Ol" butonuna tıkla
2. Bilgileri doldur:
   ```
   Ad Soyad: Ahmet Yılmaz
   E-posta: ahmet@okul.com
   Şifre: 123456 (veya daha güçlü)
   Rol: Öğretmen
   ```
3. "Kayıt Ol" butonuna tıkla
4. ✅ Başarılı mesajı görürsün
5. "Giriş Yap" sayfasına yönlendirileceksin

### 4.3 Giriş Yap
1. E-posta ve şifre ile giriş yap
2. ✅ Dashboard'a yönlendirileceksin

### 4.4 İlk Öğrenciyi Ekle
1. **Dashboard** > **"Öğrenciler"** kartına tıkla
2. Sağ üstte **"+ Yeni Öğrenci"** butonuna tıkla
3. Bilgileri doldur:
   ```
   Ad: Ayşe
   Soyad: Demir
   Numara: 123 (opsiyonel)
   Doğum Tarihi: (opsiyonel)
   ```
4. **"Kaydet"** butonuna tıkla
5. ✅ Öğrenci listesinde görünecek

### 4.5 İlk Puanı Ver
1. Ayşe Demir'in yanındaki **"Detay →"** linkine tıkla
2. **"Yeni Değerlendirme Ekle"** formunu doldur:
   ```
   Branş: Matematik
   Yetenek Puanı: ⭐⭐⭐⭐⭐ (5 yıldız)
   Açıklama: "Problem çözmede çok başarılı"
   ```
3. **"Değerlendirme Ekle"** butonuna tıkla
4. ✅ Değerlendirme hemen altında görünecek

---

## ✅ Başarılı! Ne Yapabilirsiniz?

### Öğretmen Olarak:
- ✅ Öğrenci ekle/görüntüle
- ✅ Branş bazlı 1-5 yıldız puan ver
- ✅ Yorum/açıklama ekle
- ✅ Diğer öğretmenlerin notlarını gör
- ✅ Sınıf bazlı öğrenci listesi gör
- ✅ Öne çıkan yetenekleri tespit et

### Veli Hesabı Test Etmek İçin:
1. Çıkış yap
2. Yeni bir hesap oluştur (Rol: **Veli**)
3. Giriş yap
4. **Dashboard** > **"Çocuklarım"** bölümüne git
5. Şu an boş görünecek (çünkü öğrenci-veli ilişkilendirmesi yapılmadı)

#### Veli-Öğrenci İlişkilendirmesi (Manuel):
1. Supabase Dashboard > **Table Editor** > **students** tablosuna git
2. Ayşe Demir kaydını bul
3. `parent_id` sütununa tıkla
4. Veli ID'sini yapıştır (Table Editor > **parents** tablosunda veli ID'sini bul)
5. Şimdi veli hesabıyla giriş yap → Ayşe'yi göreceksin

---

## 🚨 Sorun mu Yaşıyorsun?

### "Supabase keys eksik" hatası
- `.env.local` dosyasını kontrol et
- Keys'lerin doğru kopyalandığından emin ol
- **Development server'ı yeniden başlat** (Ctrl+C, sonra `npm run dev`)

### "new row violates row-level security policy"
- `002_rls_policies.sql` dosyasını tekrar çalıştır
- Supabase Table Editor'de tablolarda "RLS enabled" yazdığını kontrol et

### Öğrenci ekleme çalışmıyor
- Tüm migration dosyalarını çalıştırdığından emin ol
- Supabase Table Editor'de tabloları kontrol et
- Tarayıcı konsolunda (F12) hata mesajlarına bak

### Veli çocuğunu göremiyor
- `parent_id` ilişkilendirmesini Supabase Table Editor'den manuel yap
- İleride UI'dan yapılacak, şu an geliştirme aşamasında

---

## 🎯 Sonraki Adımlar

1. ✅ **Daha fazla öğrenci ekle**
2. ✅ **Farklı branşlarda puan ver** (Müzik, Beden Eğitimi vb.)
3. ✅ **Sınıf görünümünü test et** (Dashboard > Sınıflar > 1-A)
4. ✅ **İkinci bir öğretmen hesabı oluştur** ve ilk öğretmenin verdiği puanları gör
5. ✅ **Veli hesabı oluştur** ve raporları gör

---

## 📚 Daha Fazla Bilgi

- **Detaylı Kullanım**: `KULLANIM_KILAVUZU.md`
- **Supabase Setup**: `SUPABASE_SETUP.md`
- **Proje Özeti**: `PROJE_OZETI.md`
- **Genel Bakış**: `README.md`

---

**Tebrikler! Artık tamamen çalışan bir öğrenci takip sisteminiz var! 🎓✨**

Sorun yaşarsan `SUPABASE_SETUP.md` dosyasındaki troubleshooting bölümüne bak veya issue aç.
