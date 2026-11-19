import express from 'express';
import crypto from 'node:crypto';
import { all, get, run } from '../db/connection.js';

const router = express.Router();

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
    const ph = phone || req.user?.phone || null;
    const cntry = country || null;
    const items = line_items || lineItems || [];

    if (!mail) {
      return res.status(400).json({ error: 'Email is required for RFQ submission.' });
    }

    const rfqId = crypto.randomUUID();
    const rfqNumber = `TM-RFQ-${Date.now().toString().slice(-6)}`;
    const confirmationToken = crypto.randomUUID();
    const now = new Date().toISOString();

    await run(
      `INSERT INTO rfq_requests (
        id, user_id, reference, confirmation_token, company, contact_name,
        email, phone, country, incoterm, delivery_port, target_lead_time,
        project_name, message, certification, testing, items, attachments,
        status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?)`,
      [
        rfqId,
        req.user ? req.user.id : null,
        rfqNumber,
        confirmationToken,
        comp || 'Trishul Customer',
        name || 'Customer',
        mail,
        ph,
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

    // If customer is logged in, also record line items into product_requests so they appear in their portal
    if (req.user && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const prodId = crypto.randomUUID();
        await run(
          `INSERT INTO product_requests (id, user_id, product_name, material, size, quantity, specification, notes, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending Review', ?, ?)`,
          [
            prodId,
            req.user.id,
            item.product || item.product_name || 'Alloy Piping Component',
            item.material || item.grade || null,
            item.size || null,
            item.quantity ? `${item.quantity} ${item.unit || 'pcs'}` : '1 pcs',
            item.standard || item.rating || item.spec || null,
            `Submitted via RFQ ${rfqNumber}. ${notes || ''}`.trim(),
            now,
            now,
          ]
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: 'RFQ submitted successfully.',
      rfqNumber,
      rfqId,
    });
  } catch (err) {
    console.error('[RFQ Submission Error]:', err);
    return res.status(500).json({ error: 'Failed to submit RFQ request.' });
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

    return res.json({ success: true });
  } catch (err) {
    console.error('[Document Download Error]:', err);
    return res.status(500).json({ error: 'Failed to record document download.' });
  }
});

export default router;
