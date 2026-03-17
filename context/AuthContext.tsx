/**
 * Authentication Context Provider
 * Manages global authentication state for the entire application
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/auth-service";
import {
    AuthContextType,
    SignupRequest,
    UpdateProfileRequest,
    User,
} from "../types";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [tokens, setTokens] = useState({
    accessToken: null as string | null,
    refreshToken: null as string | null,
  });

  /**
   * Initialize auth state on app startup
   */
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize authentication state
   */
  const initializeAuth = async () => {
    try {
      setLoading(true);

      // Check if tokens exist
      const accessToken = await authService.getAccessToken();

      if (accessToken) {
        // Tokens exist, try to fetch user profile
        try {
          const profile = await authService.getUserProfile();
          setUser(profile as User);
          setAuthenticated(true);
          setTokens({
            accessToken,
            refreshToken: await AsyncStorage.getItem("refreshToken"),
          });

          // Check if token is expiring soon
          if (await authService.isTokenExpiring()) {
            await authService.refreshToken();
          }
        } catch (error) {
          console.warn("Failed to fetch user profile:", error);
          // Tokens might be invalid, clear them
          await authService.logout();
          setUser(null);
          setAuthenticated(false);
        }
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });

      if (response.data?.user) {
        setUser(response.data.user);
        setAuthenticated(true);
        setTokens({
          accessToken: response.data?.tokens?.accessToken || null,
          refreshToken: response.data?.tokens?.refreshToken || null,
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signup user
   */
  const signup = async (data: SignupRequest) => {
    try {
      setLoading(true);
      const response = await authService.signup(data);

      if (response.data?.user) {
        setUser(response.data.user);
        setAuthenticated(true);
        setTokens({
          accessToken: response.data?.tokens?.accessToken || null,
          refreshToken: response.data?.tokens?.refreshToken || null,
        });
      }
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setAuthenticated(false);
      setTokens({
        accessToken: null,
        refreshToken: null,
      });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh tokens
   */
  const refreshTokens = async () => {
    try {
      const result = await authService.refreshToken();
      setTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error) {
      console.error("Token refresh failed:", error);
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if user is admin
   */
  const isAdmin =
    user?.accountType === "admin" || user?.accountType === "lawyer";

  const value: AuthContextType = {
    user,
    isAdmin,
    loading,
    authenticated,
    tokens,
    login,
    signup,
    logout,
    refreshTokens,
    updateProfile,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use Auth Context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = (): boolean => {
  const { authenticated, loading } = useAuth();
  return authenticated && !loading;
};

/**
 * Hook to check if user is admin
 */
export const useIsAdmin = (): boolean => {
  const { isAdmin, loading } = useAuth();
  return isAdmin && !loading;
};
