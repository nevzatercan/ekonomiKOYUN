# 🐑 ekonomiKOYUN

> Türkiye'deki oyuncular için **çoklu platform fiyat takibi + abonelik karşılaştırma** uygulaması.

ekonomiKOYUN; Steam, Epic, GOG gibi PC mağazalarından PlayStation Store, Xbox Store, Nintendo eShop gibi konsol mağazalarına kadar tüm dijital oyun platformlarındaki fiyatları **TL cinsinden** takip eder. Üstüne Xbox Game Pass, PlayStation Plus, Ubisoft+ gibi **abonelik servislerinin kataloğunu** da gösterir.

**Sorduğun soru:** "Bu oyunu satın mı alayım, abonelikle mi oynayayım?"
**ekonomiKOYUN'un cevabı:** Hangi seçenek bütçene en uygun, sayılarla ve karşılaştırmalı olarak.

## ✨ Özellikler

### 🎮 Platform Desteği
- **PC:** Steam, Epic Games, GOG, Microsoft Store, Ubisoft Connect
- **Konsol:** PlayStation Store, Xbox Store, Nintendo eShop
- **Abonelikler:** Xbox Game Pass (3 tier), PlayStation Plus (3 tier), Ubisoft+, EA Play

### 💡 Akıllı Karşılaştırma
- Tüm platformlarda fiyatları yan yana göster
- "Bu oyun şu an X aboneliğinde dahil!" badge'leri
- "Game Pass'le 1 ay oyna mı, satın al mı?" hesaplama
- Servisten yakında ayrılacak oyun uyarıları
- Fiyat geçmişi grafikleri *(Faz 2)*

### 🇹🇷 Türkiye Odaklı
- Tüm fiyatlar TL
- Türkiye bölge kataloğu (özellikle PSN Plus)
- Kur farkı analizleri
- Türk geliştirici oyunları için özel kategori

## 🛠️ Teknoloji

- **Backend:** Node.js, Express, SQLite, Prisma
- **Frontend:** React, Vite, Tailwind CSS
- **Veri:** Steam API, scraping (Cheerio/Puppeteer), topluluk JSON kaynakları
- **Mimari:** Adapter Pattern — yeni platform eklemek = yeni adapter dosyası

## 🚀 Geliştirme

Detaylı plan için [PROJECT_PLAN.md](./PROJECT_PLAN.md) dosyasına bakın.

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (yeni terminal)
cd frontend
npm install
npm run dev
```

## 🗺️ Yol Haritası

- **Faz 1 (MVP):** Steam entegrasyonu, arama, wishlist
- **Faz 2:** Diğer mağazalar + tüm abonelik servisleri + akıllı karşılaştırma
- **Faz 3:** Auth, e-mail bildirimleri, sosyal özellikler, mobil

## 📜 Lisans

MIT — Bu proje öğrenme amaçlı geliştirilmektedir.

## 🐑 Neden bu isim?

"Ekonomi" + "koyun" = bütçesini sürüsü gibi güden, ekonomik düşünen oyuncu. Ayrıca "ekonomi oyun" wordplay'i de var. Çünkü Türkiye'de oyun almak ekonomik bir karardır 😄
