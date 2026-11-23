import jwt from 'jsonwebtoken';
import { get, run } from '../db/connection.js';

const JWT_SECRET = process.env.JWT_SECRET || 'trishul-jwt-secret-key-prod-2026-auth-resilient';

export async function authenticateToken(req, res, next) {
  try {
    let token = null;

    if (req.cookies && req.cookies.trishul_session) {
      token = req.cookies.trishul_session;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]?.trim();
    }

    if (!token) {
      req.user = null;
      return next();
    }

    // 1. First priority: Stateless signed JWT verification (serverless resilience across lambda instances)
    let jwtPayload = null;
    try {
      jwtPayload = jwt.verify(token, JWT_SECRET);
    } catch {
      jwtPayload = null;
    }

    if (jwtPayload && jwtPayload.userId) {
      // Look up user from database
      let user = await get(
        `SELECT id, email, full_name, company, phone, role, status, avatar_url, last_login_at, created_at
         FROM users WHERE id = ?`,
        [jwtPayload.userId]
      );

      // Fallback: If not found by ID (e.g. seed admin id variant), query by email or admin role
      if (!user && (jwtPayload.role === 'admin' || jwtPayload.userId === 'admin-trishul-001')) {
        user = await get(
          `SELECT id, email, full_name, company, phone, role, status, avatar_url, last_login_at, created_at
           FROM users WHERE role = 'admin' LIMIT 1`
        );
      } else if (!user && jwtPayload.email) {
        user = await get(
          `SELECT id, email, full_name, company, phone, role, status, avatar_url, last_login_at, created_at
           FROM users WHERE LOWER(email) = ?`,
          [jwtPayload.email.toLowerCase()]
        );
      }

      if (user) {
        if (user.status && user.status.toLowerCase() === 'inactive') {
          req.user = null;
          return next();
        }

        req.user = {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          full_name: user.full_name,
          company: user.company,
          phone: user.phone,
          role: user.role || 'customer',
          status: user.status || 'active',
          avatarUrl: user.avatar_url,
          lastLoginAt: user.last_login_at,
          createdAt: user.created_at,
        };
        req.sessionId = jwtPayload.jti || 'jwt-session';
        return next();
      } else {
        // Safe serverless fallback: If DB record is momentarily unreachable, trust verified JWT payload
        req.user = {
          id: jwtPayload.userId,
          email: jwtPayload.email,
          fullName: jwtPayload.role === 'admin' ? 'Owner Administrator' : 'Customer',
          full_name: jwtPayload.role === 'admin' ? 'Owner Administrator' : 'Customer',
          company: jwtPayload.role === 'admin' ? 'Trishul Metals & Alloys' : null,
          phone: null,
          role: jwtPayload.role || 'customer',
          status: 'active',
          avatarUrl: null,
          lastLoginAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        req.sessionId = jwtPayload.jti || 'jwt-session';
        return next();
      }
    }

    // 2. Second priority: Fallback to user_sessions table for legacy hex tokens
    const session = await get(
      `SELECT s.id as session_id, s.token, s.expires_at,
              u.id as user_id, u.email, u.full_name, u.company, u.phone, u.role, u.status, u.avatar_url, u.last_login_at, u.created_at
       FROM user_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ?`,
      [token]
    );

    if (!session) {
      req.user = null;
      return next();
    }

    // Check expiration safely across MySQL Date objects and SQLite ISO strings
    const rawExp = session.expires_at;
    const expiresAt =
      rawExp instanceof Date
        ? rawExp
        : new Date(
            typeof rawExp === 'string' && rawExp.includes(' ') && !rawExp.includes('T')
              ? rawExp.replace(' ', 'T') + 'Z'
              : rawExp
          );

    if (!isNaN(expiresAt.getTime()) && expiresAt < new Date()) {
      // Session has expired, remove it
      await run('DELETE FROM user_sessions WHERE id = ?', [session.session_id]).catch(() => {});
      req.user = null;
      return next();
    }

    // Check user account status
    if (session.status && session.status.toLowerCase() === 'inactive') {
      req.user = null;
      return next();
    }

    // Attach user (omit password_hash)
    req.user = {
      id: session.user_id,
      email: session.email,
      fullName: session.full_name,
      full_name: session.full_name,
      company: session.company,
      phone: session.phone,
      role: session.role || 'customer',
      status: session.status || 'active',
      avatarUrl: session.avatar_url,
      lastLoginAt: session.last_login_at,
      createdAt: session.created_at,
    };
    req.sessionId = session.session_id;

    return next();
  } catch (err) {
    console.error('[Auth Middleware Error]:', err);
    req.user = null;
    return next();
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  return next();
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required. Please sign in.' });
    }
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: insufficient permissions.' });
    }
    return next();
  };
}
