/**
 * Trishul Metals & Alloys - Unified API Client
 * Connects directly to Node.js / Express / SQLite backend
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  full_name?: string;
  company?: string | null;
  phone?: string | null;
  role: 'customer' | 'admin';
  avatarUrl?: string | null;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface ProductRequestItem {
  id: string;
  product_id?: string | null;
  product_name: string;
  material?: string | null;
  size?: string | null;
  quantity: string;
  specification?: string | null;
  notes?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MaterialRequestItem {
  id: string;
  material_id?: string | null;
  material_name: string;
  form?: string | null;
  quantity: string;
  specification?: string | null;
  notes?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InquiryItem {
  id: string;
  subject: string;
  message: string;
  status: string;
  response?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerStats {
  productRequests: {
    total: number;
    pending: number;
    active: number;
  };
  materialRequests: {
    total: number;
    pending: number;
    active: number;
  };
  inquiries: {
    total: number;
    open: number;
  };
  summary: {
    totalRequests: number;
    pendingReview: number;
    openInquiries: number;
  };
}

export interface ActivityItem {
  id: string;
  type: 'product_request' | 'material_request' | 'inquiry';
  title: string;
  status: string;
  created_at: string;
  detail?: string;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(path, {
    ...options,
    headers,
    credentials: 'include', // send and receive HTTP-only cookies
  });

  const contentType = response.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new ApiError(response.status, errorMsg, data);
  }

  return data as T;
}

export const api = {
  auth: {
    async register(payload: {
      fullName: string;
      email: string;
      password: string;
      confirmPassword?: string;
      company?: string;
      phone?: string;
    }): Promise<{ success: boolean; user: User }> {
      return request<{ success: boolean; user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async login(payload: { email: string; password: string }): Promise<{ success: boolean; user: User }> {
      return request<{ success: boolean; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async google(payload: {
      credential?: string;
      accessToken?: string;
      providerToken?: string;
      userInfo?: { email: string; name?: string; picture?: string; sub?: string };
    }): Promise<{ success: boolean; user: User }> {
      return request<{ success: boolean; user: User }>('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async me(): Promise<{ authenticated: boolean; user: User | null }> {
      try {
        return await request<{ authenticated: boolean; user: User | null }>('/api/auth/me');
      } catch {
        return { authenticated: false, user: null };
      }
    },

    async logout(): Promise<{ success: boolean }> {
      return request<{ success: boolean }>('/api/auth/logout', {
        method: 'POST',
      });
    },

    async changePassword(payload: {
      currentPassword?: string;
      newPassword: string;
    }): Promise<{ success: boolean; message: string }> {
      return request<{ success: boolean; message: string }>('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async resetPasswordRequest(email: string): Promise<{ success: boolean; message: string }> {
      return request<{ success: boolean; message: string }>('/api/auth/reset-password-request', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
  },

  customer: {
    async getProfile(): Promise<User> {
      return request<User>('/api/customer/profile');
    },

    async updateProfile(payload: {
      fullName?: string;
      company?: string;
      phone?: string;
    }): Promise<{ success: boolean; user: User }> {
      return request<{ success: boolean; user: User }>('/api/customer/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },

    async getStats(): Promise<CustomerStats> {
      return request<CustomerStats>('/api/customer/stats');
    },

    async getProductRequests(): Promise<{ requests: ProductRequestItem[] }> {
      return request<{ requests: ProductRequestItem[] }>('/api/customer/product-requests');
    },

    async createProductRequest(payload: {
      productId?: string;
      productName: string;
      material?: string;
      size?: string;
      quantity: string;
      specification?: string;
      notes?: string;
    }): Promise<{ success: boolean; request: ProductRequestItem }> {
      return request<{ success: boolean; request: ProductRequestItem }>(
        '/api/customer/product-requests',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );
    },

    async repeatProductRequest(
      id: string,
      payload?: { quantity?: string; notes?: string }
    ): Promise<{ success: boolean; request: ProductRequestItem }> {
      return request<{ success: boolean; request: ProductRequestItem }>(
        `/api/customer/product-requests/${id}/repeat`,
        {
          method: 'POST',
          body: JSON.stringify(payload || {}),
        }
      );
    },

    async getMaterialRequests(): Promise<{ requests: MaterialRequestItem[] }> {
      return request<{ requests: MaterialRequestItem[] }>('/api/customer/material-requests');
    },

    async createMaterialRequest(payload: {
      materialId?: string;
      materialName: string;
      form?: string;
      quantity: string;
      specification?: string;
      notes?: string;
    }): Promise<{ success: boolean; request: MaterialRequestItem }> {
      return request<{ success: boolean; request: MaterialRequestItem }>(
        '/api/customer/material-requests',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );
    },

    async repeatMaterialRequest(
      id: string,
      payload?: { quantity?: string; notes?: string }
    ): Promise<{ success: boolean; request: MaterialRequestItem }> {
      return request<{ success: boolean; request: MaterialRequestItem }>(
        `/api/customer/material-requests/${id}/repeat`,
        {
          method: 'POST',
          body: JSON.stringify(payload || {}),
        }
      );
    },

    async getInquiries(): Promise<{ inquiries: InquiryItem[] }> {
      return request<{ inquiries: InquiryItem[] }>('/api/customer/inquiries');
    },

    async createInquiry(payload: {
      subject: string;
      message: string;
    }): Promise<{ success: boolean; inquiry: InquiryItem }> {
      return request<{ success: boolean; inquiry: InquiryItem }>('/api/customer/inquiries', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async getRecentActivity(): Promise<{ activity: ActivityItem[] }> {
      return request<{ activity: ActivityItem[] }>('/api/customer/recent-activity');
    },
  },

  stock: {
    async getList(query?: { category?: string; grade?: string; search?: string }) {
      const params = new URLSearchParams();
      if (query?.category && query.category !== 'all') params.set('category', query.category);
      if (query?.grade && query.grade !== 'all') params.set('grade', query.grade);
      if (query?.search) params.set('search', query.search);
      const url = `/api/stock${params.toString() ? `?${params.toString()}` : ''}`;
      return request<{ stock: any[] }>(url);
    },
  },

  rfq: {
    async submit(data: any): Promise<{ success: boolean; rfqNumber: string; rfqId: string }> {
      return request<{ success: boolean; rfqNumber: string; rfqId: string }>('/api/rfq', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },
};

