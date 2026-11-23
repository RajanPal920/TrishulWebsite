import mysql from 'mysql2/promise';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Candidate database paths across local development, build, and Vercel serverless lambda
const CANDIDATE_DB_PATHS = [
  process.env.DATABASE_PATH ? path.resolve(process.env.DATABASE_PATH) : null,
  '/tmp/trishul.db',
  path.resolve(process.cwd(), 'server/data/trishul.db'),
  path.resolve(__dirname, '../data/trishul.db'),
  path.resolve(__dirname, '../../server/data/trishul.db'),
  path.resolve(__dirname, '../../../server/data/trishul.db'),
  '/var/task/server/data/trishul.db',
  '/var/task/data/trishul.db',
  path.resolve(process.cwd(), 'data/trishul.db'),
].filter(Boolean);

// Candidate wasm binary paths for sql.js on Vercel lambda and local Node
const CANDIDATE_WASM_PATHS = [
  path.resolve(process.cwd(), 'server/data/sql-wasm.wasm'),
  path.resolve(__dirname, '../data/sql-wasm.wasm'),
  path.resolve(__dirname, '../../server/data/sql-wasm.wasm'),
  '/var/task/server/data/sql-wasm.wasm',
  path.resolve(process.cwd(), 'node_modules/sql.js/dist/sql-wasm.wasm'),
  path.resolve(__dirname, '../../node_modules/sql.js/dist/sql-wasm.wasm'),
  path.resolve(__dirname, '../node_modules/sql.js/dist/sql-wasm.wasm'),
  '/var/task/node_modules/sql.js/dist/sql-wasm.wasm',
].filter(Boolean);

function prepareWorkingDbFile() {
  // 1. If /tmp/trishul.db already exists with data, prioritize it (contains active session mutations)
  try {
    if (fs.existsSync('/tmp/trishul.db') && fs.statSync('/tmp/trishul.db').size > 0) {
      return '/tmp/trishul.db';
    }
  } catch {}

  // 2. Locate bundled production database file
  for (const p of CANDIDATE_DB_PATHS) {
    if (p === '/tmp/trishul.db') continue;
    try {
      if (fs.existsSync(p) && fs.statSync(p).size > 0) {
        // In serverless / read-only environment, prime /tmp/trishul.db for writing
        try {
          fs.copyFileSync(p, '/tmp/trishul.db');
          console.log(`[DB] Successfully primed writable database at /tmp/trishul.db from ${p}`);
          return '/tmp/trishul.db';
        } catch {
          return p;
        }
      }
    } catch {}
  }
  return path.resolve(__dirname, '../data/trishul.db');
}

const DB_PATH = prepareWorkingDbFile();

// Engine state: 'mysql' | 'sqlite' | 'sqljs'
let activeEngine = 'sqlite';
let mysqlPool = null;
let sqliteDb = null;
let sqlJsDb = null;
let connectionPromise = null;

// ============================================================================
// 1. PRIMARY ENGINE: MySQL Connection Pool with Cloud URL & SSL Support
// ============================================================================
const connectionUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_DATABASE_URL;

const hasExplicitMySQL =
  Boolean(connectionUrl) ||
  Boolean(process.env.DB_HOST && process.env.DB_HOST !== '127.0.0.1' && process.env.DB_HOST !== 'localhost');

try {
  let poolConfig;
  if (connectionUrl) {
    poolConfig = { uri: connectionUrl };
  } else {
    const host = process.env.DB_HOST || '127.0.0.1';
    const port = parseInt(process.env.DB_PORT || '3306', 10);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'trishul_db';
    poolConfig = { host, port, user, password, database };
  }

  poolConfig.waitForConnections = true;
  poolConfig.connectionLimit = 15;
  poolConfig.queueLimit = 0;
  poolConfig.enableKeepAlive = true;
  poolConfig.keepAliveInitialDelay = 0;

  // For remote cloud MySQL (e.g. Aiven, PlanetScale, TiDB, Supabase, CleverCloud), enable SSL
  const isLocal =
    (!connectionUrl && (poolConfig.host === '127.0.0.1' || poolConfig.host === 'localhost')) ||
    (connectionUrl && (connectionUrl.includes('127.0.0.1') || connectionUrl.includes('localhost')));

  if (!isLocal) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  mysqlPool = mysql.createPool(poolConfig);

  // Eager connection test
  connectionPromise = mysqlPool
    .getConnection()
    .then((conn) => {
      activeEngine = 'mysql';
      console.log(`[DB] Successfully connected to MySQL database engine.`);
      conn.release();
      return true;
    })
    .catch((err) => {
      activeEngine = 'sqlite';
      console.warn(`[DB Notice] MySQL not reachable (${err.message}). Seamlessly initializing SQLite engine.`);
      return false;
    });
} catch (poolErr) {
  activeEngine = 'sqlite';
  console.warn('[DB Notice] MySQL pool initialization notice:', poolErr.message);
}

