/**
 * AuthContext — manages JWT session state.
 * Stores token + user info in localStorage.
 * Exposes: user, token, isAuthenticated, login(), logout().
 */
import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  return Date.now() / 1000 > payload.exp;
}

function loadSession() {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user && !isTokenExpired(token)) {
      return { token, user };
    }
    // Clear stale session
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return { token: null, user: null };
}

export function AuthProvider({ children }) {
  const [{ token, user }, setSession] = useState(loadSession);

  const login = useCallback((accessToken, userInfo) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setSession({ token: accessToken, user: userInfo });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setSession({ token: null, user: null });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
