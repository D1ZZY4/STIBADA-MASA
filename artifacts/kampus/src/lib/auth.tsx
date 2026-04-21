import { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "@workspace/api-client-react";

type AuthContextType = {
  user: User | null;
  login: (user: User, token?: string) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("kampus_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage");
        localStorage.removeItem("kampus_user");
      }
    }
    setIsLoading(false);

    const handler = (e: StorageEvent) => {
      if (e.key === "kampus_user") {
        if (e.newValue) {
          try { setUser(JSON.parse(e.newValue)); } catch { setUser(null); }
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const login = (userData: User, token?: string) => {
    setUser(userData);
    localStorage.setItem("kampus_user", JSON.stringify(userData));
    if (token) localStorage.setItem("kampus_token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("kampus_user");
    localStorage.removeItem("kampus_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
