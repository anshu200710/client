/**
 * Authentication Service
 * Handles all auth-related API calls
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "../environment";
import {
    AuthResponse,
    LoginRequest,
    PasswordResetRequest,
    ResetPasswordRequest,
    SignupRequest,
    UpdateProfileRequest,
    User,
} from "../types";
import apiClient from "./api-client";

class AuthService {
  /**
   * User login
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.LOGIN,
        credentials,
      );

      if (response.data.data?.tokens) {
        const { accessToken, refreshToken } = response.data.data.tokens;
        await this.saveTokens(accessToken, refreshToken);
        apiClient.setAuthToken(accessToken);
      }

      return response.data;
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * User signup
   */
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.SIGNUP,
        userData,
      );

      if (response.data.data?.tokens) {
        const { accessToken, refreshToken } = response.data.data.tokens;
        await this.saveTokens(accessToken, refreshToken);
        apiClient.setAuthToken(accessToken);
      }

      return response.data;
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * User logout
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint
      await apiClient.post(API_ENDPOINTS.LOGOUT, {});
    } catch (error) {
      console.warn("Logout endpoint error:", error);
    } finally {
      // Clear local tokens regardless of API response
      await this.clearTokens();
      apiClient.clearAuthToken();
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.REFRESH_TOKEN,
        { refreshToken },
      );

      if (response.data.data?.tokens) {
        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data.tokens;
        await this.saveTokens(accessToken, newRefreshToken);
        apiClient.setAuthToken(accessToken);
        return { accessToken, refreshToken: newRefreshToken };
      }

      throw new Error("Invalid refresh token response");
    } catch (error: any) {
      console.error("Token refresh error:", error);
      await this.clearTokens();
      throw error;
    }
  }

  /**
   * Verify email with verification code
   */
  async verifyEmail(email: string, verificationCode: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.VERIFY_EMAIL,
        { email, verificationCode },
      );

      if (response.data.data?.tokens) {
        const { accessToken, refreshToken } = response.data.data.tokens;
        await this.saveTokens(accessToken, refreshToken);
        apiClient.setAuthToken(accessToken);
      }

      return response.data;
    } catch (error: any) {
      console.error("Email verification error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Resend verification code
   */
  async resendVerificationCode(email: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.VERIFY_EMAIL.replace('verify-email', 'resend-verification-code'),
        { email },
      );
      return response.data;
    } catch (error: any) {
      console.error("Resend verification error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Forgot password request
   */
  async forgotPassword(data: PasswordResetRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.FORGOT_PASSWORD,
        data,
      );
      return response.data;
    } catch (error: any) {
      console.error("Forgot password error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.RESET_PASSWORD,
        data,
      );
      return response.data;
    } catch (error: any) {
      console.error("Reset password error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<User> {
    try {
      const response = await apiClient.get<{ data: User }>(
        API_ENDPOINTS.GET_PROFILE,
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Get profile error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    try {
      const response = await apiClient.put<{ data: User }>(
        API_ENDPOINTS.UPDATE_PROFILE,
        data,
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Update profile error:", error.response?.data);
      throw error;
    }
  }

  // ============ Token Management ============

  /**
   * Save tokens to AsyncStorage
   */
  private async saveTokens(
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem("accessToken", accessToken),
        AsyncStorage.setItem("refreshToken", refreshToken),
        AsyncStorage.setItem("tokenTimestamp", Date.now().toString()),
      ]);
    } catch (error) {
      console.error("Error saving tokens:", error);
      throw error;
    }
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem("accessToken");
    } catch (error) {
      console.error("Error retrieving access token:", error);
      return null;
    }
  }

  /**
   * Get refresh token
   */
  private async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem("refreshToken");
    } catch (error) {
      console.error("Error retrieving refresh token:", error);
      return null;
    }
  }

  /**
   * Clear all tokens
   */
  private async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem("accessToken"),
        AsyncStorage.removeItem("refreshToken"),
        AsyncStorage.removeItem("tokenTimestamp"),
      ]);
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }

  /**
   * Check if token is expiring soon (within 5 minutes)
   */
  async isTokenExpiring(): Promise<boolean> {
    try {
      const timestamp = await AsyncStorage.getItem("tokenTimestamp");
      if (!timestamp) return true;

      const elapsed = Date.now() - parseInt(timestamp);
      const fiveMinutes = 5 * 60 * 1000;

      // Assuming tokens are valid for 1 hour, refresh if < 5 minutes left
      return elapsed > 55 * 60 * 1000; // 55 minutes
    } catch (error) {
      return true;
    }
  }
}

export default new AuthService();
