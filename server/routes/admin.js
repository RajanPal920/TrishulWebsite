import express from 'express';
import crypto from 'node:crypto';
import { get, all, run } from '../db/connection.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Strict security: All admin routes require authentication AND 'admin' role
router.use(requireAuth);
router.use(requireRole('admin'));

// Helper to log admin actions
async function logAdminAction(admin, action, targetType, targetId = null, details = null, req = null) {
  try {
    const id = crypto.randomUUID();
    const ip = req ? (req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '127.0.0.1') : '127.0.0.1';
    const now = new Date().toISOString();
    await run(
      `INSERT INTO admin_activity_logs (id, admin_id, admin_email, action, target_type, target_id, details, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, admin.id, admin.email, action, targetType, targetId, details, ip, now]
    );
  } catch (err) {
    console.warn('[Admin Audit Log Notice]:', err.message);
  }
}

/**
 * GET /api/admin/overview
 * Real-time statistics across all business modules
 */
router.get('/overview', async (req, res) => {
  try {
    const [custStats, prodStats, matStats, inqStats, orderStats, recentUsers, recentRequests] = await Promise.all([
      get("SELECT count(*) as total FROM users WHERE role = 'customer'"),
      get(`SELECT
             count(*) as total,
             SUM(CASE WHEN status = 'Pending Review' THEN 1 ELSE 0 END) as pending,
             SUM(CASE WHEN status = 'Quotation Sent' THEN 1 ELSE 0 END) as quoted,
             SUM(COALESCE(quotation_amount, 0)) as total_quote_val
           FROM product_requests`),
      get(`SELECT
             count(*) as total,
             SUM(CASE WHEN status = 'Pending Review' THEN 1 ELSE 0 END) as pending
           FROM material_requests`),
      get(`SELECT
             count(*) as total,
             SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open
           FROM inquiries`),
      get(`SELECT
             count(*) as total,
             SUM(CASE WHEN status IN ('Processing', 'Manufactured', 'Inspection Ready', 'Dispatched') THEN 1 ELSE 0 END) as active,
             SUM(COALESCE(total_amount, 0)) as total_order_val
           FROM orders`),
      all(
        `SELECT id, full_name, email, company, role, login_method, last_login_at, created_at
         FROM users
         ORDER BY created_at DESC LIMIT 5`
      ),
      all(
        `SELECT pr.id, pr.product_name as title, pr.material, pr.quantity, pr.status, pr.created_at, u.full_name as customer_name, u.company
         FROM product_requests pr
         JOIN users u ON u.id = pr.user_id
         ORDER BY pr.created_at DESC LIMIT 5`
      ),
    ]);

    return res.json({
      stats: {
        totalCustomers: custStats?.total || 0,
        productRequests: {
          total: prodStats?.total || 0,
          pending: prodStats?.pending || 0,
          quoted: prodStats?.quoted || 0,
          totalQuoteValue: prodStats?.total_quote_val || 0,
        },
        materialRequests: {
          total: matStats?.total || 0,
          pending: matStats?.pending || 0,
        },
        inquiries: {
          total: inqStats?.total || 0,
          open: inqStats?.open || 0,
        },
        orders: {
          total: orderStats?.total || 0,
          active: orderStats?.active || 0,
          totalOrderValue: orderStats?.total_order_val || 0,
        },
      },
      recentUsers: recentUsers || [],
      recentRequests: recentRequests || [],
    });
  } catch (err) {
    console.error('[Admin Overview Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve admin overview statistics.' });
  }
});

/**
 * GET /api/admin/customers
 * Paginated and searchable list of registered customers
 */
router.get('/customers', async (req, res) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    let sql = `
      SELECT u.id, u.email, u.full_name, u.company, u.phone, u.role, u.login_method, u.last_login_at, u.created_at,
             (SELECT count(*) FROM product_requests WHERE user_id = u.id) as product_requests_count,
             (SELECT count(*) FROM material_requests WHERE user_id = u.id) as material_requests_count,
             (SELECT count(*) FROM inquiries WHERE user_id = u.id) as inquiries_count,
             (SELECT count(*) FROM orders WHERE user_id = u.id) as orders_count
      FROM users u
      WHERE u.role = 'customer'
    `;
    const params = [];

    if (search) {
      sql += ' AND (u.full_name LIKE ? OR u.email LIKE ? OR u.company LIKE ? OR u.phone LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const customers = await all(sql, params);
    const totalCount = await get("SELECT count(*) as count FROM users WHERE role = 'customer'");

    return res.json({
      customers: customers || [],
      total: totalCount?.count || 0,
    });
  } catch (err) {
    console.error('[Admin Customers Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve customer accounts.' });
  }
});

/**
 * GET /api/admin/customers/:id
 * Complete 360-degree customer profile & requisition history
 */
router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await get(
      `SELECT id, email, full_name, company, phone, role, avatar_url, login_method, last_login_at, created_at
       FROM users WHERE id = ?`,
      [req.params.id]
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const [productRequests, materialRequests, inquiries, orders, loginHistory] = await Promise.all([
      all('SELECT * FROM product_requests WHERE user_id = ? ORDER BY created_at DESC', [customer.id]),
      all('SELECT * FROM material_requests WHERE user_id = ? ORDER BY created_at DESC', [customer.id]),
      all('SELECT * FROM inquiries WHERE user_id = ? ORDER BY created_at DESC', [customer.id]),
      all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [customer.id]),
      all('SELECT * FROM user_login_activity WHERE user_id = ? ORDER BY created_at DESC LIMIT 10', [customer.id]),
    ]);

    return res.json({
      customer,
      productRequests: productRequests || [],
      materialRequests: materialRequests || [],
      inquiries: inquiries || [],
      orders: orders || [],
      loginHistory: loginHistory || [],
    });
  } catch (err) {
    console.error('[Admin Customer Detail Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve customer details.' });
  }
});

/**
 * GET /api/admin/login-activity
 * Login history audit log across all customers and administrators
 */
router.get('/login-activity', async (req, res) => {
  try {
    const activities = await all(
      `SELECT la.id, la.user_id, la.login_method, la.ip_address, la.user_agent, la.status, la.created_at,
              u.email, u.full_name, u.company, u.role
       FROM user_login_activity la
       JOIN users u ON u.id = la.user_id
       ORDER BY la.created_at DESC LIMIT 100`
    );

    return res.json({ loginActivity: activities || [] });
  } catch (err) {
    console.error('[Admin Login Activity Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch login activity.' });
  }
});

/**
 * GET /api/admin/product-requests
 * All customer cut-to-size RFQs and product requests
 */
router.get('/product-requests', async (req, res) => {
  try {
    const requests = await all(
      `SELECT pr.*, u.email as customer_email, u.full_name as customer_name, u.company as customer_company, u.phone as customer_phone
       FROM product_requests pr
       JOIN users u ON u.id = pr.user_id
       ORDER BY pr.created_at DESC`
    );
    return res.json({ requests: requests || [] });
  } catch (err) {
    console.error('[Admin Product Requests Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve product requests.' });
  }
});

/**
 * PUT /api/admin/product-requests/:id
 * Update status and set quotation price
 */
router.put('/product-requests/:id', async (req, res) => {
  try {
    const { status, quotation_amount, notes } = req.body;
    const now = new Date().toISOString();

    await run(
      `UPDATE product_requests
       SET status = COALESCE(?, status),
           quotation_amount = COALESCE(?, quotation_amount),
           notes = COALESCE(?, notes),
           updated_at = ?
       WHERE id = ?`,
      [status || null, quotation_amount !== undefined ? quotation_amount : null, notes || null, now, req.params.id]
    );

    await logAdminAction(
      req.user,
      'UPDATE_PRODUCT_REQUEST',
      'product_requests',
      req.params.id,
      `Status changed to: ${status}${quotation_amount ? `, Quote: INR ${quotation_amount}` : ''}`,
      req
    );

    const updated = await get('SELECT * FROM product_requests WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Product request updated.', request: updated });
  } catch (err) {
    console.error('[Admin Product Request Update Error]:', err);
    return res.status(500).json({ error: 'Failed to update product request.' });
  }
});

/**
 * GET /api/admin/material-requests
 * All customer material inquiries and grade requirements
 */
router.get('/material-requests', async (req, res) => {
  try {
    const requests = await all(
      `SELECT mr.*, u.email as customer_email, u.full_name as customer_name, u.company as customer_company, u.phone as customer_phone
       FROM material_requests mr
       JOIN users u ON u.id = mr.user_id
       ORDER BY mr.created_at DESC`
    );
    return res.json({ requests: requests || [] });
  } catch (err) {
    console.error('[Admin Material Requests Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve material requests.' });
  }
});

/**
 * PUT /api/admin/material-requests/:id
 * Update status
 */
router.put('/material-requests/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const now = new Date().toISOString();

    await run(
      `UPDATE material_requests
       SET status = COALESCE(?, status),
           notes = COALESCE(?, notes),
           updated_at = ?
       WHERE id = ?`,
      [status || null, notes || null, now, req.params.id]
    );

    await logAdminAction(
      req.user,
      'UPDATE_MATERIAL_REQUEST',
      'material_requests',
      req.params.id,
      `Status changed to: ${status}`,
      req
    );

    const updated = await get('SELECT * FROM material_requests WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Material request updated.', request: updated });
  } catch (err) {
    console.error('[Admin Material Request Update Error]:', err);
    return res.status(500).json({ error: 'Failed to update material request.' });
  }
});

/**
 * GET /api/admin/inquiries
 * All customer technical and commercial inquiries
 */
router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await all(
      `SELECT inq.*, u.email as customer_email, u.full_name as customer_name, u.company as customer_company, u.phone as customer_phone
       FROM inquiries inq
       JOIN users u ON u.id = inq.user_id
       ORDER BY inq.created_at DESC`
    );
    return res.json({ inquiries: inquiries || [] });
  } catch (err) {
    console.error('[Admin Inquiries Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve customer inquiries.' });
  }
});

/**
 * POST /api/admin/inquiries/:id/respond
 * Submit official response to customer inquiry
 */
router.post('/inquiries/:id/respond', async (req, res) => {
  try {
    const { response, status = 'Responded' } = req.body;
    if (!response || !response.trim()) {
      return res.status(400).json({ error: 'Response content cannot be empty.' });
    }

    const now = new Date().toISOString();
    await run(
      `UPDATE inquiries
       SET response = ?,
           status = ?,
           responded_at = ?,
           updated_at = ?
       WHERE id = ?`,
      [response.trim(), status, now, now, req.params.id]
    );

    await logAdminAction(req.user, 'RESPOND_INQUIRY', 'inquiries', req.params.id, 'Response sent to customer', req);

    const updated = await get('SELECT * FROM inquiries WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Response submitted successfully.', inquiry: updated });
  } catch (err) {
    console.error('[Admin Inquiry Response Error]:', err);
    return res.status(500).json({ error: 'Failed to submit response to inquiry.' });
  }
});

/**
 * GET /api/admin/orders
 * All purchase orders
 */
router.get('/orders', async (req, res) => {
  try {
    const orders = await all(
      `SELECT o.*, u.email as customer_email, u.full_name as customer_name, u.company as customer_company
       FROM orders o
       JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    );
    return res.json({ orders: orders || [] });
  } catch (err) {
    console.error('[Admin Orders Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
});

/**
 * POST /api/admin/orders
 * Create new purchase order for a customer
 */
router.post('/orders', async (req, res) => {
  try {
    const { user_id, userId, title, description, total_amount, totalAmount, currency = 'INR', tracking_number, trackingNumber, delivery_date, deliveryDate } = req.body;
    const uid = user_id || userId;
    const orderTitle = (title || '').trim();
    const amount = parseFloat(total_amount || totalAmount || 0);

    if (!uid) return res.status(400).json({ error: 'Customer user ID is required.' });
    if (!orderTitle) return res.status(400).json({ error: 'Order title / description is required.' });

    const id = crypto.randomUUID();
    const orderNumber = `PO-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    await run(
      `INSERT INTO orders (id, order_number, user_id, title, description, total_amount, currency, status, tracking_number, delivery_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Processing', ?, ?, ?, ?)`,
      [id, orderNumber, uid, orderTitle, description || null, amount, currency, tracking_number || trackingNumber || null, delivery_date || deliveryDate || null, now, now]
    );

    await logAdminAction(req.user, 'CREATE_ORDER', 'orders', id, `Order ${orderNumber} created for customer ${uid}`, req);

    const created = await get('SELECT * FROM orders WHERE id = ?', [id]);
    return res.status(201).json({ success: true, message: 'Order created successfully.', order: created });
  } catch (err) {
    console.error('[Admin Order Create Error]:', err);
    return res.status(500).json({ error: 'Failed to create order.' });
  }
});

/**
 * PUT /api/admin/orders/:id
 * Update order status or tracking details
 */
router.put('/orders/:id', async (req, res) => {
  try {
    const { status, tracking_number, trackingNumber, delivery_date, deliveryDate, notes } = req.body;
    const now = new Date().toISOString();

    await run(
      `UPDATE orders
       SET status = COALESCE(?, status),
           tracking_number = COALESCE(?, tracking_number),
           delivery_date = COALESCE(?, delivery_date),
           updated_at = ?
       WHERE id = ?`,
      [status || null, tracking_number || trackingNumber || null, delivery_date || deliveryDate || null, now, req.params.id]
    );

    await logAdminAction(req.user, 'UPDATE_ORDER', 'orders', req.params.id, `Order updated: Status=${status}`, req);

    const updated = await get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Order updated successfully.', order: updated });
  } catch (err) {
    console.error('[Admin Order Update Error]:', err);
    return res.status(500).json({ error: 'Failed to update order.' });
  }
});

/**
 * GET /api/admin/stock
 * Certified warehouse inventory
 */
router.get('/stock', async (req, res) => {
  try {
    const items = await all('SELECT * FROM stock_items ORDER BY category ASC, grade ASC');
    return res.json({ stock: items || [] });
  } catch (err) {
    console.error('[Admin Stock Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch stock items.' });
  }
});

