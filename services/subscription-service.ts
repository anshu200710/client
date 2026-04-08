import axios from "axios";
import { config as ENV_CONFIG } from "@/environment";

// Get API base URL from environment
const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

/**
 * Subscription Service
 * Handles all subscription-related API calls
 */

// ═══════════════════════════════════════════════════════════════════════════
// USER SUBSCRIPTION APIs
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get all available subscription plans
 * @returns {Promise} Array of subscription plans
 */
export const getAllSubscriptions = async () => {
  try {
    const response = await apiClient.get("/subscription");
    return response.data;
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    throw error;
  }
};

/**
 * Get specific subscription by ID
 * @param {string} subscriptionId - Subscription ID
 * @returns {Promise} Subscription details
 */
export const getSubscriptionById = async (subscriptionId: string) => {
  try {
    const response = await apiClient.get(`/subscription/${subscriptionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    throw error;
  }
};

/**
 * Get user's current subscription status
 * @param {string} token - Auth token
 * @returns {Promise} User's subscription details
 */
export const getUserSubscriptionStatus = async (token: string) => {
  try {
    const response = await apiClient.get("/subscription/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    throw error;
  }
};

/**
 * Initiate subscription purchase (create Razorpay order)
 * @param {string} subscriptionId - Subscription ID to purchase
 * @param {string} token - Auth token
 * @returns {Promise} Order data for Razorpay
 */
export const initiatePurchase = async (
  subscriptionId: string,
  token: string
) => {
  try {
    const response = await apiClient.post(
      "/subscription/initiate-purchase",
      { subscriptionId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error initiating purchase:", error);
    throw error;
  }
};

/**
 * Verify payment and create subscription
 * @param {Object} paymentData - Payment verification data
 * @param {string} token - Auth token
 * @returns {Promise} Created subscription details
 */
export const verifyPaymentAndCreateSubscription = async (
  paymentData: {
    subscriptionId: string;
    paymentId: string;
    orderId: string;
    signature: string;
  },
  token: string
) => {
  try {
    const response = await apiClient.post(
      "/subscription/verify-payment",
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};

/**
 * Cancel active subscription
 * @param {string} reason - Cancellation reason
 * @param {string} token - Auth token
 * @returns {Promise} Cancelled subscription details
 */
export const cancelSubscription = async (reason: string, token: string) => {
  try {
    const response = await apiClient.post(
      "/subscription/cancel",
      { reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    throw error;
  }
};

/**
 * Get subscription purchase history
 * @param {string} token - Auth token
 * @returns {Promise} Array of subscription purchases
 */
export const getSubscriptionHistory = async (token: string) => {
  try {
    const response = await apiClient.get("/subscription/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching subscription history:", error);
    throw error;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN SUBSCRIPTION APIs
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create new subscription plan (Admin only)
 * @param {Object} subscriptionData - Subscription details
 * @param {string} token - Auth token
 * @returns {Promise} Created subscription
 */
export const createSubscription = async (
  subscriptionData: {
    name: string;
    price: number;
    interval: "monthly" | "yearly";
    durationInDays: number;
    description?: string;
    features?: string[];
    benefits?: string[];
    badge?: string;
  },
  token: string
) => {
  try {
    const response = await apiClient.post("/admin/subscription", subscriptionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

/**
 * Get all subscriptions (Admin view)
 * @param {string} token - Auth token
 * @returns {Promise} Array of all subscriptions
 */
export const getAllSubscriptionsAdmin = async (token: string) => {
  try {
    const response = await apiClient.get("/admin/subscription", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching subscriptions (admin):", error);
    throw error;
  }
};

/**
 * Update subscription plan (Admin only)
 * @param {string} subscriptionId - Subscription ID
 * @param {Object} updateData - Data to update
 * @param {string} token - Auth token
 * @returns {Promise} Updated subscription
 */
export const updateSubscription = async (
  subscriptionId: string,
  updateData: {
    price?: number;
    description?: string;
    features?: string[];
    benefits?: string[];
    badge?: string;
    isActive?: boolean;
  },
  token: string
) => {
  try {
    const response = await apiClient.patch(
      `/admin/subscription/${subscriptionId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }
};

/**
 * Toggle subscription active status (Admin only)
 * @param {string} subscriptionId - Subscription ID
 * @param {string} token - Auth token
 * @returns {Promise} Updated subscription
 */
export const toggleSubscriptionStatus = async (
  subscriptionId: string,
  token: string
) => {
  try {
    const response = await apiClient.patch(
      `/admin/subscription/${subscriptionId}/toggle`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling subscription status:", error);
    throw error;
  }
};

/**
 * Get subscription statistics (Admin only)
 * @param {string} token - Auth token
 * @returns {Promise} Subscription statistics
 */
export const getSubscriptionStats = async (token: string) => {
  try {
    const response = await apiClient.get("/admin/subscription/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching subscription stats:", error);
    throw error;
  }
};

/**
 * Set authorization token for all requests
 * @param {string} token - Auth token
 */
export const setAuthToken = (token: string) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

/**
 * Export axios instance for custom requests
 */
export default apiClient;
