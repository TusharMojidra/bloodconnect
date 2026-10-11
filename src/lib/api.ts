export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad',
  'Kolkata', 'Pune', 'Jaipur', 'Kochi', 'Lucknow',
  'Ahmedabad', 'Chandigarh', 'Bhopal', 'Surat', 'Vellore',
] as const;

export const URGENCY_LEVELS = ['critical', 'urgent', 'normal'] as const;
export const REQUEST_STATUSES = ['pending', 'fulfilled', 'cancelled'] as const;

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

function setToken(token: string | null) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

export const api = {
  getToken,
  setToken,

  auth: {
    signup: (body: { fullName: string; email: string; password: string; phone: string; city: string }) =>
      request<{ token: string; user: AuthUser }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    login: (body: { email: string; password: string }) =>
      request<{ token: string; user: AuthUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    me: () =>
      request<AuthUser>('/auth/me'),

    updateProfile: (body: { fullName?: string; phone?: string; city?: string }) =>
      request<AuthUser>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
  },

  donors: {
    list: (params?: { bloodGroup?: string; city?: string; available?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.bloodGroup) query.set('bloodGroup', params.bloodGroup);
      if (params?.city) query.set('city', params.city);
      if (params?.available) query.set('available', 'true');
      const qs = query.toString();
      return request<Donor[]>(`/donors${qs ? `?${qs}` : ''}`);
    },

    getMine: () => request<Donor>('/donors/me'),

    create: (body: Omit<DonorPayload, 'userId'>) =>
      request<Donor>('/donors', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    update: (id: string, body: Partial<DonorPayload>) =>
      request<Donor>(`/donors/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),

    toggleAvailability: (id: string) =>
      request<Donor>(`/donors/${id}/availability`, {
        method: 'PATCH',
      }),

    delete: (id: string) =>
      request<{ message: string }>(`/donors/${id}`, {
        method: 'DELETE',
      }),
  },

  bloodRequests: {
    list: (params?: { status?: string; bloodGroup?: string; city?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.bloodGroup) query.set('bloodGroup', params.bloodGroup);
      if (params?.city) query.set('city', params.city);
      const qs = query.toString();
      return request<BloodRequest[]>(`/blood-requests${qs ? `?${qs}` : ''}`);
    },

    getMine: () => request<BloodRequest[]>('/blood-requests/me'),

    create: (body: Omit<BloodRequestPayload, 'userId' | 'status'>) =>
      request<BloodRequest>('/blood-requests', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    update: (id: string, body: Partial<BloodRequestPayload>) =>
      request<BloodRequest>(`/blood-requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),

    delete: (id: string) =>
      request<{ message: string }>(`/blood-requests/${id}`, {
        method: 'DELETE',
      }),
  },

  donations: {
    list: () => request<Donation[]>('/donations'),

    create: (body: { bloodGroup: string; donationDate: string; units?: number; hospital?: string; city?: string }) =>
      request<Donation>('/donations', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  admin: {
    stats: () => request<AdminStats>('/admin/stats'),
    users: () => request<AdminUser[]>('/admin/users'),
    donors: () => request<Donor[]>('/admin/donors'),
    bloodRequests: () => request<BloodRequest[]>('/admin/blood-requests'),
  },

  contact: {
    submit: (body: { name: string; email: string; subject: string; message: string }) =>
      request<{ message: string }>('/contact', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  stats: {
    public: () => request<{ donors: number; requests: number; cities: number }>('/donors?available=true'),
  },
};

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  role: 'user' | 'admin';
}

export interface Donor {
  _id: string;
  userId: string;
  fullName: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  city: string;
  lastDonationDate: string | null;
  available: boolean;
  createdAt: string;
}

export interface DonorPayload {
  userId: string;
  fullName: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  city: string;
  lastDonationDate: string | null;
  available: boolean;
}

export interface BloodRequest {
  _id: string;
  userId: string;
  patientName: string;
  bloodGroup: string;
  hospital: string;
  city: string;
  unitsRequired: number;
  urgency: string;
  contactName: string;
  contactPhone: string;
  status: string;
  createdAt: string;
}

export interface BloodRequestPayload {
  userId: string;
  patientName: string;
  bloodGroup: string;
  hospital: string;
  city: string;
  unitsRequired: number;
  urgency: string;
  contactName: string;
  contactPhone: string;
  status: string;
}

export interface Donation {
  _id: string;
  userId: string;
  donorId: string | null;
  bloodGroup: string;
  donationDate: string;
  units: number;
  hospital: string;
  city: string;
}

export interface AdminStats {
  users: number;
  donors: number;
  requests: number;
  availableDonors: number;
  pendingRequests: number;
  fulfilledRequests: number;
  cancelledRequests: number;
}

export interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  createdAt: string;
}
