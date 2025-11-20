# Kullanım Kılavuzu - Öğrencim

Bu dosya uygulamayı nasıl kullanacağınızı adım adım açıklar.

## 📚 İçindekiler

1. [İlk Kurulum](#ilk-kurulum)
2. [Öğretmen Kullanımı](#öğretmen-kullanımı)
3. [Veli Kullanımı](#veli-kullanımı)
4. [Sık Sorulan Sorular](#sık-sorulan-sorular)

---

## İlk Kurulum

### 1. Supabase Projesi Oluşturma

Detaylı kurulum için `SUPABASE_SETUP.md` dosyasına bakın. Özet:

1. [supabase.com](https://supabase.com) hesabı açın
2. Yeni proje oluşturun
3. API keys'i kopyalayın
4. `.env.local` dosyasını oluşturup keys'i yapıştırın
5. Migration dosyalarını SQL Editor'de çalıştırın

### 2. Uygulamayı Başlatma

```powershell
npm install
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini açın.

---

## Öğretmen Kullanımı

### Kayıt ve Giriş

1. Ana sayfada **"Kayıt Ol"** butonuna tıklayın
2. Bilgilerinizi girin:
   - Ad Soyad
   - E-posta (okul e-postası önerilir)
   - Şifre (en az 6 karakter)
   - Rol: **Öğretmen** seçin
3. **"Kayıt Ol"** ile kaydı tamamlayın
4. Giriş sayfasından e-posta ve şifre ile giriş yapın

### Öğrenci Ekleme

1. Dashboard'dan **"Öğrenciler"** bölümüne gidin
2. Sağ üstteki **"+ Yeni Öğrenci"** butonuna tıklayın
3. Öğrenci bilgilerini girin:
   - **Ad** (zorunlu)
   - **Soyad** (zorunlu)
   - Öğrenci Numarası (opsiyonel)
   - Doğum Tarihi (opsiyonel)
4. **"Kaydet"** butonuna tıklayın

> **Not**: Sınıf ve veli ataması şu an manuel olarak Supabase'den yapılmalıdır. İleriki güncellemelerde form üzerinden eklenecek.

### Yetenek Değerlendirmesi Ekleme

1. **"Öğrenciler"** sayfasından bir öğrencinin **"Detay"** butonuna tıklayın
2. **"Yeni Değerlendirme Ekle"** formunu doldurun:
   - **Branş**: Matematik, Müzik, Beden Eğitimi vb. seçin
   - **Yetenek Puanı**: 1-5 arası yıldız verin
     - ⭐ = Geliştirilmeli
     - ⭐⭐ = Orta
     - ⭐⭐⭐ = İyi
     - ⭐⭐⭐⭐ = Çok İyi
     - ⭐⭐⭐⭐⭐ = Mükemmel
   - **Açıklama**: Gözlemlerinizi yazın (opsiyonel ama önerilir)
3. **"Değerlendirme Ekle"** butonuna tıklayın

### Diğer Öğretmenlerin Değerlendirmelerini Görme

Öğrenci detay sayfasında:
- Tüm branşlar için verilen puanlar görünür
- Her değerlendirmenin yanında hangi öğretmen tarafından verildiği yazar
- Tarih bilgisi görüntülenir
- Bu sayede öğrencinin tüm yönlerini görebilirsiniz

### Sınıf Bazlı Görünüm

1. Dashboard'dan **"Sınıflar"** bölümüne gidin
2. Bir sınıf kartına tıklayın (örn: 1-A, 2-B)
3. Tablo görünümü:
   - Tüm öğrenciler listelenir
   - **"Öne Çıkan Yetenek"** sütunu: Her öğrencinin en yüksek puan aldığı branşı gösterir
   - **"Puan"** sütunu: O branştaki ortalama puanı gösterir
   - **"Toplam Değerlendirme"**: Kaç adet puanlama yapıldığını gösterir

---

## Veli Kullanımı

### Kayıt ve Giriş

1. Ana sayfada **"Kayıt Ol"** butonuna tıklayın
2. Bilgilerinizi girin:
   - Ad Soyad
   - E-posta
   - Şifre
   - Rol: **Veli** seçin
3. Giriş yapın

> **Önemli**: Velinin çocuğuyla ilişkilendirilmesi için okul yöneticisinin Supabase'de öğrencinin `parent_id` alanını güncelle gerekir.

### Çocuğunuzun Raporunu Görüntüleme

1. Dashboard'dan **"Çocuklarım"** bölümüne gidin
2. Çocuğunuzun/çocuklarınızın kartları görünür
3. Her çocuk için:
   - Sınıf ve numara bilgisi
   - Tüm branşlardaki değerlendirmeler
   - Öğretmen yorumları
   - Tarih bilgileri

### Veliler Neler GÖREBİLİR?

✅ **Görebilir:**
- Kendi çocuklarının tüm branşlardaki puanları
- Öğretmen yorumları
- Hangi öğretmenin hangi tarihteki puanı verdiği

❌ **Göremez:**
- Diğer öğrencilerin bilgileri
- Kendi çocuğu hakkında `visibility=false` olarak işaretlenmiş puanlar

---

## Sık Sorulan Sorular

### Genel

**S: Şifremi unuttum, nasıl sıfırlayabilirim?**  
A: Şu an şifre sıfırlama özelliği henüz eklenmedi. Supabase Dashboard > Authentication > Users bölümünden manuel olarak şifre sıfırlayabilirsiniz veya yeni kullanıcı oluşturabilirsiniz.

**S: Örnek veriler nasıl eklenir?**  
A: Supabase migration dosyalarını çalıştırdığınızda otomatik olarak örnek branşlar (Matematik, Müzik vb.) ve sınıflar (1-A, 2-B vb.) eklenir.

### Öğretmen Soruları

**S: Bir öğrenciye birden fazla kez aynı branşta puan verebilir miyim?**  
A: Hayır. Veritabanı şeması gereği her öğretmen, her öğrenci için her branşta sadece 1 kez puan verebilir. Mevcut puanı güncellemek için o puanı silip yenisini ekleyebilirsiniz (gelecekte düzenleme özelliği eklenecek).

**S: Diğer öğretmenlerin puanlarını değiştirebilir miyim?**  
A: Hayır. RLS (Row Level Security) politikaları sayesinde sadece kendi verdiğiniz puanları düzenleyebilir/silebilirsiniz. Diğer öğretmenlerin puanlarını sadece görüntüleyebilirsiniz.

**S: Veliye hangi bilgiler görünür?**  
A: Veliler sadece `visibility=true` olarak işaretlenmiş puanları görür. Şu an tüm puanlar varsayılan olarak görünür, ileride gizleme özelliği eklenecek.

### Veli Soruları

**S: Çocuğum listede görünmüyor, ne yapmalıyım?**  
A: Okul yönetimiyle iletişime geçin. Öğrencinin `parent_id` alanının sizin veli kaydınıza bağlanması gerekiyor. Bu işlem Supabase Table Editor'de yapılabilir.

**S: Eski puanlar görünüyor mu?**  
A: Evet, tüm değerlendirme geçmişi tarih sırasıyla görüntülenir.

### Teknik Sorular

**S: "new row violates row-level security policy" hatası alıyorum**  
A: RLS politikaları eksik. `SUPABASE_SETUP.md` dosyasında `002_rls_policies.sql` dosyasını tekrar çalıştırın.

**S: Öğrenci eklerken hata alıyorum**  
A: Supabase bağlantınızı ve migration dosyalarının doğru çalıştırıldığını kontrol edin. Tarayıcı konsolunda (F12) hata mesajlarına bakın.

**S: Mobilde düzgün görünmüyor**  
A: Tüm sayfalar Tailwind CSS ile responsive tasarlanmıştır. Tarayıcınızın güncel olduğundan emin olun.

---

## 🎯 Hızlı Başlangıç Senaryosu

### Senaryo: İlk Kullanım (5 dakika)

1. **Öğretmen hesabı oluştur**
   - Kayıt ol > Ad: "Ahmet Yılmaz", Rol: Öğretmen

2. **İlk öğrenciyi ekle**
   - Dashboard > Öğrenciler > Yeni Öğrenci
   - Ad: "Ayşe", Soyad: "Demir"

3. **İlk değerlendirmeyi ekle**
   - Ayşe Demir > Detay
   - Branş: Matematik, Puan: 5 yıldız, Açıklama: "Problem çözmede çok başarılı"

4. **Sınıf görünümünü kontrol et**
   - Dashboard > Sınıflar > 1-A (veya başka sınıf)
   - Öğrencilerin öne çıkan yeteneklerini gör

5. **Veli hesabı oluştur**
   - Çıkış yap > Kayıt ol > Rol: Veli
   - Supabase'de öğrencinin `parent_id`'sini güncelle
   - Dashboard > Çocuklarım

---

## 🚀 Sonraki Adımlar

- [ ] Veli-öğrenci ilişkilendirmesini UI'dan yapma
- [ ] Öğrenciye sınıf atama özelliği
- [ ] Değerlendirme düzenleme/silme butonu
- [ ] PDF rapor oluşturma
- [ ] E-posta bildirimleri
- [ ] Grafik ve istatistikler

---

## 📞 Destek

Sorun yaşıyorsanız:
1. `README.md` dosyasına bakın
2. `SUPABASE_SETUP.md` kurulum adımlarını kontrol edin
3. Tarayıcı konsolu (F12) hatalarını inceleyin
4. GitHub'da issue açın

**Mutlu öğretim! 🎓**
