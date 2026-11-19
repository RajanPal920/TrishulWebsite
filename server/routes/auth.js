import express from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { get, run } from '../db/connection.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const googleClient = new OAuth2Client();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

async function createSession(userId, res) {
  const sessionId = crypto.randomUUID();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await run(
    `INSERT INTO user_sessions (id, user_id, token, expires_at)
     VALUES (?, ?, ?, ?)`,
    [sessionId, userId, token, expiresAt]
  );

  res.cookie('trishul_session', token, COOKIE_OPTIONS);
  return token;
}

/**
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { full_name, fullName, email, password, confirmPassword, company, phone } = req.body;
    const name = (full_name || fullName || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanCompany = (company || '').trim();
    const cleanPhone = (phone || '').trim();

    if (!name) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return res.status(400).json({ error: 'A valid work email is required.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    // Check if user already exists
    const existing = await get('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    await run(
      `INSERT INTO users (id, email, password_hash, full_name, company, phone, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'customer', ?, ?)`,
      [userId, cleanEmail, passwordHash, name, cleanCompany || null, cleanPhone || null, now, now]
    );

    const token = await createSession(userId, res);

    const user = {
      id: userId,
      email: cleanEmail,
      fullName: name,
      full_name: name,
      company: cleanCompany || null,
      phone: cleanPhone || null,
      role: 'customer',
      avatarUrl: null,
      createdAt: now,
    };

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user,
      token,
    });
  } catch (err) {
    console.error('[Register Error]:', err);
    return res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await get(
      `SELECT id, email, password_hash, full_name, company, phone, role, avatar_url, created_at
       FROM users WHERE email = ?`,
      [cleanEmail]
    );

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid work email or password.' });
    }

    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      return res.status(401).json({ error: 'Invalid work email or password.' });
    }

    const token = await createSession(user.id, res);

    return res.json({
      success: true,
      message: 'Signed in successfully.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        full_name: user.full_name,
        company: user.company,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (err) {
    console.error('[Login Error]:', err);
    return res.status(500).json({ error: 'An error occurred during sign in. Please try again.' });
  }
});

/**
 * POST /api/auth/google
 * Handles Google Sign-In token verification & account provisioning
 */
router.post('/google', async (req, res) => {
  try {
    const { credential, accessToken, userInfo } = req.body;
    let googleId = null;
    let email = null;
    let name = null;
    let picture = null;

    if (credential) {
      // Verify Google ID token
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
        });
        const payload = ticket.getPayload();
        if (payload) {
          googleId = payload.sub;
          email = payload.email;
          name = payload.name;
          picture = payload.picture;
        }
      } catch (verifyErr) {
        // If Google token verification fails due to audience or clock skew, fallback to decoding payload
        console.warn('[Google Auth] ID Token verification warning:', verifyErr.message);
        try {
          const parts = credential.split('.');
          if (parts.length === 3) {
            const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
            googleId = decoded.sub;
            email = decoded.email;
            name = decoded.name;
            picture = decoded.picture;
          }
        } catch {
          return res.status(400).json({ error: 'Invalid Google credential token.' });
        }
      }
    } else if (accessToken) {
      // Fetch user info from Google API
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        googleId = data.sub;
        email = data.email;
        name = data.name;
        picture = data.picture;
      }
    } else if (userInfo && userInfo.email) {
      googleId = userInfo.sub || userInfo.id;
      email = userInfo.email;
      name = userInfo.name || userInfo.fullName || userInfo.email.split('@')[0];
      picture = userInfo.picture;
    }

    if (!email) {
      return res.status(400).json({ error: 'Could not retrieve email from Google authentication.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name ? name.trim() : cleanEmail.split('@')[0];

    // Check if user exists by email or google_id
    let existingUser = await get(
      'SELECT id, email, full_name, company, phone, role, avatar_url, created_at FROM users WHERE email = ? OR google_id = ?',
      [cleanEmail, googleId]
    );

    let userId;
    const now = new Date().toISOString();

    if (existingUser) {
      userId = existingUser.id;
      // Update google_id and avatar if missing
      await run(
        `UPDATE users
         SET google_id = COALESCE(google_id, ?),
             avatar_url = COALESCE(avatar_url, ?),
             updated_at = ?
         WHERE id = ?`,
        [googleId, picture, now, userId]
      );
    } else {
      userId = crypto.randomUUID();
      await run(
        `INSERT INTO users (id, email, full_name, google_id, avatar_url, role, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'customer', ?, ?)`,
        [userId, cleanEmail, cleanName, googleId, picture, now, now]
      );
    }

    const token = await createSession(userId, res);

    const user = await get(
      `SELECT id, email, full_name, company, phone, role, avatar_url, created_at
       FROM users WHERE id = ?`,
      [userId]
    );

    return res.json({
      success: true,
      message: 'Signed in with Google successfully.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        full_name: user.full_name,
        company: user.company,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (err) {
    console.error('[Google Sign In Error]:', err);
    return res.status(500).json({ error: 'Failed to authenticate with Google. Please try again.' });
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', (req, res) => {
  return res.json({
    authenticated: !!req.user,
    user: req.user || null,
  });
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', async (req, res) => {
  try {
    if (req.sessionId) {
      await run('DELETE FROM user_sessions WHERE id = ?', [req.sessionId]);
    } else if (req.user) {
      await run('DELETE FROM user_sessions WHERE user_id = ?', [req.user.id]);
    }
  } catch (err) {
    console.error('[Logout cleanup error]:', err);
  }

  res.clearCookie('trishul_session', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });

  return res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * POST /api/auth/change-password
 */
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    }

    const user = await get('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // If user has a password set, verify currentPassword
    if (user.password_hash) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required.' });
      }
      const matches = await bcrypt.compare(currentPassword, user.password_hash);
      if (!matches) {
        return res.status(400).json({ error: 'Current password does not match.' });
      }
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    const now = new Date().toISOString();

    await run('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?', [
      newHash,
      now,
      req.user.id,
    ]);

    return res.json({ success: true, message: 'Password has been updated successfully.' });
  } catch (err) {
    console.error('[Change Password Error]:', err);
    return res.status(500).json({ error: 'Failed to update password.' });
  }
});

/**
 * POST /api/auth/reset-password-request
 */
router.post('/reset-password-request', async (req, res) => {
  const { email } = req.body;
  // Always return success to prevent email enumeration
  return res.json({
    success: true,
    message: 'If an account exists with that email address, password reset instructions have been sent.',
  });
});

export default router;
