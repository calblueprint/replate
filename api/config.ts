// API Configuration for Rails Backend
const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http:/10.2.193.239:3000';

export { BASE_URL };

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/login',
  DRIVERS: '/api/drivers',
} as const;

// Types for driver auth
export interface DriverSignupData {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface DriverLoginData {
  email: string;
  password: string;
}

export interface DriverResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

// API functions
export const driverAPI = {
  signup: async (data: DriverSignupData): Promise<DriverResponse> => {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.DRIVERS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driver: data }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.join(', ') || 'Signup failed');
    }

    return response.json();
  },

  login: async (data: DriverLoginData): Promise<DriverResponse> => {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },
};
