import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "admin_ssb" | "coach" | "parent" | "admin_eo";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  register: (name: string, email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("fg-user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email: string, _password: string, role: UserRole) => {
    const mockUser: User = {
      id: "usr_" + Math.random().toString(36).slice(2, 9),
      name: email.split("@")[0],
      email,
      role,
    };
    setUser(mockUser);
    localStorage.setItem("fg-user", JSON.stringify(mockUser));
  }, []);

  const register = useCallback((name: string, email: string, _password: string, role: UserRole) => {
    const mockUser: User = { id: "usr_" + Math.random().toString(36).slice(2, 9), name, email, role };
    setUser(mockUser);
    localStorage.setItem("fg-user", JSON.stringify(mockUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("fg-user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
