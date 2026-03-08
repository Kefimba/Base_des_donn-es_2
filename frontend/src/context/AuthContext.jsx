import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1];
    const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(normalized));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = (payload) => {
    const rawToken = payload?.token || payload?.access_token || "";
    if (!rawToken) {
      throw new Error("Token de connexion manquant");
    }
    localStorage.setItem("token", rawToken);
    localStorage.setItem("user", JSON.stringify(payload));
    setToken(rawToken);
    setUser(payload);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const claims = token ? decodeJwtPayload(token) : null;

  const value = useMemo(
    () => ({ token, user, claims, isAuthenticated: Boolean(token), login, logout }),
    [token, user, claims]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
