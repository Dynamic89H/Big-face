import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi, setToken, getToken, type SignupInput } from '../api/client';
import { destroySocket, getSocket } from '../api/socket';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (u: User | null) => void;
  dailyReward: { streak: number; xp: number } | null;
  clearDailyReward: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyReward, setDailyReward] = useState<{ streak: number; xp: number } | null>(null);

  const refreshUser = useCallback(async () => {
    const { user: fresh } = await authApi.me();
    setUser((prev) => {
      if (prev && fresh.level > prev.level) {
        // Level up! Celebrate with a fanfare.
        import('../utils/chime').then((m) => m.playLevelUp()).catch(() => undefined);
      }
      return fresh;
    });
  }, []);

  // On boot, if a token is stored, restore the session and open the socket.
  useEffect(() => {
    (async () => {
      if (getToken()) {
        try {
          await refreshUser();
          getSocket();
        } catch {
          // Stale/invalid token — drop it and fall through to logged out.
          setToken(null);
          destroySocket();
          setUser(null);
        }
      }
      setLoading(false);
    })();
  }, [refreshUser]);

  const login = useCallback(async (identifier: string, password: string) => {
    const { token, user, dailyReward: reward } = await authApi.login(identifier, password);
    setToken(token);
    setUser(user);
    if (reward) setDailyReward(reward);
    getSocket(); // socket reads the fresh token at creation
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    const { token, user } = await authApi.signup(input);
    setToken(token);
    setUser(user);
    getSocket();
  }, []);

  const logout = useCallback(() => {
    destroySocket();
    setToken(null);
    setUser(null);
  }, []);

  const clearDailyReward = useCallback(() => setDailyReward(null), []);

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, refreshUser, setUser, dailyReward, clearDailyReward }),
    [user, loading, login, signup, logout, refreshUser, dailyReward, clearDailyReward],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
