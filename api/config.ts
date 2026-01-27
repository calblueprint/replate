import { Alert } from 'react-native';

// API Configuration for Rails Backend
const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export { BASE_URL };

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/drivers/login',
  DRIVERS: '/api/drivers',
  REQUEST_PASSWORD_RESET: '/api/drivers/password',
  RESET_PASSWORD: '/api/drivers/password',
  PARTNERS: '/api/partners',
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

export interface PasswordResetRequestData {
  email: string;
}

export interface PasswordResetData {
  reset_password_token: string;
  password: string;
  password_confirmation: string;
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

  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.REQUEST_PASSWORD_RESET}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ driver: { email } }),
        },
      );

      if (!response.ok) {
        const responseClone = response.clone();
        try {
          const error: ApiError = await response.json();
          throw {
            message:
              error.errors?.join(', ') ||
              error.error ||
              error.message ||
              'Failed to send reset email',
            errors: error.errors || [],
            status: response.status,
          };
        } catch (parseError) {
          if (
            typeof parseError === 'object' &&
            parseError !== null &&
            'status' in parseError &&
            'message' in parseError
          ) {
            throw parseError;
          }
          try {
            const text = await responseClone.text();
            try {
              const parsed = JSON.parse(text);
              throw {
                message:
                  parsed.errors?.join(', ') ||
                  parsed.error ||
                  'Failed to send reset email',
                errors: parsed.errors || [],
                status: response.status,
              };
            } catch {
              throw {
                message: text || `Server error (${response.status})`,
                errors: [],
                status: response.status,
              };
            }
          } catch {
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
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          message: 'Network error. Please check your connection and try again.',
          errors: [],
          status: 0,
        };
      }
      throw error;
    }
  },

  resetPassword: async (
    data: PasswordResetData,
  ): Promise<{ message: string }> => {
    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.RESET_PASSWORD}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ driver: data }),
        },
      );

      if (!response.ok) {
        const responseClone = response.clone();
        try {
          const error: ApiError = await response.json();
          throw {
            message:
              error.errors?.join(', ') ||
              error.error ||
              error.message ||
              'Failed to reset password',
            errors: error.errors || [],
            status: response.status,
          };
        } catch (parseError) {
          if (
            typeof parseError === 'object' &&
            parseError !== null &&
            'status' in parseError &&
            'message' in parseError
          ) {
            throw parseError;
          }
          try {
            const text = await responseClone.text();
            try {
              const parsed = JSON.parse(text);
              throw {
                message:
                  parsed.errors?.join(', ') ||
                  parsed.error ||
                  'Failed to reset password',
                errors: parsed.errors || [],
                status: response.status,
              };
            } catch {
              throw {
                message: text || `Server error (${response.status})`,
                errors: [],
                status: response.status,
              };
            }
          } catch {
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
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          message: 'Network error. Please check your connection and try again.',
          errors: [],
          status: 0,
        };
      }
      throw error;
    }
  },
};

export const getPartners = async () => {
  const response = await fetch(`${BASE_URL}${API_ENDPOINTS.PARTNERS}`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch partners: ${text}`);
  }

  const json = await response.json();
  return json;
};

export async function updateDriverPartner(
  driverId: number,
  selectedNPOId: number,
) {
  try {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.DRIVERS}/${driverId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          driver: { partner_id: selectedNPOId },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to update driver:', errorData);
      Alert.alert('Error', errorData.error || 'Unknown error');
      return;
    }

    const data = await response.json();
    Alert.alert(
      'Success',
      `Driver updated. Partner ID: ${data.driver.partner_id}`,
    );
    return data.driver;
  } catch (err) {
    console.error('Network or server error:', err);
    Alert.alert('Network error', 'Unable to update driver.');
  }
}
