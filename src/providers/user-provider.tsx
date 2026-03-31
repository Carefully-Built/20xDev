'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';

import type { ReactNode } from 'react';

export interface UserData {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  organizationId?: string;
}

interface UserContextValue {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  updateUser: (updates: Partial<UserData>) => void;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

interface UserProviderProps {
  readonly children: ReactNode;
  readonly initialUser: UserData | null;
}

export function UserProvider({ children, initialUser }: UserProviderProps): React.ReactElement {
  const [user, setUser] = useState(initialUser);

  const updateUser = useCallback((updates: Partial<UserData>): void => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const refreshUser = useCallback((): void => {
    globalThis.dispatchEvent(new CustomEvent('user-updated'));
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      updateUser,
      refreshUser,
    }),
    [user, setUser, updateUser, refreshUser],
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const defaultContextValue: UserContextValue = {
  user: null,
  setUser: noop,
  updateUser: noop,
  refreshUser: noop,
};

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  return context ?? defaultContextValue;
}
