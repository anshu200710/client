import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

const COLORS = {
  primary: "#1E4FA3",
  secondary: "#2ECC71",
  success: "#22c55e",
  alertRed: "#ef4444",
  alertAmber: "#FFC107",
  lightGrey: "#F5F7FB",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textGray: "#666666",
  textLight: "#9FA3B1",
  border: "#E4E7EF",
};

/**
 * Login Screen Component
 * Handles user authentication with email and password
 */
export default function LoginScreen() {
  // State Management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auth Context
  const { login, loading, error, clearError } = useAuth();

  /**
   * Validate email format
   */
  const isValidEmail = (emailStr: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  /**
   * Handle login submission
   */
  const handleLogin = async () => {
    try {
      // Clear previous errors
      setValidationError(null);
      clearError();

      // Validation
      if (!email.trim()) {
        setValidationError("Email is required");
        return;
      }

      if (!isValidEmail(email)) {
        setValidationError("Please enter a valid email address");
        return;
      }

      if (!password) {
        setValidationError("Password is required");
        return;
      }

      if (password.length < 6) {
        setValidationError("Password must be at least 6 characters");
        return;
      }

      // Attempt login
      const user = await login(email, password);

      // Route based on user role
      if (user?.role === "admin") {
        router.replace("/dashboard");
      } else {
        router.replace("/(dashboard)/home");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Login failed. Please try again.";
      Alert.alert("Login Error", errorMessage, [{ text: "OK" }]);
      console.error("Login error:", err);
    }
  };

  /**
   * Navigate to signup screen
   */
  const navigateToSignup = () => {
    router.replace("/signup");
  };

  /**
   * Navigate to forgot password screen
   */
  const navigateToForgotPassword = () => {
    // TODO: Implement forgot password screen
    Alert.alert("Coming Soon", "Password recovery feature coming soon!");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: 40,
            paddingHorizontal: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textDark,
              textAlign: "center",
              marginBottom: 30,
              marginTop: 20,
            }}
          >
            Step Into the Future{"\n"}of Shopping
          </Text>

          {/* Login/Register Toggle */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: COLORS.lightGrey,
              borderRadius: 50,
              padding: 4,
              marginBottom: 32,
            }}
          >
            <TouchableOpacity
              disabled
              style={{
                flex: 1,
                backgroundColor: COLORS.primary,
                borderRadius: 50,
                paddingVertical: 14,
                alignItems: "center",
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 15,
                  fontFamily: "Poppins_600SemiBold",
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={navigateToSignup}
              style={{
                flex: 1,
                borderRadius: 50,
                paddingVertical: 14,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.textDark,
                  fontSize: 15,
                  fontFamily: "Poppins_500Medium",
                }}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Message Display */}
          {(validationError || error) && (
            <View
              style={{
                backgroundColor: COLORS.alertRed + "15",
                borderLeftWidth: 4,
                borderLeftColor: COLORS.alertRed,
                padding: 12,
                borderRadius: 8,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: COLORS.alertRed,
                  fontSize: 13,
                  fontFamily: "Poppins_500Medium",
                }}
              >
                {validationError || error}
              </Text>
            </View>
          )}

          {/* Email Input */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_500Medium",
                color: COLORS.textDark,
                marginBottom: 8,
                marginLeft: 4,
              }}
            >
              Email Address
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.lightGrey,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderWidth: 1.5,
                borderColor: validationError && !email ? COLORS.alertRed : "transparent",
              }}
            >
              <Ionicons name="mail-outline" size={18} color={COLORS.textLight} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="example@gmail.com"
                placeholderTextColor={COLORS.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setValidationError(null);
                }}
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: COLORS.textDark,
                  outlineStyle: "none" as any,
                }}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_500Medium",
                color: COLORS.textDark,
                marginBottom: 8,
                marginLeft: 4,
              }}
            >
              Password
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.lightGrey,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderWidth: 1.5,
                borderColor: validationError && !password ? COLORS.alertRed : "transparent",
              }}
            >
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.textLight} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="••••••••••••"
                placeholderTextColor={COLORS.textLight}
                secureTextEntry={!showPassword}
                editable={!loading}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setValidationError(null);
                }}
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: COLORS.textDark,
                  outlineStyle: "none" as any,
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me & Forgot Password */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={{ flexDirection: "row", alignItems: "center" }}
              activeOpacity={0.7}
              disabled={loading}
            >
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  borderWidth: 1.5,
                  borderColor: rememberMe ? COLORS.primary : COLORS.textLight,
                  backgroundColor: rememberMe ? COLORS.primary : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 8,
                }}
              >
                {rememberMe && (
                  <Ionicons name="checkmark" size={12} color={COLORS.white} />
                )}
              </View>
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.textDark,
                  fontFamily: "Poppins_500Medium",
                }}
              >
                Remember Me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToForgotPassword} disabled={loading}>
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.primary,
                  fontFamily: "Poppins_600SemiBold",
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={loading || !email || !password}
            style={{
              backgroundColor: loading || !email || !password ? COLORS.textLight : COLORS.primary,
              borderRadius: 50,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 32,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.white} style={{ marginRight: 8 }} />
            ) : null}
            <Text
              style={{
                color: COLORS.white,
                fontSize: 16,
                fontFamily: "Poppins_700Bold",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <View
              style={{ flex: 1, height: 1, backgroundColor: COLORS.border }}
            />
            <Text
              style={{
                marginHorizontal: 16,
                fontSize: 12,
                color: COLORS.textLight,
                fontFamily: "Poppins_500Medium",
              }}
            >
              Or continue with
            </Text>
            <View
              style={{ flex: 1, height: 1, backgroundColor: COLORS.border }}
            />
          </View>

          {/* Social Login Buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 40,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 14,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: COLORS.border,
                backgroundColor: COLORS.white,
              }}
              disabled={loading}
            >
              <Ionicons
                name="logo-google"
                size={20}
                color="#DB4437"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.textDark,
                }}
              >
                Google
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 14,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: COLORS.border,
                backgroundColor: COLORS.white,
              }}
              disabled={loading}
            >
              <Ionicons
                name="logo-apple"
                size={20}
                color="#000"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.textDark,
                }}
              >
                Apple
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Navigation Link */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: "auto",
            }}
          >
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>
              Don&apos;t have an account?{" "}
            </Text>
            <TouchableOpacity onPress={navigateToSignup} disabled={loading}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.primary,
                }}
              >
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
