import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, type User } from "@/lib/api";

export interface AuthModalOptions {
  promptMessage?: string;
  onAuthenticated?: () => void;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    company?: string;
    phone?: string;
  }) => Promise<User>;
  loginWithGoogle: (payload: {
    credential?: string;
    accessToken?: string;
    providerToken?: string;
    userInfo?: { email: string; name?: string; picture?: string; sub?: string };
  }) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  updateProfile: (data: { fullName?: string; company?: string; phone?: string }) => Promise<User>;
  openAuthModal: (options?: AuthModalOptions) => void;
  closeAuthModal: () => void;
  authModalState: { isOpen: boolean; options?: AuthModalOptions | undefined };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const res = await api.auth.me();
      if (res.authenticated && res.user) {
        setUser(res.user);
        return res.user;
      } else {
        setUser(null);
        return null;
      }
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    company?: string;
    phone?: string;
  }): Promise<User> => {
    setLoading(true);
    try {
      const res = await api.auth.register(payload);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (payload: {
    credential?: string;
    accessToken?: string;
    providerToken?: string;
    userInfo?: { email: string; name?: string; picture?: string; sub?: string };
  }): Promise<User> => {
    setLoading(true);
    try {
      const res = await api.auth.google(payload);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.auth.logout();
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (data: {
    fullName?: string;
    company?: string;
    phone?: string;
  }): Promise<User> => {
    const res = await api.customer.updateProfile(data);
    setUser(res.user);
    return res.user;
  };

  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    options?: AuthModalOptions | undefined;
  }>({ isOpen: false });

  const openAuthModal = useCallback((options?: AuthModalOptions) => {
    setAuthModalState({ isOpen: true, options });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalState({ isOpen: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser,
        updateProfile,
        openAuthModal,
        closeAuthModal,
        authModalState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

