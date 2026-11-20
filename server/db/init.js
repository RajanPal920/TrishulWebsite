import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'node:url';
import { db, exec, get, run, all, getActiveEngine, ensureConnected, sqliteDb } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STOCK_ITEMS_SEED = [
  ['Inconel 625','inconel-625','Weld Neck Flanges','weld-neck-flanges','Flanges','1/2" - 8"','Class 150 / 300','ASTM B564 UNS N06625',186,'pcs','Mumbai','ready','H-6251A'],
  ['Inconel 625','inconel-625','90° Elbows','90-degree-elbows','Buttweld Fittings','1/2" - 6"','SCH 40 / 80','ASTM B366 WPNCI',240,'pcs','Mumbai','ready','H-6253C'],
  ['Inconel 625','inconel-625','Seamless Pipes','seamless-pipes','Pipes & Tubes','1/2" - 6"','SCH 40 / 80','ASTM B444 / B829',820,'m','Mumbai','ready','H-6255P'],
  ['Inconel 600','inconel-600','Weld Neck Flanges','weld-neck-flanges','Flanges','1/2" - 6"','Class 150 / 300','ASTM B564 UNS N06600',94,'pcs','Mumbai','ready','H-6001A'],
  ['Inconel 601','inconel-601','Round Bars','round-bars','Bars','12 - 90 mm','—','ASTM B166 UNS N06601',1450,'kg','Mumbai','limited','H-6011B'],
  ['Incoloy 800','incoloy-800','Blind Flanges','blind-flanges','Flanges','1/2" - 10"','Class 150 / 300','ASTM B564 UNS N08800',72,'pcs','Mumbai','ready','H-8001A'],
  ['Incoloy 825','incoloy-825','Weld Neck Flanges','weld-neck-flanges','Flanges','1/2" - 12"','Class 150 - 900','ASTM B564 UNS N08825',148,'pcs','Mumbai','ready','H-8251A'],
  ['Incoloy 825','incoloy-825','Heat Exchanger Tubes','heat-exchanger-tubes','Pipes & Tubes','19.05 x 2.11 mm','—','ASTM B163 / B704',2600,'m','Mumbai','ready','H-8253T'],
  ['Hastelloy C276','hastelloy-c276','Socket Weld Fittings','socket-weld-fittings','Forged Fittings','1/2" - 2"','Class 3000 / 6000','ASTM B564 UNS N10276',310,'pcs','Mumbai','ready','H-C2761F'],
  ['Hastelloy C276','hastelloy-c276','Plates','plates','Sheets, Plates & Coils','3 - 12 mm','—','ASTM B575 UNS N10276',980,'kg','Mumbai','limited','H-C2762P'],
  ['Hastelloy C22','hastelloy-c22','90° Elbows','90-degree-elbows','Buttweld Fittings','1/2" - 4"','SCH 40 / 80','ASTM B366 WPHC22',126,'pcs','Mumbai','ready','H-C221E'],
  ['Monel 400','monel-400','Weld Neck Flanges','weld-neck-flanges','Flanges','1/2" - 8"','Class 150 / 300','ASTM B564 UNS N04400',164,'pcs','Mumbai','ready','H-M4001A'],
  ['Monel 400','monel-400','Threaded Fittings','threaded-fittings','Forged Fittings','1/2" - 2"','Class 3000','ASTM B564 UNS N04400',208,'pcs','Mumbai','ready','H-M4002F'],
  ['Nickel 200','nickel-200','Weld Neck Flanges','weld-neck-flanges','Flanges','1/2" - 6"','Class 150 / 300','ASTM B564 UNS N02200',88,'pcs','Mumbai','ready','H-N2001A'],
  ['Nickel 200','nickel-200','Seamless Pipes','seamless-pipes','Pipes & Tubes','1/2" - 4"','SCH 40 / 80','ASTM B161 UNS N02200',540,'m','Mumbai','limited','H-N2002P'],
  ['Nickel 201','nickel-201','Sheets & Coils','sheets-coils','Sheets, Plates & Coils','1 - 6 mm','—','ASTM B162 UNS N02201',760,'kg','Mumbai','ready','H-N2011S'],
  ['Alloy 20','alloy-20','Weld Neck Flanges','weld-neck-flanges','Flanges','1/2" - 8"','Class 150 / 300','ASTM B462 UNS N08020',96,'pcs','Mumbai','ready','H-A201A'],
  ['Duplex 2205','duplex-2205','Weld Neck Flanges','weld-neck-flanges','Flanges','1/2" - 24"','Class 150 - 1500','ASTM A182 F51 / F60',420,'pcs','Mumbai','ready','H-22051A'],
  ['Duplex 2205','duplex-2205','90° Elbows','90-degree-elbows','Buttweld Fittings','1/2" - 12"','SCH 10S - 80S','ASTM A815 WP-S31803',380,'pcs','Mumbai','ready','H-22052E'],
  ['Duplex 2205','duplex-2205','Seamless Pipes','seamless-pipes','Pipes & Tubes','1/2" - 10"','SCH 10S - 80S','ASTM A790 UNS S31803',1900,'m','Mumbai','ready','H-22053P'],
  ['Duplex 2205','duplex-2205','Round Bars','round-bars','Bars','16 - 200 mm','—','ASTM A276 / A479 S31803',4200,'kg','Mumbai','ready','H-22054B'],
  ['Super Duplex 2507','super-duplex-2507','Weld Neck Flanges','weld-neck-flanges','Flanges','1/2" - 16"','Class 150 - 1500','ASTM A182 F53',236,'pcs','Mumbai','ready','H-25071A'],
  ['Super Duplex 2507','super-duplex-2507','Blind Flanges','blind-flanges','Flanges','1/2" - 12"','Class 150 - 900','ASTM A182 F53',118,'pcs','Mumbai','ready','H-25072A'],
  ['Super Duplex 2507','super-duplex-2507','Seamless Pipes','seamless-pipes','Pipes & Tubes','1/2" - 8"','SCH 40S / 80S','ASTM A790 UNS S32750',1150,'m','Mumbai','limited','H-25073P'],
  ['Super Duplex S32760','super-duplex-s32760','Socket Weld Fittings','socket-weld-fittings','Forged Fittings','1/2" - 2"','Class 3000 / 6000','ASTM A182 F55',260,'pcs','Mumbai','ready','H-32760F'],
  ['SS 304','stainless-steel-304','Weld Neck Flanges','weld-neck-flanges','Flanges','1/2" - 24"','Class 150 - 900','ASTM A182 F304',1250,'pcs','Mumbai','ready','H-3041A'],
  ['SS 304','stainless-steel-304','Seamless Pipes','seamless-pipes','Pipes & Tubes','1/2" - 12"','SCH 10S - 80S','ASTM A312 TP304',5200,'m','Mumbai','ready','H-3042P'],
  ['SS 316','stainless-steel-316','Weld Neck Flanges','weld-neck-flanges','Flanges','1/2" - 24"','Class 150 - 1500','ASTM A182 F316',1480,'pcs','Mumbai','ready','H-3161A'],
  ['SS 316','stainless-steel-316','Slip-On Flanges','slip-on-flanges','Flanges','1/2" - 24"','Class 150 / 300','ASTM A182 F316',960,'pcs','Mumbai','ready','H-3162A'],
  ['SS 316','stainless-steel-316','90° Elbows','90-degree-elbows','Buttweld Fittings','1/2" - 16"','SCH 10S - 80S','ASTM A403 WP316',1620,'pcs','Mumbai','ready','H-3163E'],
  ['SS 316','stainless-steel-316','Instrumentation Tubing','instrumentation-tubing','Pipes & Tubes','6 - 25.4 mm OD','—','ASTM A269 TP316',3400,'m','Mumbai','ready','H-3164T'],
  ['SS 316','stainless-steel-316','Plates','plates','Sheets, Plates & Coils','3 - 40 mm','—','ASTM A240 316',8600,'kg','Mumbai','ready','H-3165P'],
  ['SS 321','stainless-steel-321','Weld Neck Flanges','weld-neck-flanges','Flanges','1/2" - 12"','Class 150 / 300','ASTM A182 F321',288,'pcs','Mumbai','ready','H-3211A'],
  ['SS 347','stainless-steel-347','90° Elbows','90-degree-elbows','Buttweld Fittings','1/2" - 8"','SCH 40S / 80S','ASTM A403 WP347',176,'pcs','Mumbai','limited','H-3471E'],
  ['SS 904L','stainless-steel-904l','Weld Neck Flanges','weld-neck-flanges','Flanges','1/2" - 10"','Class 150 / 300','ASTM A182 F904L',124,'pcs','Mumbai','ready','H-9041A'],
  ['254 SMO','254-smo','Weld Neck Flanges','weld-neck-flanges','Flanges','1/2" - 8"','Class 150 / 300','ASTM A182 F44',86,'pcs','Mumbai','limited','H-2541A'],
  ['SS 310S','stainless-steel-310s','Round Bars','round-bars','Bars','16 - 150 mm','—','ASTM A276 310S',2300,'kg','Mumbai','ready','H-310S1B'],
  ['Carbon Steel A105','carbon-steel-a105','Weld Neck Flanges','weld-neck-flanges','Flanges','1/2" - 24"','Class 150 - 2500','ASTM A105N',3400,'pcs','Mumbai','ready','H-A1051A'],
  ['Carbon Steel A105','carbon-steel-a105','Blind Flanges','blind-flanges','Flanges','1/2" - 24"','Class 150 - 1500','ASTM A105N',1800,'pcs','Mumbai','ready','H-A1052A'],
  ['Carbon Steel A350 LF2','carbon-steel-a350-lf2','Weld Neck Flanges','weld-neck-flanges','Flanges','1/2" - 16"','Class 150 - 900','ASTM A350 LF2 Cl.1',620,'pcs','Mumbai','ready','H-LF21A'],
  ['Carbon Steel A234 WPB','carbon-steel-a234-wpb','90° Elbows','90-degree-elbows','Buttweld Fittings','1/2" - 24"','SCH 40 / 80','ASTM A234 WPB',4100,'pcs','Mumbai','ready','H-WPB1E'],
  ['Carbon Steel A106','carbon-steel-a106','Seamless Pipes','seamless-pipes','Pipes & Tubes','1/2" - 16"','SCH 40 / 80 / 160','ASTM A106 Gr B',9800,'m','Mumbai','ready','H-A1061P'],
  ['API 5L Line Pipe','api-5l-line-pipe','Line Pipe','line-pipe','Pipes & Tubes','6" - 24"','SCH 20 - 80','API 5L Gr B / X52',4200,'m','Mumbai','limited','H-5L1P'],
  ['Carbon Steel A516 Gr 70','carbon-steel-a516-gr70','Plates','plates','Sheets, Plates & Coils','6 - 60 mm','—','ASTM A516 Gr 70',22000,'kg','Mumbai','ready','H-5161P'],
  ['UPVC','upvc','UPVC Pressure Pipes','upvc-pressure-pipes','PVC / UPVC / CPVC Piping','20 - 315 mm','PN 6 - PN 16','IS 4985',6400,'m','Mumbai','ready','B-UPVC1'],
  ['CPVC','cpvc','CPVC Pipes','cpvc-pipes','PVC / UPVC / CPVC Piping','1/2" - 2"','SDR 11 / 13.5','ASTM D2846',3800,'m','Mumbai','ready','B-CPVC1'],
  ['SWR PVC','swr-pvc','SWR Drainage Pipes','swr-drainage-pipes','PVC / UPVC / CPVC Piping','63 - 160 mm','Type A / B','IS 13592',5200,'m','Mumbai','ready','B-SWR1'],
  ['UPVC','upvc','PVC Fittings','pvc-fittings','PVC / UPVC / CPVC Piping','20 - 250 mm','—','IS 4985 / IS 13592',9200,'pcs','Mumbai','ready','B-PVCF1']
];

