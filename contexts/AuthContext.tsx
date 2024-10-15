import React, { createContext, useState, useContext, useEffect } from 'react';
import { magic } from '../config/magic';
import { getItem, setItem, removeItem } from '../utils/storage';
import { useUser } from './UserContext';
import { Alert, InteractionManager } from 'react-native';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setUserMetadata } = useUser();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedMetadata = await getItem('userMetadata');
      if (storedMetadata) {
        setUserMetadata(JSON.parse(storedMetadata));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const result = await magic.auth.loginWithEmailOTP({ email });
      if (result) {
        setIsAuthenticated(true);
        setIsLoading(false);

        // Perform non-critical operations in the background after UI interactions
        InteractionManager.runAfterInteractions(async () => {
          const metadata = await magic.user.getInfo();
          setUserMetadata(metadata);
          await setItem('userMetadata', JSON.stringify(metadata));
          await setItem('hasOnboarded', 'true');
        });

        return true; // Indicate successful login
      } else {
        Alert.alert('Login Failed', 'Unexpected response from the server.');
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
			if (error.message === 'Login cancelled by user') {
				Alert.alert('Login Cancelled', 'You have cancelled the login process.');
			} else if (error.message === 'Login timed out') {
				Alert.alert('Login Timeout', 'The login process took too long. Please try again.');
			} else if (error.code === 'rate_limit_exceeded') {
				Alert.alert('Too Many Attempts', 'Please wait a moment before trying again.');
			} else {
				Alert.alert('Login Error', 'An error occurred during login. Please try again.');
			}
    } finally {
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    // Immediately update the UI
    setIsAuthenticated(false);
    setUserMetadata(null);

    // Perform non-critical operations in the background
    InteractionManager.runAfterInteractions(() => {
			magic.user.logout().catch(error => console.error('Error logging out in the background:', error));
			removeItem('userMetadata');
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login: login as unknown as (email: string) => Promise<void>, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};