import app from '../server/index.js';
import { initDatabase } from '../server/db/init.js';

let isDbInitialized = false;

export default async function handler(req, res) {
  if (!isDbInitialized) {
    try {
      await initDatabase();
      isDbInitialized = true;
    } catch (err) {
      console.warn('[Vercel Serverless DB Init Notice]:', err?.message);
    }
  }

  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
