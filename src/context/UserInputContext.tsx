"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type UserDetails = {
  name: string | null;
  dateOfBirth: string | null; // Storing as ISO string
};

type UserInputContextType = {
  userDetails: UserDetails;
  setUserDetails: (details: UserDetails) => void;
};

const UserInputContext = createContext<UserInputContextType | undefined>(undefined);

const USER_DETAILS_STORAGE_KEY = "cosmicInsightsUserDetails";

export function UserInputProvider({ children }: { children: ReactNode }) {
  const [userDetails, setUserDetailsState] = useState<UserDetails>({
    name: null,
    dateOfBirth: null,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedDetails = localStorage.getItem(USER_DETAILS_STORAGE_KEY);
      if (storedDetails) {
        setUserDetailsState(JSON.parse(storedDetails));
      }
    } catch (error) {
        console.error("Failed to read user details from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  const setUserDetails = (details: UserDetails) => {
    try {
      localStorage.setItem(USER_DETAILS_STORAGE_KEY, JSON.stringify(details));
      setUserDetailsState(details);
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
