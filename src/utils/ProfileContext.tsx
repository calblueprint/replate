import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  apiRequest,
  ApiError as ApiUtilError,
  validateResponse,
} from '../../api/apiUtils';
import { API_ENDPOINTS, BASE_URL } from '../../api/config';
import { useAuth } from './AuthContext';

// Extended driver profile interface to include NPO/partner information
export interface DriverProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  partner_id?: number;
}

interface ProfileContextType {
  profile: DriverProfile | null;
  loading: boolean;
  error: string | null;
  setProfile: (profile: DriverProfile | null) => void;
  refreshProfile: (driverId: number) => Promise<void>;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [profile, setProfileState] = useState<DriverProfile | null>(null);
  // Start as true so index.tsx waits for the first profile fetch before routing.
  // clearProfile() sets this back to false when there's no authenticated driver.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { driver } = useAuth();

  const setProfile = (newProfile: DriverProfile | null) => {
    setProfileState(newProfile);
    setError(null);
  };

  const refreshProfile = async (driverId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<DriverProfile | { driver: DriverProfile }>(
        `${BASE_URL}${API_ENDPOINTS.DRIVERS}/${driverId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          validateResponse: response => {
            // Response can be either { driver: {...} } or {...}
            const profileData =
              typeof response === 'object' &&
              response !== null &&
              'driver' in response
                ? response.driver
                : response;
            return validateResponse(profileData, [
              'id',
              'email',
              'first_name',
              'last_name',
            ]);
          },
        },
      );

      setProfileState('driver' in data ? data.driver : data);
    } catch (err) {
      const errorMessage =
        err instanceof ApiUtilError ? err.message : 'Failed to load profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearProfile = () => {
    setProfileState(null);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    if (driver?.id) {
      refreshProfile(driver.id);
    } else {
      clearProfile();
    }
  }, [driver?.id]);

  const value: ProfileContextType = {
    profile,
    loading,
    error,
    setProfile,
    refreshProfile,
    clearProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