/**
 * POST /api/admin/stock
 * Add new stock item to warehouse
 */
router.post('/stock', async (req, res) => {
  try {
    const { category, grade, grade_slug, product, product_slug, size, rating, spec, quantity = 0, unit = 'pcs', location = 'Mumbai', status = 'ready' } = req.body;
    if (!category || !grade) {
      return res.status(400).json({ error: 'Category and grade are required.' });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await run(
      `INSERT INTO stock_items (id, category, grade, grade_slug, product, product_slug, size, rating, spec, quantity, unit, location, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, category, grade, grade_slug || null, product || null, product_slug || null, size || null, rating || null, spec || null, parseInt(quantity, 10), unit, location, status, now]
    );

    await logAdminAction(req.user, 'ADD_STOCK', 'stock_items', id, `Added ${quantity} ${unit} of ${grade} (${category})`, req);

    const created = await get('SELECT * FROM stock_items WHERE id = ?', [id]);
    return res.status(201).json({ success: true, message: 'Stock item added.', item: created });
  } catch (err) {
    console.error('[Admin Stock Add Error]:', err);
    return res.status(500).json({ error: 'Failed to add stock item.' });
  }
});

/**
 * DELETE /api/admin/stock/:id
 * Remove stock item
 */
router.delete('/stock/:id', async (req, res) => {
  try {
    await run('DELETE FROM stock_items WHERE id = ?', [req.params.id]);
    await logAdminAction(req.user, 'DELETE_STOCK', 'stock_items', req.params.id, 'Removed stock item', req);
    return res.json({ success: true, message: 'Stock item removed.' });
  } catch (err) {
    console.error('[Admin Stock Delete Error]:', err);
    return res.status(500).json({ error: 'Failed to delete stock item.' });
  }
});

/**
 * GET /api/admin/activity-logs
 * Audit log of administrative operations
 */
router.get('/activity-logs', async (req, res) => {
  try {
    const logs = await all('SELECT * FROM admin_activity_logs ORDER BY created_at DESC LIMIT 100');
    return res.json({ logs: logs || [] });
  } catch (err) {
    console.error('[Admin Activity Logs Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve admin activity logs.' });
  }
});

/**
 * GET /api/admin/export-csv
 * Export data to standard CSV
 */
router.get('/export-csv', async (req, res) => {
  try {
    const { type = 'customers' } = req.query;

    if (type === 'customers') {
      const customers = await all("SELECT id, full_name, email, company, phone, login_method, created_at FROM users WHERE role = 'customer'");
      let csv = 'ID,Full Name,Email,Company,Phone,Login Method,Registration Date\n';
      for (const c of customers) {
        csv += `"${c.id}","${c.full_name || ''}","${c.email}","${c.company || ''}","${c.phone || ''}","${c.login_method}","${c.created_at}"\n`;
      }
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="trishul_customers.csv"');
      return res.send(csv);
    }

    if (type === 'orders') {
      const orders = await all("SELECT o.order_number, u.full_name, u.email, o.title, o.total_amount, o.currency, o.status, o.created_at FROM orders o JOIN users u ON u.id = o.user_id");
      let csv = 'Order Number,Customer Name,Customer Email,Title,Amount,Currency,Status,Created At\n';
      for (const o of orders) {
        csv += `"${o.order_number}","${o.full_name}","${o.email}","${o.title}",${o.total_amount},"${o.currency}","${o.status}","${o.created_at}"\n`;
      }
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="trishul_orders.csv"');
      return res.send(csv);
    }

    return res.status(400).json({ error: 'Invalid export type. Supported types: customers, orders' });
  } catch (err) {
    console.error('[Admin CSV Export Error]:', err);
    return res.status(500).json({ error: 'Failed to generate CSV export.' });
  }
});

export default router;
