import { StoreAdapter } from '../base/StoreAdapter.js';

const SEARCH_URL = 'https://steamcommunity.com/actions/SearchApps';
const APPDETAILS_URL = 'https://store.steampowered.com/api/appdetails';
const FEATURED_URL = 'https://store.steampowered.com/api/featured';
const STORE_BASE = 'https://store.steampowered.com/app';

// Steam, Türkiye'de 2022 sonrası TL'yi bıraktı.
// cc=tr ile TR bölgesine özel USD fiyatı geliyor (küresel fiyattan düşük olabilir).
const STEAM_REGION = 'tr';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class SteamAdapter extends StoreAdapter {
  constructor() {
    super('steam', 'Steam', STEAM_REGION);
    this.delayMs = 300; // Steam'e nazik ol — istek aralarında bekle
  }

  async searchGame(query, limit = 5) {
    const url = `${SEARCH_URL}/${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Steam arama başarısız: HTTP ${res.status}`);

    const results = await res.json();
    return results.slice(0, limit).map((item) => ({
      externalId: String(item.appid),
      title: item.name,
      coverUrl: item.logo,
      storeUrl: `${STORE_BASE}/${item.appid}`,
    }));
  }

  async getPrice(gameId) {
    await sleep(this.delayMs);
    const url = `${APPDETAILS_URL}?appids=${gameId}&filters=price_overview,name&cc=${this.region}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Steam fiyat isteği başarısız: HTTP ${res.status}`);

    const json = await res.json();
    const entry = json[String(gameId)];

    if (!entry?.success) throw new Error(`Steam: appid ${gameId} bulunamadı`);

    const data = entry.data;

    // Ücretsiz oyun
    if (!data.price_overview) {
      return {
        externalId: String(gameId),
        price: 0,
        originalPrice: 0,
        discountPercent: 0,
        currency: 'USD',
        priceFormatted: 'Ücretsiz',
        originalPriceFormatted: 'Ücretsiz',
        region: this.region,
        recordedAt: new Date(),
      };
    }

    const p = data.price_overview;
    return {
      externalId: String(gameId),
      // Steam fiyatları kuruş cinsinden gelir (cent), 100'e bölerek dolar elde edilir
      price: p.final / 100,
      originalPrice: p.initial / 100,
      discountPercent: p.discount_percent,
      currency: p.currency,           // 'USD' (TR bölgesi)
      priceFormatted: p.final_formatted,
      originalPriceFormatted: p.initial_formatted,
      region: this.region,
      recordedAt: new Date(),
    };
  }

  async getCurrentDeals(limit = 5) {
    const url = `${FEATURED_URL}/?cc=${this.region}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Steam öne çıkanlar isteği başarısız: HTTP ${res.status}`);

    const data = await res.json();
    const items = data.featured_win ?? [];

    return items
      .filter((item) => item.discount_percent > 0)
      .slice(0, limit)
      .map((item) => ({
        externalId: String(item.id),
        title: item.name,
        price: item.final_price / 100,
        originalPrice: item.original_price / 100,
        discountPercent: item.discount_percent,
        currency: 'USD',
        priceFormatted: `$${(item.final_price / 100).toFixed(2)}`,
        storeUrl: `${STORE_BASE}/${item.id}`,
      }));
  }

  async ping() {
    try {
      const res = await fetch(`${APPDETAILS_URL}?appids=10&filters=name`, {
        signal: AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
