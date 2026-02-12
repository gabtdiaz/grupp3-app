import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) {
      setToken(saved);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const isAuthenticated = !!token;

  const login = useCallback(async (data: LoginRequest) => {
    const res = await api.post<AuthResponse>("/api/auth/login", data);
    const newToken = res.data.token ?? res.data.Token;
    if (!newToken) throw new Error("Backend returnerade ingen token.");
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const register = useCallback(
    async (data: RegisterRequest) => {
      const res = await api.post<AuthResponse>("/api/auth/register", data);
      const newToken = res.data.token ?? res.data.Token;
      if (newToken) {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
        return;
      }
      await login({ email: data.email, password: data.password });
    },
    [login],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ token, isAuthenticated, isLoading, login, register, logout }),
    [token, isAuthenticated, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth måste användas inom <AuthProvider>.");
  }
  return ctx;
}
