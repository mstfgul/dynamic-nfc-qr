# Dinamik NFC & QR Kod Platformu

Kendi kullanımın için dinamik NFC etiketleri ve QR kodları yönetmek üzere geliştirilmiş bir platform. Bu uygulama ile kısa linkler oluşturabilir, QR kodları üretebilir ve tıklama analitiği takip edebilirsin.

## Özellikler

- **QR Kod Oluşturma**: Otomatik QR kod oluşturma ve indirme
- **Dinamik Yönlendirme**: Kısa linkler oluştur ve hedef URL'yi istediğin zaman değiştir
- **NFC Desteği**: NFC etiketlerine yazabileceğin kısa linkler
- **Analitik Dashboard**: Detaylı tıklama istatistikleri
  - Cihaz türü (mobile, desktop, tablet)
  - Tarayıcı bilgisi
  - İşletim sistemi
  - Zaman bazlı istatistikler (24 saat, 7 gün, 30 gün)
- **Link Yönetimi**: Linkleri aktif/pasif yapma, düzenleme ve silme

## Teknolojiler

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **QR Kod**: qrcode kütüphanesi
- **Analytics**: ua-parser-js (user agent parsing)

## Kurulum

### Gereksinimler

- Node.js 18+
- MongoDB (lokal veya MongoDB Atlas)

### Adımlar

1. Bağımlılıkları yükle:
```bash
npm install
```

2. MongoDB'yi başlat:

**Lokal MongoDB için:**
```bash
# macOS (Homebrew ile)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Veya MongoDB Atlas kullan:**
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluştur
- Yeni cluster oluştur (ücretsiz tier yeterli)
- Connection string'i al

3. `.env.local` dosyası zaten oluşturuldu, gerekirse düzenle:
```bash
# MongoDB bağlantısı (lokal)
MONGODB_URI=mongodb://localhost:27017/dynamic-nfc-qr

# Veya MongoDB Atlas için:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dynamic-nfc-qr

# Base URL (production'da değiştir)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Development server'ı başlat:
```bash
npm run dev
```

5. Tarayıcıda aç: [http://localhost:3000](http://localhost:3000)

## Kullanım

### Yeni Link Oluşturma

1. Ana sayfada "Yeni Link" butonuna tıkla
2. Hedef URL'i gir (zorunlu)
3. İsteğe bağlı: Başlık, açıklama ve özel kod ekle
4. "Oluştur" butonuna tıkla
5. QR kod otomatik oluşturulur ve indirebilirsin

### QR Kod Kullanımı

- QR kod görselini indir
- Yazdır veya dijital olarak paylaş
- QR kod taratıldığında otomatik yönlendirme yapılır

### NFC Kullanımı

1. Bir link oluştur
2. Kısa linki kopyala (örn: `http://localhost:3000/abc123`)
3. NFC yazma uygulaması kullanarak (NFC Tools vb.) linki NFC etiketine yaz
4. NFC etiketi telefonla okutunca otomatik yönlendirme yapılır

### Link Yönetimi

- **Düzenleme**: Hedef URL'yi değiştir, yönlendirme otomatik güncellenir
- **Aktif/Pasif**: Linki geçici olarak devre dışı bırak
- **Silme**: Linki kalıcı olarak sil
- **Analitik**: Her link için detaylı tıklama istatistiklerini görüntüle

## Production'a Deploy

### Vercel (Önerilen)

1. GitHub'a push yap
2. [Vercel](https://vercel.com)'e git ve projeyi import et
3. Environment variables ekle:
   - `MONGODB_URI`: MongoDB connection string
   - `NEXT_PUBLIC_BASE_URL`: Production URL'in (örn: https://senin-domain.vercel.app)
4. Deploy et

### MongoDB Atlas Setup

Production için MongoDB Atlas kullanmanı öneririm:

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)'ta ücretsiz cluster oluştur
2. Database user oluştur
3. Network Access'te "Allow access from anywhere" seç (0.0.0.0/0)
4. Connection string'i kopyala ve Vercel'de environment variable olarak ekle

## API Endpoints

- `GET /api/links` - Tüm linkleri listele
- `POST /api/links` - Yeni link oluştur
- `GET /api/links/[id]` - Link detayı
- `PATCH /api/links/[id]` - Link güncelle
- `DELETE /api/links/[id]` - Link sil
- `GET /api/analytics/[shortCode]` - Link analitik

## Özelleştirme

### Base URL Değiştirme

Production'da kendi domain'ini kullanmak için `.env.local` dosyasındaki `NEXT_PUBLIC_BASE_URL`'i değiştir:

```bash
NEXT_PUBLIC_BASE_URL=https://senin-domain.com
```

### QR Kod Renkleri

`app/api/links/route.ts` dosyasında QR kod renklerini özelleştirebilirsin:

```typescript
const qrCodeData = await QRCode.toDataURL(shortUrl, {
  width: 400,
  margin: 2,
  color: {
    dark: '#000000',  // QR kod rengi
    light: '#FFFFFF', // Arka plan rengi
  },
});
```

## Proje Yapısı

```
├── app/
│   ├── [shortCode]/          # Dinamik yönlendirme sayfası
│   ├── analytics/[shortCode]/ # Analitik dashboard
│   ├── api/
│   │   ├── links/            # Link CRUD API'ları
│   │   └── analytics/        # Analitik API'ları
│   └── page.tsx              # Ana admin panel
├── lib/
│   └── mongodb.ts            # MongoDB bağlantısı
├── models/
│   ├── Link.ts               # Link model şeması
│   └── Analytics.ts          # Analitik model şeması
└── .env.local                # Ortam değişkenleri
```

## Lisans

Kişisel kullanım için geliştirilmiştir.
