import { Alert } from 'react-native';
import { apiRequest, ApiError as ApiUtilError } from './apiUtils';
import { ENV_CONFIG } from './envConfig';

// API Configuration for Rails Backend
const BASE_URL = ENV_CONFIG.API_BASE_URL;

export { BASE_URL };

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/drivers/login',
  DRIVERS: '/api/drivers',
  REQUEST_PASSWORD_RESET: '/api/drivers/password',
  RESET_PASSWORD: '/api/drivers/password',
  PARTNERS: '/api/partners',
  TASKS: '/api/tasks',
  MY_TASKS: '/api/my_tasks',
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
  push_token: string | null;
  notifications_enabled: boolean;
}

// Error types for better error handling
export interface ApiError {
  errors?: string[];
  error?: string;
  message?: string;
}

// Re-export ApiError from apiUtils for consistency
export { ApiUtilError as ApiRequestError };

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
  return apiRequest(`${BASE_URL}${API_ENDPOINTS.PARTNERS}`, {
    method: 'GET',
  });
};

interface UpdateDriverResponse {
  id: number;
  email: string;
  partner_id: number | null;
  push_token?: string | null;
  notifications_enabled?: boolean;
}

interface UpdateDriverPayload {
  partner_id?: number | null;
  push_token?: string | null;
  notifications_enabled?: boolean;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function updateDriverPartner(
  driverId: number,
  selectedNPOId: number,
): Promise<UpdateDriverResponse | null> {
  try {
    const driverObj = await updateDriver(driverId, {
      partner_id: selectedNPOId,
    });

    Alert.alert(
      'Success',
      driverObj.partner_id != null
        ? `Driver updated. Partner ID: ${driverObj.partner_id}`
        : 'Driver updated.',
    );

    return driverObj;
  } catch (err) {
    const errorMsg =
      err instanceof ApiUtilError ? err.message : 'Unable to update driver.';
    Alert.alert('Error', errorMsg);
    return null;
  }
}

export async function updateDriver(
  driverId: number,
  payload: UpdateDriverPayload,
): Promise<UpdateDriverResponse> {
  const responseData = await apiRequest<
    UpdateDriverResponse | { driver: UpdateDriverResponse }
  >(`${BASE_URL}${API_ENDPOINTS.DRIVERS}/${driverId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      driver: payload,
    }),
  });

  // supports both { driver: {...} } and {...}
  return isObject(responseData) && 'driver' in responseData
    ? (responseData.driver as UpdateDriverResponse)
    : (responseData as UpdateDriverResponse);
}

export async function getTask(encryptedTaskId: string) {
  const safeId = encodeURIComponent(encryptedTaskId);

  return apiRequest(`${BASE_URL}${API_ENDPOINTS.TASKS}/${safeId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

export async function claimTask(encryptedTaskId: string, driverId: number) {
  const safeId = encodeURIComponent(encryptedTaskId);

  return apiRequest(`${BASE_URL}${API_ENDPOINTS.TASKS}/${safeId}/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ driver_id: driverId }),
  });
}

export async function submitTaskMissed(encryptedTaskId: string) {
  const safeId = encodeURIComponent(encryptedTaskId);
  return apiRequest(`${BASE_URL}/api/tasks/${safeId}/mark_as_failed`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

export async function submitCompletionDetails(
  encryptedTaskId: string,
  data: {
    total_pounds_entered: string;
    description?: string;
    photoUri?: string | null;
  },
) {
  const safeId = encodeURIComponent(encryptedTaskId);
  const url = `${BASE_URL}/api/tasks/${safeId}/update_completion_details`;

  if (data.photoUri) {
    // Multipart: can't send a file as JSON. Use FormData and let fetch
    // set the Content-Type with the correct boundary automatically.
    const form = new FormData();
    form.append('task[total_pounds_entered]', data.total_pounds_entered);
    if (data.description) {
      form.append('task[description]', data.description);
    }

    // Infer filename + mime from the URI (expo-image-picker gives file://...)
    const filename = data.photoUri.split('/').pop() || 'photo.jpg';
    const extMatch = /\.(\w+)$/.exec(filename);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

    // React Native's FormData accepts a {uri, name, type} object as a file
    // value, but TypeScript's DOM types only know about Blob | string. The
    // double-cast is the standard RN workaround. fetch on RN serializes this
    // shape into a real multipart file part at runtime.
    form.append('task[photo]', {
      uri: data.photoUri,
      name: filename,
      type: mimeType,
    } as unknown as Blob);

    return apiRequest(url, {
      method: 'PATCH',
      body: form,
    });
  }

  return apiRequest(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      total_pounds_entered: data.total_pounds_entered,
      description: data.description,
    }),
  });
}
