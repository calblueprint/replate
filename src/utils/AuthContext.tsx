import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  driverAPI,
  DriverLoginData,
  DriverResponse,
  DriverSignupData,
  updateDriver,
} from '../../api/config';
import { safeJsonParse, sanitizeObject } from './sanitization';

// Simple AuthContext with persistence
interface AuthContextType {
  driver: DriverResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    credentials: DriverLoginData,
    staySignedIn?: boolean,
  ) => Promise<void>;
  signup: (
    driverData: DriverSignupData,
    staySignedIn?: boolean,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const PUSH_PERMISSION_REQUESTED_KEY = 'push_permission_requested';

function getExpoProjectId(): string | null {
  const easConfigProjectId = Constants.easConfig?.projectId ?? null;
  if (easConfigProjectId) return easConfigProjectId;

  const extra = Constants.expoConfig?.extra as
    | { eas?: { projectId?: string } }
    | undefined;
  return extra?.eas?.projectId ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [driver, setDriver] = useState<DriverResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!driver;

  const registerForPushNotifications = async (
    driverId: number,
    { allowPrompt }: { allowPrompt: boolean },
  ) => {
    try {
      const hasRequestedPermission =
        (await AsyncStorage.getItem(PUSH_PERMISSION_REQUESTED_KEY)) === 'true';

      let isGranted = false;
      if (allowPrompt && !hasRequestedPermission) {
        const permissionResult = await Notifications.requestPermissionsAsync();
        await AsyncStorage.setItem(PUSH_PERMISSION_REQUESTED_KEY, 'true');
        isGranted = permissionResult.status === 'granted';
      } else {
        const permissionResult = await Notifications.getPermissionsAsync();
        isGranted = permissionResult.status === 'granted';
      }

      if (!isGranted) {
        try {
          await updateDriver(driverId, { notifications_enabled: false });
        } catch (error) {
          console.warn('Failed to disable notifications on backend', error);
        }
        return;
      }

      const projectId = getExpoProjectId();
      if (!projectId) {
        console.warn('Push projectId is unavailable; skipping token sync');
        return;
      }

      const tokenResult = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      await updateDriver(driverId, {
        push_token: tokenResult.data,
        notifications_enabled: true,
      });
    } catch (error) {
      console.warn('Push registration failed', error);
    }
  };

  // Load stored driver data on app start
  useEffect(() => {
    const loadStoredDriver = async () => {
      try {
        const storedDriver = await AsyncStorage.getItem('driver');

        if (storedDriver) {
          const parsed = safeJsonParse<DriverResponse>(storedDriver);
          // Sanitize the parsed data to prevent prototype pollution
          const sanitized = sanitizeObject(
            parsed as unknown as Record<string, unknown>,
          ) as unknown as DriverResponse;
          setDriver(sanitized);
          // Silent push re-registration is intentionally restore-only:
          // run only after a valid stored driver is available, and never block auth restore.
          if (typeof sanitized.id === 'number' && sanitized.id > 0) {
            void registerForPushNotifications(sanitized.id, {
              allowPrompt: false,
            });
          }
        }
      } catch {
        // Failed to load stored driver, user will need to login again
        setDriver(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredDriver();
  }, []);

  const login = async (credentials: DriverLoginData, staySignedIn = false) => {
    const driverData = await driverAPI.login(credentials);
    setDriver(driverData);

    if (staySignedIn) {
      await AsyncStorage.setItem('driver', JSON.stringify(driverData));
    }

    if (typeof driverData.id === 'number' && driverData.id > 0) {
      void registerForPushNotifications(driverData.id, { allowPrompt: true });
    }
  };

  const signup = async (driverData: DriverSignupData) => {
    const newDriver = await driverAPI.signup(driverData);
    setDriver(newDriver);
    // Always persist after signup so cold starts can detect incomplete onboarding
    await AsyncStorage.setItem('driver', JSON.stringify(newDriver));
  };

  const logout = async () => {
    setDriver(null);
    await AsyncStorage.removeItem('driver');
  };

  return (
    <AuthContext.Provider
      value={{ driver, isAuthenticated, isLoading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
