import app from '../server/index.js';
import { initDatabase } from '../server/db/init.js';
import { ensureConnected } from '../server/db/connection.js';

let isDbInitialized = false;

export default async function handler(req, res) {
  try {
    await ensureConnected();
  } catch (connErr) {
    console.warn('[Vercel Serverless Connection Notice]:', connErr?.message);
  }

  if (!isDbInitialized) {
    try {
      await initDatabase();
      isDbInitialized = true;
    } catch (err) {
      console.warn('[Vercel Serverless DB Init Notice]:', err?.message);
    }
  }

  return new Promise((resolve, reject) => {
    res.on('finish', resolve);
    res.on('close', resolve);
    app(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
