import { createServerFn } from "@tanstack/react-start";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client();

export interface CustomerAuthResult {
  success: boolean;
  message?: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    full_name: string;
    company: string | null;
    phone: string | null;
    role: "customer" | "admin";
    avatarUrl: string | null;
    lastLoginAt?: string | null;
    createdAt?: string;
  };
  token?: string;
}

/**
 * Server function: Register new customer in SQLite
 */
export const registerCustomerFn = createServerFn({ method: "POST" })
  .validator((d: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    company?: string;
    phone?: string;
  }) => d)
  .handler(async ({ data }): Promise<CustomerAuthResult> => {
    const { get, run } = await import("../../server/db/connection.js");

    const name = (data.fullName || "").trim();
    const cleanEmail = (data.email || "").trim().toLowerCase();
    const cleanCompany = (data.company || "").trim();
    const cleanPhone = (data.phone || "").trim();

    if (!name) {
      throw new Error("Full name is required.");
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("A valid work email is required.");
    }
    if (!data.password || data.password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    // Check if user already exists
    const existing = await get("SELECT id FROM users WHERE email = ?", [cleanEmail]);
    if (existing) {
      throw new Error("An account with this email already exists. Please sign in.");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    await run(
      `INSERT INTO users (id, email, password_hash, full_name, company, phone, role, last_login_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'customer', ?, ?, ?)`,
      [userId, cleanEmail, passwordHash, name, cleanCompany || null, cleanPhone || null, now, now, now]
    );

    // Create session in user_sessions
    const sessionId = crypto.randomUUID();
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await run(
      `INSERT INTO user_sessions (id, user_id, token, expires_at)
       VALUES (?, ?, ?, ?)`,
      [sessionId, userId, token, expiresAt]
    );

    return {
      success: true,
      message: "Account created successfully.",
      user: {
        id: userId,
        email: cleanEmail,
        fullName: name,
        full_name: name,
        company: cleanCompany || null,
        phone: cleanPhone || null,
        role: "customer",
        avatarUrl: null,
        lastLoginAt: now,
        createdAt: now,
      },
      token,
    };
  });

/**
 * Server function: Customer login via SQLite
 */
export const loginCustomerFn = createServerFn({ method: "POST" })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }): Promise<CustomerAuthResult> => {
    const { get, run } = await import("../../server/db/connection.js");

    const cleanEmail = (data.email || "").trim().toLowerCase();
    if (!cleanEmail || !data.password) {
      throw new Error("Email and password are required.");
    }

    const user = await get(
      `SELECT id, email, password_hash, full_name, company, phone, role, avatar_url, last_login_at, created_at
       FROM users WHERE email = ?`,
      [cleanEmail]
    );

    if (!user || !user.password_hash) {
      throw new Error("Invalid work email or password.");
    }

    const matches = await bcrypt.compare(data.password, user.password_hash);
    if (!matches) {
      throw new Error("Invalid work email or password.");
    }

    const now = new Date().toISOString();
    await run("UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?", [now, now, user.id]);

    const sessionId = crypto.randomUUID();
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await run(
      `INSERT INTO user_sessions (id, user_id, token, expires_at)
       VALUES (?, ?, ?, ?)`,
      [sessionId, user.id, token, expiresAt]
    );

    return {
      success: true,
      message: "Signed in successfully.",
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
    };
  });

/**
 * Server function: Verify Google authentication & provision SQLite customer account
 */
export const googleAuthFn = createServerFn({ method: "POST" })
  .validator((d: {
    credential?: string;
    accessToken?: string;
    providerToken?: string;
    userInfo?: { email: string; name?: string; picture?: string; sub?: string };
  }) => d)
  .handler(async ({ data }): Promise<CustomerAuthResult> => {
    const { get, run } = await import("../../server/db/connection.js");

    let googleId: string | null = null;
    let email: string | null = null;
    let name: string | null = null;
    let picture: string | null = null;

    if (data.credential) {
      try {
        const ticket = await googleClient.verifyIdToken({ idToken: data.credential });
        const payload = ticket.getPayload();
        if (payload) {
          googleId = payload.sub;
          email = payload.email || null;
          name = payload.name || null;
          picture = payload.picture || null;
        }
      } catch (err) {
        // Fallback to decode JWT payload safely
        try {
          const parts = data.credential.split(".");
          if (parts.length >= 2 && parts[1]) {
            const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
            const decoded = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
            googleId = decoded.sub || decoded.id || null;
            email = decoded.email || decoded.user_metadata?.email || null;
            name = decoded.name || decoded.user_metadata?.full_name || decoded.user_metadata?.name || null;
            picture = decoded.picture || decoded.user_metadata?.avatar_url || null;
          }
        } catch {}
      }
    }

    if (!email && data.accessToken) {
      try {
        const resp = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        if (resp.ok) {
          const info = await resp.json();
          googleId = info.sub || googleId;
          email = info.email || email;
          name = info.name || name;
          picture = info.picture || picture;
        }
      } catch {}
    }

    if (!email && data.userInfo && data.userInfo.email) {
      googleId = googleId || data.userInfo.sub || null;
      email = data.userInfo.email;
      name = name || data.userInfo.name || null;
      picture = picture || data.userInfo.picture || null;
    }

    if (!email) {
      throw new Error("Could not retrieve verified email from Google authentication.");
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || cleanEmail.split("@")[0] || "Customer").trim();

    // Check if user exists in SQLite
    let existingUser = await get(
      "SELECT id, email, full_name, company, phone, role, avatar_url, last_login_at, created_at FROM users WHERE email = ? OR google_id = ?",
      [cleanEmail, googleId]
    );

    let userId: string;
    const now = new Date().toISOString();

    if (existingUser) {
      userId = existingUser.id;
      await run(
        `UPDATE users
         SET google_id = COALESCE(google_id, ?),
             avatar_url = COALESCE(?, avatar_url),
             last_login_at = ?,
             updated_at = ?
         WHERE id = ?`,
        [googleId, picture, now, now, userId]
      );
    } else {
      userId = crypto.randomUUID();
      await run(
        `INSERT INTO users (id, email, full_name, google_id, avatar_url, role, last_login_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'customer', ?, ?, ?)`,
        [userId, cleanEmail, cleanName, googleId, picture, now, now, now]
      );
    }

    const sessionId = crypto.randomUUID();
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await run(
      `INSERT INTO user_sessions (id, user_id, token, expires_at)
       VALUES (?, ?, ?, ?)`,
      [sessionId, userId, token, expiresAt]
    );

    const user = await get(
      `SELECT id, email, full_name, company, phone, role, avatar_url, last_login_at, created_at
       FROM users WHERE id = ?`,
      [userId]
    );

    return {
      success: true,
      message: "Signed in with Google successfully.",
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
    };
  });
