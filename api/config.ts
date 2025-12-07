import { Alert } from 'react-native';

// API Configuration for Rails Backend
const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.56.72.43:3000';

export { BASE_URL };

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/login',
  DRIVERS: '/api/drivers',
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
  zone_id: number;
  home_lat: number;
  home_lon: number;
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

export const getPartners = async () => {
  const response = await fetch(`${BASE_URL}${API_ENDPOINTS.PARTNERS}`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch partners: ${text}`);
  }

  const json = await response.json();
  return json;
};

export async function updateDriverPartner(selectedNPOId: number) {
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.DRIVERS}/1`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        driver: { partner_id: selectedNPOId },
      }),
    });

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
