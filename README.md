# Luxury Motors

Lüks araç pazaryeri için tasarlanmış, tam donanımlı bir e-ticaret platformu. Modern Next.js mimarisi ve Supabase backend ile sıfırdan inşa edildi.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)

## Hakkında

Luxury Motors, lüks otomotiv segmentine yönelik tam akışlı bir pazaryeri sitesidir. Ziyaretçiler araçları filtreleyebilir, detaylarını inceleyebilir, favorilerine ekleyebilir ve satış için iletişime geçebilir. Yönetici tarafında ise araç yönetimi, görsel yükleme ve müşteri sorgu takibi için kapsamlı bir admin paneli bulunur.

## Öne Çıkan Özellikler

### Genel Site

- Hero slideshow, öne çıkan araçlar, kategori grid, marka şeridi ve CTA bölümlerinden oluşan anasayfa
- Araç listeleme — marka, kategori, fiyat, yıl, yakıt tipine göre filtreleme; 6 farklı sıralama; debounced arama; sayfalama
- Detaylı araç sayfaları — interaktif galeri ve lightbox, tam teknik özellikler tablosu, ilgili araç önerileri
- Favori sistemi — tek tıkla favoriye ekleme/çıkarma
- İletişim formları — genel iletişim sayfası ve araç detayında modal form
- Tam mobil uyumlu, erişilebilir tasarım

### Yönetim Paneli (Admin)

- Dashboard — anlık istatistikler ve son sorgular
- Araç CRUD — 30+ alanlı form, beş bölümlü düzenli yapı
- Görsel yönetimi — Supabase Storage'a doğrudan yükleme, primary belirleme, silme
- Sorgu yönetimi — durum güncelleme, müşteri detayları, araç bağlantısı
- Rol bazlı erişim kontrolü (admin / user)

### Kimlik Doğrulama ve Güvenlik

- E-posta/şifre kayıt ve giriş
- Sunucu taraflı oturum yönetimi (Supabase SSR)
- Row Level Security (RLS) ile tablo erişim kontrolü
- Korumalı route'lar — middleware ile session yenileme

## Teknoloji Stack

| Katman    | Teknoloji                                          |
| --------- | -------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack)                 |
| Dil       | TypeScript                                         |
| Stil      | Tailwind CSS v4, shadcn/ui (Radix + Nova preset)   |
| Backend   | Supabase (PostgreSQL, Auth, Storage, RLS)          |
| State     | React Server Components, Server Actions, URL state |
| Form      | useActionState (React 19)                          |
| Icons     | Lucide React                                       |
| Font      | Playfair Display + Inter                           |

## Tasarım Sistemi: "Showroom Beyaz"

| Token                | Değer                     |
| -------------------- | ------------------------- |
| Background           | `#FAFAFA`                 |
| Foreground           | `#0F0F0F`                 |
| Accent (yarış kırmızısı) | `#A50012`             |
| Muted                | `#555555`                 |
| Border               | `#D4D4D4`                 |
| Heading Font         | Playfair Display (serif)  |
| Body Font            | Inter (sans)              |

## Veritabanı Şeması

7 tablo, 4 enum, RLS politikaları ve auth trigger:

- **profiles** — kullanıcı profilleri (auth.users ile bağlantılı, role: user/admin)
- **brands** — markalar (slug, logo_url, açıklama)
- **categories** — kategoriler (Süper Spor, Lüks SUV, Klasik vb.)
- **cars** — araçlar (30+ alan: teknik özellikler, görünüm, belge, durum)
- **car_images** — araç galerisi (Storage yolu, sıralama, primary işareti)
- **favorites** — kullanıcı favorileri (user_id + car_id unique)
- **inquiries** — müşteri sorguları (tip: bilgi/test sürüşü/fiyat teklifi, durum: yeni/görüşüldü/tamamlandı/iptal)

## Kurulum

### Önkoşullar

- Node.js 20+ (nvm önerilir)
- Supabase hesabı (ücretsiz katman yeterli)
- Git

### Adımlar

