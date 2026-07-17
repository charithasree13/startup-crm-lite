/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * @typedef {Object} User
 * @property {string} id - Database user ID.
 * @property {string} name - User full display name.
 * @property {string} username - User login handle.
 * @property {string} email - Email address.
 * @property {string} mobile - Contact number.
 * @property {string} role - Access level ('admin' or 'user').
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {User|null} user - Current logged-in user profile.
 * @property {string|null} token - JWT authentication token.
 * @property {boolean} isLoading - True if restoring session or making reqs.
 * @property {boolean} loading - Alias to isLoading for compatibility.
 * @property {function(string, string): Promise<User>} login - Log in using email and password.
 * @property {function(string, string, string): Promise<User>} register - Register a new account.
 * @property {function(): void} logout - Destroy the current session.
 */

export const AuthContext = createContext(undefined);

/**
 * AuthProvider component that wraps the application.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('crm-token');
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Restore session ONCE on mount — reads token from localStorage directly
  // so we do not re-trigger on every login/logout token state change.
  useEffect(() => {
    const checkSession = async () => {
      const storedToken = localStorage.getItem('crm-token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.getProfile();
        if (response.success && response.data) {
          setUser(response.data);
          setToken(storedToken);
        } else {
          localStorage.removeItem('crm-token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Session restore failed:', err);
        localStorage.removeItem('crm-token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []); // Run once on mount only

  /**
   * Log in user
   */
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem('crm-token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register a new admin
   */
  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await authService.register(name, email, password);
      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem('crm-token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Log out current user
   */
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const value = {
    user,
    token,
    loading: isLoading, // Alias for backward compatibility
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to consume AuthContext.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth() must be used within an <AuthProvider>');
  }
  return context;
}
