import express from 'express';
import crypto from 'node:crypto';
import { get, all, run } from '../db/connection.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All customer routes require authentication
router.use(requireAuth);

/**
 * GET /api/customer/profile
 */
router.get('/profile', async (req, res) => {
  try {
    const user = await get(
      `SELECT id, email, full_name, company, phone, role, avatar_url, created_at, updated_at
       FROM users WHERE id = ?`,
      [req.user.id]
    );
    if (!user) {
      return res.status(404).json({ error: 'Customer profile not found.' });
    }
    return res.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      full_name: user.full_name,
      company: user.company || '',
      phone: user.phone || '',
      role: user.role,
      avatarUrl: user.avatar_url,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    });
  } catch (err) {
    console.error('[Customer Profile GET Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

/**
 * PUT /api/customer/profile
 */
router.put('/profile', async (req, res) => {
  try {
    const { full_name, fullName, company, phone } = req.body;
    const name = (full_name || fullName || req.user.full_name || '').trim();
    const comp = company !== undefined ? company.trim() : req.user.company;
    const ph = phone !== undefined ? phone.trim() : req.user.phone;

    if (!name) {
      return res.status(400).json({ error: 'Full name cannot be empty.' });
    }

    const now = new Date().toISOString();
    await run(
      `UPDATE users
       SET full_name = ?, company = ?, phone = ?, updated_at = ?
       WHERE id = ?`,
      [name, comp || null, ph || null, now, req.user.id]
    );

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: req.user.id,
        email: req.user.email,
        fullName: name,
        full_name: name,
        company: comp || null,
        phone: ph || null,
        role: req.user.role,
      },
    });
  } catch (err) {
    console.error('[Customer Profile PUT Error]:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

/**
 * GET /api/customer/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const productStats = await get(
      `SELECT
         COUNT(*) as total,
         SUM(CASE WHEN status = 'Pending Review' THEN 1 ELSE 0 END) as pending,
         SUM(CASE WHEN status = 'Approved' OR status = 'Quotation Sent' THEN 1 ELSE 0 END) as active
       FROM product_requests WHERE user_id = ?`,
      [req.user.id]
    );

    const materialStats = await get(
      `SELECT
         COUNT(*) as total,
         SUM(CASE WHEN status = 'Pending Review' THEN 1 ELSE 0 END) as pending,
         SUM(CASE WHEN status = 'Approved' OR status = 'Quoted' THEN 1 ELSE 0 END) as active
       FROM material_requests WHERE user_id = ?`,
      [req.user.id]
    );

    const inquiryStats = await get(
      `SELECT
         COUNT(*) as total,
         SUM(CASE WHEN status = 'Open' OR status = 'In Progress' THEN 1 ELSE 0 END) as open
       FROM inquiries WHERE user_id = ?`,
      [req.user.id]
    );

    return res.json({
      productRequests: {
        total: productStats?.total || 0,
        pending: productStats?.pending || 0,
        active: productStats?.active || 0,
      },
      materialRequests: {
        total: materialStats?.total || 0,
        pending: materialStats?.pending || 0,
        active: materialStats?.active || 0,
      },
      inquiries: {
        total: inquiryStats?.total || 0,
        open: inquiryStats?.open || 0,
      },
      summary: {
        totalRequests: (productStats?.total || 0) + (materialStats?.total || 0),
        pendingReview: (productStats?.pending || 0) + (materialStats?.pending || 0),
        openInquiries: inquiryStats?.open || 0,
      },
    });
  } catch (err) {
    console.error('[Customer Stats Error]:', err);
    return res.status(500).json({ error: 'Failed to calculate statistics.' });
  }
});

/**
 * GET /api/customer/product-requests
 */
router.get('/product-requests', async (req, res) => {
  try {
    const requests = await all(
      `SELECT id, product_id, product_name, material, size, quantity, specification, notes, status, created_at, updated_at
       FROM product_requests
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    return res.json({ requests });
  } catch (err) {
    console.error('[Product Requests GET Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch product requests.' });
  }
});

/**
 * POST /api/customer/product-requests
 */
router.post('/product-requests', async (req, res) => {
  try {
    const {
      product_id,
      productId,
      product_name,
      productName,
      material,
      size,
      quantity,
      specification,
      notes,
    } = req.body;

    const prodName = (product_name || productName || '').trim();
    const qty = (quantity || '').toString().trim();

    if (!prodName) {
      return res.status(400).json({ error: 'Product name is required.' });
    }
    if (!qty) {
      return res.status(400).json({ error: 'Quantity is required.' });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await run(
      `INSERT INTO product_requests (id, user_id, product_id, product_name, material, size, quantity, specification, notes, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending Review', ?, ?)`,
      [
        id,
        req.user.id,
        product_id || productId || null,
        prodName,
        material || null,
        size || null,
        qty,
        specification || null,
        notes || null,
        now,
        now,
      ]
    );

    const created = await get('SELECT * FROM product_requests WHERE id = ?', [id]);
    return res.status(201).json({
      success: true,
      message: 'Product request submitted successfully.',
      request: created,
    });
  } catch (err) {
    console.error('[Product Requests POST Error]:', err);
    return res.status(500).json({ error: 'Failed to submit product request.' });
  }
});

/**
 * POST /api/customer/product-requests/:id/repeat
 */
router.post('/product-requests/:id/repeat', async (req, res) => {
  try {
    const original = await get(
      'SELECT * FROM product_requests WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!original) {
      return res.status(404).json({ error: 'Original product request not found.' });
    }

    const { quantity, notes } = req.body;
    const newId = crypto.randomUUID();
    const now = new Date().toISOString();

    await run(
      `INSERT INTO product_requests (id, user_id, product_id, product_name, material, size, quantity, specification, notes, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending Review', ?, ?)`,
      [
        newId,
        req.user.id,
        original.product_id,
        original.product_name,
        original.material,
        original.size,
        quantity || original.quantity,
        original.specification,
        notes !== undefined ? notes : original.notes ? `Repeat of previous order. ${original.notes}` : 'Repeat of previous order',
        now,
        now,
      ]
    );

    const created = await get('SELECT * FROM product_requests WHERE id = ?', [newId]);
    return res.status(201).json({
      success: true,
      message: 'Repeat request created successfully.',
      request: created,
    });
  } catch (err) {
    console.error('[Repeat Product Request Error]:', err);
    return res.status(500).json({ error: 'Failed to create repeat request.' });
  }
});

/**
 * GET /api/customer/material-requests
 */
router.get('/material-requests', async (req, res) => {
  try {
    const requests = await all(
      `SELECT id, material_id, material_name, form, quantity, specification, notes, status, created_at, updated_at
       FROM material_requests
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    return res.json({ requests });
  } catch (err) {
    console.error('[Material Requests GET Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch material requests.' });
  }
});

/**
 * POST /api/customer/material-requests
 */
router.post('/material-requests', async (req, res) => {
  try {
    const {
      material_id,
      materialId,
      material_name,
      materialName,
      form,
      quantity,
      specification,
      notes,
    } = req.body;

    const matName = (material_name || materialName || '').trim();
    const qty = (quantity || '').toString().trim();

    if (!matName) {
      return res.status(400).json({ error: 'Material name is required.' });
    }
    if (!qty) {
      return res.status(400).json({ error: 'Quantity is required.' });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await run(
      `INSERT INTO material_requests (id, user_id, material_id, material_name, form, quantity, specification, notes, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending Review', ?, ?)`,
      [
        id,
        req.user.id,
        material_id || materialId || null,
        matName,
        form || null,
        qty,
        specification || null,
        notes || null,
        now,
        now,
      ]
    );

    const created = await get('SELECT * FROM material_requests WHERE id = ?', [id]);
    return res.status(201).json({
      success: true,
      message: 'Material request submitted successfully.',
      request: created,
    });
  } catch (err) {
    console.error('[Material Requests POST Error]:', err);
    return res.status(500).json({ error: 'Failed to submit material request.' });
  }
});

/**
 * POST /api/customer/material-requests/:id/repeat
 */
router.post('/material-requests/:id/repeat', async (req, res) => {
  try {
    const original = await get(
      'SELECT * FROM material_requests WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!original) {
      return res.status(404).json({ error: 'Original material request not found.' });
    }

    const { quantity, notes } = req.body;
    const newId = crypto.randomUUID();
    const now = new Date().toISOString();

    await run(
      `INSERT INTO material_requests (id, user_id, material_id, material_name, form, quantity, specification, notes, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending Review', ?, ?)`,
      [
        newId,
        req.user.id,
        original.material_id,
        original.material_name,
        original.form,
        quantity || original.quantity,
        original.specification,
        notes !== undefined ? notes : original.notes ? `Repeat order. ${original.notes}` : 'Repeat order',
        now,
        now,
      ]
    );

    const created = await get('SELECT * FROM material_requests WHERE id = ?', [newId]);
    return res.status(201).json({
      success: true,
      message: 'Repeat material request created successfully.',
      request: created,
    });
  } catch (err) {
    console.error('[Repeat Material Request Error]:', err);
    return res.status(500).json({ error: 'Failed to create repeat material request.' });
  }
});

/**
 * GET /api/customer/inquiries
 */
router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await all(
      `SELECT id, subject, message, status, response, created_at, updated_at
       FROM inquiries
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    return res.json({ inquiries });
  } catch (err) {
    console.error('[Inquiries GET Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch inquiries.' });
  }
});

/**
 * POST /api/customer/inquiries
 */
router.post('/inquiries', async (req, res) => {
  try {
    const { subject, message } = req.body;
    const sub = (subject || '').trim();
    const msg = (message || '').trim();

    if (!sub) {
      return res.status(400).json({ error: 'Inquiry subject is required.' });
    }
    if (!msg) {
      return res.status(400).json({ error: 'Inquiry message cannot be empty.' });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await run(
      `INSERT INTO inquiries (id, user_id, subject, message, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'Open', ?, ?)`,
      [id, req.user.id, sub, msg, now, now]
    );

    const created = await get('SELECT * FROM inquiries WHERE id = ?', [id]);
    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. Our engineering team will respond shortly.',
      inquiry: created,
    });
  } catch (err) {
    console.error('[Inquiries POST Error]:', err);
    return res.status(500).json({ error: 'Failed to submit inquiry.' });
  }
});

/**
 * GET /api/customer/recent-activity
 */
router.get('/recent-activity', async (req, res) => {
  try {
    const productReqs = await all(
      `SELECT id, 'product_request' as type, product_name as title, status, created_at, quantity as detail
       FROM product_requests WHERE user_id = ?
       ORDER BY created_at DESC LIMIT 5`,
      [req.user.id]
    );

    const materialReqs = await all(
      `SELECT id, 'material_request' as type, material_name as title, status, created_at, quantity as detail
       FROM material_requests WHERE user_id = ?
       ORDER BY created_at DESC LIMIT 5`,
      [req.user.id]
    );

    const inquiries = await all(
      `SELECT id, 'inquiry' as type, subject as title, status, created_at, '' as detail
       FROM inquiries WHERE user_id = ?
       ORDER BY created_at DESC LIMIT 5`,
      [req.user.id]
    );

    const combined = [...productReqs, ...materialReqs, ...inquiries]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 8);

    return res.json({ activity: combined });
  } catch (err) {
    console.error('[Recent Activity Error]:', err);
    return res.status(500).json({ error: 'Failed to load activity feed.' });
  }
});

export default router;
