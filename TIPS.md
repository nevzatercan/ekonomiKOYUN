# 📝 Tüyolar & Öğrendiklerimiz

> ekonomiKOYUN projesinde yol alırken karşılaştığımız küçük ama değerli bilgiler.
> Hızlı bakılabilsin diye konu başlıklarına ayrıldı.

---

## 🌳 Git & GitHub

### 1. Boş klasörleri Git görmez
Git, **dosyaları** izler — klasörleri değil. Bir klasör boşsa, `git add` ile staging'e koymaya çalışsan da gözükmez. Çözüm: o klasöre `.gitkeep` adında boş bir dosya koymak (isim aslında konvansiyon, `.placeholder` da yazsan olur). Klasör dolduğunda `.gitkeep`'i silebilirsin.

### 2. Conventional Commits formatı
Commit mesajının başına ne tür bir değişiklik olduğunu söyleyen bir "tip" yazıyoruz. Yaygın tipler:
- `feat:` — yeni özellik
- `fix:` — bug düzeltmesi
- `chore:` — build, config, klasör, isim değişiklikleri (kod davranışını etkilemez)
- `docs:` — sadece dokümantasyon
- `refactor:` — kod yeniden düzenleme (davranış aynı)
- `test:` — test ekleme/düzenleme
- `style:` — formatting, noktalama (kod davranışı yok)

Scope (parantez içi) opsiyonel ama faydalı: `feat(adapters): steam adapter ekle`. Böylece hangi modül etkilenmiş tek bakışta belli oluyor.

### 3. Branch isimlendirme
`feature/açıklama-tireli` şeklinde. Örn:
- `feature/backend-setup`
- `feature/steam-adapter`
- `fix/wishlist-duplicate`

`main` üstüne direkt commit atılmıyor; her iş bir branch'te → PR ile birleşiyor.

### 4. `git checkout -b <branch>` ile yeni branch + geçiş bir adımda
`git branch yeni && git checkout yeni` yerine `git checkout -b yeni` kısayolu var. Modern Git'te `git switch -c yeni` de aynı işi yapıyor (daha okunabilir).

### 5. `git status --short` ile hızlı bakış
Tam çıktıdan ziyade `M`, `A`, `??` gibi tek harfli durum kodlarıyla özet görünür. Büyük diff'lerde işe yarıyor.

---

## 🏗️ Mimari & Tasarım

### 6. Adapter Pattern neden işe yarıyor?
Her platform (Steam, Epic, GOG, PSN...) farklı API/şema sunuyor. Eğer bunları doğrudan `service` katmanında çağırırsan, yeni platform eklerken her yeri değiştirmen gerekir. Adapter Pattern: ortak bir **interface** tanımla (`searchGame`, `getPrice`...) — her platform kendi sınıfında bu metodları implement etsin. Üst katman (search service) tüm adapter'lara aynı şekilde konuşur. Yeni platform = yeni dosya, başka kod değişmez.

### 7. JavaScript'te "soyut sınıf" yok ama taklit edebiliyoruz
Java/C#'taki `abstract class` JS'de yok. Yaygın taktik: base sınıfta metodu `throw new Error('not implemented')` ile bırak. Alt sınıf override etmezse runtime'da hata patlar. Tip güvenliği için TypeScript daha temiz çözer ama JS'de bu yeterli.

---

(devamı geldikçe eklenecek...)

---

## ⚙️ Node.js & Express

### 8. ESM vs CommonJS — `"type": "module"` ne demek?
Node.js'in iki modül sistemi var. Eski olan **CommonJS** (`require`, `module.exports`), yeni olan **ESM** (`import`, `export`). `package.json`'a `"type": "module"` ekleyince tüm `.js` dosyaları ESM modülü olarak yorumlanır. Avantajı: modern syntax, top-level `await`, daha iyi tree-shaking. Dezavantajı: bazı eski kütüphaneler henüz ESM'e geçmemiş — `require` yerine `import` kullanman gerekiyor.

> Bu projede ESM seçildi — `import` / `export` her yerde.

### 9. `__dirname` ESM'de yok — ama taklit edilebilir
CommonJS'de `__dirname` otomatik geliyordu. ESM'de yok. Çözüm:
```js
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
```
`import.meta.url` dosyanın tam URL'ini verir (`file:///...`). `fileURLToPath` bunu normal dosya yoluna çevirir.

### 10. SQLite WAL modu neden açıldı?
Varsayılan SQLite modu (DELETE journal) yazma sırasında veritabanını kilitler; aynı anda okuma yapılamaz. **WAL (Write-Ahead Logging)** modunda okuma ve yazma aynı anda olabilir — web API'sinde birden fazla istek eşzamanlı geldiğinde bu kritik. Tek satırla açılır:
```js
db.pragma('journal_mode = WAL');
```

### 11. `nodemon` ile geliştirme kolaylığı
`node src/server.js` ile başlattığında kod değişikliklerinde sunucuyu kendin yeniden başlatman gerekir. `nodemon src/server.js` ise dosya değişikliklerini izler ve sunucuyu otomatik yeniden başlatır. `npm run dev` ile çalıştır.

---

## 🔌 Adapter Pattern

### 12. `new.target` ile doğrudan örneklemeyi engelleme
Bir sınıfın sadece alt sınıflar üzerinden kullanılmasını zorlamak için `constructor`'da şunu yaz:
```js
if (new.target === StoreAdapter) {
  throw new Error('StoreAdapter doğrudan örneklenemez.');
}
```
`new.target` her zaman `new` ile çağrılan sınıfı gösterir. `new StoreAdapter()` → `new.target === StoreAdapter` ✅ hata. `new SteamAdapter()` → `new.target === SteamAdapter` ✅ geçer.

### 13. `.env.example` neden commit'lenir, `.env` neden commit'lenmez?
`.env` dosyası **gerçek API anahtarlarını, şifreleri** barındırır — git geçmişine girerse sızdırmış olursun. `.env.example` ise sadece hangi değişkenlerin gerektiğini gösteren şablon — sır yok, commit'lenmesi lazım ki başka geliştirici (ya da gelecekteki sen) ne ayarlaması gerektiğini bilsin.
