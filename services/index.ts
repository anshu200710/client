/**
 * Services Index
 * Export all services from a single file for easier imports
 */

export { default as adminService } from "./admin-service";
export { default as apiClient } from "./api-client";
export { default as authService } from "./auth-service";
export { default as notificationsService } from "./notifications-service";
export { default as toolsService } from "./tools-service";
export { default as usersService } from "./users-service";

// Types
export { API_ENDPOINTS, config } from "../environment";
export type * from "../types";

