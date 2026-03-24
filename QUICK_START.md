# Quick Start Guide - Authentication System

## What Was Implemented

### ✅ Backend (Server)
- **Updated AuthController** with proper error handling and response formats
- **Token Generation** - Access tokens (7d) and Refresh tokens (30d)
- **Email Verification** - 6-digit codes with 10-minute expiration
- **Consistent Response Format** - All endpoints return structured responses with success flag

### ✅ Frontend Services
- **auth-service.ts** - Complete API integration layer
- **AuthContext.tsx** - Global state management with error handling
- **Sign-in** - Login with email/password validation
- **Sign-up** - Register with multiple account types
- **Email Verification** - Screen with resend functionality and countdown timer
- **Token Management** - Automatic token refresh and storage

### ✅ Frontend Screens
- **login.tsx** - Fully functional login with validation and error display
- **signup.tsx** - Comprehensive registration form with conditional fields
- **verify-email.tsx** - Email verification with resend code timer

---

## How to Use

### 1. Setup AuthProvider in Root Layout

In `client/app/_layout.tsx`:

```typescript
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Rest of your app */}
    </AuthProvider>
  );
}
```

### 2. Use Auth in Components

```typescript
import { useAuth } from "../context/AuthContext";

export default function MyScreen() {
  const { 
    user, 
    authenticated, 
    loading, 
    error,
    login,
    logout,
    clearError
  } = useAuth();

  return (
    <View>
      {error && <Text style={{color: 'red'}}>{error}</Text>}
      {loading && <ActivityIndicator />}
      {authenticated ? (
        <View>
          <Text>Welcome, {user?.firstName}</Text>
          <Button title="Logout" onPress={logout} />
        </View>
      ) : (
        <Text>Not logged in</Text>
      )}
    </View>
  );
}
```

---

## API Response Format

All backend responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": { /* user object */ },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": "Technical error details"
}
```

---

## Testing Endpoints with CURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "accountType": "individual"
  }'
```

### Verify Email
```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "verificationCode": "123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Resend Verification Code
```bash
curl -X POST http://localhost:5000/api/auth/resend-verification-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

---

## Environment Variables

### Backend (.env)
```
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=5000
MONGODB_URI=your-mongodb-connection
EMAIL_SERVICE_KEY=your-email-service-key
```

### Frontend (client/environment.ts)
```typescript
API_BASE_URL: "http://192.168.1.100:5000/api"  // Change IP to your machine
API_TIMEOUT: 30000
```

---

## Key Features

### Input Validation
- ✅ Email format validation
- ✅ Password strength requirements (min 6 chars)
- ✅ Password confirmation matching
- ✅ Phone number validation
- ✅ Required field checking
- ✅ Terms acceptance checking

### Error Handling
- ✅ Backend validation errors
- ✅ Network error handling
- ✅ Token expiration handling
- ✅ User-friendly error messages
- ✅ Loading state management

### Security
- ✅ Token-based authentication
- ✅ Automatic token refresh
- ✅ Secure token storage
- ✅ Email verification required
- ✅ Password hashing on backend

### UI/UX
- ✅ Real-time field validation
- ✅ Loading indicators
- ✅ Error message display
- ✅ Countdown timer for resend
- ✅ Keyboard handling
- ✅ Safe area support

---

## Form Validation Rules

### Login Form
- Email: Valid email format required
- Password: Minimum 6 characters

### Signup Form
- First Name: Required, non-empty
- Last Name: Required, non-empty
- Email: Valid email format required
- Password: Minimum 6 characters
- Confirm Password: Must match password
- Phone: Optional, must be 10+ digits if provided
- Business Name: Required if account type is "business"
- Terms: Must be accepted

### Email Verification
- Code: 4-10 characters required
- Auto-resend after 10 minutes

---

## Common Workflows

### Workflow 1: New User Registration
1. User opens app → Lands on Login screen
2. User clicks "Register" → Goes to Signup screen
3. User fills form → Submits
4. System shows Verify Email screen
5. User enters code from email → Clicks Verify
6. System routes to Dashboard

### Workflow 2: Returning User Login
1. User opens app → Checks for stored tokens
2. If valid tokens exist → Automatically goes to Dashboard
3. If no tokens or expired → Shows Login screen
4. User enters credentials → Clicks Login
5. System routes to Dashboard

### Workflow 3: Account Type Selection
1. User selects "Business" during signup
2. System shows additional "Business Name" field
3. User enters business details
4. System validates accordingly

---

## Debugging Tips

### Enable API Logging
In `client/environment.ts`:
```typescript
LOG_REQUESTS: true  // Logs all API calls
DEBUG: true         // Enables debug mode
```

### Check Stored Tokens
In DevTools Console:
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.getItem('accessToken').then(console.log);
AsyncStorage.getItem('refreshToken').then(console.log);
```

### Monitor Network Requests
- Use React Native Debugger
- Check Network tab for failed requests
- Verify request/response bodies

### Backend Logs
Check server console for:
- Database connection errors
- Email service failures
- Validation errors
- Token generation issues

---

## File Structure

```
client/
├── app/
│   └── (auth)/
│       ├── login.tsx          ← Login screen
│       ├── signup.tsx         ← Registration screen
│       ├── verify-email.tsx   ← Email verification screen
│       └── _layout.tsx        ← Auth stack layout
├── context/
│   └── AuthContext.tsx        ← Auth state management
├── services/
│   ├── auth-service.ts        ← API calls
│   └── api-client.ts          ← HTTP client
├── types/
│   └── index.ts               ← TypeScript interfaces
└── AUTH_IMPLEMENTATION.md     ← Full documentation

server/
├── routes/
│   └── authRoutes.js          ← Auth endpoints
├── controllers/
│   └── authController.js      ← Auth business logic
├── models/
│   └── User.js                ← User schema
└── utils/
    └── emailService.js        ← Email sending
```

---

## Next Steps

1. **Configure Email Service**
   - Set up Gmail, SendGrid, or similar
   - Add credentials to .env
   - Test email sending

2. **Setup Database**
   - Ensure MongoDB is running
   - Check User model migration
   - Verify collections are created

3. **Test Full Flow**
   - Register new account
   - Verify email
   - Login with created account
   - Check profile data

4. **Deploy**
   - Push to staging environment
   - Run full test suite
   - Deploy to production

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Check server logs for backend errors
3. Verify API endpoint URLs are correct
4. Ensure database is connected
5. Check email service configuration

For detailed information, refer to `AUTH_IMPLEMENTATION.md`