export async function initDatabase() {
  await ensureConnected();
  const engine = getActiveEngine();
  const schemaFile = engine === 'mysql' ? 'schema.mysql.sql' : 'schema.sql';
  const schemaPath = path.join(__dirname, schemaFile);

  console.log(`[DB] Applying database schema for engine '${engine}' using ${schemaFile}...`);
  try {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    // On MySQL, split statements by semicolon if needed or run directly
    if (engine === 'mysql') {
      const statements = schemaSql
        .split(/;\s*$/m)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith('--') && !s.toUpperCase().startsWith('CREATE DATABASE') && !s.toUpperCase().startsWith('USE '));
      for (const stmt of statements) {
        try {
          await exec(stmt);
        } catch (stmtErr) {
          // ignore already exists or duplicate index errors
        }
      }
    } else {
      await exec(schemaSql);
    }
    console.log('[DB] Schema applied successfully.');
  } catch (err) {
    console.warn('[DB Notice] Schema execution warning:', err.message);
  }

  // Safe schema migration for last_login_at, role, login_method, and status across both engines
  const migrations = [
    'ALTER TABLE users ADD COLUMN last_login_at TEXT',
    "ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'customer'",
    "ALTER TABLE users ADD COLUMN login_method TEXT DEFAULT 'password'",
    "ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'",
    'ALTER TABLE product_requests ADD COLUMN quotation_amount REAL',
    'ALTER TABLE material_requests ADD COLUMN quotation_amount REAL',
  ];
  for (const m of migrations) {
    try {
      await run(m);
    } catch {
      // Column already exists, safe to ignore
    }
  }

  // Ensure sqlite fallback also has status column if sqliteDb is open
  if (sqliteDb) {
    sqliteDb.run("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active';", () => {});
    sqliteDb.run("ALTER TABLE users ADD COLUMN login_method TEXT DEFAULT 'password';", () => {});
    sqliteDb.run("ALTER TABLE users ADD COLUMN last_login_at TEXT;", () => {});
    sqliteDb.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'customer';", () => {});
  }

  // Ensure document_downloads & cad_downloads tables exist
  try {
    await run(`
      CREATE TABLE IF NOT EXISTS document_downloads (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NULL,
        doc_id VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NULL,
        company VARCHAR(255) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await run(`
      CREATE TABLE IF NOT EXISTS cad_downloads (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NULL,
        part_code VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NULL,
        company VARCHAR(255) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch {
    // safe to ignore table exists
  }

  // Ensure default Owner Administrator exists
  const adminEmail = 'admin@trishulmetal.com';
  const existingAdmin = await get('SELECT id FROM users WHERE email = ?', [adminEmail]);
  if (!existingAdmin) {
    const adminId = 'admin-trishul-001';
    const adminHash = await bcrypt.hash('Admin@Trishul2026!', 10);
    const now = new Date().toISOString();
    await run(
      `INSERT INTO users (id, email, password_hash, full_name, company, phone, role, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'admin', 'active', ?, ?)`,
      [adminId, adminEmail, adminHash, 'Owner Administrator', 'Trishul Metals & Alloys', '+91 22 2389 4500', now, now]
    );
    console.log('[DB] Seeded default Owner Administrator: admin@trishulmetal.com');
  }

  // Ensure all existing customer accounts have a valid password hash for seamless password login
  const defaultCustomerHash = await bcrypt.hash('Customer@Trishul2026!', 10);
  await run("UPDATE users SET password_hash = ? WHERE password_hash IS NULL AND role = 'customer'", [defaultCustomerHash]).catch(() => {});
  if (sqliteDb) {
    sqliteDb.run("UPDATE users SET password_hash = ? WHERE password_hash IS NULL AND role = 'customer'", [defaultCustomerHash], () => {});
  }

  // Bidirectional Synchronization: Sync SQLite users and RFQs into MySQL and vice versa
  if (sqliteDb) {
    try {
      const sqliteUsers = await new Promise((resolve) => {
        sqliteDb.all('SELECT * FROM users', (err, rows) => resolve(rows || []));
      });

      const currentUsers = await all('SELECT id, email FROM users');
      const currentEmailMap = new Map((currentUsers || []).map((u) => [(u.email || '').toLowerCase(), u.id]));

      for (const su of sqliteUsers) {
        const cleanEmail = (su.email || '').toLowerCase();
        if (cleanEmail && !currentEmailMap.has(cleanEmail)) {
          console.log(`[DB Sync] Migrating user from SQLite to active engine: ${cleanEmail} (${su.full_name})`);
          await run(
            `INSERT INTO users (id, email, password_hash, full_name, company, phone, role, status, google_id, avatar_url, login_method, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              su.id || crypto.randomUUID(),
              cleanEmail,
              su.password_hash || null,
              su.full_name || 'Customer',
              su.company || null,
              su.phone || null,
              su.role || 'customer',
              su.status || 'active',
              su.google_id || null,
              su.avatar_url || null,
              su.login_method || 'password',
              su.created_at || new Date().toISOString(),
              su.updated_at || new Date().toISOString(),
            ]
          ).catch((e) => console.warn('[DB Sync Notice]:', e.message));
        }
      }

      // If active engine is MySQL, ensure SQLite has any users from MySQL
      if (engine === 'mysql') {
        const mysqlUsers = await all('SELECT * FROM users');
        const sqliteEmails = new Set(sqliteUsers.map((u) => (u.email || '').toLowerCase()));
        for (const mu of mysqlUsers) {
          const cleanEmail = (mu.email || '').toLowerCase();
          if (cleanEmail && !sqliteEmails.has(cleanEmail)) {
            sqliteDb.run(
              `INSERT OR IGNORE INTO users (id, email, password_hash, full_name, company, phone, role, status, google_id, avatar_url, login_method, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                mu.id,
                cleanEmail,
                mu.password_hash || null,
                mu.full_name,
                mu.company || null,
                mu.phone || null,
                mu.role || 'customer',
                mu.status || 'active',
                mu.google_id || null,
                mu.avatar_url || null,
                mu.login_method || 'password',
                mu.created_at ? new Date(mu.created_at).toISOString() : new Date().toISOString(),
                mu.updated_at ? new Date(mu.updated_at).toISOString() : new Date().toISOString(),
              ],
              () => {}
            );
          }
        }
      }
    } catch (syncErr) {
      console.warn('[DB Sync Warning]:', syncErr.message);
    }
  }

  // Check if stock_items is populated
  const stockCount = await get('SELECT COUNT(*) as count FROM stock_items');
  if (stockCount && stockCount.count === 0) {
    console.log('[DB] Seeding stock items...');
    for (const item of STOCK_ITEMS_SEED) {
      const id = crypto.randomUUID();
      await run(
        `INSERT INTO stock_items (id, grade, grade_slug, product, product_slug, category, size, rating, spec, quantity, unit, location, status, heat_ref)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, ...item]
      );
    }
    console.log(`[DB] Successfully seeded ${STOCK_ITEMS_SEED.length} stock items.`);
  }

  return true;
}

// If executed directly, run initDatabase
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initDatabase()
    .then(() => {
      console.log('[DB] Initialization complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[DB] Initialization failed:', err);
      process.exit(1);
    });
}
