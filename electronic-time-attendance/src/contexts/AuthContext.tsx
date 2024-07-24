import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  userId: number | null;
  token: string | null;
  name: string | null;
  login: (userId: number, token: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUserId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("name");

    if (storedToken && storedUserId && storedName) {
      setToken(storedToken);
      setUserId(Number(storedUserId));
      setName(storedName);
    }
  }, []);

  const login = (userId: number, token: string, name: string) => {
    setUserId(userId);
    setToken(token);
    setName(name);
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", userId.toString());
    localStorage.setItem("name", name);
  };

  const logout = () => {
    setUserId(null);
    setToken(null);
    setName(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
  };

  return (
    <AuthContext.Provider value={{ userId, token, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
