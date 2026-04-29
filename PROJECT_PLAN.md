# 🐑 ekonomiKOYUN - Proje Planı v2

> Türkiye'deki oyuncular için **çoklu platform fiyat takibi + abonelik servisi karşılaştırma** uygulaması.
> "Bu oyunu satın mı alayım, abonelikle mi oynayayım?" sorusunun cevabı.

---

## 🎯 Vizyon

Türkiye'deki oyuncular **hangi cihazda, hangi yöntemle (satın alma vs abonelik), hangi mağazada** oyun oynamanın en ekonomik olduğunu tek bir yerden görebilsin.

**Ana fark:** Mevcut çözümler (SteamDB, IsThereAnyDeal vb.) sadece PC mağazaları, sadece satın alma fiyatı gösterir. ekonomiKOYUN:
- ✅ Hem PC hem konsol hem mobil
- ✅ Hem satın alma hem abonelik servisleri
- ✅ Hepsi TL cinsinden, Türkiye'ye özel
- ✅ "Bu oyun şu an Game Pass'te" gibi karar verdirici bilgi

**Örnek senaryo:**
> Kullanıcı "Cyberpunk 2077" arar.
> Sonuç:
> - 🟢 Steam: 599 TL (normal: 1199 TL, %50 indirim)
> - 🔵 Epic: 999 TL
> - 🟡 GOG: 1099 TL
> - 🟣 PSN: 1499 TL
> - 🟢 Xbox Store: 749 TL (%37 indirim)
> - ⭐ **Game Pass Ultimate'te dahil!** (89 TL/ay)
> - ⭐ **PSN Plus Extra'da dahil!** (149 TL/ay)
>
> En ekonomik: 1 ay Game Pass al, bitir → 89 TL.

İşte bu, projenin **ana değer önerisi.**

---

## 🌍 Platform Stratejisi

### Kapsam: Hiyerarşik Kategori Yapısı

Üst seviyede 3 ana kategori, her biri kendi alt kategorilerine ayrılıyor. Kullanıcı "sadece PlayStation oyunlarına bak" diyebilsin.

#### 1️⃣ PC Mağazaları (Satın Alma)
Tek bir grup, çünkü PC oyuncuları genelde birden fazla mağazadan alır.

- **Steam** ✅ (Faz 1)
- **Epic Games Store** (Faz 2)
- **GOG.com** (Faz 2)
- **Microsoft Store / Xbox PC** (Faz 2)
- **Ubisoft Connect / Ubisoft Store** (Faz 2)
- **Humble Store** (Faz 3)
- **Green Man Gaming, Fanatical** (Faz 3)
- **EA App / Origin** (Faz 3)
- **Battle.net** (Faz 3)

#### 2️⃣ Konsol Mağazaları (Satın Alma) — Marka Bazlı Alt Kategoriler

Konsol oyuncusu sadece sahip olduğu platformla ilgilenir. Bu yüzden marka bazlı ayrım çok önemli:

##### 🟦 PlayStation
- **PlayStation Store (PS5)** (Faz 2)
- **PlayStation Store (PS4)** (Faz 2)
- *(PS3 / PS Vita — Faz 4, retro oyuncular için belki)*

##### 🟩 Xbox
- **Xbox Store (Series X/S)** (Faz 2)
- **Xbox Store (Xbox One)** (Faz 2)
- *(Xbox 360 store — Faz 4)*

##### 🟥 Nintendo
- **Nintendo eShop (Switch)** (Faz 2)
- *(Switch 2 — çıkınca eklenecek)*
- *(3DS / Wii U eShop — kapandı/kapanıyor, atla)*

**Not:** Xbox Series ve Xbox One çoğu zaman aynı oyunu paylaşıyor (geriye dönük uyumluluk). Bunları DB'de ayrı platform olarak tutacağız ama UI'da gerektiğinde birleştirebiliriz.

#### 3️⃣ Abonelik Servisleri (Kütüphane!) — Sağlayıcı Bazlı Alt Kategoriler
**BU PROJENİN EN ÖZGÜN KISMI!**

##### 🟩 Microsoft / Xbox Aboneliği
- **Xbox Game Pass (Console)** (Faz 2)
- **PC Game Pass** (Faz 2)
- **Game Pass Ultimate** (Faz 2) — hepsini kapsıyor
- **EA Play** (Faz 3) — Ultimate'in bir parçası ama bağımsız da var

##### 🟦 PlayStation Aboneliği
- **PlayStation Plus Essential** (Faz 2)
- **PlayStation Plus Extra** (Faz 2)
- **PlayStation Plus Premium / Deluxe** (Faz 2)

