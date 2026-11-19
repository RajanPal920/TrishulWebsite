import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function formatSqlDate(val) {
  if (!val) return null;
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 19).replace('T', ' ');
  } catch {
    return null;
  }
}

async function migrate() {
  console.log('[MySQL Migration] Connecting to MySQL server at 127.0.0.1:3306...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  console.log('[MySQL Migration] Connected. Ensuring database trishul_db exists...');
  await connection.query('CREATE DATABASE IF NOT EXISTS trishul_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
  await connection.query('USE trishul_db;');

  console.log('[MySQL Migration] Applying MySQL schema (tables & constraints)...');
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.mysql.sql'), 'utf8');
  await connection.query(schemaSql);
  console.log('[MySQL Migration] Schema successfully applied.');

  // Import SQLite data if trishul.db exists
  const sqliteDbPath = path.resolve(__dirname, '../data/trishul.db');
  if (fs.existsSync(sqliteDbPath)) {
    console.log('[MySQL Migration] Reading existing SQLite database records from', sqliteDbPath);
    try {
      const { all } = await import('./connection.js');

      // 1. Migrate Users
      const sqliteUsers = await all('SELECT * FROM users');
      console.log(`[MySQL Migration] Found ${sqliteUsers.length} user(s) in SQLite.`);
      for (const u of sqliteUsers) {
        await connection.query(
          `INSERT INTO users (id, email, password_hash, full_name, company, phone, role, google_id, avatar_url, login_method, last_login_at, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             full_name = VALUES(full_name),
             company = VALUES(company),
             phone = VALUES(phone),
             role = VALUES(role),
             google_id = COALESCE(VALUES(google_id), google_id),
             avatar_url = COALESCE(VALUES(avatar_url), avatar_url),
             last_login_at = COALESCE(VALUES(last_login_at), last_login_at);`,
          [
            u.id,
            u.email,
            u.password_hash,
            u.full_name,
            u.company,
            u.phone,
            u.role || 'customer',
            u.google_id,
            u.avatar_url,
            u.google_id ? 'google' : 'password',
            formatSqlDate(u.last_login_at),
            formatSqlDate(u.created_at) || formatSqlDate(new Date()),
            formatSqlDate(u.updated_at) || formatSqlDate(new Date()),
          ]
        );
      }

      // 2. Migrate User Sessions
      const sqliteSessions = await all('SELECT * FROM user_sessions');
      console.log(`[MySQL Migration] Found ${sqliteSessions.length} session(s) in SQLite.`);
      for (const s of sqliteSessions) {
        await connection.query(
          `INSERT INTO user_sessions (id, user_id, token, expires_at, created_at)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE expires_at = VALUES(expires_at);`,
          [s.id, s.user_id, s.token, formatSqlDate(s.expires_at), formatSqlDate(s.created_at) || formatSqlDate(new Date())]
        );
      }

      // 3. Migrate Stock Items
      const sqliteStock = await all('SELECT * FROM stock_items');
      console.log(`[MySQL Migration] Found ${sqliteStock.length} stock item(s) in SQLite.`);
      for (const item of sqliteStock) {
        await connection.query(
          `INSERT INTO stock_items (id, category, grade, grade_slug, product, product_slug, size, rating, spec, quantity, unit, location, status, heat_ref, verified_on, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE quantity = VALUES(quantity);`,
          [
            item.id,
            item.category,
            item.grade,
            item.grade_slug || null,
            item.product || null,
            item.product_slug || null,
            item.size || null,
            item.rating || null,
            item.spec || null,
            item.quantity || 0,
            item.unit || 'pcs',
            item.location || 'Mumbai',
            item.status || 'ready',
            item.heat_ref || null,
            item.verified_on || null,
            formatSqlDate(item.created_at) || formatSqlDate(new Date()),
          ]
        );
      }

      // 4. Migrate Product Requests
      const sqliteProductReqs = await all('SELECT * FROM product_requests');
      console.log(`[MySQL Migration] Found ${sqliteProductReqs.length} product request(s) in SQLite.`);
      for (const pr of sqliteProductReqs) {
        await connection.query(
          `INSERT INTO product_requests (id, user_id, product_id, product_name, material, size, quantity, specification, notes, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE status = VALUES(status);`,
          [
            pr.id,
            pr.user_id,
            pr.product_id,
            pr.product_name,
            pr.material,
            pr.size,
            pr.quantity,
            pr.specification,
            pr.notes,
            pr.status || 'Pending Review',
            formatSqlDate(pr.created_at) || formatSqlDate(new Date()),
            formatSqlDate(pr.updated_at) || formatSqlDate(new Date()),
          ]
        );
      }
    } catch (migErr) {
      console.warn('[MySQL Migration Notice]: SQLite data read warning:', migErr.message);
    }
  }

  // Ensure default Owner Administrator exists
  const adminEmail = 'admin@trishulmetal.com';
  const [adminRows] = await connection.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
  if (!adminRows || adminRows.length === 0) {
    const adminId = 'admin-trishul-001';
    const adminHash = await bcrypt.hash('Admin@Trishul2026!', 10);
    const now = new Date();
    await connection.query(
      `INSERT INTO users (id, email, password_hash, full_name, company, phone, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'admin', ?, ?)`,
      [adminId, adminEmail, adminHash, 'Owner Administrator', 'Trishul Metals & Alloys', '+91 22 2389 4500', now, now]
    );
    console.log('[MySQL Migration] Seeded default Owner Administrator: admin@trishulmetal.com');
  }

  await connection.end();
  console.log('[MySQL Migration] Successfully completed migration to MySQL (trishul_db).');
}

migrate().catch((err) => {
  console.error('[MySQL Migration Error]:', err);
  process.exit(1);
});
