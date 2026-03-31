/**
 * Environment Configuration
 * Manages API endpoints and app configuration based on environment
 */

type Environment = "development" | "staging" | "production";

const ENV: Environment = "development"; // Change based on build environment

const ENV_CONFIG = {
  development: {
    API_BASE_URL: "http://192.168.0.19:4000/api", // Local development server
    API_TIMEOUT: 30000,
    DEBUG: true,
    LOG_REQUESTS: true,
  },
  staging: {
    API_BASE_URL: "https://staging-api.yourdomain.com/api",
    API_TIMEOUT: 30000,
    DEBUG: true,
    LOG_REQUESTS: false,
  },
  production: {
    API_BASE_URL: "https://api.yourdomain.com/api",
    API_TIMEOUT: 30000,
    DEBUG: false,
    LOG_REQUESTS: false,
  },
};

export const config = ENV_CONFIG[ENV];
export const environment = ENV;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  REFRESH_TOKEN: "/auth/refresh",
  LOGOUT: "/auth/logout",
  VERIFY_EMAIL: "/auth/verify-email",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // User endpoints
  GET_PROFILE: "/users/profile",
  UPDATE_PROFILE: "/users/profile",
  GET_USER_BY_ID: "/users/:id",

  // Admin endpoints
  GET_USERS: "/admin/users",
  GET_USER_DETAILS: "/admin/users/:id",
  UPDATE_USER: "/admin/users/:id",
  DELETE_USER: "/admin/users/:id",
  GET_DASHBOARD: "/admin/dashboard",
  GET_ANALYTICS: "/admin/analytics",

  // Tools endpoints
  CALCULATE_GST: "/tools/gst/calculate",
  CHECK_TRADEMARK: "/trademarks/check",
  GENERATE_INVOICE: "/tools/invoice/generate",
  GENERATE_CHALLAN: "/tools/challan/generate",

  // Service endpoints
  GET_SERVICES: "/services",
  GET_SERVICE_BY_ID: "/services/:id",
  CREATE_SERVICE: "/services",
  UPDATE_SERVICE: "/services/:id",
  DELETE_SERVICE: "/services/:id",

  // Notification endpoints
  GET_NOTIFICATIONS: "/notifications",
  MARK_AS_READ: "/notifications/:id/read",
  DELETE_NOTIFICATION: "/notifications/:id",
};

export default config;