##### 🟧 Ubisoft Aboneliği
- **Ubisoft+ Classics** (Faz 2)
- **Ubisoft+ Premium** (Faz 2)

##### 🟥 Nintendo Aboneliği
- **Nintendo Switch Online** (Faz 3)
- **Nintendo Switch Online + Expansion Pack** (Faz 3)

##### ☁️ Cloud Streaming Servisleri
Ayrı kategoride çünkü "sahiplik" mantığı farklı:
- **GeForce Now** (Faz 3)
- **Amazon Luna** (Faz 4 — belki)
- **Apple Arcade** (Faz 4 — mobil/Apple ekosistemi)
- **Google Play Pass** (Faz 4 — mobil)

### Mimari: Genişletilmiş Adapter Pattern

Üç farklı adapter tipi tanımlayacağız:

```
StoreAdapter (satın alma mağazaları için)
├── searchGame(query)
├── getPrice(gameId, region='tr')
└── getCurrentDeals()

SubscriptionAdapter (abonelik servisleri için)
├── getCatalog()                  # servisteki tüm oyunlar
├── isGameIncluded(gameTitle)     # belirli oyun dahil mi?
├── getSubscriptionTiers()        # Essential / Extra / Premium gibi
└── getPriceTry()                 # aylık abonelik TL fiyatı

AggregatedSearch (üst katman)
└── searchEverywhere(query)       # hem mağazalarda hem aboneliklerde ara
```

Yeni platform = yeni adapter. Mimari değişmez.

---

## 📊 Veri Toplama Stratejisi (Platform Bazlı)

Her platformun veri kaynağı farklı, planımızı baştan biliyoruz ki sürpriz olmasın:

| Platform | Yöntem | Zorluk | Not |
|----------|--------|--------|-----|
| **Steam** | Resmi Store API | 🟢 Kolay | `cc=tr` parametresi var, ücretsiz |
| **Epic Games** | GraphQL API (unofficial) veya scraping | 🟡 Orta | Ücretsiz API'leri var ama belgelendirme zayıf |
| **GOG** | Resmi API endpoint'leri (kısmen public) | 🟡 Orta | Bölge bazlı fiyat çekilebilir |
| **Microsoft/Xbox Store** | Microsoft Store API + scraping | 🟡 Orta | Xbox API'si var ama auth gerekiyor |
| **PlayStation Store** | Unofficial API / scraping | 🔴 Zor | Sony resmi API vermiyor, dikkatli scrape |
| **Nintendo eShop** | nintendo-switch-eshop kütüphanesi | 🟡 Orta | Topluluk kütüphaneleri var |
| **Ubisoft Connect** | Scraping / unofficial | 🔴 Zor | API yok |
| **CheapShark** | Resmi ücretsiz API | 🟢 Kolay | **Yedek/Aggregator olarak kullanılabilir** |
| **Game Pass katalog** | xbox-game-pass-tracker tarzı | 🟡 Orta | Topluluk JSON'ları var |
| **PSN Plus katalog** | Unofficial / scraping | 🔴 Zor | Resmi liste vermiyorlar |
| **Ubisoft+ katalog** | Scraping | 🟡 Orta | Sayfa yapısı sabit |

**Akıllı strateji:** Resmi API olan yerden başla, olmayan yerlerde scraping veya topluluk veri kaynaklarına geç. Mümkünse **birden fazla kaynak** kullanıp güvenilirliği artır.

---

## 📦 MVP Özellikleri (Faz 1 - Birkaç Saat)

Sadece Steam ile başlayıp altyapıyı kuracağız. **Mimari, çoklu platform için baştan hazır.**

### Backend
- [ ] Express server kurulumu
- [ ] SQLite veritabanı
- [ ] **Soyut adapter interface'leri** (StoreAdapter, SubscriptionAdapter)
- [ ] Steam adapter implementasyonu
- [ ] `/api/search?q=...` endpoint
- [ ] `/api/wishlist` CRUD endpoint'leri

### Frontend
- [ ] React + Vite + Tailwind kurulumu
- [ ] Oyun arama sayfası
- [ ] Wishlist sayfası
- [ ] Fiyat görüntüleme (TL, indirim yüzdesi)

---

## 🚀 Faz 2: Çoklu Platform + Abonelik (Sonraki Oturumlar)

### 2A: Diğer PC Mağazaları
- [ ] Epic Games adapter
- [ ] GOG adapter
- [ ] Microsoft Store adapter (PC tarafı)

