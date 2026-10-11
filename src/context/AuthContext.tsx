import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, AuthUser } from '@/lib/api';

interface AuthContextType {
  user: AuthUser | null;
  profile: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, phone: string, city: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async (): Promise<AuthUser | null> => {
    const token = api.getToken();
    if (!token) return null;

    try {
      const me = await api.auth.me();
      return me;
    } catch {
      api.setToken(null);
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      const u = await loadUser();
      setUser(u);
      setLoading(false);
    })();
  }, []);

  const refreshProfile = async () => {
    try {
      const me = await api.auth.me();
      setUser(me);
    } catch {
      // keep current state if refresh fails
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { token, user: u } = await api.auth.login({ email, password });
      api.setToken(token);
      setUser(u);
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    city: string
  ) => {
    try {
      const { token, user: u } = await api.auth.signup({
        fullName,
        email,
        password,
        phone,
        city,
      });
      api.setToken(token);
      setUser(u);
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  const signOut = async () => {
    api.setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile: user, loading, signIn, signUp, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
