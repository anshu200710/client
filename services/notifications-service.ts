/**
 * Notifications Service
 * Handles notification-related API calls
 */

import { API_ENDPOINTS } from "../environment";
import { Notification, NotificationResponse } from "../types";
import apiClient from "./api-client";

class NotificationsService {
  /**
   * Get all notifications
   */
  async getNotifications(page = 1, limit = 20): Promise<NotificationResponse> {
    try {
      const response = await apiClient.get<NotificationResponse>(
        API_ENDPOINTS.GET_NOTIFICATIONS,
        { params: { page, limit } },
      );
      return response.data;
    } catch (error: any) {
      console.error("Get notifications error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const endpoint = API_ENDPOINTS.MARK_AS_READ.replace(
        ":id",
        notificationId,
      );
      const response = await apiClient.patch<{ data: Notification }>(
        endpoint,
        {},
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Mark as read error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const endpoint = API_ENDPOINTS.DELETE_NOTIFICATION.replace(
        ":id",
        notificationId,
      );
      await apiClient.delete(endpoint);
    } catch (error: any) {
      console.error("Delete notification error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.post(
        API_ENDPOINTS.GET_NOTIFICATIONS + "/mark-all-read",
        {},
      );
    } catch (error: any) {
      console.error("Mark all as read error:", error.response?.data);
      throw error;
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get<{ count: number }>(
        API_ENDPOINTS.GET_NOTIFICATIONS + "/unread-count",
      );
      return response.data.count;
    } catch (error: any) {
      console.error("Get unread count error:", error.response?.data);
      return 0;
    }
  }
}

export default new NotificationsService();
