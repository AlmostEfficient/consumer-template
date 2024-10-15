import React, { createContext, useState, useContext } from 'react';
import { MagicUserMetadata } from '@magic-sdk/types';

interface UserContextType {
  userMetadata: MagicUserMetadata | null;
  setUserMetadata: React.Dispatch<React.SetStateAction<MagicUserMetadata | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userMetadata, setUserMetadata] = useState<MagicUserMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <UserContext.Provider value={{ userMetadata, setUserMetadata, isLoading, setIsLoading }}>
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
