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

const driverJsonRequest = <T>(
  endpoint: string,
  method: 'POST' | 'PUT',
  payload: unknown,
): Promise<T> =>
  apiRequest<T>(`${BASE_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    retries: 0,
  });

// API functions
export const driverAPI = {
  signup: (data: DriverSignupData): Promise<DriverResponse> =>
    driverJsonRequest<DriverResponse>(API_ENDPOINTS.DRIVERS, 'POST', {
      driver: data,
    }),

  login: (data: DriverLoginData): Promise<DriverResponse> =>
    driverJsonRequest<DriverResponse>(API_ENDPOINTS.LOGIN, 'POST', data),

  requestPasswordReset: (email: string): Promise<{ message: string }> =>
    driverJsonRequest<{ message: string }>(
      API_ENDPOINTS.REQUEST_PASSWORD_RESET,
      'POST',
      { driver: { email } },
    ),

  resetPassword: (data: PasswordResetData): Promise<{ message: string }> =>
    driverJsonRequest<{ message: string }>(
      API_ENDPOINTS.RESET_PASSWORD,
      'PUT',
      { driver: data },
    ),
};

export type PartnerTuple = [number, string];

export const getPartners = async (): Promise<PartnerTuple[]> => {
  const data = await apiRequest<unknown>(
    `${BASE_URL}${API_ENDPOINTS.PARTNERS}`,
    {
      method: 'GET',
    },
  );
  return Array.isArray(data)
    ? data.filter(
        (item): item is PartnerTuple =>
          Array.isArray(item) &&
          typeof item[0] === 'number' &&
          typeof item[1] === 'string',
      )
    : [];
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
      err instanceof ApiUtilError ? err.message : 'Unable to update driver.';
    Alert.alert('Error', errorMsg);
    return null;
  }
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
    partner_id: string;
    description?: string;
    photo_description?: string;
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
    form.append('task[partner_id]', data.partner_id);
    if (data.description) {
      form.append('task[description]', data.description);
    }
    if (data.photo_description) {
      form.append('task[photo_description]', data.photo_description);
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
      partner_id: data.partner_id,
      description: data.description,
    }),
  });
}
