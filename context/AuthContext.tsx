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
  const [error, setError] = useState<string | null>(null);
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
      setError(null);

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
          setError("Session expired. Please login again.");
        }
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      setUser(null);
      setAuthenticated(false);
      setError("Failed to initialize authentication");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user with email and password
   */
  const login = async (email: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login({ email, password });

      if (response.data?.user) {
        setUser(response.data.user);
        setAuthenticated(true);
        setTokens({
          accessToken: response.data?.tokens?.accessToken || null,
          refreshToken: response.data?.tokens?.refreshToken || null,
        });
        return response.data.user;
      }
      throw new Error("Invalid login response");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Login failed";
      setError(errorMessage);
      console.error("Login failed:", error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signup user with account details
   */
  const signup = async (data: SignupRequest): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.signup(data);

      if (response.data?.user) {
        setUser(response.data.user);
        // Don't set authenticated yet until email is verified
        setTokens({
          accessToken: response.data?.tokens?.accessToken || null,
          refreshToken: response.data?.tokens?.refreshToken || null,
        });
        return response.data.user;
      }
      throw new Error("Invalid signup response");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Signup failed";
      setError(errorMessage);
      console.error("Signup failed:", error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify email with verification code
   */
  const verifyEmail = async (email: string, verificationCode: string): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.verifyEmail(email, verificationCode);

      if (response.data?.user) {
        setUser(response.data.user);
        setAuthenticated(true);
        setTokens({
          accessToken: response.data?.tokens?.accessToken || null,
          refreshToken: response.data?.tokens?.refreshToken || null,
        });
        return response.data.user;
      }
      throw new Error("Invalid email verification response");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Email verification failed";
      setError(errorMessage);
      console.error("Email verification failed:", error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resend verification code
   */
  const resendVerificationCode = async (email: string): Promise<void> => {
    try {
      setError(null);
      await authService.resendVerificationCode(email);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to resend verification code";
      setError(errorMessage);
      console.error("Resend verification code failed:", error);
      throw new Error(errorMessage);
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await authService.logout();
      setUser(null);
      setAuthenticated(false);
      setTokens({
        accessToken: null,
        refreshToken: null,
      });
    } catch (error: any) {
      console.error("Logout failed:", error);
      // Still clear local state even if logout fails
      setUser(null);
      setAuthenticated(false);
      setTokens({
        accessToken: null,
        refreshToken: null,
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh tokens
   */
  const refreshTokens = async (): Promise<void> => {
    try {
      setError(null);
      const result = await authService.refreshToken();
      setTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error: any) {
      console.error("Token refresh failed:", error);
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Profile update failed";
      setError(errorMessage);
      console.error("Profile update failed:", error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error message
   */
  const clearError = (): void => {
    setError(null);
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
    error,
    tokens,
    login,
    signup,
    verifyEmail,
    resendVerificationCode,
    logout,
    refreshTokens,
    updateProfile,
    clearError,
    initializeAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use AuthContext
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
