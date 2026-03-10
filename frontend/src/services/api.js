import axios from "axios";

const runtimeApiBase =
  typeof window !== "undefined" ? window.__API_BASE__ : undefined;

const normalizeApiBase = (value) => {
  if (!value) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
};

const api = axios.create({
  baseURL:
    normalizeApiBase(import.meta.env.VITE_API_BASE) ||
    normalizeApiBase(runtimeApiBase) ||
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
