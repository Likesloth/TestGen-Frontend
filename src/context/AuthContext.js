// src/context/AuthContext.js
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // hydrate from storage
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username') || '';
      setIsLoggedIn(!!token && !!username);
      setUser(username || '');
    } catch (_) {
      setIsLoggedIn(false);
      setUser('');
    }
  }, []);

  const login = useCallback((username, token) => {
    try {
      if (token) localStorage.setItem('token', token);
      if (username) localStorage.setItem('username', username);
    } catch (_) {
      // ignore storage errors
    }
    setUser(username || '');
    setIsLoggedIn(!!token && !!username);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    } catch (_) {
      // ignore storage errors
    }
    setUser('');
    setIsLoggedIn(false);
  }, []);

  const value = useMemo(() => ({ user, isLoggedIn, login, logout }), [user, isLoggedIn, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

