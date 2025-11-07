// API Configuration for Rails Backend
const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http:/10.2.193.239:3000';

export { BASE_URL };

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/drivers/login',
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
        // Clone the response so we can read it multiple times if needed
        const responseClone = response.clone();
        try {
          const error: ApiError = await response.json();
          // Return error object with errors array for better parsing
          const errorObj = {
            message: error.errors?.join(', ') || error.error || 'Signup failed',
            errors: error.errors || [],
            status: response.status,
          };
          throw errorObj;
        } catch (parseError) {
          // If parseError is already our error object (has status and message), re-throw it
          if (
            typeof parseError === 'object' &&
            parseError !== null &&
            'status' in parseError &&
            'message' in parseError
          ) {
            throw parseError;
          }
          // Otherwise, JSON parsing failed - try to read as text
          try {
            const text = await responseClone.text();
            // Try to parse as JSON one more time
            try {
              const parsed = JSON.parse(text);
              throw {
                message:
                  parsed.errors?.join(', ') || parsed.error || 'Signup failed',
                errors: parsed.errors || [],
                status: response.status,
              };
            } catch {
              // Not valid JSON, use text as message
              throw {
                message: text || `Server error (${response.status})`,
                errors: [],
                status: response.status,
              };
            }
          } catch {
            // Couldn't read response, use status code
            throw {
              message: `Server error (${response.status}). Please try again.`,
              errors: [],
              status: response.status,
            };
          }
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
        // Clone the response so we can read it multiple times if needed
        const responseClone = response.clone();
        try {
          const error: ApiError = await response.json();
          // Return error object with proper message
          throw {
            message: error.error || error.message || 'Login failed',
            errors: [],
            status: response.status,
          };
        } catch (parseError) {
          // If parseError is already our error object (has status and message), re-throw it
          if (
            typeof parseError === 'object' &&
            parseError !== null &&
            'status' in parseError &&
            'message' in parseError
          ) {
            throw parseError;
          }
          // JSON parsing failed - try to read as text
          try {
            const text = await responseClone.text();
            throw {
              message: text || `Authentication failed (${response.status})`,
              errors: [],
              status: response.status,
            };
          } catch {
            // Couldn't read response, use status-based message
            const statusMessage =
              response.status === 401
                ? 'Invalid email or password'
                : `Server error (${response.status})`;
            throw {
              message: statusMessage,
              errors: [],
              status: response.status,
            };
          }
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
