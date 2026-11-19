/**
 * Trishul Metals - Customer Auth Server Functions (Deprecated)
 * Note: Customer authentication is now handled directly by high-performance Express REST endpoints
 * (/api/auth/register, /api/auth/login, /api/auth/google) with persistent SQLite pooling.
 */

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
