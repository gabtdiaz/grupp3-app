import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, TOKEN_KEY } from "../api/api";


type LoginRequest = {
  email: string;
  password: string;
};

type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: number;
  city: string;
};

type AuthResponse = {
   token?: string;
  Token?: string;
};

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;

  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  /**
   * När appen startar:
   * läs token från localStorage
   * om den finns -> användaren räknas som inloggad
   */
  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) setToken(saved);
  }, []);

  const isAuthenticated = !!token;

  /**
   * Login:
   * skickar POST till backend
   * får JWT-token tillbaka
   * sparar token lokalt + i state
   */
  async function login(data: LoginRequest) {
  const res = await api.post<AuthResponse>("/api/auth/login", data);

  const newToken = res.data.token ?? res.data.Token;
  if (!newToken) throw new Error("Backend returnerade ingen token.");

  localStorage.setItem(TOKEN_KEY, newToken);
  setToken(newToken);
}


  /**
   * Register:
   * skapar användaren i backend
   * loggar in direkt efteråt 
   */
  async function register(data: RegisterRequest) {
  const res = await api.post<AuthResponse>("/api/auth/register", data);

  const newToken = res.data.token ?? res.data.Token;

  // Om register returnerar token, spara direkt:
  if (newToken) {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    return;
  }

  // annars fallback: logga in efter register
  await login({ email: data.email, password: data.password });
}

  /**
   * Logout:
   *  tar bort token överallt
   */
  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  const value = useMemo(
    () => ({ token, isAuthenticated, login, register, logout }),
    [token, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth():
 *  enkel hook för att läsa auth-state och anropa login/register/logout
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth måste användas inom <AuthProvider>.");
  }
  return ctx;
}
