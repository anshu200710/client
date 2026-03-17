/**
 * API Client Service
 * Handles all HTTP requests, token management, and error handling
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios";
import { API_ENDPOINTS, config } from "../environment";
import { ApiError, AuthResponse } from "../types";

class APIClient {
  private client: AxiosInstance;
  private refreshTokenUrl = API_ENDPOINTS.REFRESH_TOKEN;
  private isRefreshing = false;
  private failedQueue: Array<{
    onSuccess: (token: string) => void;
    onFailed: (error: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: config.API_BASE_URL,
      timeout: config.API_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (requestConfig) => {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }

        if (config.DEBUG ?? false) {
          console.log("🚀 API Request:", {
            url: requestConfig.url,
            method: requestConfig.method,
            data: requestConfig.data,
          });
        }

        return requestConfig;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        if (config.LOG_REQUESTS) {
          console.log("✅ API Response:", {
            url: response.config.url,
            status: response.status,
            data: response.data,
          });
        }
        return response;
      },
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as any;

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                onSuccess: (token: string) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  resolve(this.client(originalRequest));
                },
                onFailed: (err: any) => {
                  reject(err);
                },
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await AsyncStorage.getItem("refreshToken");
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            const response = await this.client.post<AuthResponse>(
              API_ENDPOINTS.REFRESH_TOKEN,
              { refreshToken },
            );

            const { accessToken, refreshToken: newRefreshToken } =
              response.data.data?.tokens || {};

            if (accessToken && newRefreshToken) {
              await AsyncStorage.setItem("accessToken", accessToken);
              await AsyncStorage.setItem("refreshToken", newRefreshToken);

              this.client.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;

              // Process queued requests
              this.failedQueue.forEach((req) => req.onSuccess(accessToken));
              this.failedQueue = [];

              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and reject
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("refreshToken");
            this.failedQueue.forEach((req) => req.onFailed(refreshError));
            this.failedQueue = [];

            // Optionally dispatch logout action or redirect to login
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Log errors if debug mode enabled
        if (config.DEBUG) {
          console.error("❌ API Error:", {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });
        }

        return Promise.reject(error);
      },
    );
  }

  /**
   * Generic GET request
   */
  async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(endpoint, config);
  }

  /**
   * Generic POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(endpoint, data, config);
  }

  /**
   * Generic PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(endpoint, data, config);
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(endpoint, data, config);
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(endpoint, config);
  }

  /**
   * Upload file (multipart)
   */
  async uploadFile<T>(
    endpoint: string,
    formData: FormData,
    onProgress?: (progress: number) => void,
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(progress);
        }
      },
    });
  }

  /**
   * Set authorization token manually
   */
  setAuthToken(token: string) {
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  /**
   * Clear authorization token
   */
  clearAuthToken() {
    delete this.client.defaults.headers.common.Authorization;
  }

  /**
   * Get axios instance for advanced usage
   */
  getInstance(): AxiosInstance {
    return this.client;
  }
}

export default new APIClient();