### 2B: Konsol Mağazaları
- [ ] PlayStation Store adapter
- [ ] Xbox Store adapter (konsol)
- [ ] Nintendo eShop adapter

### 2C: Abonelik Servisleri 🌟
- [ ] Xbox Game Pass katalog adapter
- [ ] PlayStation Plus katalog adapter (Extra + Premium)
- [ ] Ubisoft+ katalog adapter
- [ ] **"Aboneliklerde mi?" işareti** — arama sonuçlarında oyun bir abonelikte varsa belirgin badge göster
- [ ] **Abonelik karşılaştırma sayfası:**
  - "Hangi serviste daha çok oyun var?"
  - "TL/oyun başına en ucuz abonelik hangisi?"
  - "Yeni eklenen oyunlar"
  - "Servisten yakında ayrılacak oyunlar" (kritik bilgi!)

### 2D: Karar Verdirici Özellikler 💡
- [ ] **Akıllı öneri:** "Bu oyunu Game Pass'le 1 ay oyna = X TL, satın al = Y TL. Tasarrufun: Z TL"
- [ ] **Bundle dedektörü:** "Bu oyun şu bundle'ın içinde, ayrı almaktan ucuz"
- [ ] **Fiyat geçmişi grafiği** (Recharts)
- [ ] **Cron job:** her gün otomatik güncelleme

---

## 🌟 Faz 3: Sosyal + Otomasyon

- [ ] Hedef fiyat alarmı + e-mail bildirim
- [ ] Kullanıcı sistemi (auth)
- [ ] Steam profilini import et (kütüphane senkronizasyonu)
- [ ] Discord botu
- [ ] PWA (mobil app gibi)
- [ ] Bölge fiyat karşılaştırması (TR vs Arjantin vs USD - efsane meme)
- [ ] Türk oyuncu topluluğu için forum/yorum

---

## 🛠️ Teknik Stack (Güncellenmiş)

| Katman | Teknoloji | Sebep |
|--------|-----------|-------|
| Backend | Node.js + Express | Hızlı geliştirme |
| Database | SQLite → Postgres (Faz 2) | Başlangıç + ölçek |
| ORM | Prisma | Tip güvenliği, kolay migration |
| Web Scraping | Cheerio (HTML) + Puppeteer (JS-heavy) | Resmi API olmayan platformlar için |
| Job Queue | node-cron + BullMQ (Faz 2) | Düzenli fiyat güncelleme |
| Frontend | React + Vite | Modern, hızlı |
| Styling | Tailwind CSS | Hızlı UI |
| Charts | Recharts | Fiyat geçmişi grafikleri |
| State | Zustand veya Context API | Basit state management |
| Hosting | Vercel + Render free tier | Ücretsiz başlangıç |

---

## 📁 Klasör Yapısı (Güncellenmiş - Çoklu Platform İçin Hazır)

```
ekonomiKOYUN/
├── backend/
│   ├── src/
│   │   ├── adapters/
│   │   │   ├── base/
│   │   │   │   ├── StoreAdapter.js              # Soyut sınıf - mağazalar
│   │   │   │   └── SubscriptionAdapter.js       # Soyut sınıf - abonelikler
│   │   │   ├── pc/
│   │   │   │   ├── steam.js                     # ✅ Faz 1
│   │   │   │   ├── epic.js                      # Faz 2
│   │   │   │   ├── gog.js                       # Faz 2
│   │   │   │   ├── microsoft-pc.js              # Faz 2
│   │   │   │   └── ubisoft-store.js             # Faz 2
│   │   │   ├── playstation/
│   │   │   │   ├── psn-store.js                 # Faz 2 (PS4/PS5 mağaza)
│   │   │   │   └── psn-plus.js                  # Faz 2 (Essential/Extra/Premium)
│   │   │   ├── xbox/
│   │   │   │   ├── xbox-store.js                # Faz 2 (konsol mağazası)
│   │   │   │   ├── gamepass.js                  # Faz 2 (Game Pass tüm tier'lar)
│   │   │   │   └── ea-play.js                   # Faz 3
│   │   │   ├── nintendo/
│   │   │   │   ├── eshop.js                     # Faz 2 (Switch eShop)
│   │   │   │   └── switch-online.js             # Faz 3
│   │   │   ├── ubisoft/
│   │   │   │   └── ubisoft-plus.js              # Faz 2 (Classics/Premium)
│   │   │   └── cloud/
│   │   │       └── geforce-now.js               # Faz 3
│   │   ├── services/
│   │   │   ├── search.js                        # Tüm adapter'larda paralel arama
│   │   │   ├── pricing.js                       # Fiyat karşılaştırma mantığı
│   │   │   ├── recommendation.js                # "Game Pass'le mi alsam?" mantığı
│   │   │   └── tracker.js                       # Periyodik güncelleme
│   │   ├── routes/
│   │   ├── jobs/                                # Cron işleri
│   │   ├── db/
│   │   └── server.js
│   ├── prisma/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameCard.jsx
│   │   │   ├── PriceComparison.jsx              # Tüm platformları yan yana göster
│   │   │   ├── PlatformGroupTabs.jsx            # PC/PlayStation/Xbox/Nintendo sekmeleri
│   │   │   ├── SubscriptionBadge.jsx            # "Game Pass'te dahil!" rozeti
│   │   │   └── SmartRecommendation.jsx          # "Bu oyun için en iyi seçenek"
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Search.jsx                       # Marka filtreli arama
│   │   │   ├── Wishlist.jsx
│   │   │   ├── GameDetail.jsx                   # Tek oyun, tüm platformlarda fiyat
│   │   │   ├── Subscriptions.jsx                # Tüm abonelikler karşılaştırma
│   │   │   └── PlatformGroup.jsx                # Sadece tek marka (örn. /platform/playstation)
│   │   ├── hooks/
│   │   ├── api/
│   │   └── App.jsx
│   └── package.json
│
├── .gitignore
├── README.md
└── PROJECT_PLAN.md
```

