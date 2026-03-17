/**
 * Admin Service
 * Handles admin-specific API calls and dashboard operations
 */

import { API_ENDPOINTS } from "../environment";
import {
    AnalyticsData,
    DashboardStats,
    PaginatedResponse,
    User,
    UserProfile,
} from "../types";
import apiClient from "./api-client";

class AdminService {
  /**
   * Get admin dashboard stats
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<{ data: DashboardStats }>(
        API_ENDPOINTS.GET_DASHBOARD,
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Dashboard stats error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Get analytics data
   */
  async getAnalytics(
    period: "daily" | "weekly" | "monthly" = "weekly",
  ): Promise<AnalyticsData> {
    try {
      const response = await apiClient.get<{ data: AnalyticsData }>(
        API_ENDPOINTS.GET_ANALYTICS,
        { params: { period } },
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Analytics error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<PaginatedResponse<User>> {
    try {
      const response = await apiClient.get<{ data: PaginatedResponse<User> }>(
        API_ENDPOINTS.GET_USERS,
        { params: { page, limit, search } },
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Get all users error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Get user details
   */
  async getUserDetails(userId: string): Promise<UserProfile> {
    try {
      const endpoint = API_ENDPOINTS.GET_USER_DETAILS.replace(":id", userId);
      const response = await apiClient.get<{ data: UserProfile }>(endpoint);
      return response.data.data;
    } catch (error: any) {
      console.error("Get user details error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(userId: string, data: any): Promise<User> {
    try {
      const endpoint = API_ENDPOINTS.UPDATE_USER.replace(":id", userId);
      const response = await apiClient.put<{ data: User }>(endpoint, data);
      return response.data.data;
    } catch (error: any) {
      console.error("Update user error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string, reason?: string): Promise<void> {
    try {
      const endpoint = API_ENDPOINTS.DELETE_USER.replace(":id", userId);
      await apiClient.delete(endpoint, {
        data: { reason },
      });
    } catch (error: any) {
      console.error("Delete user error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Ban user
   */
  async banUser(userId: string, reason: string): Promise<User> {
    try {
      const endpoint = API_ENDPOINTS.UPDATE_USER.replace(":id", userId);
      const response = await apiClient.put<{ data: User }>(endpoint, {
        status: "banned",
        banReason: reason,
      });
      return response.data.data;
    } catch (error: any) {
      console.error("Ban user error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Unban user
   */
  async unbanUser(userId: string): Promise<User> {
    try {
      const endpoint = API_ENDPOINTS.UPDATE_USER.replace(":id", userId);
      const response = await apiClient.put<{ data: User }>(endpoint, {
        status: "active",
        banReason: null,
      });
      return response.data.data;
    } catch (error: any) {
      console.error("Unban user error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Export users as CSV
   */
  async exportUsers(): Promise<Blob> {
    try {
      const response = await apiClient.get<Blob>(
        API_ENDPOINTS.GET_USERS + "/export",
        {
          responseType: "blob",
        },
      );
      return response.data;
    } catch (error: any) {
      console.error("Export users error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Get system logs
   */
  async getSystemLogs(page = 1, limit = 50): Promise<any> {
    try {
      const response = await apiClient.get<{ data: any }>("/admin/logs", {
        params: { page, limit },
      });
      return response.data.data;
    } catch (error: any) {
      console.error("Get logs error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Send announcement
   */
  async sendAnnouncement(data: {
    title: string;
    message: string;
    type: "info" | "warning" | "success" | "error";
  }): Promise<any> {
    try {
      const response = await apiClient.post<{ data: any }>(
        "/admin/announcements",
        data,
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Send announcement error:", error.response?.data);
      throw error;
    }
  }
}

export default new AdminService();
