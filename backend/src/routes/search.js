import { Router } from 'express';
import { SteamAdapter } from '../adapters/pc/steam.js';

const router = Router();
const steam = new SteamAdapter();

// GET /api/search?q=cyberpunk
// Maksimum 5 sonuç döner — limit artırılmak istenirse ?limit=N eklenebilir (max 5)
router.get('/', async (req, res) => {
  const query = req.query.q?.trim();

  if (!query) {
    return res.status(400).json({ error: 'q parametresi zorunlu. Örnek: /api/search?q=witcher' });
  }

  const limit = Math.min(parseInt(req.query.limit) || 5, 5);

  try {
    const results = await steam.searchGame(query, limit);

    if (results.length === 0) {
      return res.json({ query, results: [], message: 'Sonuç bulunamadı.' });
    }

    res.json({ query, count: results.length, results });
  } catch (err) {
    console.error('[search] Hata:', err.message);
    res.status(502).json({ error: 'Steam\'e ulaşılamadı.', detail: err.message });
  }
});

export default router;
