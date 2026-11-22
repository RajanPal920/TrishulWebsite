import express from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { get, all, run, sqliteDb } from '../db/connection.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { sendRequestStatusUpdateEmail, sendAdminReplyEmail } from '../services/email.js';

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
    const [
      custStats,
      rfqCountRow,
      pendingRfqRow,
      prodStats,
      matStats,
      inqStats,
      orderStats,
      recentUsers,
      recentRequests,
      recentRfqs,
    ] = await Promise.all([
      get("SELECT count(*) as total FROM users WHERE role = 'customer'"),
      get("SELECT count(*) as total FROM rfq_requests"),
      get("SELECT count(*) as total FROM rfq_requests WHERE LOWER(status) IN ('new', 'submitted', 'pending review')"),
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
        `SELECT id, full_name, email, company, phone, role, login_method, status, last_login_at, created_at
         FROM users
         WHERE role = 'customer'
         ORDER BY created_at DESC LIMIT 5`
      ),
      all(
        `SELECT pr.id, pr.product_name as title, pr.material, pr.quantity, pr.status, pr.created_at, u.full_name as customer_name, u.company
         FROM product_requests pr
         JOIN users u ON u.id = pr.user_id
         ORDER BY pr.created_at DESC LIMIT 5`
      ),
      all(
        `SELECT id, reference, company, contact_name, email, phone, items, message, status, created_at
         FROM rfq_requests
         ORDER BY created_at DESC LIMIT 6`
      ),
    ]);

    const parsedRecentRfqs = (recentRfqs || []).map((r) => ({
      ...r,
      items: typeof r.items === 'string' ? JSON.parse(r.items || '[]') : (r.items || []),
    }));

    return res.json({
      stats: {
        totalCustomers: custStats?.total || 0,
        totalRfqs: rfqCountRow?.total || 0,
        pendingRfqs: pendingRfqRow?.total || 0,
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
      recentRfqs: parsedRecentRfqs,
    });
  } catch (err) {
    console.error('[Admin Overview Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve admin overview statistics.' });
  }
});

/**
 * GET /api/admin/rfqs
 * Complete list of customer queries & RFQ requests with full search and status filter
 */
router.get('/rfqs', async (req, res) => {
  try {
    const { status, search } = req.query;
    let sql = 'SELECT * FROM rfq_requests WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      const clean = status.trim().toLowerCase();
      if (clean === 'new') {
        sql += " AND (LOWER(status) = 'new' OR LOWER(status) = 'submitted' OR LOWER(status) = 'pending review')";
      } else {
        sql += ' AND LOWER(status) = ?';
        params.push(clean);
      }
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      sql += ' AND (reference LIKE ? OR contact_name LIKE ? OR email LIKE ? OR company LIKE ? OR phone LIKE ?)';
      params.push(term, term, term, term, term);
    }

    sql += ' ORDER BY created_at DESC';

    const rfqs = await all(sql, params);
    const parsed = (rfqs || []).map((r) => ({
      ...r,
      items: typeof r.items === 'string' ? JSON.parse(r.items || '[]') : (r.items || []),
      testing: typeof r.testing === 'string' ? JSON.parse(r.testing || '[]') : (r.testing || []),
      attachments: typeof r.attachments === 'string' ? JSON.parse(r.attachments || '[]') : (r.attachments || []),
    }));

    return res.json({ rfqs: parsed });
  } catch (err) {
    console.error('[Admin RFQs Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve RFQ queries.' });
  }
});

/**
 * PUT /api/admin/rfqs/:id
 * Update status, admin response, internal notes, and notify customer via email
 */
