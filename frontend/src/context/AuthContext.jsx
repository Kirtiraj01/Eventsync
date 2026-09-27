import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, getMe } from "../api/clubhub";

const AuthContext = createContext(null);
const STORAGE_KEY = "clubhub_session";

function readStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession());
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  // Rehydrate & validate session with backend on mount
  useEffect(() => {
    if (!session?.token) return;
    let cancelled = false;
    getMe(session.token)
      .then((meData) => {
        if (!cancelled && meData) {
          setSession((prev) => ({
            ...prev,
            clubId: meData.clubId || prev.clubId,
            clubSlug: meData.clubSlug || prev.clubSlug,
            clubName: meData.clubName || prev.clubName,
          }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          // Token expired or invalid — clear session
          setSession(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [session?.token]);

  const login = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const data = await apiLogin(email, password);
      // data: { token, clubId, clubSlug, clubName }
      setSession(data);
      return data;
    } catch (err) {
      setAuthError(err.message || "Login failed");
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => setSession(null);

  const value = {
    isLoggedIn: Boolean(session?.token),
    token: session?.token || null,
    clubId: session?.clubId || null,
    clubSlug: session?.clubSlug || null,
    clubName: session?.clubName || "Your club",
    authError,
    authLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