---

## 🗄️ Veritabanı Şeması (Genişletilmiş + Hiyerarşik)

```sql
-- Genel oyun bilgisi
games (
  id, internal_id, title, cover_url, release_date, created_at
)

-- Platform grupları (marka/sağlayıcı seviyesi)
-- Örnek: 'PC', 'PlayStation', 'Xbox', 'Nintendo', 'Cloud Streaming'
platform_groups (
  id, name, slug, icon_url, display_order
  -- Örnek: 1 | 'PlayStation' | 'playstation' | '...' | 2
  -- Örnek: 2 | 'Xbox'        | 'xbox'        | '...' | 3
)

-- Platformlar (artık bir gruba bağlı)
-- Tip enum: 'store' veya 'subscription'
platforms (
  id, group_id, name, type, region, logo_url
  -- Örnek: 1 | 1 (PlayStation) | 'PlayStation Store (PS5)' | 'store' | 'tr'
  -- Örnek: 2 | 1 (PlayStation) | 'PS Plus Extra'           | 'subscription' | 'tr'
  -- Örnek: 3 | 2 (Xbox)        | 'Xbox Store (Series X/S)' | 'store' | 'tr'
  -- Örnek: 4 | 2 (Xbox)        | 'Game Pass Ultimate'      | 'subscription' | 'tr'
)

-- Bir oyunun bir platformdaki kaydı
game_platforms (
  id, game_id, platform_id, external_id, store_url
)

-- Mağaza fiyatları (zaman serisi)
store_prices (
  id, game_platform_id, price_try, original_price_try,
  discount_percent, recorded_at
)

-- Abonelik kataloğu (oyun X servisinde Y'den Z'ye kadar dahil)
subscription_inclusions (
  id, game_platform_id, subscription_id,
  added_at, leaves_at, tier_required
  -- tier_required: 'extra', 'premium', 'ultimate' gibi
)

-- Abonelik servisinin TL fiyatı (zaman serisi)
subscription_prices (
  id, platform_id, monthly_price_try, yearly_price_try, recorded_at
)

-- Kullanıcı verileri (Faz 3'te auth gelince)
users (id, email, ...)
wishlist (id, user_id, game_id, target_price_try, added_at)
user_subscriptions (id, user_id, platform_id, expires_at)
  -- Kullanıcı abonelik bilgisi: zaten Game Pass'i varsa
  -- "Bu oyun zaten senin Game Pass'inde!" diyebiliriz
```

---

## 🇹🇷 Türkiye'ye Özel Akıllı Özellikler

Bu fikirler projeyi gerçekten **Türkiye için** yapacak:

