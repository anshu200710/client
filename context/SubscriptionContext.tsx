import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import * as subscriptionService from "@/services/subscription-service";

export interface Subscription {
  _id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  durationInDays: number;
  description: string;
  features: string[];
  benefits: string[];
  badge: string;
  savingsPercentage: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  _id: string;
  subscriptionId: string;
  status: "active" | "cancelled" | "expired" | "pending";
  startDate: string;
  endDate: string;
  paymentId: string;
  orderId: string;
  amount: number;
  autoRenew: boolean;
  daysRemaining: number;
}

export interface SubscriptionContextType {
  // Subscriptions
  subscriptions: Subscription[];
  loadingSubscriptions: boolean;
  // User Subscription State
  userSubscription: UserSubscription | null;
  userSubscriptionLoading: boolean;
  hasActiveSubscription: boolean;
  subscriptionTier: "free" | "monthly" | "yearly";
  canAccessTemplates: boolean;
  // Functions
  fetchAllSubscriptions: () => Promise<void>;
  fetchUserSubscriptionStatus: () => Promise<void>;
  initiatePurchase: (subscriptionId: string) => Promise<any>;
  verifyPayment: (paymentData: any) => Promise<any>;
  cancelSubscription: (reason: string) => Promise<void>;
  fetchSubscriptionHistory: () => Promise<any>;
  refreshSubscriptionStatus: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token } = useAuth();

  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);

  // User subscription state
  const [userSubscription, setUserSubscription] =
    useState<UserSubscription | null>(null);
  const [userSubscriptionLoading, setUserSubscriptionLoading] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<
    "free" | "monthly" | "yearly"
  >("free");
  const canAccessTemplates = hasActiveSubscription && subscriptionTier !== "free";

  /**
   * Fetch all available subscription plans
   */
  const fetchAllSubscriptions = async () => {
    try {
      setLoadingSubscriptions(true);
      const response = await subscriptionService.getAllSubscriptions();
      if (response.success && response.data) {
        setSubscriptions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setLoadingSubscriptions(false);
    }
  };

  /**
   * Fetch user's current subscription status
   */
  const fetchUserSubscriptionStatus = async () => {
    if (!user || !token) return;

    try {
      setUserSubscriptionLoading(true);
      const response = await subscriptionService.getUserSubscriptionStatus(
        token
      );

      if (response.success) {
        setHasActiveSubscription(response.hasActiveSubscription);
        setSubscriptionTier(response.subscriptionTier || "free");

        if (response.data) {
          setUserSubscription(response.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
      setHasActiveSubscription(false);
      setSubscriptionTier("free");
    } finally {
      setUserSubscriptionLoading(false);
    }
  };

  /**
   * Initiate subscription purchase
   */
  const initiatePurchase = async (subscriptionId: string) => {
    if (!token) throw new Error("Not authenticated");

    try {
      const response = await subscriptionService.initiatePurchase(
        subscriptionId,
        token
      );
      return response.data;
    } catch (error) {
      console.error("Failed to initiate purchase:", error);
      throw error;
    }
  };

  /**
   * Verify payment and create subscription
   */
  const verifyPayment = async (paymentData: any) => {
    if (!token) throw new Error("Not authenticated");

    try {
      const response = await subscriptionService.verifyPaymentAndCreateSubscription(
        paymentData,
        token
      );

      if (response.success) {
        // Refresh subscription status after successful payment
        await fetchUserSubscriptionStatus();
      }

      return response.data;
    } catch (error) {
      console.error("Failed to verify payment:", error);
      throw error;
    }
  };

  /**
   * Cancel active subscription
   */
  const cancelSubscription = async (reason: string) => {
    if (!token) throw new Error("Not authenticated");

    try {
      const response = await subscriptionService.cancelSubscription(
        reason,
        token
      );

      if (response.success) {
        // Update state
        setUserSubscription(null);
        setHasActiveSubscription(false);
        setSubscriptionTier("free");
      }
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      throw error;
    }
  };

  /**
   * Fetch subscription purchase history
   */
  const fetchSubscriptionHistory = async () => {
    if (!token) throw new Error("Not authenticated");

    try {
      const response = await subscriptionService.getSubscriptionHistory(token);
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch subscription history:", error);
      throw error;
    }
  };

  /**
   * Refresh subscription status
   */
  const refreshSubscriptionStatus = async () => {
    await fetchUserSubscriptionStatus();
  };

  /**
   * Load initial data
   */
  useEffect(() => {
    fetchAllSubscriptions();
  }, []);

  /**
   * Load user subscription status when user logs in
   */
  useEffect(() => {
    if (user && token) {
      fetchUserSubscriptionStatus();
    }
  }, [user, token]);

  const value: SubscriptionContextType = {
    subscriptions,
    loadingSubscriptions,
    userSubscription,
    userSubscriptionLoading,
    hasActiveSubscription,
    subscriptionTier,
    fetchAllSubscriptions,
    fetchUserSubscriptionStatus,
    initiatePurchase,
    verifyPayment,
    cancelSubscription,
    fetchSubscriptionHistory,
    refreshSubscriptionStatus,
    canAccessTemplates,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

/**
 * Hook to use subscription context
 */
export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};
