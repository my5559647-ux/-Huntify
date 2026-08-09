'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
}

type Theme = 'light' | 'dark';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  theme: Theme;
  toggleTheme: () => void;
  login: (user: AuthUser) => void;
  logout: () => void;
  deleteAccount: () => void;
  updateAvatar: (avatar: string) => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
  guardModalOpen: boolean;
  openGuardModal: () => void;
  closeGuardModal: () => void;
  requireAuth: (callback: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  user: 'huntify_user',
  theme: 'huntify_theme',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [theme, setTheme] = useState<Theme>('light'); // Light is the default
  const [guardModalOpen, setGuardModalOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state after mount (client-only, avoids SSR mismatch)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.user);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  // Apply theme class to <html> so it works across the whole app
  useEffect(() => {
    if (hydrated) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    }
  }, [theme, hydrated]);

  const persistUser = useCallback((u: AuthUser | null) => {
    try {
      if (u) {
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(u));
      } else {
        localStorage.removeItem(STORAGE_KEYS.user);
      }
    } catch {
      // ignore storage errors
    }
    setUser(u);
  }, []);

  const login = useCallback((u: AuthUser) => persistUser(u), [persistUser]);

  const logout = useCallback(() => persistUser(null), [persistUser]);

  const deleteAccount = useCallback(() => persistUser(null), [persistUser]);

  const updateAvatar = useCallback(
    (avatar: string) => {
      setUser((prev) => {
        const next = prev ? { ...prev, avatar } : { name: '', email: '', avatar };
        persistUser(next);
        return next;
      });
    },
    [persistUser]
  );

  const updateProfile = useCallback(
    (updates: Partial<AuthUser>) => {
      setUser((prev) => {
        const next = prev ? { ...prev, ...updates } : ({ ...updates } as AuthUser);
        persistUser(next);
        return next;
      });
    },
    [persistUser]
  );

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    []
  );

  const openGuardModal = useCallback(() => setGuardModalOpen(true), []);
  const closeGuardModal = useCallback(() => setGuardModalOpen(false), []);

  // If not authenticated, show the guard modal instead of running the action
  const requireAuth = useCallback(
    (callback: () => void) => {
      setUser((current) => {
        // We read auth state synchronously here
        void current;
        return current ?? null;
      });
      const authed = user;
      if (!authed) {
        setGuardModalOpen(true);
      } else {
        callback();
      }
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        theme,
        toggleTheme,
        login,
        logout,
        deleteAccount,
        updateAvatar,
        updateProfile,
        guardModalOpen,
        openGuardModal,
        closeGuardModal,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

