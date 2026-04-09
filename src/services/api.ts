const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('wms_token');
}

export function setToken(token: string) {
  localStorage.setItem('wms_token', token);
}

export function clearToken() {
  localStorage.removeItem('wms_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro de servidor' }));
    throw new Error(err.error || `Erro ${res.status}`);
  }

  return res.json();
}

// Auth
export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: number; name: string; email: string; role: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),

  register: (name: string, email: string, password: string, role?: string) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  // Boxes
  getBoxes: () => request<any[]>('/boxes'),
  createBox: (code: string, description: string, cartId?: number) =>
    request('/boxes', {
      method: 'POST',
      body: JSON.stringify({ code, description, cartId }),
    }),
  assignBox: (id: number, cartId: number) =>
    request(`/boxes/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ cartId }),
    }),

  // Carts
  getCarts: () => request<any[]>('/carts'),
  createCart: (code: string, corridorId?: number) =>
    request('/carts', {
      method: 'POST',
      body: JSON.stringify({ code, corridorId }),
    }),
  assignCart: (id: number, corridorId: number) =>
    request(`/carts/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ corridorId }),
    }),

  // Corridors
  getCorridors: () => request<any[]>('/corridors'),
  createCorridor: (name: string, zone: string) =>
    request('/corridors', {
      method: 'POST',
      body: JSON.stringify({ name, zone }),
    }),
};
