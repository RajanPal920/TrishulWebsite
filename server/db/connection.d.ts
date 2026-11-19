import type sqlite3 from 'sqlite3';

export const db: sqlite3.Database;

export function all<T = any>(sql: string, params?: any[]): Promise<T[]>;
export function query<T = any>(sql: string, params?: any[]): Promise<T[]>;
export function get<T = any>(sql: string, params?: any[]): Promise<T | undefined>;
export function run(sql: string, params?: any[]): Promise<{ lastID: number; changes: number }>;
export function exec(sql: string): Promise<void>;

declare const connection: {
  db: sqlite3.Database;
  all: typeof all;
  query: typeof query;
  get: typeof get;
  run: typeof run;
  exec: typeof exec;
};

export default connection;