1. **TL etiketi her yerde** — Hiçbir yerde dolar görmeyecek kullanıcı
2. **Kur farkı uyarısı** — "Bu oyunun fiyatı son 30 günde %15 arttı (kur etkisi)"
3. **"Türk hesabı uyarıları"** — Hangi oyunlar bölge kilidi yiyor, hangi platformlar Türkiye'de düzgün çalışıyor
4. **Game Pass Türkiye fiyatı vs global fiyatı karşılaştırma** — Türkiye hâlâ ucuz mu?
5. **PSN Plus Türkiye katalogu** — Bölgesel farklılıklar var, sadece Türkiye'dekini göster
6. **Türk geliştiricilerin oyunları için özel kategori** — Mount & Blade, vs.
7. **Bayram/sezon indirimi takvimi** — Steam Yaz, Kış indirimleri vs Türkiye lokasyonlu kampanyalar
8. **Cüzdan dostu öneriler** — "Bu ay X TL bütçen var, şu kombinasyonla en çok oyun"

---

## ✅ İlk Oturum Checklist (Aynı Kalıyor — Steam ile Başla)

- [ ] 1. GitHub'da `ekonomiKOYUN` adında repo oluştur
- [ ] 2. Local'de proje klasörünü kur
- [ ] 3. `.gitignore`, `README.md`, `PROJECT_PLAN.md` ekle → ilk commit
- [ ] 4. `feature/backend-setup`: Express + SQLite + soyut adapter sınıfları → PR #1
- [ ] 5. `feature/steam-adapter`: Steam adapter implementasyonu → PR #2
- [ ] 6. `feature/search-endpoint`: `/api/search` çalışsın → PR #3
- [ ] 7. `feature/wishlist-api`: Wishlist CRUD → PR #4
- [ ] 8. `feature/frontend-setup`: React + Vite → PR #5
- [ ] 9. `feature/search-ui`: Arama sayfası → PR #6
- [ ] 10. `feature/wishlist-ui`: Wishlist görüntüleme → PR #7

**Önemli:** Soyut adapter sınıflarını (`StoreAdapter`, `SubscriptionAdapter`) **baştan** doğru tasarla. Sonra Epic, GOG, Game Pass eklediğinde keyfin yerine gelecek.

---

## 💡 Önemli Notlar

0. **⚠️ GitHub Actions / CI/CD KULLANMA!**
   - Bu projede `.github/workflows/` klasörü AÇILMAYACAK.
   - Hiçbir CI/CD pipeline kurulmayacak (test runner, auto-deploy, lint check vs.)
   - Sebep: Geliştirici ücretli plan üzerinde, Actions her çalıştığında ücret kesiliyordu.
   - Hesapta budget alert'ler aktif ($0 spending limit), ama yine de tetiklemeyelim.
   - Test/lint/build hepsi LOKAL'de yapılacak.
   - Deploy LOKAL'de manuel yapılacak (örn. `vercel --prod` komutu lokal terminalden).

1. **Scraping'e dikkat:** Resmi API'si olmayan platformları scrape ederken nazik ol — uygun bekleme süreleri, User-Agent ayarla, robots.txt'e bak.
2. **Veri güncellik:** Mağaza fiyatları günde 1-2 kez, abonelik katalogları haftada 1-2 kez güncellense yeter. Spam'leme.
3. **Cache her yerde:** SQLite + Redis (Faz 2) ile API çağrılarını minimize et.
4. **Yasal:** Sadece halka açık fiyat bilgisi gösteriyoruz. Hiçbir oyunu dağıtmıyoruz, satmıyoruz. Sadece "şurada şu fiyata var" diyoruz, link veriyoruz.
5. **Performance:** "Tüm platformlarda ara" işlemi yavaş olabilir → paralel sorgu + progressive loading kullan.

---

## 🎓 Bu Genişletilmiş Versiyon Ne Öğretiyor?

Önceki listeye ek olarak:
- ✅ **Web scraping teknikleri** (Cheerio + Puppeteer)
- ✅ **Job queue / cron jobs** (BullMQ ile)
- ✅ **Rate limiting & caching stratejileri**
- ✅ **Çok kaynaklı veri birleştirme** (search aggregation)
- ✅ **Karmaşık veri modelleme** (subscription inclusions, time series)
- ✅ **Daha gerçekçi proje yönetimi** (faz planı, MVP'den genişleme)
- ✅ **Domain knowledge** (oyun ekosistemi, abonelik modelleri)

---

**Son güncelleme:** v2.1 — Konsol mağazaları ve abonelikler **marka bazlı alt kategorilere** ayrıldı (PlayStation/Xbox/Nintendo) 🎮🎮🎮
**Sonraki adım:** Hazır olunca Faz 1 checklist'inden başla. Steam ile başla, mimariyi doğru kur, gerisi domino taşı gibi gelir.
