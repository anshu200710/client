# Authentication System Documentation

## Overview
This document provides a complete guide to the authentication system implemented for the Vyapaar app. The system includes user registration, email verification, login, and token management.

---

## Architecture

### Frontend Components

#### 1. **AuthContext.tsx** (`client/context/AuthContext.tsx`)
The central state management for authentication using React Context API.

**Key Features:**
- Global authentication state management
- User session persistence
- Token refresh handling
- Error management

**Key Methods:**
```typescript
- login(email, password): Promise<User> - Log in user
- signup(data): Promise<User> - Register new user
- verifyEmail(email, code): Promise<User> - Verify email with code
- resendVerificationCode(email): Promise<void> - Resend verification code
- logout(): Promise<void> - Log out user
- refreshTokens(): Promise<void> - Refresh access token
- updateProfile(data): Promise<User> - Update user profile
- clearError(): void - Clear error messages
```

#### 2. **auth-service.ts** (`client/services/auth-service.ts`)
Service layer for all authentication API calls.

**Key Methods:**
- `login(credentials)` - Call login endpoint
- `signup(userData)` - Call registration endpoint
- `verifyEmail(email, code)` - Verify email with code
- `logout()` - Call logout endpoint
- `refreshToken()` - Refresh access token
- Token management (save, retrieve, clear)

#### 3. **Login Screen** (`client/app/(auth)/login.tsx`)
User login interface with email and password fields.

**Features:**
- Email validation
- Password validation
- Loading states
- Error display
- Remember me checkbox
- Social login buttons (UI ready)
- Navigation to signup

#### 4. **Signup Screen** (`client/app/(auth)/signup.tsx`)
User registration interface with comprehensive form validation.

**Features:**
- First name and last name inputs
- Account type selection (Individual/Business)
- Conditional business name field
- Email validation
- Phone number validation
- Password confirmation
- Terms and conditions acceptance
- Loading states
- Error display
- Social signup buttons (UI ready)

#### 5. **Email Verification Screen** (`client/app/(auth)/verify-email.tsx`)
Email verification interface with resend functionality.

**Features:**
- Verification code input
- Email display and edit
- Countdown timer (10 minutes)
- Resend code button
- Loading states
- Error display
- Time-based resend limiting

### Backend Components

#### 1. **Auth Routes** (`server/routes/authRoutes.js`)
API endpoints for authentication:
```
POST   /api/auth/register          - Register new user
POST   /api/auth/verify-email      - Verify email with code
POST   /api/auth/login             - Login user
POST   /api/auth/resend-verification-code - Resend verification email
```

#### 2. **Auth Controller** (`server/controllers/authController.js`)
Business logic for authentication operations.

**Endpoints:**

**Register**
```javascript
// POST /api/auth/register
Request: {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  accountType: "individual" | "business" | "lawyer",
  phoneNumber?: string,
  businessName?: string
}

Response: {
  success: true,
  message: "User registered successfully...",
  data: {
    user: { ... },
    tokens: {
      accessToken: string,
      refreshToken: string
    }
  }
}
```

**Email Verification**
```javascript
// POST /api/auth/verify-email
Request: {
  email: string,
  verificationCode: string
}

Response: {
  success: true,
  message: "Email verified successfully",
  data: {
    user: { ... },
    tokens: {
      accessToken: string,
      refreshToken: string
    }
  }
}
```

**Login**
```javascript
// POST /api/auth/login
Request: {
  email: string,
  password: string
}

Response: {
  success: true,
  message: "Login successful",
  data: {
    user: { ... },
    tokens: {
      accessToken: string,
      refreshToken: string
    }
  }
}
```

**Resend Verification Code**
```javascript
// POST /api/auth/resend-verification-code
Request: {
  email: string
}

Response: {
  success: true,
  message: "Verification code resent to email"
}
```

---

## Data Types

### User Interface
```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  accountType: "individual" | "business" | "lawyer" | "admin";
  profilePicture?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### SignupRequest Interface
```typescript
interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: "individual" | "business" | "lawyer" | "admin";
  phoneNumber?: string;
  businessName?: string;
  gstNumber?: string;
}
```

### AuthContextType Interface
```typescript
interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  authenticated: boolean;
  error: string | null;
  tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  };
  login: (email: string, password: string) => Promise<User>;
  signup: (data: SignupRequest) => Promise<User>;
  verifyEmail: (email: string, code: string) => Promise<User>;
  resendVerificationCode: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<User>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}
