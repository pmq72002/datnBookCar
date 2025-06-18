import React, { createContext, useState, useContext, ReactNode } from 'react';

type User = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  // thêm các trường khác nếu cần
};

type UserContextType = {
  userData: User | null;
  setUserData: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
