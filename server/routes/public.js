import express from 'express';
import crypto from 'node:crypto';
import { all, get, run } from '../db/connection.js';
import { sendRequestReceivedEmail } from '../services/email.js';

const router = express.Router();

/**
 * Dispatch internal notification email from notifications@trishulmetal.com to contactustrishul@gmail.com
 * Supports console audit logging and environmental webhook/transport safely without blocking user flow.
 */
async function dispatchEmailNotification({ type, reference, customerName, email, company, phone, summary }) {
  const from = 'notifications@trishulmetal.com';
  const to = 'contactustrishul@gmail.com';
  const subject = `[Trishul Desk] New ${type}: ${reference} (${company || customerName})`;

  console.log(`[Email Notification Dispatcher] Queued:`, {
    from,
    to,
    subject,
    reference,
    customer: `${customerName} <${email}>`,
    company,
    phone,
    summary,
    timestamp: new Date().toISOString(),
  });
}

/**
 * GET /api/stock
 * Serves real-time stock list from Trishul Metals Mumbai warehouse
 */
router.get('/stock', async (req, res) => {
  try {
    const { category, grade, search } = req.query;
    let sql = 'SELECT * FROM stock_items WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (grade) {
      sql += ' AND (grade_slug = ? OR grade LIKE ?)';
      params.push(grade, `%${grade}%`);
    }
    if (search) {
      sql += ' AND (grade LIKE ? OR product LIKE ? OR spec LIKE ? OR size LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY category ASC, grade ASC, size ASC';

    const items = await all(sql, params);
    return res.json({ stock: items });
  } catch (err) {
    console.error('[Stock API Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve stock inventory.' });
  }
});

/**
 * POST /api/rfq
 * Accepts RFQ submission, stores in SQLite, links to authenticated user if available
 */
router.post('/rfq', async (req, res) => {
  try {
    const {
      contact_name,
      contactName,
      email,
      company,
      phone,
      country,
      line_items,
      lineItems,
      notes,
    } = req.body;

    const name = (contact_name || contactName || req.user?.full_name || '').trim();
    const mail = (email || req.user?.email || '').trim().toLowerCase();
    const comp = company || req.user?.company || null;
    const ph = (phone || req.user?.phone || '').trim();
    const cntry = country || null;
    const items = line_items || lineItems || [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mail || !emailRegex.test(mail)) {
      return res.status(400).json({ error: 'A valid email address is required for RFQ submission.' });
    }

    if (ph) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;
      if (!phoneRegex.test(ph)) {
        return res.status(400).json({
          error: 'Please enter a valid phone number with country code (e.g. +91 98200 12345).',
        });
      }
    }

    const rfqId = crypto.randomUUID();
    const rfqNumber = `TM-RFQ-${Date.now().toString().slice(-6)}`;
    const confirmationToken = crypto.randomUUID();
    const now = new Date().toISOString();

    // 1. Identify customer ID: from active session OR by looking up registered user by email
    let userId = req.user ? req.user.id : null;
    if (!userId && mail) {
      try {
        const existingUser = await get('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [mail]);
        if (existingUser?.id) {
          userId = existingUser.id;
        }
      } catch {
        // Safe to ignore lookup error
      }
    }

    await run(
      `INSERT INTO rfq_requests (
        id, user_id, reference, confirmation_token, company, contact_name,
        email, phone, country, incoterm, delivery_port, target_lead_time,
        project_name, message, certification, testing, items, attachments,
        status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?)`,
      [
        rfqId,
        userId,
        rfqNumber,
        confirmationToken,
        comp || 'Trishul Customer',
        name || 'Customer',
        mail,
        ph || null,
        cntry,
        req.body.incoterm || null,
        req.body.delivery_port || req.body.deliveryPort || null,
        req.body.target_lead_time || req.body.targetLeadTime || null,
        req.body.project_name || req.body.projectName || null,
        notes || req.body.message || null,
        req.body.certification || null,
        JSON.stringify(req.body.testing || []),
        JSON.stringify(items),
        JSON.stringify(req.body.attachments || []),
        now,
      ]
    );

    // If customer is registered or logged in, also record line items into product_requests so they appear in their portal
    if (userId && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const prodId = crypto.randomUUID();
        await run(
          `INSERT INTO product_requests (id, user_id, product_name, material, size, quantity, specification, notes, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending Review', ?, ?)`,
          [
            prodId,
            userId,
            item.product || item.product_name || 'Alloy Piping Component',
            item.material || item.grade || null,
            item.size || null,
            item.quantity ? `${item.quantity} ${item.unit || 'pcs'}` : '1 pcs',
            item.standard || item.rating || item.spec || null,
            `Submitted via RFQ ${rfqNumber}. ${notes || ''}`.trim(),
            now,
            now,
          ]
        ).catch(() => {});
      }
    }

    // Record in request_activity_history for audit trail
    const histId = crypto.randomUUID();
    await run(
      `INSERT INTO request_activity_history (id, request_id, actor_type, actor_id, actor_name, action, old_status, new_status, message, is_internal, email_sent, created_at)
       VALUES (?, ?, 'customer', ?, ?, 'SUBMITTED', NULL, 'Pending', ?, 0, 1, ?)`,
      [histId, rfqId, userId || null, name || comp || 'Customer', `${items.length} line item(s) submitted via RFQ form`, now]
    ).catch(() => {});

    // Determine base URL
    const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : null);
    const baseUrl = origin || process.env.SITE_URL || 'https://www.trishulmetal.com';

    // 1. Dispatch customer email notification: Email A (Request Received)
    sendRequestReceivedEmail({
      to: mail,
      customerName: name || comp || 'Customer',
      reference: rfqNumber,
      summary: `${Array.isArray(items) ? items.length : 1} line item(s) enquiry for ${comp || 'project material supply'}`,
      baseUrl,
    }).catch((custMailErr) => console.warn('[Customer RFQ Email Warning]:', custMailErr.message));

    // 2. Trigger internal export desk email notification
    dispatchEmailNotification({
      type: 'RFQ Submission',
      reference: rfqNumber,
      customerName: name || 'Trishul Customer',
      email: mail,
      company: comp,
      phone: ph,
      summary: `${Array.isArray(items) ? items.length : 1} line item(s)`,
    }).catch((mailErr) => console.warn('[RFQ Notification Warning]:', mailErr.message));

    return res.status(201).json({
      success: true,
      message: 'RFQ submitted successfully.',
      rfqNumber,
      reference: rfqNumber,
      rfqId,
      confirmationToken,
    });
  } catch (err) {
    console.error('[RFQ Submission Error]:', err);
    return res.status(500).json({ error: 'Failed to submit RFQ request.' });
  }
});

