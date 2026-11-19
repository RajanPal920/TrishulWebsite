-- Trishul Metals & Alloys - MySQL Production Database Schema
-- Database: trishul_db

CREATE DATABASE IF NOT EXISTS trishul_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE trishul_db;

-- 1. Users Table (Customers and Administrators)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NULL,
  full_name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  google_id VARCHAR(255) UNIQUE NULL,
  avatar_url VARCHAR(500) NULL,
  login_method VARCHAR(50) NOT NULL DEFAULT 'password',
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_google_id (google_id),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. User Sessions Table (Persistent Server-Side Session Tokens)
CREATE TABLE IF NOT EXISTS user_sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sessions_token (token),
  INDEX idx_sessions_user_id (user_id),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. User Login Activity Table (Audit Log for Customer and Admin Logins)
CREATE TABLE IF NOT EXISTS user_login_activity (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  login_method VARCHAR(50) NOT NULL, -- 'password', 'google'
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  status ENUM('success', 'failed') NOT NULL DEFAULT 'success',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_login_activity_user (user_id),
  INDEX idx_login_activity_created (created_at),
  CONSTRAINT fk_login_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Product Requests Table (Customer Requisitions & Cut-to-Size RFQs)
CREATE TABLE IF NOT EXISTS product_requests (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  product_id VARCHAR(100) NULL,
  product_name VARCHAR(255) NOT NULL,
  material VARCHAR(100) NULL,
  size VARCHAR(100) NULL,
  quantity VARCHAR(100) NOT NULL,
  specification VARCHAR(255) NULL,
  notes TEXT NULL,
  status ENUM('Pending Review', 'Under Evaluation', 'Quotation Sent', 'Approved', 'Fulfilled', 'Closed') NOT NULL DEFAULT 'Pending Review',
  quotation_amount DECIMAL(12,2) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_product_req_user (user_id),
  INDEX idx_product_req_status (status),
  CONSTRAINT fk_prod_req_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Material Requests Table (Material Grade Inquiries & Requirements)
CREATE TABLE IF NOT EXISTS material_requests (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  material_id VARCHAR(100) NULL,
  material_name VARCHAR(255) NOT NULL,
  form VARCHAR(100) NULL,
  quantity VARCHAR(100) NOT NULL,
  specification VARCHAR(255) NULL,
  notes TEXT NULL,
  status ENUM('Pending Review', 'Under Evaluation', 'Quoted', 'Approved', 'Closed') NOT NULL DEFAULT 'Pending Review',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_mat_req_user (user_id),
  INDEX idx_mat_req_status (status),
  CONSTRAINT fk_mat_req_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Inquiries Table (Customer Technical, Metallurgical & Commercial Inquiries)
CREATE TABLE IF NOT EXISTS inquiries (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('Open', 'In Progress', 'Responded', 'Closed') NOT NULL DEFAULT 'Open',
  response TEXT NULL,
  responded_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_inquiries_user (user_id),
  INDEX idx_inquiries_status (status),
  CONSTRAINT fk_inquiries_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Orders / Purchases Table (Customer Purchase Orders & Fulfillment Tracking)
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  order_number VARCHAR(64) UNIQUE NOT NULL,
  user_id VARCHAR(64) NOT NULL,
  product_request_id VARCHAR(64) NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  status ENUM('Processing', 'Manufactured', 'Inspection Ready', 'Dispatched', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Processing',
  tracking_number VARCHAR(100) NULL,
  delivery_date DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_status (status),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Stock Items Table (Mumbai Warehouse Certified Stock Inventory)
CREATE TABLE IF NOT EXISTS stock_items (
  id VARCHAR(64) PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  grade VARCHAR(100) NOT NULL,
  grade_slug VARCHAR(100) NULL,
  product VARCHAR(150) NULL,
  product_slug VARCHAR(150) NULL,
  size VARCHAR(100) NULL,
  rating VARCHAR(100) NULL,
  spec VARCHAR(200) NULL,
  quantity INT NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL DEFAULT 'pcs',
  location VARCHAR(100) NOT NULL DEFAULT 'Mumbai',
  status VARCHAR(50) NOT NULL DEFAULT 'ready',
  heat_ref VARCHAR(100) NULL,
  verified_on VARCHAR(50) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_stock_category (category),
  INDEX idx_stock_grade (grade),
  INDEX idx_stock_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Admin Activity Logs Table (Owner & Admin Audit Trail)
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id VARCHAR(64) PRIMARY KEY,
  admin_id VARCHAR(64) NOT NULL,
  admin_email VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(100) NOT NULL,
  target_id VARCHAR(64) NULL,
  details TEXT NULL,
  ip_address VARCHAR(45) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin_logs_admin (admin_id),
  INDEX idx_admin_logs_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. RFQ Requests Table (Public Website Multi-Item Quotations)
CREATE TABLE IF NOT EXISTS rfq_requests (
  id VARCHAR(64) PRIMARY KEY,
  reference VARCHAR(64) UNIQUE NOT NULL,
  user_id VARCHAR(64) NULL,
  company VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NULL,
  country VARCHAR(100) NULL,
  incoterm VARCHAR(50) NULL,
  delivery_port VARCHAR(100) NULL,
  target_lead_time VARCHAR(100) NULL,
  project_name VARCHAR(255) NULL,
  message TEXT NULL,
  certification VARCHAR(100) NULL,
  testing JSON NULL,
  items JSON NULL,
  attachments JSON NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Submitted',
  confirmation_token VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rfq_reference (reference),
  INDEX idx_rfq_email (email),
  INDEX idx_rfq_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
