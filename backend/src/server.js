import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

// SQLite bağlantısını başlat — DB dosyası backend/data/ altında oluşur
const DB_PATH = process.env.DATABASE_URL || join(__dirname, '..', 'data', 'ekonomikoyun.db');

let db;
try {
  const { mkdirSync } = await import('fs');
  mkdirSync(join(__dirname, '..', 'data'), { recursive: true });
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL'); // eşzamanlı okuma için
  console.log(`[DB] SQLite bağlantısı kuruldu: ${DB_PATH}`);
} catch (err) {
  console.error('[DB] SQLite başlatılamadı:', err.message);
  process.exit(1);
}

// health-check endpoint — deployment ortamında "uygulama canlı mı?" kontrolü için
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ekonomiKOYUN-backend',
    timestamp: new Date().toISOString(),
    db: db.open ? 'connected' : 'disconnected',
  });
});

app.listen(PORT, () => {
  console.log(`[Server] ekonomiKOYUN backend ${PORT} portunda çalışıyor`);
  console.log(`[Server] Health-check: http://localhost:${PORT}/health`);
});

export { db };
