import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { authApi, setToken, getToken, type SignupInput } from '../api/client';
import { destroySocket, getSocket } from '../api/socket';
import { levelForXp } from '../utils/xp';
import type { User } from '../types';

export interface XpFlash {
  amount: number;
  key: number;
}

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
  comeback: { tokens: number; xp: number; multiplierEndsAt: string } | null;
  clearComeback: () => void;
  /** Floating "+N XP" indicator payload (null when idle). */
  xpFlash: XpFlash | null;
  /** Show a floating "+N XP" indicator. */
  flashXp: (amount: number) => void;
  /**
   * Optimistically add XP to the local user (instant visual feedback for
   * high-frequency actions like chat). Fires the +N XP flash and celebrates
   * locally if a level threshold is crossed. The server remains the source
   * of truth; refreshUser() corrects any drift.
   */
  bumpLocalXp: (amount: number) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyReward, setDailyReward] = useState<{ streak: number; xp: number } | null>(null);
  const [comeback, setComeback] = useState<{ tokens: number; xp: number; multiplierEndsAt: string } | null>(null);

  const refreshUser = useCallback(async () => {
    const { user: fresh } = await authApi.me();
    setUser((prev) => {
      if (prev && fresh.level > prev.level) {
        // Level up! Celebrate with fanfare + confetti.
        import('../utils/chime').then((m) => m.playLevelUp()).catch(() => undefined);
        import('../components/Celebration').then((m) => m.celebrate(`🎉 LEVEL ${fresh.level}!`, true)).catch(() => undefined);
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
          // Stale/invalid token (e.g. account deleted) — nuke all local
          // session data so the user lands on signup fresh, not half-logged-in.
          setToken(null);
          destroySocket();
          setUser(null);
          try {
            Object.keys(localStorage)
              .filter((k) => k.startsWith('bigface.'))
              .forEach((k) => localStorage.removeItem(k));
          } catch {
            /* storage unavailable */
          }
        }
      }
      setLoading(false);
    })();
  }, [refreshUser]);

  const login = useCallback(async (identifier: string, password: string) => {
    const { token, user, dailyReward: reward, comeback: cb } = await authApi.login(identifier, password);
    setToken(token);
    setUser(user);
    if (reward) setDailyReward(reward);
    if (cb) setComeback(cb);
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
  const clearComeback = useCallback(() => setComeback(null), []);

  const [xpFlash, setXpFlash] = useState<XpFlash | null>(null);
  const flashTimer = useRef<number | null>(null);

  const flashXp = useCallback((amount: number) => {
    if (!amount || amount <= 0) return;
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    setXpFlash({ amount, key: Date.now() + Math.random() });
    flashTimer.current = window.setTimeout(() => setXpFlash(null), 2400);
  }, []);

  useEffect(() => () => {
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
  }, []);

  const bumpLocalXp = useCallback((amount: number) => {
    if (!amount || amount <= 0) return;
    setUser((prev) => {
      if (!prev) return prev;
      const xp = prev.xp + amount;
      const level = levelForXp(xp);
      if (level > prev.level) {
        // Crossed a level threshold locally — celebrate now; the server
        // refresh will confirm the real value later.
        import('../utils/chime').then((m) => m.playLevelUp()).catch(() => undefined);
        import('../components/Celebration').then((m) => m.celebrate(`🎉 LEVEL ${level}!`, true)).catch(() => undefined);
      }
      return { ...prev, xp, level };
    });
    flashXp(amount);
  }, [flashXp]);

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, refreshUser, setUser, dailyReward, clearDailyReward, comeback, clearComeback, xpFlash, flashXp, bumpLocalXp }),
    [user, loading, login, signup, logout, refreshUser, dailyReward, clearDailyReward, comeback, clearComeback, xpFlash, flashXp, bumpLocalXp],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
