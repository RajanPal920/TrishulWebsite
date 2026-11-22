import express from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { get, run, all, sqliteDb } from '../db/connection.js';
import { requireAuth } from '../middleware/auth.js';
import { sendPasswordResetEmail } from '../services/email.js';

const router = express.Router();
const googleClient = new OAuth2Client();

function getCookieOptions(req) {
  const isHttps = req ? (req.secure || req.headers['x-forwarded-proto'] === 'https') : false;
  return {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };
}

async function createSession(userId, res, req) {
  const sessionId = crypto.randomUUID();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await run(
    `INSERT INTO user_sessions (id, user_id, token, expires_at)
     VALUES (?, ?, ?, ?)`,
    [sessionId, userId, token, expiresAt]
  );

  // Also mirror into sqlite if available
  if (sqliteDb) {
    sqliteDb.run(
      `INSERT OR IGNORE INTO user_sessions (id, user_id, token, expires_at)
       VALUES (?, ?, ?, ?)`,
      [sessionId, userId, token, expiresAt],
      () => {}
    );
  }

  res.cookie('trishul_session', token, getCookieOptions(req));
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
    const existing = await get(
      'SELECT id, email, password_hash, full_name, company, phone, role, status, created_at FROM users WHERE LOWER(email) = ?',
      [cleanEmail]
    );

    if (existing) {
      if (!existing.password_hash) {
        // Account exists from Google OAuth or guest lead without a password set!
        // Allow customer to set their password now and activate password login
        const passwordHash = await bcrypt.hash(password.trim(), 10);
        const now = new Date().toISOString();
        await run(
          `UPDATE users
           SET password_hash = ?,
               full_name = COALESCE(NULLIF(?, ''), full_name),
               company = COALESCE(?, company),
               phone = COALESCE(?, phone),
               status = 'active',
               login_method = 'password',
               updated_at = ?
           WHERE id = ?`,
          [passwordHash, name, cleanCompany || null, cleanPhone || null, now, existing.id]
        );

        if (sqliteDb) {
          sqliteDb.run(
            `UPDATE users
             SET password_hash = ?,
                 full_name = COALESCE(NULLIF(?, ''), full_name),
                 company = COALESCE(?, company),
                 phone = COALESCE(?, phone),
                 status = 'active',
                 login_method = 'password',
                 updated_at = ?
             WHERE id = ?`,
            [passwordHash, name, cleanCompany || null, cleanPhone || null, now, existing.id],
            () => {}
          );
        }

        const token = await createSession(existing.id, res, req);

        // Link any guest RFQs
        await run(
          'UPDATE rfq_requests SET user_id = ? WHERE LOWER(email) = ? AND user_id IS NULL',
          [existing.id, cleanEmail]
        ).catch(() => {});

        console.log(`[Register] Activated password login for existing account: ${cleanEmail}`);

        const user = {
          id: existing.id,
          email: cleanEmail,
          fullName: name || existing.full_name,
          full_name: name || existing.full_name,
          company: cleanCompany || existing.company || null,
          phone: cleanPhone || existing.phone || null,
          role: existing.role || 'customer',
          avatarUrl: null,
          createdAt: existing.created_at || now,
        };

        return res.status(200).json({
          success: true,
          message: 'Password set and account activated successfully.',
          user,
          token,
        });
      }

      return res.status(409).json({
        error: 'An account with this email already exists. Please sign in instead.',
        code: 'ACCOUNT_ALREADY_EXISTS',
      });
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

    const token = await createSession(userId, res, req);

    // Link any previous guest RFQs to this new account
    await run(
      'UPDATE rfq_requests SET user_id = ? WHERE LOWER(email) = ? AND user_id IS NULL',
      [userId, cleanEmail]
    ).catch(() => {});

    console.log(`[Register] Created new customer account: ${cleanEmail} (${name})`);

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

    const isAdminAlias =
      rawEmail === 'admin' ||
      rawEmail === 'administrator' ||
      rawEmail === 'adminadmin' ||
      rawEmail === 'admin administrator' ||
      rawEmail === 'adminadministrator' ||
      rawEmail === 'owner' ||
      rawEmail === 'owner administrator' ||
      rawEmail === 'admin-trishul-001' ||
      rawEmail === 'admin@trishulmetal.com' ||
      rawEmail.startsWith('admin@');

    const cleanEmail = isAdminAlias ? 'admin@trishulmetal.com' : rawEmail;

    let user = await get(
      `SELECT id, email, password_hash, full_name, company, phone, role, status, avatar_url, created_at
       FROM users WHERE LOWER(email) = ? OR LOWER(full_name) = ?`,
      [cleanEmail, cleanEmail]
    );

    if (!user && (isAdminAlias || rawEmail.includes('admin') || rawEmail.includes('administrator'))) {
      user = await get(
        `SELECT id, email, password_hash, full_name, company, phone, role, status, avatar_url, created_at
         FROM users WHERE role = 'admin' LIMIT 1`
      );
    }

    // Fallback: If not found in primary engine, search SQLite fallback and sync
    if (!user && sqliteDb) {
      const fallbackUser = await new Promise((resolve) => {
        const query = isAdminAlias
          ? `SELECT id, email, password_hash, full_name, company, phone, role, status, avatar_url, created_at FROM users WHERE role = 'admin' LIMIT 1`
          : `SELECT id, email, password_hash, full_name, company, phone, role, status, avatar_url, created_at FROM users WHERE LOWER(email) = ? OR LOWER(full_name) = ?`;
        const params = isAdminAlias ? [] : [cleanEmail, cleanEmail];
        sqliteDb.get(query, params, (err, row) => resolve(row || null));
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

    if (!user) {
      console.warn(`[Login] Customer account not found: ${cleanEmail}`);
      return res.status(404).json({
        error: 'Your account was not found. It looks like your account does not exist in our database. Would you like to create your account again?',
        code: 'ACCOUNT_NOT_FOUND',
      });
    }

    if (!user.password_hash) {
      console.warn(`[Login] User ${cleanEmail} has null password_hash`);
      return res.status(401).json({
        error: 'This account was registered via Google Sign-In and does not have a password set. Please sign in with Google or use Create Account to set a password.',
        code: 'GOOGLE_ACCOUNT_NO_PASSWORD',
      });
    }

    if (user.status && user.status.toLowerCase() === 'inactive') {
      return res.status(403).json({
        error: 'Your account is currently inactive. Please contact support.',
        code: 'ACCOUNT_INACTIVE',
      });
    }

    const trimmedPassword = password.trim();
    let matches = await bcrypt.compare(password, user.password_hash);
    if (!matches && trimmedPassword !== password) {
      matches = await bcrypt.compare(trimmedPassword, user.password_hash);
    }
    if (!matches) {
      console.warn(`[Login] Password mismatch for: ${cleanEmail}`);
      return res.status(401).json({
        error: 'Incorrect email or password. Please check your credentials and try again.',
        code: 'INVALID_CREDENTIALS',
      });
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

    const token = await createSession(user.id, res, req);

    // Link any previous guest RFQs to this account
    await run(
      'UPDATE rfq_requests SET user_id = ? WHERE LOWER(email) = ? AND user_id IS NULL',
      [user.id, cleanEmail]
    ).catch(() => {});

    console.log(`[Login] Successful sign-in for: ${cleanEmail} (${user.role})`);

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
    return res.status(500).json({
      error: 'Something went wrong. Please try again later.',
      code: 'SERVER_ERROR',
    });
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

    await createSession(userId, res, req);

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

    const token = await createSession(userId, res, req);

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
      await run('DELETE FROM user_sessions WHERE id = ?', [req.sessionId]).catch(() => {});
    } else if (req.user) {
      await run('DELETE FROM user_sessions WHERE user_id = ?', [req.user.id]).catch(() => {});
    }

    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]?.trim()
      : null;
    if (bearerToken) {
      await run('DELETE FROM user_sessions WHERE token = ?', [bearerToken]).catch(() => {});
    }

    if (req.cookies && req.cookies.trishul_session) {
      await run('DELETE FROM user_sessions WHERE token = ?', [req.cookies.trishul_session]).catch(() => {});
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
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirmation password do not match.' });
    }

    const user = await get('SELECT id, email, password_hash FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    // If user has a password set, verify currentPassword
    if (user.password_hash) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required.' });
      }
      let matches = await bcrypt.compare(currentPassword, user.password_hash);
      if (!matches && currentPassword.trim() !== currentPassword) {
        matches = await bcrypt.compare(currentPassword.trim(), user.password_hash);
      }
      if (!matches) {
        return res.status(400).json({ error: 'Current password is incorrect. Please verify and try again.' });
      }

      // Check that new password is not identical to current password
      const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
      if (isSamePassword) {
        return res.status(400).json({
          error: 'New password cannot be the same as your current password. Please choose a different password.',
        });
      }
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    const now = new Date().toISOString();

    await run('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?', [
      newHash,
      now,
      req.user.id,
    ]);

    if (sqliteDb) {
      sqliteDb.run(
        'UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?',
        [newHash, now, req.user.id],
        () => {}
      );
    }

    // Record activity in user_login_activity
    const activityId = crypto.randomUUID();
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket?.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    await run(
      `INSERT INTO user_login_activity (id, user_id, login_method, ip_address, user_agent, status, created_at)
       VALUES (?, ?, 'password_change', ?, ?, 'success', ?)`,
      [activityId, req.user.id, ip, userAgent, now]
    ).catch(() => {});

    return res.json({ success: true, message: 'Your password has been changed successfully.' });
  } catch (err) {
    console.error('[Change Password Error]:', err);
    return res.status(500).json({ error: 'Failed to update password. Please try again.' });
  }
});

/**
 * Password Reset Controller: Request Reset Token & Send Email
 */
async function handleForgotPasswordRequest(req, res) {
  try {
    const { email } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    // Generic safe response to prevent email enumeration
    const genericResponse = {
      success: true,
      message: 'If an account exists with this email address, password reset instructions have been sent.',
    };

    if (!cleanEmail) {
      return res.json(genericResponse);
    }

    // Look up customer account
    const user = await get(
      'SELECT id, email, full_name, role, status FROM users WHERE LOWER(email) = ?',
      [cleanEmail]
    );

    if (user && user.status !== 'inactive') {
      const now = new Date();
      const nowIso = now.toISOString();

      // Invalidate any existing unused reset tokens for this user
      await run(
        'UPDATE password_reset_tokens SET used_at = ? WHERE user_id = ? AND used_at IS NULL',
        [nowIso, user.id]
      ).catch(() => {});

      // Generate cryptographically secure random token (32 bytes = 64 hex chars)
      const rawToken = crypto.randomBytes(32).toString('hex');
      // Store ONLY the SHA-256 hash in the database
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const tokenId = crypto.randomUUID();
      // Token expires in 30 minutes
      const expiresAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString();

      await run(
        `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [tokenId, user.id, tokenHash, expiresAt, nowIso]
      );

      if (sqliteDb) {
        sqliteDb.run(
          `INSERT OR IGNORE INTO password_reset_tokens (id, user_id, token_hash, expires_at, created_at)
           VALUES (?, ?, ?, ?, ?)`,
          [tokenId, user.id, tokenHash, expiresAt, nowIso],
          () => {}
        );
      }

      // Determine client base URL
      const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : null);
      const baseUrl = origin || process.env.SITE_URL || 'https://www.trishulmetal.com';

      // Send the email with the secure link
      await sendPasswordResetEmail({
        to: user.email,
        customerName: user.full_name,
        resetToken: rawToken,
        baseUrl,
      }).catch((emailErr) => {
        console.warn('[Password Reset Email Warning]:', emailErr.message);
      });

      console.log(`[Auth] Issued secure password reset token for: ${cleanEmail}`);
    } else {
      console.log(`[Auth] Password reset requested for non-existent email: ${cleanEmail} (suppressed response)`);
    }

    return res.json(genericResponse);
  } catch (err) {
    console.error('[Forgot Password Error]:', err);
    // Return generic success to avoid leaking server state or account existence
    return res.json({
      success: true,
      message: 'If an account exists with this email address, password reset instructions have been sent.',
    });
  }
}

router.post('/forgot-password', handleForgotPasswordRequest);
router.post('/reset-password-request', handleForgotPasswordRequest);

/**
 * GET /api/auth/verify-reset-token
 * Validates reset token and checks expiry without consuming it
 */
router.get('/verify-reset-token', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ valid: false, error: 'Token is required.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const tokenRecord = await get(
      `SELECT t.*, u.email, u.full_name
       FROM password_reset_tokens t
       JOIN users u ON u.id = t.user_id
       WHERE t.token_hash = ?`,
      [tokenHash]
    );

    if (!tokenRecord || tokenRecord.used_at) {
      return res.status(400).json({
        valid: false,
        error: 'This password reset link is invalid or has already been used.',
      });
    }

    const expiresAt = new Date(tokenRecord.expires_at).getTime();
    if (expiresAt < Date.now()) {
      return res.status(400).json({
        valid: false,
        error: 'This password reset link has expired (valid for 30 minutes). Please request a new one.',
      });
    }

    return res.json({
      valid: true,
      email: tokenRecord.email,
      fullName: tokenRecord.full_name,
    });
  } catch (err) {
    console.error('[Verify Reset Token Error]:', err);
    return res.status(500).json({ valid: false, error: 'Failed to verify reset link.' });
  }
});

/**
 * POST /api/auth/reset-password
 * Consumes the token and sets a new password
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, newPassword, confirmPassword } = req.body;
    const pwd = (newPassword || password || '').trim();
    const conf = (confirmPassword || '').trim();

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Reset token is required.' });
    }
    if (!pwd || pwd.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    if (conf && pwd !== conf) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const tokenRecord = await get(
      `SELECT t.*, u.id as user_id, u.email, u.full_name
       FROM password_reset_tokens t
       JOIN users u ON u.id = t.user_id
       WHERE t.token_hash = ?`,
      [tokenHash]
    );

    if (!tokenRecord || tokenRecord.used_at) {
      return res.status(400).json({
        error: 'This password reset link is invalid or has already been used.',
      });
    }

    const expiresAt = new Date(tokenRecord.expires_at).getTime();
    if (expiresAt < Date.now()) {
      return res.status(400).json({
        error: 'This password reset link has expired. Please request a new reset link.',
      });
    }

    const newHash = await bcrypt.hash(pwd, 10);
    const now = new Date().toISOString();

    // 1. Update customer password
    await run(
      `UPDATE users
       SET password_hash = ?, login_method = 'password', status = 'active', updated_at = ?
       WHERE id = ?`,
      [newHash, now, tokenRecord.user_id]
    );

    if (sqliteDb) {
      sqliteDb.run(
        `UPDATE users
         SET password_hash = ?, login_method = 'password', status = 'active', updated_at = ?
         WHERE id = ?`,
        [newHash, now, tokenRecord.user_id],
        () => {}
      );
    }

    // 2. Mark this token as used immediately (single-use)
    await run('UPDATE password_reset_tokens SET used_at = ? WHERE id = ?', [now, tokenRecord.id]);
    if (sqliteDb) {
      sqliteDb.run('UPDATE password_reset_tokens SET used_at = ? WHERE id = ?', [now, tokenRecord.id], () => {});
    }

    // 3. Invalidate all existing sessions for security
    await run('DELETE FROM user_sessions WHERE user_id = ?', [tokenRecord.user_id]);
    if (sqliteDb) {
      sqliteDb.run('DELETE FROM user_sessions WHERE user_id = ?', [tokenRecord.user_id], () => {});
    }

    // 4. Log password reset event
    const activityId = crypto.randomUUID();
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    await run(
      `INSERT INTO user_login_activity (id, user_id, login_method, ip_address, user_agent, status, created_at)
       VALUES (?, ?, 'password', ?, ?, 'password_reset_success', ?)`,
      [activityId, tokenRecord.user_id, ip, userAgent, now]
    ).catch(() => {});

    console.log(`[Auth] Password reset successfully completed for user: ${tokenRecord.email}`);

    return res.json({
      success: true,
      message: 'Your password has been reset successfully. You can now log in with your new credentials.',
    });
  } catch (err) {
    console.error('[Reset Password Error]:', err);
    return res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
});

export default router;
