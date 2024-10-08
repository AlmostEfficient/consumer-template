import React, { createContext, useState, useEffect, useContext } from 'react';
import { getItem, setItem } from '../utils/storage'; // Your storage utility functions
import { magic } from '../config/magic';
import { MagicUserMetadata } from '@magic-sdk/types';

interface UserContextType {
  userMetadata: MagicUserMetadata | null;
  setUserMetadata: React.Dispatch<React.SetStateAction<MagicUserMetadata | null>>;
  fetchUserMetadata: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userMetadata, setUserMetadata] = useState<MagicUserMetadata | null>(null);

  const fetchUserMetadata = async () => {
    try {
      const cachedMetadata = await getItem('userMetadata');
      if (cachedMetadata) {
        setUserMetadata(JSON.parse(cachedMetadata));
      } else {
        const metadata = await magic.user.getInfo();
        setUserMetadata(metadata);
        await setItem('userMetadata', JSON.stringify(metadata));
      }
    } catch (error) {
      console.error('Error fetching user metadata:', error);
    }
  };

  useEffect(() => {
    fetchUserMetadata();
  }, []);

  return (
    <UserContext.Provider value={{ userMetadata, setUserMetadata, fetchUserMetadata }}>
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