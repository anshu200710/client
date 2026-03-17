/**
 * Users Service
 * Handles user-related API calls
 */

import { API_ENDPOINTS } from "../environment";
import { PaginatedResponse, User, UserProfile } from "../types";
import apiClient from "./api-client";

class UsersService {
  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User> {
    try {
      const endpoint = API_ENDPOINTS.GET_USER_BY_ID.replace(":id", userId);
      const response = await apiClient.get<{ data: User }>(endpoint);
      return response.data.data;
    } catch (error: any) {
      console.error("Get user error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Get all users (admin)
   */
  async getAllUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    try {
      const response = await apiClient.get<PaginatedResponse<User>>(
        API_ENDPOINTS.GET_USERS,
        { params: { page, limit } },
      );
      return response.data;
    } catch (error: any) {
      console.error("Get users error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Update user (admin)
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
   * Delete user (admin)
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      const endpoint = API_ENDPOINTS.DELETE_USER.replace(":id", userId);
      await apiClient.delete(endpoint);
    } catch (error: any) {
      console.error("Delete user error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Get user details (admin)
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
}

export default new UsersService();
