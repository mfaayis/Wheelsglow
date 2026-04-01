const BASE = '/api'; // proxied by Vite to localhost:3001
export const ADMIN_KEY = 'wg-admin-2026';

async function request<T>(path: string, options?: RequestInit, adminKey?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (adminKey) headers['x-admin-key'] = adminKey;
  const res = await fetch(`${BASE}${path}`, { ...options, headers: { ...headers, ...options?.headers } });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'API error');
  return json;
}

// ── Products
export const api = {
  getProducts: () => request<{ data: any[] }>('/products'),
  getProduct: (id: number) => request<{ data: any }>(`/products/${id}`),

  // ── Public order tracking
  trackOrder: (orderId: string) => request<{ data: any }>(`/orders/${orderId}`),

  // ── Checkout — place new order
  placeOrder: (payload: {
    customerName: string; customerEmail: string; customerPhone: string;
    address: string; city: string; state: string; pincode: string;
    productId: number; productName: string; size: string; amount: number; notes?: string;
  }) => request<{ data: { orderId: string; status: string }; message: string }>('/orders', {
    method: 'POST', body: JSON.stringify(payload)
  }),

  // ── Admin
  admin: {
    getOrders: (params: { status?: string; search?: string } = {}, key: string = ADMIN_KEY) => {
      const qs = new URLSearchParams(params as any).toString();
      return request<{ data: any[]; total: number; stats: any }>(`/admin/orders?${qs}`, {}, key);
    },
    updateOrder: (id: string, body: { status?: string; trackingId?: string }, key: string = ADMIN_KEY) =>
      request<{ data: any }>(`/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify(body) }, key),
    deleteOrder: (id: string, key: string = ADMIN_KEY) =>
      request<{ message: string }>(`/admin/orders/${id}`, { method: 'DELETE' }, key),
    getContacts: (key: string = ADMIN_KEY) =>
      request<{ data: any[] }>('/admin/contacts', {}, key),
  },

  // ── Contact
  sendContact: (payload: { name: string; email: string; phone?: string; message: string }) =>
    request<{ message: string }>('/contact', { method: 'POST', body: JSON.stringify(payload) }),
};
