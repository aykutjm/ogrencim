# Öğrencim - Öğrenci Takip Sistemi

Öğretmenler arası bilgi paylaşımı ve öğrenci yetenek takip sistemi. Bu uygulama, öğretmenlerin öğrencilerin farklı branşlardaki yeteneklerini değerlendirmesini, bu bilgilerin diğer öğretmenlerle paylaşılmasını ve velilerin çocuklarının gelişimini takip etmesini sağlar.

## 🎯 Özellikler

- **Öğretmen Paneli**: Öğrencilere branş bazlı 1-5 arası yetenek puanı verme
- **Sınıf Bazlı Görüntüleme**: Sınıf seçerek öğrencileri listele, öne çıkan yetenekleri gör
- **Öğretmenler Arası Paylaşım**: Tüm öğretmenlerin notları birbirlerine görünür
- **Veli Erişimi**: Veliler kendi çocuklarının raporlarını görüntüleyebilir
- **Güvenli Kimlik Doğrulama**: Supabase Auth ile rol bazlı erişim kontrolü
- **Mobil Uyumlu**: Responsive tasarım ile tüm cihazlarda kullanım

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL + Auth + RLS)
- **Deployment**: Vercel (önerilir)

## 📋 Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Supabase hesabı (ücretsiz)

## 🚀 Kurulum

### 1. Projeyi Klonlayın

```bash
cd c:\Users\adnan\Desktop\Projeler\ögrencim
```

### 2. Bağımlılıkları Yükleyin

```powershell
npm install
```

### 3. Supabase Projesi Oluşturun

1. [Supabase](https://supabase.com) hesabı açın
2. Yeni bir proje oluşturun
3. Project Settings > API bölümünden şu bilgileri alın:
   - Project URL
   - anon/public key

### 4. Ortam Değişkenlerini Ayarlayın

`.env.example` dosyasını `.env.local` olarak kopyalayın:

```powershell
Copy-Item .env.example .env.local
```

`.env.local` dosyasını düzenleyip Supabase bilgilerinizi girin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Veritabanı Şemasını Oluşturun

Supabase Dashboard > SQL Editor'de `supabase/migrations` klasöründeki SQL dosyalarını sırasıyla çalıştırın:

1. `001_initial_schema.sql` - Tabloları oluşturur
2. `002_rls_policies.sql` - Güvenlik politikalarını ekler
3. `003_seed_data.sql` - Örnek verileri ekler
4. `004_triggers_functions.sql` - Trigger ve fonksiyonları ekler

**Alternatif**: Tüm migration dosyalarını tek seferde çalıştırmak için Supabase CLI kullanabilirsiniz (opsiyonel):

```powershell
npx supabase db push
```

### 6. Uygulamayı Çalıştırın

```powershell
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📱 Kullanım

### İlk Kullanıcı Kaydı

1. Ana sayfada "Kayıt Ol" butonuna tıklayın
2. Ad soyad, e-posta, şifre girin
3. Rolünüzü seçin: **Öğretmen** veya **Veli**
4. Kayıt olduktan sonra giriş yapın

### Öğretmen İşlemleri

1. Dashboard'dan "Öğrenciler" bölümüne gidin
2. Öğrenci ekleyin (Ad, Soyad, Sınıf, Veli bilgileri)
3. Öğrenci detayına girerek branş bazlı puan (1-5 yıldız) ve yorum ekleyin
4. Diğer öğretmenlerin verdiği puanları görüntüleyin
5. Sınıf bazlı görünümde öğrencilerin öne çıkan yeteneklerini inceleyin

### Veli İşlemleri

1. Dashboard'dan "Çocuklarım" bölümüne gidin
2. Çocuğunuzun tüm branşlardaki puanlarını ve öğretmen yorumlarını görüntüleyin
3. Raporları PDF olarak indirin (yakında eklenecek)

## 🗂️ Proje Yapısı

```
ögrencim/
├── app/
│   ├── auth/
│   │   ├── login/          # Giriş sayfası
│   │   ├── signup/         # Kayıt sayfası
│   │   └── signout/        # Çıkış route handler
│   ├── dashboard/          # Ana kontrol paneli
│   ├── globals.css         # Global CSS
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Ana sayfa
├── lib/
│   └── supabase/
│       ├── client.ts       # Browser client
│       ├── server.ts       # Server client
│       └── middleware.ts   # Auth middleware
├── supabase/
│   └── migrations/         # Veritabanı migration dosyaları
├── middleware.ts           # Next.js middleware
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🗄️ Veritabanı Şeması

### Temel Tablolar

- **teachers**: Öğretmen bilgileri
- **parents**: Veli bilgileri
- **students**: Öğrenci bilgileri (ad, soyad, sınıf, veli)
- **classes**: Sınıf bilgileri (1-A, 2-B vs.)
- **subjects**: Branşlar (Matematik, Müzik, Beden Eğitimi vs.)
- **skill_ratings**: Yetenek puanlamaları (1-5 arası, yorum)
- **audit_logs**: Denetim kayıtları

### Güvenlik (RLS)

- Öğretmenler tüm öğrencileri görür, sadece kendi verdikleri notları düzenleyebilir
- Veliler sadece kendi çocuklarını görür
- Tüm değişiklikler audit_logs'a kaydedilir

## 🔐 Roller ve İzinler

| Özellik | Öğretmen | Veli | Admin |
|---------|----------|------|-------|
| Öğrenci listesi görüntüleme | ✅ | Sadece kendi çocuğu | ✅ |
| Yetenek puanı verme | ✅ | ❌ | ✅ |
| Diğer öğretmenlerin notlarını görme | ✅ | ❌ | ✅ |
| Kendi notlarını düzenleme | ✅ | ❌ | ✅ |
| Raporları görüntüleme | ✅ | ✅ (sadece çocuğu) | ✅ |
| Audit logları | ❌ | ❌ | ✅ |

## 🚀 Deployment

### Vercel'e Deploy

1. Vercel hesabı oluşturun
2. Projeyi GitHub'a push edin
3. Vercel dashboard'da "Import Project" ile projeyi ekleyin
4. Environment Variables bölümüne `.env.local` değerlerini ekleyin
5. Deploy edin

### Ortam Değişkenleri (Production)

Vercel > Settings > Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=production-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=production-key
```

## 📝 Yapılacaklar

- [x] Proje yapısı ve temel kurulum
- [x] Kimlik doğrulama (Login/Signup)
- [x] Supabase entegrasyonu
- [x] Veritabanı şeması ve RLS
- [ ] Öğrenci CRUD işlemleri
- [ ] Sınıf bazlı görünüm ve filtreleme
- [ ] Yetenek puanlama arayüzü (1-5 yıldız)
- [ ] Öne çıkan yetenek vurgulama
- [ ] Veli portal ve raporlama
- [ ] PDF rapor oluşturma
- [ ] CSV import/export
- [ ] Bildirim sistemi
- [ ] Yetenek trend grafikleri

## 🤝 Katkıda Bulunma

Bu proje aktif geliştirme aşamasındadır. Katkılarınızı memnuniyetle karşılarız!

## 📄 Lisans

MIT

## 📞 İletişim

Sorularınız için issue açabilirsiniz.

---

**Not**: Bu uygulama eğitim amaçlıdır ve sürekli geliştirilmektedir. Production kullanımı için ek güvenlik önlemleri ve testler gerekebilir.
