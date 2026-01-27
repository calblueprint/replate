import React, { createContext, ReactNode, useContext, useState } from 'react';
import { API_ENDPOINTS, BASE_URL } from '../../api/config';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setProfile = (newProfile: DriverProfile | null) => {
    setProfileState(newProfile);
    setError(null);
  };

  const refreshProfile = async (driverId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.DRIVERS}/${driverId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch driver profile');
      }

      const data = await response.json();
      setProfileState(data.driver || data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      console.error('Error refreshing profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearProfile = () => {
    setProfileState(null);
    setError(null);
  };

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
