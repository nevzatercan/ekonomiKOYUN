/**
 * Abonelik servisleri için soyut temel sınıf.
 * Game Pass, PSN Plus, Ubisoft+, Nintendo Switch Online gibi
 * her abonelik servisi bu sınıfı extend eder.
 *
 * StoreAdapter'dan ayrı tutuldu çünkü abonelik mantığı farklı:
 * oyun "satın alınmaz", belirli bir tier'da kataloğa dahil edilir.
 */
export class SubscriptionAdapter {
  /**
   * @param {string} serviceId   - Benzersiz servis kimliği (örn. 'gamepass', 'psn-plus')
   * @param {string} serviceName - Kullanıcıya gösterilen isim (örn. 'Xbox Game Pass')
   * @param {string} provider    - Sağlayıcı (örn. 'microsoft', 'sony', 'ubisoft', 'nintendo')
   * @param {string} region      - Varsayılan bölge (Türkiye: 'tr')
   */
  constructor(serviceId, serviceName, provider, region = 'tr') {
    if (new.target === SubscriptionAdapter) {
      throw new Error('SubscriptionAdapter doğrudan örneklenemez — bir alt sınıf oluşturun.');
    }
    this.serviceId = serviceId;
    this.serviceName = serviceName;
    this.provider = provider;
    this.region = region;
  }

  /**
   * Servisteki tüm oyunları döndürür.
   * Büyük kataloglarda sayfalama uygulanabilir.
   * @returns {Promise<CatalogGame[]>}
   */
  async getCatalog() {
    throw new Error(`[${this.serviceId}] getCatalog() implement edilmedi.`);
  }

  /**
   * Belirli bir oyunun bu serviste mevcut olup olmadığını kontrol eder.
   * @param {string} gameTitle - Oyun adı (fuzzy match uygulanabilir)
   * @returns {Promise<InclusionResult>}
   */
  async isGameIncluded(gameTitle) {
    throw new Error(`[${this.serviceId}] isGameIncluded() implement edilmedi.`);
  }

  /**
   * Servisin abonelik katmanlarını (tier) döndürür.
   * Örn. PSN Plus → ['essential', 'extra', 'premium']
   * Örn. Game Pass → ['pc', 'console', 'ultimate']
   * @returns {Promise<SubscriptionTier[]>}
   */
  async getSubscriptionTiers() {
    throw new Error(`[${this.serviceId}] getSubscriptionTiers() implement edilmedi.`);
  }

  /**
   * Servisin aylık TL fiyatını döndürür (tier bazında).
   * @param {string} [tier] - Tier ID (belirtilmezse en düşük tier)
   * @returns {Promise<SubscriptionPrice>}
   */
  async getPriceTry(tier) {
    throw new Error(`[${this.serviceId}] getPriceTry() implement edilmedi.`);
  }

  /**
   * Yakında servisten ayrılacak oyunları döndürür.
   * Kullanıcılar için kritik bilgi — "oynamadan önce servis bırakıyor!"
   * @returns {Promise<LeavingSoonGame[]>}
   */
  async getLeavingSoon() {
    throw new Error(`[${this.serviceId}] getLeavingSoon() implement edilmedi.`);
  }

  /**
   * Yeni eklenen oyunları döndürür.
   * @param {number} [daysSince=7] - Kaç gün öncesinden bu yana eklenenleri getir
   * @returns {Promise<CatalogGame[]>}
   */
  async getRecentlyAdded(daysSince = 7) {
    throw new Error(`[${this.serviceId}] getRecentlyAdded() implement edilmedi.`);
  }

  /**
   * Adapter'ın sağlıklı çalışıp çalışmadığını kontrol eder.
   * @returns {Promise<boolean>}
   */
  async ping() {
    throw new Error(`[${this.serviceId}] ping() implement edilmedi.`);
  }

  toString() {
    return `SubscriptionAdapter(${this.serviceId}, provider=${this.provider}, region=${this.region})`;
  }
}

/*
 * --- Dönüş tipi şemaları (JSDoc referansı) ---
 *
 * @typedef {Object} CatalogGame
 * @property {string}   externalId
 * @property {string}   title
 * @property {string}   [coverUrl]
 * @property {string}   tier          - Hangi abonelik katmanında dahil ('essential', 'extra'…)
 * @property {Date}     [addedAt]
 * @property {Date}     [leavesAt]    - Servisten ne zaman çıkıyor (null = belirsiz)
 *
 * @typedef {Object} InclusionResult
 * @property {boolean}  included
 * @property {string}   [tier]        - Hangi tier'da dahil
 * @property {string}   [externalId]  - Katalogdaki ID
 *
 * @typedef {Object} SubscriptionTier
 * @property {string}   id            - Örn. 'essential', 'extra', 'ultimate'
 * @property {string}   name          - Kullanıcıya gösterilen ad
 * @property {number}   monthlyPriceTry
 * @property {number}   [yearlyPriceTry]
 *
 * @typedef {Object} SubscriptionPrice
 * @property {string}   tier
 * @property {number}   monthlyPriceTry
 * @property {number}   [yearlyPriceTry]
 * @property {Date}     recordedAt
 *
 * @typedef {Object} LeavingSoonGame
 * @property {string}   externalId
 * @property {string}   title
 * @property {Date}     leavesAt
 * @property {string}   tier
 */
