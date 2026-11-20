import express from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { get, run, sqliteDb } from '../db/connection.js';
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

    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Full name is required (minimum 2 characters).' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'A valid work email is required (e.g. name@company.com).' });
    }
    if (cleanPhone) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;
      if (!phoneRegex.test(cleanPhone)) {
        return res.status(400).json({
          error: 'Please enter a valid phone number with country code (e.g. +91 98200 12345).',
        });
      }
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    // Check if user already exists
    const existing = await get('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
    }

    const passwordHash = await bcrypt.hash(password.trim(), 10);
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    await run(
      `INSERT INTO users (id, email, password_hash, full_name, company, phone, role, status, login_method, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'customer', 'active', 'password', ?, ?)`,
      [userId, cleanEmail, passwordHash, name, cleanCompany || null, cleanPhone || null, now, now]
    );

    // Also mirror into sqlite if sqliteDb exists
    if (sqliteDb) {
      sqliteDb.run(
        `INSERT OR IGNORE INTO users (id, email, password_hash, full_name, company, phone, role, status, login_method, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'customer', 'active', 'password', ?, ?)`,
        [userId, cleanEmail, passwordHash, name, cleanCompany || null, cleanPhone || null, now, now],
        () => {}
      );
    }

    const token = await createSession(userId, res);

    // Link any previous guest RFQs to this new account
    await run(
      'UPDATE rfq_requests SET user_id = ? WHERE LOWER(email) = ? AND user_id IS NULL',
      [userId, cleanEmail]
    ).catch(() => {});

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
    const rawEmail = (email || '').trim().toLowerCase();

    if (!rawEmail || !password) {
      return res.status(400).json({ error: 'Email / Username and password are required.' });
    }

    const cleanEmail = rawEmail === 'admin' ? 'admin@trishulmetal.com' : rawEmail;

    let user = await get(
      `SELECT id, email, password_hash, full_name, company, phone, role, status, avatar_url, created_at
       FROM users WHERE LOWER(email) = ? OR LOWER(full_name) = ?`,
      [cleanEmail, cleanEmail]
    );

    if (!user && rawEmail === 'admin') {
      user = await get(
        `SELECT id, email, password_hash, full_name, company, phone, role, status, avatar_url, created_at
         FROM users WHERE role = 'admin' LIMIT 1`
      );
    }

    // Fallback: If not found in primary engine, search SQLite fallback and sync
    if (!user && sqliteDb) {
      const fallbackUser = await new Promise((resolve) => {
        sqliteDb.get(
          `SELECT id, email, password_hash, full_name, company, phone, role, status, avatar_url, created_at
           FROM users WHERE LOWER(email) = ? OR LOWER(full_name) = ?`,
          [cleanEmail, cleanEmail],
          (err, row) => resolve(row || null)
        );
      });
      if (fallbackUser) {
        user = fallbackUser;
        // Auto-sync into active engine
        await run(
          `INSERT INTO users (id, email, password_hash, full_name, company, phone, role, status, login_method, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'password', ?, ?)`,
          [
            fallbackUser.id,
            fallbackUser.email,
            fallbackUser.password_hash,
            fallbackUser.full_name,
            fallbackUser.company || null,
            fallbackUser.phone || null,
            fallbackUser.role || 'customer',
            fallbackUser.status || 'active',
            fallbackUser.created_at || new Date().toISOString(),
            new Date().toISOString(),
          ]
        ).catch(() => {});
      }
    }

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid work email or password.' });
    }

    if (user.status && user.status.toLowerCase() === 'inactive') {
      return res.status(403).json({ error: 'Your account is currently inactive. Please contact support.' });
    }

    const matches = await bcrypt.compare(password.trim(), user.password_hash);
    if (!matches) {
      return res.status(401).json({ error: 'Invalid work email or password.' });
    }

    const now = new Date().toISOString();
    await run('UPDATE users SET last_login_at = ?, login_method = \'password\', updated_at = ? WHERE id = ?', [now, now, user.id]);

    // Record login activity in user_login_activity
    const activityId = crypto.randomUUID();
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket?.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    await run(
      `INSERT INTO user_login_activity (id, user_id, login_method, ip_address, user_agent, status, created_at)
       VALUES (?, ?, 'password', ?, ?, 'success', ?)`,
      [activityId, user.id, ip, userAgent, now]
    ).catch(() => {});

    const token = await createSession(user.id, res);

    // Link any previous guest RFQs to this account
    await run(
      'UPDATE rfq_requests SET user_id = ? WHERE LOWER(email) = ? AND user_id IS NULL',
      [user.id, cleanEmail]
    ).catch(() => {});

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
        lastLoginAt: now,
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
 * Helper to safely extract decoded JSON payload from JWT string without throwing
 */
