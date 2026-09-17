import { Item, User, BorrowRequest } from '../types';

const API_BASE = 'http://localhost:5000/api';

class ApiClient {
  private getToken(): string | null {
    try {
      return localStorage.getItem('borrowbuddy_token');
    } catch {
      return null;
    }
  }

  public setToken(token: string) {
    try {
      localStorage.setItem('borrowbuddy_token', token);
    } catch {
      // ignore
    }
  }

  public clearToken() {
    try {
      localStorage.removeItem('borrowbuddy_token');
    } catch {
      // ignore
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorBody.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // --- Auth Endpoints ---
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    return res;
  }

  async register(name: string, email: string, password: string, course: string): Promise<{ token: string; user: User }> {
    const res = await this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, course }),
    });
    this.setToken(res.token);
    return res;
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // --- Item Endpoints ---
  async getItems(params?: {
    category?: string;
    campus?: string;
    search?: string;
    availableOnly?: boolean;
    sort?: string;
  }): Promise<Item[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.campus && params.campus !== 'all') query.set('campus', params.campus);
    if (params?.search) query.set('search', params.search);
    if (params?.availableOnly) query.set('availableOnly', 'true');
    if (params?.sort) query.set('sort', params.sort);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request<Item[]>(`/items${queryString}`);
  }

  async getItemById(id: string): Promise<Item> {
    return this.request<Item>(`/items/${id}`);
  }

  async createItem(itemData: Partial<Item>): Promise<Item> {
    return this.request<Item>('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async deleteItem(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/items/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Borrow Request Endpoints ---
  async getBorrowRequests(): Promise<BorrowRequest[]> {
    return this.request<BorrowRequest[]>('/borrow-requests');
  }

  async createBorrowRequest(data: {
    itemId: string;
    startDate: string;
    endDate: string;
    message?: string;
  }): Promise<BorrowRequest> {
    return this.request<BorrowRequest>('/borrow-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBorrowRequestStatus(id: string, status: string): Promise<BorrowRequest> {
    return this.request<BorrowRequest>(`/borrow-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // --- User Profile Endpoint ---
  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  // --- Razorpay Payment Endpoints ---
  async getPaymentConfig(): Promise<{ keyId: string; currency: string; businessName: string }> {
    return this.request<{ keyId: string; currency: string; businessName: string }>('/payments/config');
  }

  async createPaymentOrder(data: {
    amount: number;
    currency?: string;
    receipt?: string;
    notes?: Record<string, any>;
  }): Promise<{ success: boolean; order: any; keyId: string }> {
    return this.request<{ success: boolean; order: any; keyId: string }>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount?: number;
    purpose?: string;
    itemId?: string;
  }): Promise<{
    success: boolean;
    message: string;
    paymentId: string;
    orderId: string;
    verifiedAt: string;
    amount: number;
    currency: string;
    purpose: string;
  }> {
    return this.request('/payments/verify-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();