// ============================================================================
// 2. SECONDARY ENGINE: Native SQLite Driver (Local Development / Server)
// ============================================================================
try {
  const sqlite3 = require('sqlite3');
  if (sqlite3 && sqlite3.Database) {
    sqliteDb = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.warn('[DB Notice] Native SQLite initialization warning:', err.message);
      } else {
        sqliteDb.run('PRAGMA foreign_keys = ON;');
      }
    });
  }
} catch (sqliteLoadErr) {
  console.warn('[DB Notice] Native sqlite3 binary not available in this environment. Falling back to universal WebAssembly sql.js engine.');
}

// ============================================================================
// 3. TERTIARY ENGINE: Universal WebAssembly SQLite (sql.js) for Vercel Serverless
// ============================================================================
let sqlJsInitPromise = null;

function findWasmBinary() {
  for (const p of CANDIDATE_WASM_PATHS) {
    try {
      if (fs.existsSync(p) && fs.statSync(p).size > 0) {
        return fs.readFileSync(p);
      }
    } catch {}
  }
  return null;
}

async function getSqlJsEngine() {
  if (sqlJsDb) return sqlJsDb;
  if (sqlJsInitPromise) return sqlJsInitPromise;

  sqlJsInitPromise = (async () => {
    try {
      const initSqlJs = require('sql.js');
      const wasmBinary = findWasmBinary();
      const sqlConfig = wasmBinary
        ? { wasmBinary }
        : {
            locateFile: (file) => {
              for (const p of CANDIDATE_WASM_PATHS) {
                try {
                  if (fs.existsSync(p)) return p;
                } catch {}
              }
              return file;
            },
          };

      const SQL = await initSqlJs(sqlConfig);

      // Find best file to load initial bytes from (prefers /tmp/trishul.db or copied bundled db)
      const dbFileToLoad = prepareWorkingDbFile();
      let fileBuffer = null;
      try {
        if (fs.existsSync(dbFileToLoad) && fs.statSync(dbFileToLoad).size > 0) {
          fileBuffer = fs.readFileSync(dbFileToLoad);
        }
      } catch (readErr) {
        console.warn('[sql.js] Notice reading db file:', readErr.message);
      }

      sqlJsDb = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();
      console.log(`[DB] Universal sql.js (WebAssembly) initialized successfully from ${dbFileToLoad || 'memory'} (${fileBuffer ? fileBuffer.length : 0} bytes).`);
      return sqlJsDb;
    } catch (wasmErr) {
      console.error('[DB] Failed to initialize sql.js:', wasmErr.message);
      return null;
    }
  })();

  return sqlJsInitPromise;
}

// Persist sql.js mutations to disk (/tmp/trishul.db and original DB_PATH if writable)
export function persistSqlJs(dbInstance) {
  const instance = dbInstance || sqlJsDb;
  if (!instance) return;
  try {
    const data = instance.export();
    const buf = Buffer.from(data);
    try {
      fs.writeFileSync('/tmp/trishul.db', buf);
    } catch {}
    try {
      const localPath = path.resolve(process.cwd(), 'server/data/trishul.db');
      if (fs.existsSync(path.dirname(localPath))) {
        fs.writeFileSync(localPath, buf);
      }
    } catch {}
    try {
      if (DB_PATH && !DB_PATH.startsWith('/tmp') && fs.existsSync(path.dirname(DB_PATH))) {
        fs.writeFileSync(DB_PATH, buf);
      }
    } catch {}
  } catch {}
}

export { sqliteDb };

function normalizeParamsForMySQL(params) {
  if (!Array.isArray(params)) return params;
  return params.map((val) => {
    if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
      }
    }
    return val;
  });
}

/**
 * Execute a query that returns multiple rows
 */
