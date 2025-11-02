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

// Error types for better error handling
export interface ApiError {
  errors?: string[];
  error?: string;
  message?: string;
}

// API functions
export const driverAPI = {
  signup: async (data: DriverSignupData): Promise<DriverResponse> => {
    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.DRIVERS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driver: data }),
      });

      if (!response.ok) {
        try {
          const error: ApiError = await response.json();
          // Return error object with errors array for better parsing
          const errorObj = {
            message: error.errors?.join(', ') || error.error || 'Signup failed',
            errors: error.errors || [],
            status: response.status,
          };
          throw errorObj;
        } catch {
          // If JSON parsing fails, throw network error
          throw {
            message:
              'Network error. Please check your connection and try again.',
            errors: [],
            status: response.status,
          };
        }
      }

      return response.json();
    } catch (error) {
      // Handle network errors (fetch failures)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          message: 'Network error. Please check your connection and try again.',
          errors: [],
          status: 0,
        };
      }
      // Re-throw API errors
      throw error;
    }
  },

  login: async (data: DriverLoginData): Promise<DriverResponse> => {
    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        try {
          const error: ApiError = await response.json();
          throw {
            message: error.error || error.message || 'Login failed',
            errors: [],
            status: response.status,
          };
        } catch {
          throw {
            message:
              'Network error. Please check your connection and try again.',
            errors: [],
            status: response.status,
          };
        }
      }

      return response.json();
    } catch (error) {
      // Handle network errors (fetch failures)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          message: 'Network error. Please check your connection and try again.',
          errors: [],
          status: 0,
        };
      }
      // Re-throw API errors
      throw error;
    }
  },
};
