-- Trishul Metals SQLite Database Schema

PRAGMA foreign_keys = ON;

-- 1. Users Table
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

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- 2. User Sessions Table (Persistent server-side session management)
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

-- 3. Products Catalog Table
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

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- 4. Materials Catalog Table
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

CREATE INDEX IF NOT EXISTS idx_materials_slug ON materials(slug);
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category);

-- 5. Product Requests Table (RFQs / Quotations per customer)
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
  status TEXT NOT NULL DEFAULT 'Pending Review', -- 'Pending Review', 'Under Evaluation', 'Quotation Sent', 'Approved', 'Fulfilled', 'Closed'
  quotation_amount REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_product_requests_user ON product_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_product_requests_status ON product_requests(status);

-- 6. Material Requests Table (Material inquiries / RFQs per customer)
CREATE TABLE IF NOT EXISTS material_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  material_id TEXT,
  material_name TEXT NOT NULL,
  form TEXT,
  quantity TEXT NOT NULL,
  specification TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Pending Review', -- 'Pending Review', 'Under Evaluation', 'Quoted', 'Approved', 'Closed'
  quotation_amount REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_material_requests_user ON material_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_material_requests_status ON material_requests(status);

-- 7. Inquiries Table (Customer support, engineering queries, general inquiries)
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open', -- 'Open', 'In Progress', 'Answered', 'Resolved'
  response TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_inquiries_user ON inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

-- 8. Stock Items (Inventory from Trishul Metals Mumbai warehouse)
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

CREATE INDEX IF NOT EXISTS idx_stock_category ON stock_items(category);
CREATE INDEX IF NOT EXISTS idx_stock_grade_slug ON stock_items(grade_slug);

-- 9. RFQ Requests Table (Public or customer RFQs)
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
  testing TEXT, -- JSON array
  items TEXT, -- JSON array
  attachments TEXT, -- JSON array
  status TEXT NOT NULL DEFAULT 'Submitted',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rfq_reference ON rfq_requests(reference);
CREATE INDEX IF NOT EXISTS idx_rfq_confirmation ON rfq_requests(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_rfq_user ON rfq_requests(user_id);

-- 10. CAD Downloads & Document Downloads Tracking
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

-- 11. Customer Orders & Purchases Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_request_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  total_amount REAL NOT NULL DEFAULT 0.0,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'Processing', -- 'Processing', 'Manufactured', 'Inspection Ready', 'Dispatched', 'Delivered', 'Cancelled'
  tracking_number TEXT,
  delivery_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 12. User Login Activity Table
CREATE TABLE IF NOT EXISTS user_login_activity (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  login_method TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'success',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_login_activity_user ON user_login_activity(user_id);

-- 13. Admin Activity Logs Table
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

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_activity_logs(admin_id);

-- 14. Password Reset Tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_pw_reset_hash ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_pw_reset_user ON password_reset_tokens(user_id);

-- 15. Request Activity History (Audit Log & Customer Communications)
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

CREATE INDEX IF NOT EXISTS idx_req_history_request ON request_activity_history(request_id);
CREATE INDEX IF NOT EXISTS idx_req_history_created ON request_activity_history(created_at);