export async function all(sql, params = []) {
  if (connectionPromise) await connectionPromise;

  // 1. MySQL
  if (activeEngine === 'mysql' && mysqlPool) {
    try {
      const [rows] = await mysqlPool.query(sql, normalizeParamsForMySQL(params));
      return rows;
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.code === 'EACCES') {
        activeEngine = 'sqlite';
        return all(sql, params);
      }
      throw err;
    }
  }

  // 2. Native SQLite
  if (sqliteDb) {
    return new Promise((resolve, reject) => {
      sqliteDb.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  // 3. Universal WebAssembly SQLite (sql.js)
  const wasmDb = await getSqlJsEngine();
  if (wasmDb) {
    try {
      const stmt = wasmDb.prepare(sql);
      stmt.bind(params);
      const rows = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      return rows;
    } catch (err) {
      console.warn('[sql.js all error]:', err.message);
      return [];
    }
  }

  return [];
}

/**
 * Execute a query that returns a single row
 */
export async function get(sql, params = []) {
  if (connectionPromise) await connectionPromise;

  // 1. MySQL
  if (activeEngine === 'mysql' && mysqlPool) {
    try {
      const [rows] = await mysqlPool.query(sql, normalizeParamsForMySQL(params));
      return rows && rows.length > 0 ? rows[0] : null;
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.code === 'EACCES') {
        activeEngine = 'sqlite';
        return get(sql, params);
      }
      throw err;
    }
  }

  // 2. Native SQLite
  if (sqliteDb) {
    return new Promise((resolve, reject) => {
      sqliteDb.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      });
    });
  }

  // 3. Universal WebAssembly SQLite (sql.js)
  const wasmDb = await getSqlJsEngine();
  if (wasmDb) {
    try {
      const stmt = wasmDb.prepare(sql);
      stmt.bind(params);
      const row = stmt.step() ? stmt.getAsObject() : null;
      stmt.free();
      return row;
    } catch (err) {
      console.warn('[sql.js get error]:', err.message);
      return null;
    }
  }

  return null;
}

/**
 * Execute an INSERT, UPDATE, or DELETE query
 */
export async function run(sql, params = []) {
  if (connectionPromise) await connectionPromise;

  // 1. MySQL
  if (activeEngine === 'mysql' && mysqlPool) {
    try {
      const [result] = await mysqlPool.query(sql, normalizeParamsForMySQL(params));
      // Mirror writes to SQLite fallback for offline persistence
      if (sqliteDb) {
        try {
          sqliteDb.run(sql, params, () => {});
        } catch {}
      } else if (sqlJsDb) {
        try {
          sqlJsDb.run(sql, params);
          persistSqlJs(sqlJsDb);
        } catch {}
      }
      return {
        lastID: result.insertId,
        insertId: result.insertId,
        changes: result.affectedRows,
        affectedRows: result.affectedRows,
      };
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.code === 'EACCES') {
        activeEngine = 'sqlite';
        return run(sql, params);
      }
      throw err;
    }
  }

  // 2. Native SQLite
  if (sqliteDb) {
    return new Promise((resolve, reject) => {
      sqliteDb.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  // 3. Universal WebAssembly SQLite (sql.js)
  const wasmDb = await getSqlJsEngine();
  if (wasmDb) {
    try {
      wasmDb.run(sql, params);
      persistSqlJs(wasmDb);
      return { lastID: 1, changes: 1 };
    } catch (err) {
      if (!err.message?.includes('duplicate column name')) {
        console.warn('[sql.js run notice]:', err.message);
      }
      throw err;
    }
  }

  return { lastID: 0, changes: 0 };
}

/**
 * Execute a raw SQL statement
 */
export async function exec(sql) {
  if (connectionPromise) await connectionPromise;

  // 1. MySQL
  if (activeEngine === 'mysql' && mysqlPool) {
    await mysqlPool.query(sql);
    return;
  }

  // 2. Native SQLite
  if (sqliteDb) {
    return new Promise((resolve, reject) => {
      sqliteDb.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // 3. Universal WebAssembly SQLite (sql.js)
  const wasmDb = await getSqlJsEngine();
  if (wasmDb) {
    try {
      wasmDb.exec(sql);
      persistSqlJs(wasmDb);
      return;
    } catch (err) {
      console.warn('[sql.js exec error]:', err.message);
    }
  }
}

export function getActiveEngine() {
  if (activeEngine === 'mysql') return 'mysql';
  if (sqliteDb) return 'sqlite-native';
  if (sqlJsDb) return 'sqlite-wasm';
  return 'sqlite-fallback';
}

export async function ensureConnected() {
  if (connectionPromise) await connectionPromise;
  if (activeEngine !== 'mysql' && !sqliteDb) {
    await getSqlJsEngine();
  }
  return getActiveEngine();
}

export const db = sqliteDb;

export default {
  db,
  all,
  query: all,
  get,
  run,
  exec,
  getActiveEngine,
  ensureConnected,
};
