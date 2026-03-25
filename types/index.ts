/**
 * TypeScript Types and Interfaces
 * Defines all data structures used across the application
 */

// ============ Auth Types ============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: "individual" | "business" | "lawyer" | "admin";
  phoneNumber: string;
  businessName?: string;
  gstNumber?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  error?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// ============ User Types ============
export interface User {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  accountType: "individual" | "business" | "lawyer" | "admin";
  businessName?: string;
  role?: "user" | "admin";
  isEmailVerified?: boolean;
  profilePicture?: string;
  profile?: {
    phone?: string;
    address?: string;
    isCompany?: boolean;
    companyName?: string;
    gstNumber?: string;
    businessType?: string;
  };
  documents?: {
    panCard?: {
      fileUrl?: string;
      uploadedAt?: string;
      verified?: boolean;
    };
    aadhaarCard?: {
      front?: {
        fileUrl?: string;
        uploadedAt?: string;
      };
      back?: {
        fileUrl?: string;
        uploadedAt?: string;
      };
      verified?: boolean;
    };
    gstCertificate?: {
      fileUrl?: string;
      uploadedAt?: string;
      verified?: boolean;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  businessName?: string;
  profile?: {
    address?: string;
    gstNumber?: string;
    businessType?: string;
  };
}

// ============ Service Types ============
export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  userId: string;
  tags: string[];
  image?: string;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  title: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  tags: string[];
  image?: string;
}

// ============ Notification Types ============
export interface Notification {
  id: string;
  userId: string;
  type: "service_request" | "payment" | "message" | "system";
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export interface NotificationResponse {
  success: boolean;
  data: Notification[];
  total: number;
}

// ============ Tools API Types ============
export interface GSTCalculationRequest {
  amount: number;
  gstRate: number;
  discount?: number;
}

export interface GSTCalculationResponse {
  baseAmount: number;
  gstAmount: number;
  discountAmount: number;
  totalAmount: number;
  breakdown: {
    sgst: number;
    cgst: number;
    igst?: number;
  };
}

export interface TrademarkCheckRequest {
  trademark: string;
  country?: string;
  classes?: number[];
}

export interface TrademarkCheckResponse {
  trademark: string;
  available: boolean;
  results: {
    id: string;
    name: string;
    owner: string;
    status: "registered" | "pending" | "available";
    class: string;
    registrationDate?: string;
  }[];
  suggestions?: string[];
}

// ============ Invoice Types ============
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface CreateInvoiceRequest {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  items: InvoiceItem[];
  gstRate: number;
  notes?: string;
  dueDate?: string;
}

export interface InvoiceResponse {
  success: boolean;
  message: string;
  data?: {
    invoiceId: string;
    invoiceUrl: string;
    downloadUrl?: string;
  };
}

// ============ Admin Types ============
export interface AdminUser extends User {
  role: "super_admin" | "admin" | "moderator";
  permissions: string[];
}

export interface DashboardStats {
  totalUsers: number;
  totalServices: number;
  totalRequests: number;
  totalRevenue: number;
  growthRate: number;
  chartData: {
    label: string;
    value: number;
  }[];
}

export interface AnalyticsData {
  period: "daily" | "weekly" | "monthly";
  data: {
    date: string;
    users: number;
    services: number;
    revenue: number;
    requests: number;
  }[];
}

// ============ API Response Types ============
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

// ============ Service Request Types ============
export interface ServiceRequest {
  id: string;
  serviceTitle: string;
  clientName: string;
  amount: number;
  status: "pending" | "approved" | "completed" | "rejected";
  createdAt: string;
  completedAt?: string;
  description: string;
  clientEmail?: string;
  clientPhone?: string;
  providerId?: string;
  clientId?: string;
  notes?: string;
}

export interface ServiceRequestResponse {
  success: boolean;
  data: ServiceRequest[];
  total: number;
}

export interface CreateServiceRequestPayload {
  serviceTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  amount: number;
  description: string;
}

// ============ Auth Context Types ============
export interface AuthContextType {
  // State
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  authenticated: boolean;
  error: string | null;
  tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  };
  
  // Auth Methods
  login: (email: string, password: string) => Promise<User>;
  signup: (data: SignupRequest) => Promise<User>;
  verifyEmail: (email: string, verificationCode: string) => Promise<User>;
  resendVerificationCode: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<User>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}
