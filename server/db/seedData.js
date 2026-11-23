import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read schemas from disk if present, otherwise fallback to embedded constants
function getEmbeddedOrDiskSql(filename, embedded) {
  try {
    const full = path.join(__dirname, filename);
    if (fs.existsSync(full)) {
      const content = fs.readFileSync(full, 'utf8');
      if (content && content.length > 50) return content;
    }
  } catch {}
  return embedded;
}

export const SQL_SCHEMA_SQLITE = getEmbeddedOrDiskSql('schema.sql', `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL COLLATE NOCASE,
  password_hash TEXT,
  full_name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  status TEXT NOT NULL DEFAULT 'active',
  google_id TEXT UNIQUE,
  avatar_url TEXT,
  login_method TEXT DEFAULT 'password',
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  standard TEXT,
  description TEXT,
  specs TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS materials (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  uns_number TEXT,
  description TEXT,
  chemical_composition TEXT,
  mechanical_properties TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS product_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT,
  product_name TEXT NOT NULL,
  material TEXT,
  size TEXT,
  quantity TEXT NOT NULL,
  specification TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Pending Review',
  quotation_amount REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS material_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  material_id TEXT,
  material_name TEXT NOT NULL,
  form TEXT,
  quantity TEXT NOT NULL,
  specification TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Pending Review',
  quotation_amount REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open',
  response TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS stock_items (
  id TEXT PRIMARY KEY,
  grade TEXT NOT NULL,
  grade_slug TEXT,
  product TEXT NOT NULL,
  product_slug TEXT,
  category TEXT NOT NULL,
  size TEXT NOT NULL,
  rating TEXT,
  spec TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'pcs',
  location TEXT NOT NULL DEFAULT 'Mumbai',
  status TEXT NOT NULL DEFAULT 'ready',
  heat_ref TEXT,
  verified_on TEXT NOT NULL DEFAULT (date('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rfq_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  reference TEXT UNIQUE NOT NULL,
  confirmation_token TEXT UNIQUE NOT NULL,
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  incoterm TEXT,
  delivery_port TEXT,
  target_lead_time TEXT,
  project_name TEXT,
  message TEXT,
  certification TEXT,
  testing TEXT,
  items TEXT,
  attachments TEXT,
  status TEXT NOT NULL DEFAULT 'Submitted',
  admin_response TEXT,
  admin_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cad_downloads (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  part_code TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS document_downloads (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  doc_id TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_request_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  total_amount REAL NOT NULL DEFAULT 0.0,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'Processing',
  tracking_number TEXT,
  delivery_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_login_activity (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  login_method TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'success',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS request_activity_history (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  actor_name TEXT,
  action TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  message TEXT,
  is_internal INTEGER NOT NULL DEFAULT 0,
  email_sent INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

export const SQL_SCHEMA_MYSQL = getEmbeddedOrDiskSql('schema.mysql.sql', `
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NULL,
  full_name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  google_id VARCHAR(255) UNIQUE NULL,
  avatar_url TEXT NULL,
  login_method VARCHAR(50) DEFAULT 'password',
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rfq_requests (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NULL,
  reference VARCHAR(50) UNIQUE NOT NULL,
  confirmation_token VARCHAR(128) UNIQUE NOT NULL,
  company VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NULL,
  country VARCHAR(100) NULL,
  incoterm VARCHAR(20) NULL,
  delivery_port VARCHAR(255) NULL,
  target_lead_time VARCHAR(100) NULL,
  project_name VARCHAR(255) NULL,
  message TEXT NULL,
  certification VARCHAR(255) NULL,
  testing JSON NULL,
  items JSON NULL,
  attachments JSON NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Submitted',
  admin_response TEXT NULL,
  admin_notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS stock_items (
  id VARCHAR(64) PRIMARY KEY,
  grade VARCHAR(100) NOT NULL,
  grade_slug VARCHAR(100) NULL,
  product VARCHAR(150) NOT NULL,
  product_slug VARCHAR(150) NULL,
  category VARCHAR(100) NOT NULL,
  size VARCHAR(100) NOT NULL,
  rating VARCHAR(100) NULL,
  spec VARCHAR(150) NOT NULL,
  quantity DECIMAL(12, 2) NOT NULL DEFAULT 0,
  unit VARCHAR(20) NOT NULL DEFAULT 'pcs',
  location VARCHAR(100) NOT NULL DEFAULT 'Mumbai',
  status VARCHAR(50) NOT NULL DEFAULT 'ready',
  heat_ref VARCHAR(100) NULL,
  verified_on DATE NOT NULL DEFAULT (CURRENT_DATE),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS request_activity_history (
  id VARCHAR(64) PRIMARY KEY,
  request_id VARCHAR(64) NOT NULL,
  actor_type VARCHAR(20) NOT NULL,
  actor_id VARCHAR(64) NULL,
  actor_name VARCHAR(255) NULL,
  action VARCHAR(50) NOT NULL,
  old_status VARCHAR(50) NULL,
  new_status VARCHAR(50) NULL,
  message TEXT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT 0,
  email_sent BOOLEAN NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id VARCHAR(64) PRIMARY KEY,
  admin_id VARCHAR(64) NOT NULL,
  admin_email VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id VARCHAR(64) NULL,
  details TEXT NULL,
  ip_address VARCHAR(45) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_login_activity (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  login_method VARCHAR(50) NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'success',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_requests (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  product_id VARCHAR(64) NULL,
  product_name VARCHAR(255) NOT NULL,
  material VARCHAR(150) NULL,
  size VARCHAR(100) NULL,
  quantity VARCHAR(50) NOT NULL,
  specification VARCHAR(255) NULL,
  notes TEXT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending Review',
  quotation_amount DECIMAL(12, 2) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS material_requests (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  material_id VARCHAR(64) NULL,
  material_name VARCHAR(255) NOT NULL,
  form VARCHAR(100) NULL,
  quantity VARCHAR(50) NOT NULL,
  specification VARCHAR(255) NULL,
  notes TEXT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending Review',
  quotation_amount DECIMAL(12, 2) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inquiries (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Open',
  response TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  order_number VARCHAR(64) UNIQUE NOT NULL,
  user_id VARCHAR(64) NOT NULL,
  product_request_id VARCHAR(64) NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  status VARCHAR(50) NOT NULL DEFAULT 'Processing',
  tracking_number VARCHAR(100) NULL,
  delivery_date DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cad_downloads (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NULL,
  part_code VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NULL,
  company VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS document_downloads (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NULL,
  doc_id VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NULL,
  company VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`);

export const SEED_USERS = [
  {
    id: 'usr-4p5clwq5',
    email: 'customer.alpha@engineeringsolutions.com',
    password_hash: '$2b$10$Si5OiksoBTSiv5.Tw3g5ue5v9HGRj38OdBdF82eqwRvbIHX6ktbYe',
    full_name: 'Rahul Sharma',
    company: null,
    phone: null,
    role: 'customer',
    google_id: 'google-sub-alpha-12345',
    avatar_url: 'https://lh3.googleusercontent.com/a/alpha_avatar',
    created_at: '2026-11-19T07:11:29.576Z',
    updated_at: '2026-11-19T07:11:29.581Z',
    last_login_at: '2026-11-19T07:11:29.581Z',
    login_method: 'password',
    status: 'active',
  },
  {
    id: 'usr-dadtr8rj',
    email: 'customer.beta@globaloilgas.org',
    password_hash: '$2b$10$Si5OiksoBTSiv5.Tw3g5ue5v9HGRj38OdBdF82eqwRvbIHX6ktbYe',
    full_name: 'David Vance',
    company: null,
    phone: null,
    role: 'customer',
    google_id: 'google-sub-beta-67890',
    avatar_url: 'https://lh3.googleusercontent.com/a/beta_avatar',
    created_at: '2026-11-19T07:11:29.576Z',
    updated_at: '2026-11-19T07:11:29.576Z',
    last_login_at: '2026-11-19T07:11:29.576Z',
    login_method: 'password',
    status: 'active',
  },
  {
    id: 'usr-test-yhbun4',
    email: 'procurement.1795073592988@offshore-piping.com',
    password_hash: '$2b$10$VDRLvsZ6wKtLTgpq7x48hOi0/lAZjK2DuZsR.Rq6xDvOyHNPn9Ad6',
    full_name: 'Vikram Singhania',
    company: 'Singhania EPC Ltd',
    phone: '+91 98200 12345',
    role: 'customer',
    google_id: null,
    avatar_url: null,
    created_at: '2026-11-19T07:33:13.084Z',
    updated_at: '2026-11-19T07:33:13.084Z',
    last_login_at: '2026-11-19T07:33:13.084Z',
    login_method: 'password',
    status: 'active',
  },
  {
    id: 'usr-gb-g5ksh7',
    email: 'client.beta@lngterminal.com',
    password_hash: '$2b$10$Si5OiksoBTSiv5.Tw3g5ue5v9HGRj38OdBdF82eqwRvbIHX6ktbYe',
    full_name: 'Sarah Jenkins',
    company: null,
    phone: null,
    role: 'customer',
    google_id: 'g-sub-11223344',
    avatar_url: 'https://lh3.googleusercontent.com/a/sarah_jenkins',
    created_at: '2026-11-19T07:33:13.084Z',
    updated_at: '2026-11-19T07:33:13.084Z',
    last_login_at: '2026-11-19T07:33:13.084Z',
    login_method: 'password',
    status: 'active',
  },
  {
    id: '206c22e8-a808-4b34-a84c-1aeafbe71672',
    email: 'client.lnt.1795077350064@defense-ship.com',
    password_hash: '$2b$10$4I8sF464LxVgJyMx.Gz18eUjc97.iO3nZwJ0wJM8TDiUqWjsZij.W',
    full_name: 'Subhashish Sen',
    company: 'L&T Heavy Engineering',
    phone: '+91 22 6705 1100',
    role: 'customer',
    google_id: null,
    avatar_url: null,
    created_at: '2026-11-19T08:35:50.137Z',
    updated_at: '2026-11-19T08:35:50.137Z',
    last_login_at: null,
    login_method: 'password',
    status: 'active',
  },
  {
    id: 'admin-trishul-001',
    email: 'admin@trishulmetal.com',
    password_hash: '$2b$10$QCjkHp3m.hoZKz9UfNujbell8GBWbInAQf7.QNC8YVBKXgmLrtsge',
    full_name: 'Owner Administrator',
    company: 'Trishul Metals & Alloys',
    phone: '+91 22 2389 4500',
    role: 'admin',
    google_id: null,
    avatar_url: null,
    created_at: '2026-11-19T08:38:01.252Z',
    updated_at: '2026-11-23T06:53:42.302Z',
    last_login_at: '2026-11-23T06:52:10.418Z',
    login_method: 'password',
    status: 'active',
  },
  {
    id: '64862232-7aa3-4310-aa54-f3e33c6e2f13',
    email: 'permanent.customer.1795169698843@epc-piping.com',
    password_hash: '$2b$10$6xK9eF4skki2R6xsYpHemu/xj1SOfiHqsBbcml/jF53Q5ch5m/sDq',
    full_name: 'Devendra Singhal',
    company: 'Singhal Petrochem EPC Ltd',
    phone: '+91 98201 55555',
    role: 'customer',
    google_id: null,
    avatar_url: null,
    created_at: '2026-11-20T10:14:59.026Z',
    updated_at: '2026-11-20T10:14:59.174Z',
    last_login_at: '2026-11-20T10:14:59.174Z',
    login_method: 'password',
    status: 'active',
  },
  {
    id: '4e69bbf3-7cfa-44f2-a4fa-bb4376997677',
    email: 'rajanp9209022@gmail.com',
    password_hash: '$2b$10$gnAsvodSItd4Ci0MoH6r9.th05OaBFUIFGP1Wy3o0Y0.98m9T3ef6',
    full_name: 'rajan',
    company: 'dada',
    phone: '+919209022892',
    role: 'customer',
    google_id: null,
    avatar_url: null,
    created_at: '2026-11-22T07:42:36.743Z',
    updated_at: '2026-11-23T06:54:45.879Z',
    last_login_at: '2026-11-23T06:54:45.879Z',
    login_method: 'password',
    status: 'active',
  },
];

export const SEED_RFQS = [
  {
    id: '6d135518-7cee-4a3a-a759-094c8326c59c',
    user_id: '4e69bbf3-7cfa-44f2-a4fa-bb4376997677',
    reference: 'TM-RFQ-403703',
    confirmation_token: '76cb5042-6b1c-4c82-951a-6608a9547b2f',
    company: 'dada',
    contact_name: 'Rajan',
    email: 'rajanp9209022@gmail.com',
    phone: '09209022892',
    country: 'India',
    incoterm: 'FOB',
    delivery_port: 'sda',
    target_lead_time: '6',
    project_name: 'asds',
    message: 'jadli',
    certification: 'EN 10204 3.1',
    testing: '[]',
    items: '[{"material":"Incoloy 800HT","product":"Reducing Tees","size":"62","rating":"300","facing":"ff","quantity":"500","unit":"pcs","cutLength":"1000","processing":["End bevelling (ASME B16.25)"]}]',
    attachments: '[]',
    status: 'Closed',
    created_at: '2026-11-22T08:00:03.703Z',
    admin_response: 'you enquiry is done',
    admin_notes: null,
  },
  {
    id: 'cb6b7be3-46ae-470a-a003-1040d33e6005',
    user_id: '4e69bbf3-7cfa-44f2-a4fa-bb4376997677',
    reference: 'TM-RFQ-680818',
    confirmation_token: '301ec674-f2ba-4e7f-9e0b-65f648167792',
    company: 'dada',
    contact_name: 'rajan',
    email: 'rajanp9209022@gmail.com',
    phone: '+919209022892',
    country: null,
    incoterm: 'FOB',
    delivery_port: null,
    target_lead_time: null,
    project_name: null,
    message: 'Repeat enquiry based on TM-RFQ-403703: jadli',
    certification: 'EN 10204 3.1',
    testing: '[]',
    items: '[{"material":"Incoloy 800HT","product":"Reducing Tees","size":"62","rating":"300","facing":"ff","quantity":"500","unit":"pcs","cutLength":"","processing":[]}]',
    attachments: '[]',
    status: 'In Progress',
    created_at: '2026-11-23T06:51:20.818Z',
    admin_response: null,
    admin_notes: null,
  },
];

export const SEED_ACTIVITY_HISTORY = [
  {
    id: '938321c7-2c38-42af-8b7c-32e028f03966',
    request_id: '6d135518-7cee-4a3a-a759-094c8326c59c',
    actor_type: 'admin',
    actor_id: 'admin-trishul-001',
    actor_name: 'Owner Administrator',
    action: 'STATUS_CHANGED',
    old_status: 'In Progress',
    new_status: 'Responded',
    message: null,
    is_internal: 0,
    email_sent: 1,
    created_at: '2026-11-22T08:28:18.778Z',
  },
  {
    id: 'bdebe910-04a5-406d-897c-bed7c1bfa066',
    request_id: '6d135518-7cee-4a3a-a759-094c8326c59c',
    actor_type: 'admin',
    actor_id: 'admin-trishul-001',
    actor_name: 'Owner Administrator',
    action: 'STATUS_CHANGED',
    old_status: 'Responded',
    new_status: 'Closed',
    message: null,
    is_internal: 0,
    email_sent: 1,
    created_at: '2026-11-22T09:26:51.196Z',
  },
  {
    id: '4142b791-1547-4c79-8a0c-5d2aea87fd17',
    request_id: '6d135518-7cee-4a3a-a759-094c8326c59c',
    actor_type: 'admin',
    actor_id: 'admin-trishul-001',
    actor_name: 'Owner Administrator',
    action: 'ADMIN_REPLY',
    old_status: 'Closed',
    new_status: 'Closed',
    message: 'you enquiry is done',
    is_internal: 0,
    email_sent: 1,
    created_at: '2026-11-22T09:27:21.198Z',
  },
  {
    id: '7c3040b7-6d3a-4db4-ab74-b39092a6b9c2',
    request_id: 'cb6b7be3-46ae-470a-a003-1040d33e6005',
    actor_type: 'customer',
    actor_id: '4e69bbf3-7cfa-44f2-a4fa-bb4376997677',
    actor_name: 'rajan',
    action: 'SUBMITTED',
    old_status: null,
    new_status: 'Pending',
    message: '1 line item(s) submitted via RFQ form',
    is_internal: 0,
    email_sent: 1,
    created_at: '2026-11-23T06:51:20.818Z',
  },
  {
    id: '7fdc34b6-ff42-479a-add0-c3e2c48d67f5',
    request_id: 'cb6b7be3-46ae-470a-a003-1040d33e6005',
    actor_type: 'admin',
    actor_id: 'admin-trishul-001',
    actor_name: 'Owner Administrator',
    action: 'STATUS_CHANGED',
    old_status: 'Submitted',
    new_status: 'In Progress',
    message: null,
    is_internal: 0,
    email_sent: 0,
    created_at: '2026-11-23T06:53:17.919Z',
  },
];
