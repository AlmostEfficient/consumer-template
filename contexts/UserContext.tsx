import React, { createContext, useState, useEffect, useContext } from 'react';
import { getItem, setItem } from '../utils/storage';
import { magic } from '../config/magic';
import { MagicUserMetadata } from '@magic-sdk/types';

interface UserContextType {
  userMetadata: MagicUserMetadata | null;
  setUserMetadata: React.Dispatch<React.SetStateAction<MagicUserMetadata | null>>;
  fetchUserMetadata: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userMetadata, setUserMetadata] = useState<MagicUserMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserMetadata = async () => {
    setIsLoading(true);
    try {
      const cachedMetadata = await getItem('userMetadata');
      if (cachedMetadata) {
        setUserMetadata(JSON.parse(cachedMetadata));
      } else {
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          const metadata = await magic.user.getInfo();
          setUserMetadata(metadata);
          setItem('userMetadata', JSON.stringify(metadata));
        } else {
          setUserMetadata(null);
        }
      }
    } catch (error) {
      setUserMetadata(null);
			console.log('error fetching user metadata', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserMetadata();
  }, []);

  return (
    <UserContext.Provider value={{ userMetadata, setUserMetadata, fetchUserMetadata, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
