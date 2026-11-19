import sqlite3 from 'sqlite3';
import mysql from 'mysql2/promise';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'trishul.db');

// SQLite connection (fallback & local development)
export const sqliteDb = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.warn('[DB Notice] SQLite fallback initialization:', err.message);
  } else {
    sqliteDb.run('PRAGMA foreign_keys = ON;');
    sqliteDb.run('PRAGMA journal_mode = WAL;');
  }
});

// MySQL connection pool (Primary production engine)
let mysqlPool = null;
let activeEngine = 'sqlite'; // 'mysql' | 'sqlite'
let connectionPromise = null;

try {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'trishul_db';

  mysqlPool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  // Test MySQL connection eagerly
  connectionPromise = mysqlPool.getConnection()
    .then((conn) => {
      activeEngine = 'mysql';
      console.log(`[DB] Successfully connected to MySQL database: ${database} at ${host}:${port}`);
      conn.release();
      return true;
    })
    .catch((err) => {
      activeEngine = 'sqlite';
      console.warn(`[DB Notice] MySQL not reachable (${err.message}). Seamlessly running on SQLite engine.`);
      return false;
    });
} catch (poolErr) {
  activeEngine = 'sqlite';
  console.warn('[DB Notice] MySQL pool initialization notice:', poolErr.message);
}

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
  if (activeEngine === 'mysql' && mysqlPool) {
    try {
      const [rows] = await mysqlPool.query(sql, normalizeParamsForMySQL(params));
      return rows;
    } catch (err) {
      // If error is MySQL-specific or lost connection, fallback to SQLite
      if (err.code === 'ECONNREFUSED' || err.code === 'EACCES') {
        activeEngine = 'sqlite';
        return all(sql, params);
      }
      throw err;
    }
  }

  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

/**
 * Execute a query that returns a single row
 */
export async function get(sql, params = []) {
  if (connectionPromise) await connectionPromise;
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

  return new Promise((resolve, reject) => {
    sqliteDb.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

/**
 * Execute an INSERT, UPDATE, or DELETE query
 */
export async function run(sql, params = []) {
  if (connectionPromise) await connectionPromise;
  if (activeEngine === 'mysql' && mysqlPool) {
    try {
      const [result] = await mysqlPool.query(sql, normalizeParamsForMySQL(params));
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

  return new Promise((resolve, reject) => {
    sqliteDb.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

/**
 * Execute a raw SQL statement
 */
export async function exec(sql) {
  if (activeEngine === 'mysql' && mysqlPool) {
    await mysqlPool.query(sql);
    return;
  }

  return new Promise((resolve, reject) => {
    sqliteDb.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function getActiveEngine() {
  return activeEngine;
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
};
