import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  driverAPI,
  DriverLoginData,
  DriverResponse,
  DriverSignupData,
} from '../../api/config';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [driver, setDriver] = useState<DriverResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!driver;

  // Load stored driver data on app start
  useEffect(() => {
    const loadStoredDriver = async () => {
      try {
        const storedDriver = await AsyncStorage.getItem('driver');

        if (storedDriver) {
          const parsedDriver = JSON.parse(storedDriver);
          setDriver(parsedDriver);
        } else {
        }
      } catch (error) {
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
  };

  const signup = async (driverData: DriverSignupData, staySignedIn = false) => {
    const newDriver = await driverAPI.signup(driverData);
    setDriver(newDriver);

    if (staySignedIn) {
      await AsyncStorage.setItem('driver', JSON.stringify(newDriver));
    }
  };

  const logout = async () => {
    console.log('Logging out, clearing storage');
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