```

---

## Authentication Flow

### Registration Flow
1. User fills signup form with required details
2. Frontend validates all inputs
3. Frontend calls `signup()` from AuthContext
4. Backend:
   - Validates input
   - Checks if email exists
   - Creates new user with unverified status
   - Generates verification code (valid for 10 minutes)
   - Sends verification email
   - Returns tokens (pre-authentication)
5. Frontend navigates to email verification screen
6. Frontend displays resend option with countdown timer

### Email Verification Flow
1. User enters verification code from email
2. Frontend calls `verifyEmail()` with email and code
3. Backend:
   - Validates code against stored code
   - Checks code expiration
   - Updates user.isEmailVerified = true
   - Generates and returns tokens
4. Frontend updates authenticated state to true
5. Frontend navigates to dashboard

### Login Flow
1. User enters email and password
2. Frontend validates credentials format
3. Frontend calls `login()` from AuthContext
4. Backend:
   - Finds user by email
   - Checks if email is verified
   - Compares password hash
   - Generates and returns tokens
5. Frontend stores tokens in AsyncStorage
6. Frontend updates authenticated state
7. Frontend navigates to dashboard

### Token Management Flow
1. Access token stored in AsyncStorage
2. Refresh token stored in AsyncStorage
3. Tokens automatically included in API requests
4. When access token expires:
   - API interceptor detects 401 Unauthorized
   - Calls refresh token endpoint
   - Stores new tokens
   - Retries original request
5. If refresh fails, user is logged out

---

## Usage Instructions

### Using AuthContext in Components

```typescript
import { useAuth } from "../../context/AuthContext";

export default function MyComponent() {
  const { 
    user, 
    authenticated, 
    loading, 
    error,
    login, 
    logout, 
    clearError 
  } = useAuth();

  const handleLogin = async () => {
    try {
      clearError();
      const user = await login("user@example.com", "password123");
      console.log("Logged in:", user);
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  };

  return (
    <View>
      {error && <Text>{error}</Text>}
      {loading && <ActivityIndicator />}
      {authenticated && <Text>Welcome, {user?.firstName}!</Text>}
    </View>
  );
}
```

### Error Handling
All auth methods throw errors that should be caught:

```typescript
try {
  await login(email, password);
} catch (error) {
  console.error("Login failed:", error.message);
  // Display error to user
}
```

---

## Configuration

### Backend Configuration (.env)
```
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
EMAIL_SERVICE_API_KEY=your-email-service-key
```

### Frontend Configuration (client/environment.ts)
```typescript
const ENV_CONFIG = {
  development: {
    API_BASE_URL: "http://192.168.1.100:5000/api",
    API_TIMEOUT: 30000,
    DEBUG: true,
    LOG_REQUESTS: true,
  },
  // ... other environments
};
```

---

## Security Best Practices

1. **Token Storage**: Tokens are stored in AsyncStorage (native encryption on iOS/Android)
2. **HTTPS**: All API calls use HTTPS in production
3. **Token Expiration**: 
   - Access tokens: 7 days
   - Refresh tokens: 30 days
4. **Password Hashing**: Passwords are hashed using bcrypt on backend
5. **Verification Code**: 6-digit code, expires in 10 minutes
6. **CORS**: Configured on backend to allow only trusted origins

---

## Testing the System

### Manual Testing Steps

1. **Test Signup**
   - Navigate to signup screen
   - Fill form with valid data
   - Click Register
   - Should navigate to email verification screen

2. **Test Email Verification**
   - Enter verification code (check console/email)
   - Click Verify Email
   - Should navigate to dashboard

3. **Test Login**
   - Navigate to login screen
   - Enter verified email and password
   - Click Login
   - Should navigate to dashboard

4. **Test Error Handling**
   - Try invalid email format
   - Try mismatched passwords
   - Try weak password
   - Should display appropriate error messages

---

## Troubleshooting

### Common Issues

**1. Login fails with "Email not verified"**
- User must complete email verification after signup
- Check that verification code was entered correctly

**2. Verification code not received**
- Check spam folder
- Click "Resend Code" button
- Wait and try again

**3. "Invalid verification code" error**
- Code is case-sensitive
- Code expires after 10 minutes
- Cannot reuse previous codes

**4. Tokens not persisting after app restart**
- Tokens are stored in AsyncStorage
- Check that AsyncStorage installation is complete
- Verify app has permission to store data

**5. "Cannot verify email" after signup**
- Wait a few seconds and try again
- Check network connection
- Ensure backend email service is configured

---

## Future Enhancements

1. **Social Login** - Google, Apple, Facebook integration
2. **Two-Factor Authentication** - Additional security layer
3. **Biometric Login** - Fingerprint/Face ID support
4. **Password Recovery** - Forgot password flow
5. **Account Linking** - Link multiple accounts
6. **OAuth2** - Third-party app integration

---

## Support

For issues or questions, please contact the development team or refer to the API documentation at `/server/CURL_TESTING_GUIDE.md`
