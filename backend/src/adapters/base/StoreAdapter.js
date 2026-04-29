/**
 * Satın alma mağazaları için soyut temel sınıf.
 * Steam, Epic, GOG, PSN Store, Xbox Store, Nintendo eShop gibi
 * her mağaza bu sınıfı extend eder ve tüm metodları implement eder.
 *
 * Yeni mağaza eklemek = bu sınıfı extend eden yeni bir dosya yazmak.
 * Üst katman (search service) tüm mağazalara aynı arayüzle konuşur.
 */
export class StoreAdapter {
  /**
   * @param {string} storeId   - Benzersiz mağaza kimliği (örn. 'steam', 'epic', 'gog')
   * @param {string} storeName - Kullanıcıya gösterilen isim (örn. 'Steam', 'Epic Games Store')
   * @param {string} region    - Varsayılan bölge (Türkiye: 'tr')
   */
  constructor(storeId, storeName, region = 'tr') {
    if (new.target === StoreAdapter) {
      throw new Error('StoreAdapter doğrudan örneklenemez — bir alt sınıf oluşturun.');
    }
    this.storeId = storeId;
    this.storeName = storeName;
    this.region = region;
  }

  /**
   * Mağazada oyun arar.
   * @param {string} query - Arama terimi
   * @returns {Promise<SearchResult[]>}
   */
  async searchGame(query) {
    throw new Error(`[${this.storeId}] searchGame() implement edilmedi.`);
  }

  /**
   * Belirli bir oyunun TL fiyatını çeker.
   * @param {string} gameId  - Mağazaya özgü oyun kimliği
   * @param {string} region  - Bölge kodu (default: this.region)
   * @returns {Promise<PriceResult>}
   */
  async getPrice(gameId, region = this.region) {
    throw new Error(`[${this.storeId}] getPrice() implement edilmedi.`);
  }

  /**
   * Mağazadaki güncel indirimleri listeler.
   * @returns {Promise<DealResult[]>}
   */
  async getCurrentDeals() {
    throw new Error(`[${this.storeId}] getCurrentDeals() implement edilmedi.`);
  }

  /**
   * Adapter'ın sağlıklı çalışıp çalışmadığını kontrol eder.
   * @returns {Promise<boolean>}
   */
  async ping() {
    throw new Error(`[${this.storeId}] ping() implement edilmedi.`);
  }

  toString() {
    return `StoreAdapter(${this.storeId}, region=${this.region})`;
  }
}

/*
 * --- Dönüş tipi şemaları (JSDoc referansı) ---
 *
 * @typedef {Object} SearchResult
 * @property {string} externalId   - Mağazadaki oyun ID'si
 * @property {string} title        - Oyun adı
 * @property {string} [coverUrl]   - Kapak resmi URL'i
 * @property {number} [priceTry]   - Anlık TL fiyatı (varsa)
 * @property {string} storeUrl     - Mağaza sayfası URL'i
 *
 * @typedef {Object} PriceResult
 * @property {string} externalId
 * @property {number} priceTry            - Güncel TL fiyatı
 * @property {number} [originalPriceTry]  - İndirimsiz TL fiyatı
 * @property {number} [discountPercent]   - İndirim yüzdesi (0-100)
 * @property {Date}   recordedAt
 *
 * @typedef {Object} DealResult
 * @property {string} externalId
 * @property {string} title
 * @property {number} priceTry
 * @property {number} originalPriceTry
 * @property {number} discountPercent
 * @property {string} storeUrl
 * @property {Date}   [dealEndsAt]
 */
