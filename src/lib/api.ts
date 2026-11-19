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
  status?: 'active' | 'inactive';
  login_method?: string;
  avatarUrl?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string;
}

export interface AdminCustomerItem {
  id: string;
  email: string;
  full_name: string;
  company?: string | null;
  phone?: string | null;
  role: 'customer' | 'admin';
  status: 'active' | 'inactive';
  login_method: 'google' | 'password' | string;
  last_login_at?: string | null;
  created_at: string;
  rfq_count: number;
  orders_count: number;
  product_requests_count?: number;
  material_requests_count?: number;
  inquiries_count?: number;
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

export interface CustomerOrder {
  id: string;
  order_number: string;
  title: string;
  description?: string | null;
  total_amount: number;
  currency: string;
  status: 'Processing' | 'Manufactured' | 'Inspection Ready' | 'Dispatched' | 'Delivered' | 'Cancelled';
  tracking_number?: string | null;
  delivery_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RfqInquiryItem {
  id: string;
  reference: string;
  confirmation_token?: string | null;
  company: string;
  contact_name: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  incoterm?: string | null;
  delivery_port?: string | null;
  target_lead_time?: string | null;
  project_name?: string | null;
  message?: string | null;
  certification?: string | null;
  testing?: string[] | null;
  items: Array<{
    material?: string;
    product?: string;
    size?: string;
    rating?: string;
    facing?: string;
    quantity?: string;
    unit?: string;
    cutLength?: string;
    processing?: string[];
  }>;
  attachments?: Array<{ name: string; path: string; size: number }> | null;
  status: string;
  created_at: string;
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

    async getOrders(): Promise<{ orders: CustomerOrder[] }> {
      return request<{ orders: CustomerOrder[] }>('/api/customer/orders');
    },

    async getOrder(id: string): Promise<{ order: CustomerOrder }> {
      return request<{ order: CustomerOrder }>(`/api/customer/orders/${id}`);
    },

    async getRfqs(): Promise<{ rfqs: RfqInquiryItem[] }> {
      return request<{ rfqs: RfqInquiryItem[] }>('/api/customer/rfqs');
    },

    async getRfq(id: string): Promise<{ rfq: RfqInquiryItem }> {
      return request<{ rfq: RfqInquiryItem }>(`/api/customer/rfqs/${id}`);
    },
  },

  admin: {
    async getOverview(): Promise<{ stats: any; recentUsers: any[]; recentRequests: any[] }> {
      return request('/api/admin/overview');
    },

    async getCustomers(query?: {
      search?: string;
      method?: string;
      status?: string;
      sort?: string;
      page?: number;
      limit?: number;
      offset?: number;
    }): Promise<{ customers: AdminCustomerItem[]; total: number; page: number; totalPages: number; limit: number }> {
      const p = new URLSearchParams();
      if (query?.search) p.set('search', query.search);
      if (query?.method && query.method !== 'all') p.set('method', query.method);
      if (query?.status && query.status !== 'all') p.set('status', query.status);
      if (query?.sort) p.set('sort', query.sort);
      if (query?.page) p.set('page', String(query.page));
      if (query?.limit) p.set('limit', String(query.limit));
      if (query?.offset !== undefined) p.set('offset', String(query.offset));
      return request(`/api/admin/customers${p.toString() ? `?${p.toString()}` : ''}`);
    },

    async getCustomer(id: string): Promise<{
      customer: AdminCustomerItem & { avatar_url?: string | null; updated_at?: string };
      rfqs: RfqInquiryItem[];
      productRequests: ProductRequestItem[];
      materialRequests: MaterialRequestItem[];
      inquiries: InquiryItem[];
      orders: CustomerOrder[];
      loginHistory: any[];
      activityStats: {
        totalRfqs: number;
        totalOrders: number;
        totalProductRequests: number;
        totalMaterialRequests: number;
        totalInquiries: number;
        lastInquiryDate: string | null;
        lastPurchaseDate: string | null;
      };
    }> {
      return request(`/api/admin/customers/${id}`);
    },

    async updateCustomer(
      id: string,
      data: {
        full_name?: string;
        email?: string;
        phone?: string | null;
        company?: string | null;
        status?: 'active' | 'inactive';
      }
    ): Promise<{ success: boolean; message: string; customer: AdminCustomerItem }> {
      return request(`/api/admin/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async getLoginActivity(): Promise<{ loginActivity: any[] }> {
      return request('/api/admin/login-activity');
    },

    async getProductRequests(): Promise<{ requests: any[] }> {
      return request('/api/admin/product-requests');
    },

    async updateProductRequest(id: string, data: { status?: string; quotation_amount?: number; notes?: string }): Promise<any> {
      return request(`/api/admin/product-requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async getMaterialRequests(): Promise<{ requests: any[] }> {
      return request('/api/admin/material-requests');
    },

    async updateMaterialRequest(id: string, data: { status?: string; notes?: string }): Promise<any> {
      return request(`/api/admin/material-requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async getInquiries(): Promise<{ inquiries: any[] }> {
      return request('/api/admin/inquiries');
    },

    async respondInquiry(id: string, data: { response: string; status?: string }): Promise<any> {
      return request(`/api/admin/inquiries/${id}/respond`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async getOrders(): Promise<{ orders: any[] }> {
      return request('/api/admin/orders');
    },

    async createOrder(data: any): Promise<any> {
      return request('/api/admin/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async updateOrder(id: string, data: any): Promise<any> {
      return request(`/api/admin/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async getStock(): Promise<{ stock: any[] }> {
      return request('/api/admin/stock');
    },

    async addStock(data: any): Promise<any> {
      return request('/api/admin/stock', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async deleteStock(id: string): Promise<any> {
      return request(`/api/admin/stock/${id}`, {
        method: 'DELETE',
      });
    },

    async getActivityLogs(): Promise<{ logs: any[] }> {
      return request('/api/admin/activity-logs');
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
    async submit(data: any): Promise<{
      success: boolean;
      message: string;
      rfqNumber: string;
      reference: string;
      rfqId: string;
      confirmationToken: string;
    }> {
      return request('/api/rfq', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async getConfirmation(token: string): Promise<any> {
      return request(`/api/rfq/confirmation/${token}`);
    },
  },
};