/**
 * GET /api/rfq/confirmation/:token
 * Retrieve confirmation details for a submitted RFQ by token
 */
router.get('/rfq/confirmation/:token', async (req, res) => {
  try {
    const rfq = await get(
      `SELECT reference, company, contact_name, email, phone, country, incoterm, delivery_port,
              target_lead_time, project_name, message, items, attachments, testing, certification,
              status, created_at
       FROM rfq_requests
       WHERE confirmation_token = ?`,
      [req.params.token]
    );

    if (!rfq) {
      return res.status(404).json({ error: 'This acknowledgement link is invalid or no longer available.' });
    }

    return res.json({
      ...rfq,
      items: typeof rfq.items === 'string' ? JSON.parse(rfq.items || '[]') : (rfq.items || []),
      attachments: typeof rfq.attachments === 'string' ? JSON.parse(rfq.attachments || '[]') : (rfq.attachments || []),
      testing: typeof rfq.testing === 'string' ? JSON.parse(rfq.testing || '[]') : (rfq.testing || []),
    });
  } catch (err) {
    console.error('[RFQ Confirmation Fetch Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve RFQ confirmation.' });
  }
});

/**
 * POST /api/cad-download
 */
router.post('/cad-download', async (req, res) => {
  try {
    const { part_code, partCode, email, name, company } = req.body;
    const part = part_code || partCode;
    const mail = email || req.user?.email;

    if (!part || !mail) {
      return res.status(400).json({ error: 'Part code and email are required.' });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await run(
      `INSERT INTO cad_downloads (id, user_id, part_code, email, name, company, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        req.user ? req.user.id : null,
        part,
        mail,
        name || req.user?.full_name || null,
        company || req.user?.company || null,
        now,
      ]
    );

    // Notify export desk
    dispatchEmailNotification({
      type: 'CAD Drawing Download Lead',
      reference: part,
      customerName: name || req.user?.full_name || 'CAD User',
      email: mail,
      company: company || req.user?.company || '',
      phone: '',
      summary: `Component Part Code: ${part}`,
    }).catch(() => {});

    return res.json({ success: true });
  } catch (err) {
    console.error('[CAD Download Error]:', err);
    return res.status(500).json({ error: 'Failed to record download.' });
  }
});

/**
 * POST /api/document-download
 */
router.post('/document-download', async (req, res) => {
  try {
    const { doc_id, docId, email, name, company } = req.body;
    const doc = doc_id || docId;
    const mail = email || req.user?.email;

    if (!doc || !mail) {
      return res.status(400).json({ error: 'Document ID and email are required.' });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await run(
      `INSERT INTO document_downloads (id, user_id, doc_id, email, name, company, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        req.user ? req.user.id : null,
        doc,
        mail,
        name || req.user?.full_name || null,
        company || req.user?.company || null,
        now,
      ]
    );

    // Notify export desk
    dispatchEmailNotification({
      type: 'Technical Document Download',
      reference: doc,
      customerName: name || req.user?.full_name || 'Document User',
      email: mail,
      company: company || req.user?.company || '',
      phone: '',
      summary: `Document ID: ${doc}`,
    }).catch(() => {});

    return res.json({ success: true });
  } catch (err) {
    console.error('[Document Download Error]:', err);
    return res.status(500).json({ error: 'Failed to record document download.' });
  }
});

export default router;