```bash
# Repo'yu klonla
git clone https://github.com/nimeslug/luxury-motors.git
cd luxury-motors

# Bağımlılıkları yükle
npm install

# Çevre değişkenlerini ayarla
cp .env.example .env.local
# .env.local içine kendi Supabase URL ve anon key'ini ekle
```

### Çevre Değişkenleri

`.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<proje-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

### Veritabanı Kurulumu

1. Supabase Dashboard → yeni proje oluştur
2. SQL Editor → şema ve seed dosyalarını çalıştır
3. Storage → `car-images` bucket oluştur (public, 10MB limit)
4. TypeScript tiplerini üret:

```bash
npx supabase gen types typescript --project-id <proje-id> > src/types/database.ts
```

### Çalıştır

```bash
npm run dev
```

http://localhost:3000 adresinde açılır.

## Mimari Kararlar

### Server Components Öncelikli

Çoğu sayfa async server component — veri doğrudan veritabanından çekiliyor, client'a sadece state gerekenler iniyor (CarCard, CarFilters, FavoriteButton, CarGallery, ContactForm).

### URL Olarak State

Liste sayfasındaki tüm filtre/sıralama/arama URL search params'ta. Bu sayede paylaşılabilir linkler, geri tuşu desteği, yer imine ekleme — her şey doğal olarak çalışıyor.

### Server Actions

Form gönderimleri (kayıt, giriş, favori toggle, iletişim formu, araç CRUD) tamamen server actions ile yapılıyor. JS yüklenmeden de çalışır (progressive enhancement).

### Görsel Yükleme

Admin Supabase Storage'a yüklüyor → public URL alınıyor → `car_images` tablosuna kaydediliyor → genel sitede galeri olarak gösteriliyor. Tüm bu akış RLS politikaları ile korumalı (yalnızca admin yazabilir).

### Tasarım Felsefesi

Lüks moda dergisi estetiği — Playfair serif başlıklar, geniş harf aralıkları, sade siyah/beyaz/kırmızı palet. Sadelik prestij hissi yaratır. Form alanları sınırsız beyaz alana yerleşmiş, hover'da çizgi tabanlı mikro etkileşimler.

## Proje Yapısı
src/

├── app/

│   ├── (public)/         # Genel sayfalar (anasayfa, cars, favorites, account)

│   ├── (auth)/           # Giriş ve kayıt sayfaları

│   ├── admin/            # Yönetim paneli (rol korumalı)

│   ├── actions/          # Server actions (cars, favorites, inquiries)

│   └── api/              # API route handler'ları

├── components/

│   ├── cars/             # CarCard, CarGallery, CarFilters vb.

│   ├── home/             # Hero, CategoriesGrid, BrandsStrip

│   ├── admin/            # Sidebar, CarForm, CarImagesManager

│   ├── contact/          # ContactForm

│   ├── layout/           # Header, Footer

│   └── ui/               # Modal, Button (shadcn)

├── lib/

│   └── supabase/         # Client (browser ve server)

├── types/

│   └── database.ts       # Supabase generated types

└── middleware.ts         # Oturum yenileme

## Performans

- Sunucu taraflı render ile ilk yükleme hızı yüksek
- `Promise.all` ile paralel veri çekme (dashboard, düzenleme sayfası)
- Görsel lazy loading
- `revalidatePath` ile seçici cache yenileme
- Galeri thumbnail grid — sadece seçilen görsel tam boyutta yüklenir

## Yol Haritası

- [ ] AI ile araç açıklama üretimi (Anthropic Claude API)
- [ ] AI ile doğal dil arama
- [ ] Marka ve kategori CRUD (admin)
- [ ] Çoklu dil desteği (TR/EN)
- [ ] PWA + offline favoriler
- [ ] Sayfa görüntülenme analitikleri

## Geliştirici

**Gülsemin** — [@nimeslug](https://github.com/nimeslug)

Lüks otomotiv tasarımı ile modern frontend mimarisini birleştirmeyi seven bir yazılım mühendisliği öğrencisi. Bu proje hem öğrenme hem portfolyo amaçlı, sıfırdan tasarlanıp inşa edildi.

## Lisans

MIT — bu kod ücretsiz olarak kullanılabilir, eğitim ve portfolyo amaçlı paylaşıma açıktır.
