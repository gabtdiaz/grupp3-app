import axios from "axios";

/**
 * En gemensam axios-instans som används för alla API-anrop.
 * baseURL tas från .env (VITE_API_URL).
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
