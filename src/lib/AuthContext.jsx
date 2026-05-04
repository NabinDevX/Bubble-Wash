import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api, { setToken, clearToken, getToken } from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  // Verify existing token on mount
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api
      .get("/auth/user")
      .then((res) => setUser(res?.user ?? res))
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (phone, password, remember) => {
    const res = await api.post("/auth/signin", { phone, password });

    const token = res?.token ?? res?.accessToken;

    if (token) {
      if (remember) {
        localStorage.setItem("accessToken", token);
        sessionStorage.removeItem("accessToken");
      } else {
        sessionStorage.setItem("accessToken", token);
        localStorage.removeItem("accessToken");
      }
    }
    setUser(res?.user ?? res);

    return res;
  }, []);

  const signup = useCallback(async (name, phone, password) => {
    const res = await api.post("/auth/signup", { name, phone, password });
    const token = res?.token ?? res?.accessToken;
    if (token) setToken(token, remember);
    setUser(res?.user ?? res);
    return res;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
