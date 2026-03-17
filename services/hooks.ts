/**
 * Custom React Hooks for API and Auth
 * Provides reusable hooks for common patterns
 */

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    AnalyticsData,
    DashboardStats,
    Notification,
    UserProfile
} from "../types";
import {
    adminService,
    notificationsService,
    toolsService,
    usersService,
} from "./index";

// ============ Generic Data Fetching Hook ============

interface UseFetchOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options?: UseFetchOptions,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      options?.onSuccess?.(result);
    } catch (err: any) {
      setError(err);
      options?.onError?.(err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, dependencies);

  return { data, loading, error, execute, refetch: execute };
}

// ============ Notifications Hook ============

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const result = await notificationsService.getNotifications(1, 20);
      setNotifications(result.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationsService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, []);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await notificationsService.markAsRead(notificationId);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
        );
        if (unreadCount > 0) setUnreadCount(unreadCount - 1);
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    },
    [unreadCount],
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationsService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}

// ============ Admin Dashboard Hook ============

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboardData = useCallback(
    async (period: "daily" | "weekly" | "monthly" = "weekly") => {
      try {
        setLoading(true);
        setError(null);
        const [dashboardStats, analyticsData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAnalytics(period),
        ]);
        setStats(dashboardStats);
        setAnalytics(analyticsData);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { stats, analytics, loading, error, refetch: fetchDashboardData };
}

// ============ User Profile Hook ============

export function useUserProfile(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  const {
    data: profile,
    loading,
    error,
    execute: fetchProfile,
  } = useFetch<UserProfile>(
    () => usersService.getUserById(targetUserId!),
    [targetUserId],
    { onError: (err) => console.error("Profile fetch error:", err) },
  );

  return { profile, loading, error, refetch: fetchProfile };
}

// ============ GST Calculator Hook ============

export function useGSTCalculator(
  amount: number,
  gstRate: number,
  discount: number = 0,
) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculate = useCallback(async () => {
    if (!amount || !gstRate) return;

    try {
      setLoading(true);
      const localResult = toolsService.calculateGSTLocally(
        amount,
        gstRate,
        discount,
      );
      setResult(localResult);

      // Optional: Also fetch from API
      // const apiResult = await toolsService.calculateGST({
      //   amount,
      //   gstRate,
      //   discount,
      // });
    } catch (error) {
      console.error("GST calculation error:", error);
    } finally {
      setLoading(false);
    }
  }, [amount, gstRate, discount]);

  useEffect(() => {
    calculate();
  }, [amount, gstRate, discount]);

  return { result, loading, calculate };
}

// ============ Async Operation Hook ============

interface UseAsyncOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  options?: UseAsyncOptions,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await asyncFunction();
      setData(response);
      options?.onSuccess?.(response);
      return response;
    } catch (error: any) {
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { data, loading, error, execute };
}

// ============ Pagination Hook ============

export function usePagination<T>(
  fetchFunction: (page: number, limit: number) => Promise<any>,
  limit = 20,
) {
  const [items, setItems] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const result = await fetchFunction(page, limit);
        setItems(result.data);
        setCurrentPage(result.pagination?.currentPage || page);
        setTotalPages(result.pagination?.totalPages || 0);
      } catch (error) {
        console.error("Pagination fetch error:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, limit],
  );

  const goToPage = useCallback(
    (page: number) => {
      fetch(page);
    },
    [fetch],
  );

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  useEffect(() => {
    fetch(1);
  }, []);

  return {
    items,
    currentPage,
    totalPages,
    loading,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

// ============ Debounce Hook ============

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// ============ Local Storage Hook ============

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        // In a real app, store to AsyncStorage
        // await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error("Error setting local storage:", error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
}
