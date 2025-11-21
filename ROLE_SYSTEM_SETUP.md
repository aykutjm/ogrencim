# 🔐 Rol Tabanlı Erişim Sistemi Kurulumu

Bu guide, multi-tenant (çoklu kurum) ve rol tabanlı erişim sistemi kurulumunu açıklar.

## 📋 Özellikler

### 3 Rol Seviyesi:
1. **🔐 Superadmin**: Tüm kurumları yönetir, sistem geneli yetkiler
2. **🏫 Admin (İdareci)**: Kendi kurumunu yönetir
3. **👨‍🏫 Teacher**: Sadece kendi sınıflarını ve öğrencilerini görür
4. **👪 Parent**: Sadece kendi çocuklarını görür

### Multi-Institution (Çoklu Kurum):
- Her okul/kurum kendi verilerine erişir
- Superadmin tüm kurumları görür ve yönetir
- Her kurum için ayrı öğretmen, öğrenci, sınıf yönetimi

## 🚀 Kurulum Adımları

### 1. Migration'ı Uygula

Docker Desktop çalışmıyorsa migration'ı manuel olarak uygulayın:

1. Supabase Dashboard'a girin: https://supabase.com/dashboard
2. Projenizi seçin
3. Sol menüden **SQL Editor** seçin
4. **New Query** butonuna tıklayın
5. `supabase/migrations/013_add_roles_and_institutions.sql` dosyasının içeriğini kopyalayın
6. SQL Editor'e yapıştırın
7. **RUN** butonuna basın

✅ Başarılı olursa şu mesajı görmelisiniz:
```
Success. No rows returned
```

### 2. İlk Superadmin Kullanıcısını Oluştur

Supabase Dashboard'da:

1. **Authentication** > **Users** seçin
2. Kullanıcınızı bulun (örn: gulsah@mafen.com)
3. Kullanıcının yanındaki **...** menüsüne tıklayın
4. **Edit user** seçin
5. **User Metadata (JSON)** alanına şunu ekleyin:

```json
{
  "role": "superadmin",
  "full_name": "Gülşah Koku"
}
```

6. **Save** butonuna basın

### 3. Mevcut Kullanıcıları Rollere Atama

Diğer kullanıcılar için de aynı işlemi yapın:

**İdareci (Admin) için:**
```json
{
  "role": "admin",
  "full_name": "İlknur Temel Kaya"
}
```

**Öğretmen için:**
```json
{
  "role": "teacher",
  "full_name": "Esra Özcan"
}
```

**Veli için:**
```json
{
  "role": "parent",
  "full_name": "Veli Adı"
}
```

### 4. Uygulamayı Test Et

1. Çıkış yap ve tekrar giriş yap
2. Rollere göre farklı dashboard'lar göreceksiniz:
   - **Superadmin**: `/dashboard/superadmin` - Tüm kurumları yönet
   - **Admin**: `/dashboard/admin` - Kendi kurumunu yönet
   - **Teacher**: `/dashboard` - Öğrencilerini gör
   - **Parent**: `/dashboard` - Çocuklarını gör

## 🏫 Yeni Kurum Ekleme

Superadmin olarak:

1. `/dashboard/superadmin` adresine git
2. **Kurumlar** kartına tıkla
3. **➕ Yeni Kurum Ekle** butonuna bas
4. Kurum bilgilerini doldur:
   - Kurum Adı (zorunlu)
   - E-posta (zorunlu)
   - Telefon
   - Adres
   - Aktif durumu
5. **✓ Kurum Ekle** butonuna bas

## 👥 Kullanıcıları Kuruma Atama

Migration otomatik olarak mevcut tüm kullanıcıları "MAFEN Eğitim" kurumuna atadı.

Yeni kullanıcılar için:

1. Kullanıcıyı oluştur (Authentication)
2. Teachers tablosuna ekle (institution_id ile)
3. User metadata'ya role ekle

## 📊 Kontrol Panelleri

### Superadmin Dashboard
- `/dashboard/superadmin` - Ana sayfa
- `/dashboard/superadmin/institutions` - Kurum yönetimi
- `/dashboard/superadmin/users` - Kullanıcı yönetimi
- `/dashboard/superadmin/reports` - Sistem raporları

### Admin Dashboard
- `/dashboard/admin` - Ana sayfa
- `/dashboard/admin/teachers` - Öğretmen yönetimi
- `/dashboard/admin/reports` - Kurum raporları
- `/dashboard/classes` - Sınıflar (mevcut)
- `/dashboard/students` - Öğrenciler (mevcut)

### Teacher Dashboard
- `/dashboard` - Ana sayfa (mevcut)
- `/dashboard/students` - Öğrenciler
- `/dashboard/classes` - Sınıflar
- `/dashboard/ratings` - Değerlendirmeler

## 🔒 Güvenlik

- **RLS (Row Level Security)** aktif
- Her kullanıcı sadece kendi kurumunun verilerini görür
- Superadmin tüm verileri görebilir
- Rollere göre otomatik yönlendirme

## 🐛 Sorun Giderme

### "Kurum Bulunamadı" Hatası
- Kullanıcının teachers veya parents tablosunda institution_id değeri yoktur
- Solution: Teachers/Parents tablosunda institution_id ekleyin

### Role Göre Yönlendirme Çalışmıyor
- User metadata'da role alanı eksik veya yanlış
- Solution: Supabase Dashboard'da user metadata'yı kontrol edin

### RLS İzin Hatası
- Kullanıcının rolü veya kurumu yanlış ayarlanmış
- Solution: Teachers/Parents tablosunda institution_id ve user metadata'da role kontrol edin

## 📝 Notlar

- Migration geriye dönük uyumludur (mevcut veriler korunur)
- Tüm mevcut veriler "MAFEN Eğitim" kurumuna atanmıştır
- Yeni tablolar: `institutions`, `roles`
- Güncellenmiş tablolar: `teachers`, `students`, `parents`, `classes`, `subjects`

## 🎯 Sonraki Adımlar

1. ✅ Migration'ı uygula
2. ✅ İlk superadmin kullanıcısını oluştur
3. ✅ Diğer kullanıcılara roller ata
4. ⏳ Yeni kurumlar ekle (isteğe bağlı)
5. ⏳ Her kurum için admin kullanıcısı oluştur
6. ⏳ Kurum bazlı raporlama ekle

## 🆘 Destek

Sorun yaşıyorsanız:
1. Migration çıktısını kontrol edin
2. Supabase logs'ları inceleyin
3. RLS politikalarını kontrol edin