router.put('/rfqs/:id', async (req, res) => {
  try {
    const { status, admin_response, response, admin_notes, notes, notify_customer } = req.body;
    const now = new Date().toISOString();

    const existing = await get(
      'SELECT id, reference, company, contact_name, email, phone, status, admin_response, admin_notes, user_id FROM rfq_requests WHERE id = ? OR reference = ?',
      [req.params.id, req.params.id]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Inquiry / RFQ not found.' });
    }

    const oldStatus = existing.status || 'Pending';
    const newStatus = status ? status.trim() : oldStatus;
    const newAdminResponse = admin_response !== undefined ? (admin_response || '').trim() : (response !== undefined ? (response || '').trim() : existing.admin_response);
    const newAdminNotes = admin_notes !== undefined ? (admin_notes || '').trim() : (notes !== undefined ? (notes || '').trim() : existing.admin_notes);

    const hasStatusChanged = status && status.trim().toLowerCase() !== oldStatus.toLowerCase();
    const hasNewCustomerResponse = admin_response !== undefined || response !== undefined;
    const hasNewInternalNote = (admin_notes !== undefined || notes !== undefined) && newAdminNotes !== existing.admin_notes;

    // 1. Update database record
    await run(
      `UPDATE rfq_requests
       SET status = ?,
           admin_response = ?,
           admin_notes = ?
       WHERE id = ?`,
      [newStatus, newAdminResponse || null, newAdminNotes || null, existing.id]
    );

    if (sqliteDb) {
      sqliteDb.run(
        `UPDATE rfq_requests
         SET status = ?,
             admin_response = ?,
             admin_notes = ?
         WHERE id = ?`,
        [newStatus, newAdminResponse || null, newAdminNotes || null, existing.id],
        () => {}
      );
    }

    let emailSent = false;
    let emailResult = null;

    // 2. Dispatch Customer Email Notification if requested and status changed or customer response provided
    const shouldNotify = notify_customer !== false && (hasStatusChanged || hasNewCustomerResponse);

    if (shouldNotify && existing.email) {
      const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : null);
      const baseUrl = origin || process.env.SITE_URL || 'https://www.trishulmetal.com';

      try {
        emailResult = await sendRequestStatusUpdateEmail({
          to: existing.email,
          customerName: existing.contact_name || existing.company || 'Valued Customer',
          reference: existing.reference,
          oldStatus,
          newStatus,
          adminMessage: newAdminResponse || null,
          baseUrl,
        });
        emailSent = Boolean(emailResult?.success);
      } catch (mailErr) {
        console.warn('[Admin Customer Notification Warning]:', mailErr.message);
      }
    }

    // 3. Record in request_activity_history audit trail
    if (hasStatusChanged || hasNewCustomerResponse) {
      const actId = crypto.randomUUID();
      const actionType = hasStatusChanged ? 'STATUS_CHANGED' : 'ADMIN_REPLY';
      await run(
        `INSERT INTO request_activity_history (id, request_id, actor_type, actor_id, actor_name, action, old_status, new_status, message, is_internal, email_sent, created_at)
         VALUES (?, ?, 'admin', ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
        [
          actId,
          existing.id,
          req.user.id,
          req.user.full_name || 'Admin',
          actionType,
          oldStatus,
          newStatus,
          newAdminResponse || null,
          emailSent ? 1 : 0,
          now,
        ]
      ).catch(() => {});
    }

    // Record separate internal note if added (never emailed to customer)
    if (hasNewInternalNote && newAdminNotes) {
      const noteActId = crypto.randomUUID();
      await run(
        `INSERT INTO request_activity_history (id, request_id, actor_type, actor_id, actor_name, action, old_status, new_status, message, is_internal, email_sent, created_at)
         VALUES (?, ?, 'admin', ?, ?, 'INTERNAL_NOTE', ?, ?, ?, 1, 0, ?)`,
        [
          noteActId,
          existing.id,
          req.user.id,
          req.user.full_name || 'Admin',
          newStatus,
          newStatus,
          newAdminNotes,
          now,
        ]
      ).catch(() => {});
    }

    await logAdminAction(
      req.user,
      'UPDATE_RFQ_STATUS',
      'rfq_requests',
      existing.id,
      `Status: ${oldStatus} -> ${newStatus}${newAdminResponse ? ` | Customer Message Added` : ''}${emailSent ? ' | Customer Emailed' : ''}`,
      req
    );

    const updated = await get('SELECT * FROM rfq_requests WHERE id = ?', [existing.id]);
    return res.json({
      success: true,
      message: emailSent
        ? `Request updated and email notification sent to ${existing.email}.`
        : 'Request status updated successfully.',
      rfq: updated,
      emailSent,
      emailDeliveryMode: emailResult?.mode || 'none',
    });
  } catch (err) {
    console.error('[Admin RFQ Status Error]:', err);
    return res.status(500).json({ error: 'Failed to update RFQ status.' });
  }
});

/**
 * POST /api/admin/rfqs/:id/reply
 * Send official customer-facing reply message and dispatch email
 */
router.post('/rfqs/:id/reply', async (req, res) => {
  try {
    const { message, status } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Reply message cannot be empty.' });
    }

    const existing = await get(
      'SELECT id, reference, company, contact_name, email, status FROM rfq_requests WHERE id = ? OR reference = ?',
      [req.params.id, req.params.id]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    const cleanMsg = message.trim();
    const newStatus = status ? status.trim() : (existing.status || 'In Progress');
    const now = new Date().toISOString();

    await run(
      `UPDATE rfq_requests
       SET admin_response = ?, status = ?
       WHERE id = ?`,
      [cleanMsg, newStatus, existing.id]
    );

    const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : null);
    const baseUrl = origin || process.env.SITE_URL || 'https://www.trishulmetal.com';

    let emailSent = false;
    if (existing.email) {
      const emailResult = await sendAdminReplyEmail({
        to: existing.email,
        customerName: existing.contact_name || existing.company || 'Customer',
        reference: existing.reference,
        currentStatus: newStatus,
        adminMessage: cleanMsg,
        baseUrl,
      }).catch((mailErr) => {
        console.warn('[Admin Reply Email Warning]:', mailErr.message);
        return { success: false };
      });
      emailSent = Boolean(emailResult?.success);
    }

    // Record in history audit
    const actId = crypto.randomUUID();
    await run(
      `INSERT INTO request_activity_history (id, request_id, actor_type, actor_id, actor_name, action, old_status, new_status, message, is_internal, email_sent, created_at)
       VALUES (?, ?, 'admin', ?, ?, 'ADMIN_REPLY', ?, ?, ?, 0, ?, ?)`,
      [
        actId,
        existing.id,
        req.user.id,
        req.user.full_name || 'Admin',
        existing.status,
        newStatus,
        cleanMsg,
        emailSent ? 1 : 0,
        now,
      ]
    ).catch(() => {});

    await logAdminAction(
      req.user,
      'REPLY_TO_CUSTOMER',
      'rfq_requests',
      existing.id,
      `Sent official reply to ${existing.email} (Status: ${newStatus})`,
      req
    );

    return res.json({
      success: true,
      message: emailSent
        ? `Reply dispatched and email notification sent to ${existing.email}.`
        : 'Reply recorded successfully.',
      emailSent,
    });
  } catch (err) {
    console.error('[Admin Reply Error]:', err);
    return res.status(500).json({ error: 'Failed to send reply to customer.' });
  }
});

/**
 * GET /api/admin/rfqs/:id/history
 * Complete activity & audit history for a customer request
 */
router.get('/rfqs/:id/history', async (req, res) => {
  try {
    const existing = await get(
      'SELECT id, reference FROM rfq_requests WHERE id = ? OR reference = ?',
      [req.params.id, req.params.id]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    const history = await all(
      `SELECT * FROM request_activity_history
       WHERE request_id = ? OR request_id = ?
       ORDER BY created_at ASC`,
      [existing.id, existing.reference]
    );

    return res.json({
      reference: existing.reference,
      history: history || [],
    });
  } catch (err) {
    console.error('[Admin RFQ History Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve request history.' });
  }
});

/**
 * POST /api/admin/rfqs/:id/retry-notification
 * Re-send latest notification email if previous attempt failed
 */
router.post('/rfqs/:id/retry-notification', async (req, res) => {
  try {
    const existing = await get(
      'SELECT id, reference, company, contact_name, email, status, admin_response FROM rfq_requests WHERE id = ? OR reference = ?',
      [req.params.id, req.params.id]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    if (!existing.email) {
      return res.status(400).json({ error: 'No customer email address on this request.' });
    }

    const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : null);
    const baseUrl = origin || process.env.SITE_URL || 'https://www.trishulmetal.com';

    const emailResult = await sendRequestStatusUpdateEmail({
      to: existing.email,
      customerName: existing.contact_name || existing.company || 'Customer',
      reference: existing.reference,
      oldStatus: existing.status,
      newStatus: existing.status,
      adminMessage: existing.admin_response || null,
      baseUrl,
    });

    const now = new Date().toISOString();
    const actId = crypto.randomUUID();
    await run(
      `INSERT INTO request_activity_history (id, request_id, actor_type, actor_id, actor_name, action, old_status, new_status, message, is_internal, email_sent, created_at)
       VALUES (?, ?, 'admin', ?, ?, 'NOTIFICATION_RETRIED', ?, ?, 'Admin manually retried notification dispatch', 0, ?, ?)`,
      [actId, existing.id, req.user.id, req.user.full_name || 'Admin', existing.status, existing.status, emailResult?.success ? 1 : 0, now]
    ).catch(() => {});

    return res.json({
      success: true,
      message: `Notification retried successfully to ${existing.email}.`,
      deliveryMode: emailResult?.mode || 'none',
    });
  } catch (err) {
    console.error('[Admin Retry Notification Error]:', err);
    return res.status(500).json({ error: 'Failed to retry customer notification.' });
  }
});

/**
 * DELETE /api/admin/rfqs/:id
 * Admin deletes an RFQ enquiry
 */
router.delete('/rfqs/:id', async (req, res) => {
  try {
    const existing = await get(
      'SELECT id, reference FROM rfq_requests WHERE id = ? OR reference = ?',
      [req.params.id, req.params.id]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }

    await run('DELETE FROM rfq_requests WHERE id = ?', [existing.id]);
    await logAdminAction(req.user, 'DELETE_RFQ', 'rfq_requests', existing.id, `Deleted RFQ ${existing.reference}`, req);

    return res.json({
      success: true,
      message: 'Inquiry deleted successfully.',
      reference: existing.reference,
    });
  } catch (err) {
    console.error('[Admin Delete RFQ Error]:', err);
    return res.status(500).json({ error: 'Failed to delete RFQ inquiry.' });
  }
});

/**
 * PUT /api/admin/password
 * Change owner admin password
 */
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    }

    const admin = await get('SELECT * FROM users WHERE id = ? AND role = ?', [req.user.id, 'admin']);
    if (!admin) {
      return res.status(404).json({ error: 'Admin account not found.' });
    }

    if (admin.password_hash && currentPassword) {
      const match = await bcrypt.compare(currentPassword, admin.password_hash);
      if (!match) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    const now = new Date().toISOString();

    await run('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?', [newHash, now, admin.id]);
    await logAdminAction(req.user, 'CHANGE_PASSWORD', 'users', admin.id, 'Admin password changed', req);

    return res.json({ success: true, message: 'Admin password updated successfully.' });
  } catch (err) {
    console.error('[Admin Password Change Error]:', err);
    return res.status(500).json({ error: 'Failed to change admin password.' });
  }
});

/**
 * GET /api/admin/customers
 * Paginated, filtered, and searchable list of registered customers
 */
router.get('/customers', async (req, res) => {
  try {
    const {
      search,
      method,
      status,
      sort = 'registered_desc',
      limit = 20,
      page = 1,
      offset: customOffset,
    } = req.query;

    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const offset = customOffset !== undefined ? parseInt(customOffset, 10) : (parsedPage - 1) * parsedLimit;

    let whereSql = "WHERE u.role = 'customer'";
    const params = [];
    const countParams = [];

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      whereSql += ' AND (u.full_name LIKE ? OR u.email LIKE ? OR u.company LIKE ? OR u.phone LIKE ? OR u.id LIKE ?)';
      params.push(term, term, term, term, term);
      countParams.push(term, term, term, term, term);
    }

    if (method && method !== 'all') {
      whereSql += ' AND LOWER(u.login_method) = ?';
      const cleanMethod = method.trim().toLowerCase();
      params.push(cleanMethod);
      countParams.push(cleanMethod);
    }

    if (status && status !== 'all') {
      whereSql += " AND LOWER(COALESCE(u.status, 'active')) = ?";
      const cleanStatus = status.trim().toLowerCase();
      params.push(cleanStatus);
      countParams.push(cleanStatus);
    }

    let orderSql = ' ORDER BY u.created_at DESC';
    if (sort === 'registered_asc') {
      orderSql = ' ORDER BY u.created_at ASC';
    } else if (sort === 'login_desc') {
      orderSql = ' ORDER BY (u.last_login_at IS NULL), u.last_login_at DESC';
    } else if (sort === 'login_asc') {
      orderSql = ' ORDER BY (u.last_login_at IS NULL), u.last_login_at ASC';
    } else if (sort === 'name_asc') {
      orderSql = ' ORDER BY u.full_name ASC';
    } else if (sort === 'name_desc') {
      orderSql = ' ORDER BY u.full_name DESC';
    }

    const selectSql = `
      SELECT u.id, u.email, u.full_name, u.company, u.phone, u.role,
             COALESCE(u.status, 'active') as status,
             u.login_method, u.last_login_at, u.created_at,
             (SELECT count(*) FROM rfq_requests WHERE user_id = u.id OR (user_id IS NULL AND LOWER(email) = LOWER(u.email))) as rfq_count,
             (SELECT count(*) FROM orders WHERE user_id = u.id) as orders_count,
             (SELECT count(*) FROM product_requests WHERE user_id = u.id) as product_requests_count,
             (SELECT count(*) FROM material_requests WHERE user_id = u.id) as material_requests_count,
             (SELECT count(*) FROM inquiries WHERE user_id = u.id) as inquiries_count
      FROM users u
      ${whereSql}
      ${orderSql}
      LIMIT ? OFFSET ?
    `;
    params.push(parsedLimit, offset);

    const [customers, countRow] = await Promise.all([
      all(selectSql, params),
      get(`SELECT count(*) as count FROM users u ${whereSql}`, countParams),
    ]);

    const total = countRow?.count || 0;
    const totalPages = Math.ceil(total / parsedLimit);

    return res.json({
      customers: customers || [],
      total,
      page: parsedPage,
      totalPages,
      limit: parsedLimit,
    });
  } catch (err) {
    console.error('[Admin Customers Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve customer accounts.' });
  }
});

/**
 * GET /api/admin/customers/:id
 * Complete 360-degree customer profile, activity metrics & inquiry history
 */
router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await get(
      `SELECT id, email, full_name, company, phone, role,
              COALESCE(status, 'active') as status,
              avatar_url, login_method, last_login_at, created_at, updated_at
       FROM users WHERE id = ?`,
      [req.params.id]
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const [rawRfqs, productRequests, materialRequests, inquiries, orders, loginHistory] = await Promise.all([
      all(
        `SELECT * FROM rfq_requests
         WHERE user_id = ? OR (user_id IS NULL AND LOWER(email) = LOWER(?))
         ORDER BY created_at DESC`,
        [customer.id, customer.email]
      ),
      all('SELECT * FROM product_requests WHERE user_id = ? ORDER BY created_at DESC', [customer.id]),
      all('SELECT * FROM material_requests WHERE user_id = ? ORDER BY created_at DESC', [customer.id]),
      all('SELECT * FROM inquiries WHERE user_id = ? ORDER BY created_at DESC', [customer.id]),
      all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [customer.id]),
      all('SELECT * FROM user_login_activity WHERE user_id = ? ORDER BY created_at DESC LIMIT 15', [customer.id]),
    ]);

    // Parse JSON fields in RFQs
    const rfqs = (rawRfqs || []).map((r) => ({
      ...r,
      items: typeof r.items === 'string' ? JSON.parse(r.items || '[]') : (r.items || []),
      testing: typeof r.testing === 'string' ? JSON.parse(r.testing || '[]') : (r.testing || []),
      attachments: typeof r.attachments === 'string' ? JSON.parse(r.attachments || '[]') : (r.attachments || []),
    }));

    // Calculate dates
    const inquiryDates = [
      ...rfqs.map((r) => r.created_at),
      ...(inquiries || []).map((i) => i.created_at),
      ...(productRequests || []).map((p) => p.created_at),
      ...(materialRequests || []).map((m) => m.created_at),
    ]
      .filter(Boolean)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const lastInquiryDate = inquiryDates.length > 0 ? inquiryDates[0] : null;
    const lastPurchaseDate = orders && orders.length > 0 ? orders[0].created_at : null;

    const activityStats = {
      totalRfqs: rfqs.length,
      totalOrders: (orders || []).length,
      totalProductRequests: (productRequests || []).length,
      totalMaterialRequests: (materialRequests || []).length,
      totalInquiries: (inquiries || []).length,
      lastInquiryDate,
      lastPurchaseDate,
    };

    return res.json({
      customer,
      rfqs,
      productRequests: productRequests || [],
      materialRequests: materialRequests || [],
      inquiries: inquiries || [],
      orders: orders || [],
      loginHistory: loginHistory || [],
      activityStats,
    });
  } catch (err) {
    console.error('[Admin Customer Detail Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve customer details.' });
  }
});

/**
 * PUT /api/admin/customers/:id
 * Admin updates customer contact information & account status
 */
router.put('/customers/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const existing = await get('SELECT * FROM users WHERE id = ?', [customerId]);
    if (!existing) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const { full_name, email, phone, company, status } = req.body;
    const cleanName = (full_name !== undefined ? full_name : existing.full_name || '').trim();
    const cleanEmail = (email !== undefined ? email : existing.email || '').trim().toLowerCase();
    const cleanPhone = phone !== undefined ? phone.trim() : (existing.phone || '');
    const cleanCompany = company !== undefined ? company.trim() : (existing.company || '');
    const cleanStatus = (status !== undefined ? status : existing.status || 'active').trim().toLowerCase();

    // 1. Validate full name
    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ error: 'Customer full name is required (minimum 2 characters).' });
    }

    // 2. Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    // Check duplicate email
    const duplicate = await get('SELECT id FROM users WHERE email = ? AND id != ?', [cleanEmail, customerId]);
    if (duplicate) {
      return res.status(409).json({ error: 'Another account already uses this email address.' });
    }

    // 3. Validate phone if provided
    if (cleanPhone) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;
      if (!phoneRegex.test(cleanPhone)) {
        return res.status(400).json({
          error: 'Invalid phone number format. Please provide a valid phone number with country code (e.g. +91 98200 12345).',
        });
      }
    }

    // 4. Validate status
    if (cleanStatus !== 'active' && cleanStatus !== 'inactive') {
      return res.status(400).json({ error: "Account status must be either 'active' or 'inactive'." });
    }

    const now = new Date().toISOString();
    await run(
      `UPDATE users
       SET full_name = ?,
           email = ?,
           phone = ?,
           company = ?,
           status = ?,
           updated_at = ?
       WHERE id = ?`,
      [cleanName, cleanEmail, cleanPhone || null, cleanCompany || null, cleanStatus, now, customerId]
    );

    await logAdminAction(
      req.user,
      'UPDATE_CUSTOMER',
      'users',
      customerId,
      `Updated contact details for ${cleanEmail} (Name: ${cleanName}, Phone: ${cleanPhone || 'None'}, Status: ${cleanStatus})`,
      req
    );

    const updated = await get(
      `SELECT id, email, full_name, company, phone, role,
              COALESCE(status, 'active') as status,
              avatar_url, login_method, last_login_at, created_at, updated_at
       FROM users WHERE id = ?`,
      [customerId]
    );

    return res.json({
      success: true,
      message: 'Customer contact information updated successfully.',
      customer: updated,
    });
  } catch (err) {
    console.error('[Admin Customer Update Error]:', err);
    return res.status(500).json({ error: 'Failed to update customer account.' });
  }
});

/**
 * DELETE /api/admin/customers/:id
 * Delete a customer account (only role = 'customer', never delete admin)
 */
router.delete('/customers/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    // Strictly verify target is a customer (cannot delete admin)
    const customer = await get(
      "SELECT id, email, full_name, role FROM users WHERE id = ? AND role = 'customer'",
      [customerId]
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer account not found or cannot be deleted.' });
    }

    // Safely delete customer associated records across related tables
    try {
      await run('DELETE FROM product_requests WHERE user_id = ?', [customer.id]);
      await run('DELETE FROM material_requests WHERE user_id = ?', [customer.id]);
      await run('DELETE FROM inquiries WHERE user_id = ?', [customer.id]);
      await run('DELETE FROM orders WHERE user_id = ?', [customer.id]);
      await run('DELETE FROM rfq_requests WHERE user_id = ?', [customer.id]);
      await run('DELETE FROM user_sessions WHERE user_id = ?', [customer.id]);
      await run('DELETE FROM user_login_activity WHERE user_id = ?', [customer.id]);
    } catch (cleanupErr) {
      console.warn('[Admin Delete Customer Cleanup Warning]:', cleanupErr.message);
    }

    // Delete the customer record itself
    await run("DELETE FROM users WHERE id = ? AND role = 'customer'", [customer.id]);

    await logAdminAction(
      req.user,
      'DELETE_CUSTOMER',
      'users',
      customer.id,
      `Deleted customer account ${customer.email} (${customer.full_name})`,
      req
    );

    return res.json({
      success: true,
      message: `Customer account ${customer.email} deleted successfully.`,
      deletedId: customer.id,
    });
  } catch (err) {
    console.error('[Admin Delete Customer Error]:', err);
    return res.status(500).json({ error: 'Failed to delete customer account.' });
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
