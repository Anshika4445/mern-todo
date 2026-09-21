import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem("token")) return setLoading(false);
    api
      .get("/auth/me")
      .then((r) => setUser(r.data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);
  const login = async (data) => {
    const r = await api.post("/auth/login", data);
    localStorage.setItem("token", r.data.token);
    setUser(r.data.user);
  };
  const register = async (data) => {
    const r = await api.post("/auth/register", data);
    localStorage.setItem("token", r.data.token);
    setUser(r.data.user);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
