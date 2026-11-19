import { get, run } from '../db/connection.js';

export async function authenticateToken(req, res, next) {
  try {
    let token = null;

    if (req.cookies && req.cookies.trishul_session) {
      token = req.cookies.trishul_session;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      req.user = null;
      return next();
    }

    // Look up session in user_sessions table
    const session = await get(
      `SELECT s.id as session_id, s.token, s.expires_at,
              u.id, u.email, u.full_name, u.company, u.phone, u.role, u.avatar_url, u.last_login_at, u.created_at
       FROM user_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ?`,
      [token]
    );

    if (!session) {
      req.user = null;
      return next();
    }

    // Check expiration
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      // Session has expired, remove it
      await run('DELETE FROM user_sessions WHERE id = ?', [session.session_id]);
      req.user = null;
      return next();
    }

    // Attach user (omit password_hash)
    req.user = {
      id: session.id,
      email: session.email,
      fullName: session.full_name,
      full_name: session.full_name,
      company: session.company,
      phone: session.phone,
      role: session.role,
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
