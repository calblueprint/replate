import { Alert } from 'react-native';
import { ApiError, ApiErrorResponse, apiRequest } from './apiUtils';
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
}

/**
 * Parses an error response body, returning an ApiError instance.
 * Handles JSON parsing failures and fallback to text.
 */
async function parseErrorResponse(
  response: Response,
  fallbackMessage: string,
): Promise<ApiError> {
  const responseClone = response.clone();
  try {
    const body: ApiErrorResponse = await response.json();
    return new ApiError(
      body.errors?.join(', ') || body.error || body.message || fallbackMessage,
      response.status,
      body.errors || [],
    );
  } catch {
    // JSON parsing failed - try text
    try {
      const text = await responseClone.text();
      // Attempt JSON parse on text (in case content-type was wrong)
      try {
        const parsed = JSON.parse(text) as ApiErrorResponse;
        return new ApiError(
          parsed.errors?.join(', ') ||
            parsed.error ||
            parsed.message ||
            fallbackMessage,
          response.status,
          parsed.errors || [],
        );
      } catch {
        return new ApiError(
          text || `Server error (${response.status})`,
          response.status,
        );
      }
    } catch {
      return new ApiError(
        `Server error (${response.status}). Please try again.`,
        response.status,
      );
    }
  }
}

/**
 * Wraps a network-level TypeError into an ApiError.
 */
function handleFetchError(error: unknown): never {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    throw new ApiError(
      'Network error. Please check your connection and try again.',
      0,
    );
  }
  throw error;
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
        throw await parseErrorResponse(response, 'Signup failed');
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      handleFetchError(error);
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
        const apiError = await parseErrorResponse(response, 'Login failed');
        // Override message for 401 to be more user-friendly
        if (
          response.status === 401 &&
          !apiError.message.toLowerCase().includes('invalid')
        ) {
          throw new ApiError('Invalid email or password', 401, apiError.errors);
        }
        throw apiError;
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      handleFetchError(error);
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
        throw await parseErrorResponse(response, 'Failed to send reset email');
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      handleFetchError(error);
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
        throw await parseErrorResponse(response, 'Failed to reset password');
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      handleFetchError(error);
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
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function updateDriverPartner(
  driverId: number,
  selectedNPOId: number,
): Promise<UpdateDriverResponse | null> {
  try {
    const responseData = await apiRequest<
      UpdateDriverResponse | { driver: UpdateDriverResponse }
    >(`${BASE_URL}${API_ENDPOINTS.DRIVERS}/${driverId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        driver: { partner_id: selectedNPOId },
      }),
    });

    // supports both { driver: {...} } and {...}
    const driverObj =
      isObject(responseData) && 'driver' in responseData
        ? (responseData.driver as UpdateDriverResponse)
        : (responseData as UpdateDriverResponse);

    Alert.alert(
      'Success',
      driverObj.partner_id != null
        ? `Driver updated. Partner ID: ${driverObj.partner_id}`
        : 'Driver updated.',
    );

    return driverObj;
  } catch (err) {
    const errorMsg =
      err instanceof ApiError ? err.message : 'Unable to update driver.';
    Alert.alert('Error', errorMsg);
    return null;
  }
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

export async function submitCompletionDetails(
  encryptedTaskId: string,
  data: { total_pounds_entered: string; description?: string },
) {
  const safeId = encodeURIComponent(encryptedTaskId);
  return apiRequest(
    `${BASE_URL}/api/tasks/${safeId}/update_completion_details`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  );
}
