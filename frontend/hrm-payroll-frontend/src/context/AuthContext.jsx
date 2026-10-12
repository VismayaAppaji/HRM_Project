import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (loginData) => {
    localStorage.setItem("token", loginData.token);

    const userData = {
      username: loginData.username,
      role: loginData.role,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    // Store role separately because App.jsx uses it for role-based routing
    localStorage.setItem("role", loginData.role);

    // Store username separately if needed by employee pages
    localStorage.setItem("username", loginData.username);

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);