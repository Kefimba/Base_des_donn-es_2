import axios from "axios";

const runtimeApiBase =
  typeof window !== "undefined" ? window.__API_BASE__ : undefined;

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE ||
    runtimeApiBase ||
    "http://127.0.0.1:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
