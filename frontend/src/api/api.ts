import axios from "axios";

/**
 * Gemensam nyckel för JWT-token i localStorage.
 * Används av både api.ts och AuthContext
 */
export const TOKEN_KEY = "auth_token";
/**
 * En gemensam axios-instans som används för alla API-anrop.
 * baseURL tas från .env (VITE_API_URL).
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5011",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor:
 * - Körs automatiskt innan varje request skickas.
 * - Hämtar token från localStorage och skickar den som Bearer token.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * RESPONSE INTERCEPTOR
 * Körs automatiskt när ett svar kommer tillbaka.
 * Om backend svarar 401 (Unauthorized):
 * rensar token
 * användaren är då utloggad
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }

    return Promise.reject(error);
  }
);
