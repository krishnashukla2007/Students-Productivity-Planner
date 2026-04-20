import { createContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("demo");
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const session = await authService.getSession();
        setUser(session.user);
        setAuthMode(session.mode);
        setAuthError("");
      } catch (error) {
        setAuthError(error.message || "Unable to restore your session.");
      } finally {
        setIsAuthReady(true);
      }
    };

    bootstrap();

    const unsubscribe = authService.onAuthStateChange((session) => {
      setUser(session.user);
      setAuthMode(session.mode);
    });

    return unsubscribe;
  }, []);

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    setUser(result.user);
    setAuthMode(result.mode);
    setAuthError("");
    return result;
  };

  const signup = async (credentials) => {
    const result = await authService.signup(credentials);
    setUser(result.user);
    setAuthMode(result.mode);
    setAuthError("");
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const updatedUser = await authService.updateProfile(updates);
    setUser(updatedUser);
    return updatedUser;
  };

  const value = useMemo(
    () => ({
      user,
      authMode,
      authError,
      isAuthReady,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      updateProfile,
    }),
    [authError, authMode, isAuthReady, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