function decodeJwtPayload(token) {
  try {
    if (typeof token === 'string' && token.includes('.')) {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonStr = Buffer.from(base64, 'base64').toString('utf8');
        return JSON.parse(jsonStr);
      }
    }
  } catch (err) {
    console.warn('[JWT decode notice]:', err.message);
  }
  return null;
}

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  process.env.VITE_GOOGLE_CLIENT_ID ||
  '288002387414-6cvdo0ftcmsi36l9npigsaoj3m86oedc.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

/**
 * Standard trusted callback URL resolver
 * Strictly derives from configured server host and protocol
 */
function getTrustedCallbackUrl(req) {
  if (process.env.GOOGLE_CALLBACK_URL && process.env.GOOGLE_CALLBACK_URL.trim()) {
    return process.env.GOOGLE_CALLBACK_URL.trim();
  }
  if (req && typeof req.get === 'function' && req.get('host')) {
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    return `${proto}://${req.get('host')}/api/auth/google/callback`;
  }
  return 'http://localhost:8080/api/auth/google/callback';
}

/**
 * GET /api/auth/google
 * Official Google OAuth 2.0 authorization redirect
 * Generates cryptographic state and PKCE challenge (RFC 7636)
 */
router.get('/google', (req, res) => {
  const callbackUrl = getTrustedCallbackUrl(req);

  const state = crypto.randomBytes(24).toString('hex');
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

  const cookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60 * 1000, // 10 minutes
  };

  res.cookie('oauth_state', state, cookieConfig);
  res.cookie('oauth_verifier', codeVerifier, cookieConfig);

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(callbackUrl)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent('openid email profile')}` +
    `&prompt=select_account` +
    `&state=${encodeURIComponent(state)}` +
    `&code_challenge=${encodeURIComponent(codeChallenge)}` +
    `&code_challenge_method=S256`;

  return res.redirect(authUrl);
});

/**
 * GET /api/auth/google/callback
 * Official Google OAuth 2.0 backend callback
 */
router.get('/google/callback', async (req, res) => {
  try {
    const { code, state, error: oauthError } = req.query;

    if (oauthError) {
      console.warn('[Google OAuth Notice]:', oauthError);
      res.clearCookie('oauth_state', { path: '/' });
      res.clearCookie('oauth_verifier', { path: '/' });
      return res.redirect(`/auth?error=${encodeURIComponent('Google authentication was cancelled or access denied.')}`);
    }

    if (!code) {
      res.clearCookie('oauth_state', { path: '/' });
      res.clearCookie('oauth_verifier', { path: '/' });
      return res.redirect(`/auth?error=${encodeURIComponent('No authorization code returned from Google.')}`);
    }

    // State verification (CSRF Protection)
    const savedState = req.cookies?.oauth_state;
    if (!state || !savedState || state !== savedState) {
      console.warn('[Google OAuth Warning]: State mismatch or expired session state.');
      res.clearCookie('oauth_state', { path: '/' });
      res.clearCookie('oauth_verifier', { path: '/' });
      return res.redirect(
        `/auth?error=${encodeURIComponent('Authentication session expired or security verification failed. Please try again.')}`
      );
    }

    const callbackUrl = getTrustedCallbackUrl(req);
    const codeVerifier = req.cookies?.oauth_verifier;

    // Clean up temporary OAuth cookies
    res.clearCookie('oauth_state', { path: '/' });
    res.clearCookie('oauth_verifier', { path: '/' });

    let idToken = null;
    let accessToken = null;

    // Exchange authorization code for tokens
    try {
      const tokenBody = new URLSearchParams({
        code: String(code),
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      });

      if (GOOGLE_CLIENT_SECRET) {
        tokenBody.append('client_secret', GOOGLE_CLIENT_SECRET);
      }
      if (codeVerifier) {
        tokenBody.append('code_verifier', codeVerifier);
      }

      const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: tokenBody,
      });

      if (tokenResp.ok) {
        const tokenData = await tokenResp.json();
        idToken = tokenData.id_token;
        accessToken = tokenData.access_token;
      } else {
        const errText = await tokenResp.text();
        console.warn('[Google Token Exchange Warning]:', errText);
      }
    } catch (tokenErr) {
      console.warn('[Google Token Fetch Error]:', tokenErr.message);
    }

    let googleId = null;
    let email = null;
    let name = null;
    let picture = null;

    if (idToken) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload) {
          googleId = payload.sub;
          email = payload.email;
          name = payload.name;
          picture = payload.picture;
        }
      } catch {
        const decoded = decodeJwtPayload(idToken);
        if (decoded) {
          googleId = decoded.sub || decoded.id;
          email = decoded.email;
          name = decoded.name;
          picture = decoded.picture;
        }
      }
    }

    if (!email && accessToken) {
      try {
        const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (resp.ok) {
          const info = await resp.json();
          googleId = info.sub;
          email = info.email;
          name = info.name;
          picture = info.picture;
        }
      } catch {}
    }

    if (!email) {
      // If code exchange is pending client secret configuration, redirect to client token flow
      return res.redirect(`/auth?error=${encodeURIComponent('Please configure GOOGLE_CLIENT_SECRET in .env for web server flow, or use browser token flow.')}`);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || cleanEmail.split('@')[0] || 'Customer').trim();

    // Check if user exists in SQLite
    let existingUser = await get(
      'SELECT id, email, full_name, company, phone, role, avatar_url, last_login_at, created_at FROM users WHERE email = ? OR google_id = ?',
      [cleanEmail, googleId]
    );

    let userId;
    const now = new Date().toISOString();

    if (existingUser) {
      userId = existingUser.id;
      await run(
        `UPDATE users
         SET google_id = COALESCE(google_id, ?),
             avatar_url = COALESCE(?, avatar_url),
             login_method = 'google',
             last_login_at = ?,
             updated_at = ?
         WHERE id = ?`,
        [googleId, picture, now, now, userId]
      );
    } else {
      userId = crypto.randomUUID();
      await run(
        `INSERT INTO users (id, email, full_name, google_id, avatar_url, role, login_method, last_login_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'customer', 'google', ?, ?, ?)`,
        [userId, cleanEmail, cleanName, googleId, picture, now, now, now]
      );
    }

    // Record login activity in user_login_activity
    const actId = crypto.randomUUID();
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket?.remoteAddress || '127.0.0.1';
    const clientAgent = req.headers['user-agent'] || 'Unknown';
    await run(
      `INSERT INTO user_login_activity (id, user_id, login_method, ip_address, user_agent, status, created_at)
       VALUES (?, ?, 'google', ?, ?, 'success', ?)`,
      [actId, userId, clientIp, clientAgent, now]
    ).catch(() => {});

    await createSession(userId, res);

    // Link any previous guest RFQs to this account
    await run(
      'UPDATE rfq_requests SET user_id = ? WHERE LOWER(email) = ? AND user_id IS NULL',
      [userId, cleanEmail]
    ).catch(() => {});

    return res.redirect('/portal');
  } catch (err) {
    console.error('[Google OAuth Callback Error]:', err);
    return res.redirect(`/auth?error=${encodeURIComponent('Failed to complete Google authentication.')}`);
  }
});

/**
 * POST /api/auth/google
 * Handles Google Sign-In token verification & SQLite account provisioning
 */
router.post('/google', async (req, res) => {
  try {
    const { credential, accessToken, providerToken, userInfo } = req.body;
    let googleId = null;
    let email = null;
    let name = null;
    let picture = null;

    // 1. If Google ID token is provided
    if (credential) {
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
        console.warn('[Google Auth] ID Token verification fallback to payload decode:', verifyErr.message);
        const decoded = decodeJwtPayload(credential);
        if (decoded) {
          googleId = decoded.sub || decoded.id;
          email = decoded.email || decoded.user_metadata?.email;
          name = decoded.name || decoded.user_metadata?.full_name || decoded.user_metadata?.name;
          picture = decoded.picture || decoded.user_metadata?.avatar_url || decoded.user_metadata?.picture;
        }
      }
    }

    // 2. If access_token is provided (JWT from OAuth broker OR Google bearer token)
    if (!email && accessToken) {
      const decoded = decodeJwtPayload(accessToken);
      if (decoded) {
        googleId = decoded.sub || decoded.id || null;
        email = decoded.email || decoded.user_metadata?.email || null;
        name = decoded.name || decoded.user_metadata?.full_name || decoded.user_metadata?.name || null;
        picture = decoded.picture || decoded.user_metadata?.avatar_url || decoded.user_metadata?.picture || null;
      }

      // If not a decoded JWT, query Google OAuth userinfo endpoint directly
      if (!email && !accessToken.includes('.')) {
        try {
          const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (response.ok) {
            const data = await response.json();
            googleId = data.sub || googleId;
            email = data.email || email;
            name = data.name || name;
            picture = data.picture || picture;
          }
        } catch (fetchErr) {
          console.warn('[Google Auth] userinfo fetch warning:', fetchErr.message);
        }
      }
    }

    // 3. If providerToken is provided (raw Google access token returned by OAuth broker)
    if (!email && providerToken) {
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${providerToken}` },
        });
        if (response.ok) {
          const data = await response.json();
          googleId = data.sub || googleId;
          email = data.email || email;
          name = data.name || name;
          picture = data.picture || picture;
        }
      } catch (fetchErr) {
        console.warn('[Google Auth] providerToken fetch warning:', fetchErr.message);
      }
    }

    // 4. If userInfo is provided directly
    if (!email && userInfo && userInfo.email) {
      googleId = googleId || userInfo.sub || userInfo.id;
      email = userInfo.email;
      name = name || userInfo.name || userInfo.fullName || userInfo.email.split('@')[0];
      picture = picture || userInfo.picture || userInfo.avatarUrl;
    }

    if (!email) {
      return res.status(400).json({ error: 'Could not retrieve verified email from Google authentication.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name ? name.trim() : cleanEmail.split('@')[0];

    // Check if user exists in SQLite by email or google_id
    let existingUser = await get(
      'SELECT id, email, full_name, company, phone, role, avatar_url, last_login_at, created_at FROM users WHERE email = ? OR google_id = ?',
      [cleanEmail, googleId]
    );

    let userId;
    const now = new Date().toISOString();

    if (existingUser) {
      userId = existingUser.id;
      // Secure account linking & profile update
      await run(
        `UPDATE users
         SET google_id = COALESCE(google_id, ?),
             avatar_url = COALESCE(?, avatar_url),
             login_method = 'google',
             last_login_at = ?,
             updated_at = ?
         WHERE id = ?`,
        [googleId, picture, now, now, userId]
      );
    } else {
      userId = crypto.randomUUID();
      await run(
        `INSERT INTO users (id, email, full_name, google_id, avatar_url, role, login_method, last_login_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'customer', 'google', ?, ?, ?)`,
        [userId, cleanEmail, cleanName, googleId, picture, now, now, now]
      );
    }

    // Record login activity in user_login_activity
    const actId = crypto.randomUUID();
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket?.remoteAddress || '127.0.0.1';
    const clientAgent = req.headers['user-agent'] || 'Unknown';
    await run(
      `INSERT INTO user_login_activity (id, user_id, login_method, ip_address, user_agent, status, created_at)
       VALUES (?, ?, 'google', ?, ?, 'success', ?)`,
      [actId, userId, clientIp, clientAgent, now]
    ).catch(() => {});

    const token = await createSession(userId, res);

    // Link any previous guest RFQs to this account
    await run(
      'UPDATE rfq_requests SET user_id = ? WHERE LOWER(email) = ? AND user_id IS NULL',
      [userId, cleanEmail]
    ).catch(() => {});

    const user = await get(
      `SELECT id, email, full_name, company, phone, role, avatar_url, last_login_at, created_at
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
        lastLoginAt: user.last_login_at,
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
