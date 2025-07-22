
"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./FirebaseContext";

type UserDetails = {
  name: string | null;
  dateOfBirth: string | null; // Storing as ISO string
};

type UserInputContextType = {
  userDetails: UserDetails;
  setUserDetails: (details: Partial<UserDetails>) => void;
};

const UserInputContext = createContext<UserInputContextType | undefined>(undefined);

const USER_DETAILS_STORAGE_KEY_PREFIX = "cosmicInsightsUserDetails";

export function UserInputProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [userDetails, setUserDetailsState] = useState<UserDetails>({
    name: null,
    dateOfBirth: null,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  
  const storageKey = user ? `${USER_DETAILS_STORAGE_KEY_PREFIX}_${user.uid}` : "cosmicInsightsUserDetails_guest";

  useEffect(() => {
    if (user && user.email) {
        setUserDetailsState(prev => ({ ...prev, name: user.email?.split('@')[0] || null }));
    } else {
        setUserDetailsState({ name: null, dateOfBirth: null });
    }
  
    try {
      const storedDetails = localStorage.getItem(storageKey);
      if (storedDetails) {
        setUserDetailsState(prev => ({...prev, ...JSON.parse(storedDetails)}));
      }
    } catch (error) {
        console.error("Failed to read user details from localStorage", error);
    }
    setIsInitialized(true);
  }, [user, storageKey]);

  const setUserDetails = (details: Partial<UserDetails>) => {
    try {
      const newDetails = { ...userDetails, ...details };
      localStorage.setItem(storageKey, JSON.stringify(newDetails));
      setUserDetailsState(newDetails);
    } catch (error) {
        console.error("Failed to save user details to localStorage", error);
    }
  };
  
  const value = { userDetails, setUserDetails };

  return (
    <UserInputContext.Provider value={value}>
      {isInitialized ? children : null}
    </UserInputContext.Provider>
  );
}

export function useUserInput() {
  const context = useContext(UserInputContext);
  if (context === undefined) {
    throw new Error("useUserInput must be used within a UserInputProvider");
  }
  return context;
}
