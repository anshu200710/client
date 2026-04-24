import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Picker,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { SignupRequest } from "../../types";

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
 * Signup Screen Component
 * Handles user registration with validation
 */
export default function SignupScreen() {
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accountType, setAccountType] = useState<"individual" | "business" | "lawyer">("individual");
  const [businessName, setBusinessName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Auth Context
  const { signup, loading, error, clearError } = useAuth();

  /**
   * Validate email format
   */
  const isValidEmail = (emailStr: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  /**
   * Validate phone number (basic validation)
   */
  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  };

  /**
   * Handle signup submission
   */
  const handleSignup = async () => {
    try {
      // Clear previous errors
      setValidationError(null);
      clearError();

      // Validation
      if (!firstName.trim()) {
        setValidationError("First name is required");
        return;
      }

      if (!lastName.trim()) {
        setValidationError("Last name is required");
        return;
      }

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

      if (password !== confirmPassword) {
        setValidationError("Passwords do not match");
        return;
      }

      if (!phoneNumber.trim()) {
        setValidationError("Phone number is required");
        return;
      }

      if (!isValidPhone(phoneNumber)) {
        setValidationError("Please enter a valid phone number");
        return;
      }

      if (accountType === "business" && !businessName.trim()) {
        setValidationError("Business name is required for business account");
        return;
      }

      if (!agreedToTerms) {
        setValidationError("Please agree to the terms and conditions");
        return;
      }

      // Prepare signup data
      const signupData: SignupRequest = {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        phoneNumber,
        businessName: accountType === "business" ? businessName : undefined,
      };

      // Attempt signup
      const result = await signup(signupData);

      // Check if email verification is required
      if (result?.requiresVerification) {
        // Show verification code for testing (remove in production)
        if (result.verificationCode) {
          Alert.alert(
            "Verification Code",
            `Your verification code is: ${result.verificationCode}\n\nThis is for testing only.`,
            [{ text: "OK" }]
          );
        }
        // Navigate to email verification screen
        router.replace({
          pathname: "/verify-email",
          params: { email: email },
        });
      } else {
        // Direct login (legacy behavior - shouldn't happen with current server)
        router.replace("/(dashboard)/home");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Signup failed. Please try again.";
      
      // If verification code already sent, redirect to verify-email page
      if (errorMessage.includes("verification code has already been sent") || 
          errorMessage.includes("verification code has already been sent")) {
        router.replace({
          pathname: "/verify-email",
          params: { email: email },
        });
        return;
      }
      
      Alert.alert("Signup Error", errorMessage, [{ text: "OK" }]);
      console.error("Signup error:", err);
    }
  };

  /**
   * Navigate to login screen
   */
  const navigateToLogin = () => {
    router.replace("/login");
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
          {/* Header Texts */}
          <View style={{ alignItems: "center", marginBottom: 30, marginTop: 10 }}>
            <Text
              style={{
                fontSize: 28,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textDark,
                marginBottom: 8,
              }}
            >
              Create an account
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 14, color: COLORS.textLight }}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={navigateToLogin} disabled={loading}>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.primary,
                    fontFamily: "Poppins_600SemiBold",
                  }}
                >
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login/Register Toggle */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: COLORS.lightGrey,
              borderRadius: 50,
              padding: 4,
              marginBottom: 24,
            }}
          >
            <TouchableOpacity
              onPress={navigateToLogin}
              style={{
                flex: 1,
                borderRadius: 50,
                paddingVertical: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
              disabled={loading}
            >
              <Text
                style={{
                  color: COLORS.textDark,
                  fontSize: 14,
                  fontFamily: "Poppins_500Medium",
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled
              style={{
                flex: 1,
                backgroundColor: COLORS.primary,
                borderRadius: 50,
                paddingVertical: 12,
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
                  fontSize: 14,
                  fontFamily: "Poppins_600SemiBold",
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
                marginBottom: 16,
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

          {/* First Name Input */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_500Medium",
                color: COLORS.textDark,
                marginBottom: 6,
                marginLeft: 4,
              }}
            >
              First Name
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.lightGrey,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <TextInput
                placeholder="John"
                placeholderTextColor={COLORS.textLight}
                autoCapitalize="words"
                editable={!loading}
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  setValidationError(null);
                }}
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: COLORS.textDark,
                  outlineStyle: "none" as any,
                }}
              />
            </View>
          </View>

          {/* Last Name Input */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_500Medium",
                color: COLORS.textDark,
                marginBottom: 6,
                marginLeft: 4,
              }}
            >
              Last Name
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.lightGrey,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <TextInput
                placeholder="Doe"
                placeholderTextColor={COLORS.textLight}
                autoCapitalize="words"
                editable={!loading}
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  setValidationError(null);
                }}
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: COLORS.textDark,
                  outlineStyle: "none" as any,
                }}
              />
            </View>
          </View>

          {/* Account Type Selection */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_500Medium",
                color: COLORS.textDark,
                marginBottom: 6,
                marginLeft: 4,
              }}
            >
              Account Type
            </Text>
            <View
              style={{
                backgroundColor: COLORS.lightGrey,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <Picker
                selectedValue={accountType}
                onValueChange={(itemValue) => setAccountType(itemValue)}
                enabled={!loading}
                style={{
                  height: 50,
                  color: COLORS.textDark,
                }}
              >
                <Picker.Item label="Individual" value="individual" />
                <Picker.Item label="Business" value="business" />
              </Picker>
            </View>
          </View>

          {/* Business Name Input (Conditional) */}
          {accountType === "business" && (
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_500Medium",
                  color: COLORS.textDark,
                  marginBottom: 6,
                  marginLeft: 4,
                }}
              >
                Business Name
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: COLORS.lightGrey,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                }}
              >
                <TextInput
                  placeholder="Your Business Name"
                  placeholderTextColor={COLORS.textLight}
                  autoCapitalize="words"
                  editable={!loading}
                  value={businessName}
                  onChangeText={(text) => {
                    setBusinessName(text);
                    setValidationError(null);
                  }}
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: COLORS.textDark,
                    outlineStyle: "none" as any,
                  }}
                />
              </View>
            </View>
          )}

          {/* Email Input */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_500Medium",
                color: COLORS.textDark,
                marginBottom: 6,
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
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <Ionicons name="mail-outline" size={16} color={COLORS.textLight} style={{ marginRight: 8 }} />
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
                  fontSize: 14,
                  color: COLORS.textDark,
                  outlineStyle: "none" as any,
                }}
              />
            </View>
          </View>

          {/* Phone Number Input */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_500Medium",
                color: COLORS.textDark,
                marginBottom: 6,
                marginLeft: 4,
              }}
            >
              Phone Number
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.lightGrey,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <Ionicons name="call-outline" size={16} color={COLORS.textLight} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="+1 (555) 000-0000"
                placeholderTextColor={COLORS.textLight}
                keyboardType="phone-pad"
                editable={!loading}
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  setValidationError(null);
                }}
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: COLORS.textDark,
                  outlineStyle: "none" as any,
                }}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_500Medium",
                color: COLORS.textDark,
                marginBottom: 6,
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
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <Ionicons name="lock-closed-outline" size={16} color={COLORS.textLight} style={{ marginRight: 8 }} />
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
                  fontSize: 14,
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
                  size={16}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_500Medium",
                color: COLORS.textDark,
                marginBottom: 6,
                marginLeft: 4,
              }}
            >
              Confirm Password
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.lightGrey,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <Ionicons name="lock-closed-outline" size={16} color={COLORS.textLight} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="••••••••••••"
                placeholderTextColor={COLORS.textLight}
                secureTextEntry={!showConfirmPassword}
                editable={!loading}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setValidationError(null);
                }}
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: COLORS.textDark,
                  outlineStyle: "none" as any,
                }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={16}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms & Conditions Checkbox */}
          <TouchableOpacity
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}
            disabled={loading}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                borderWidth: 1.5,
                borderColor: agreedToTerms ? COLORS.primary : COLORS.textLight,
                backgroundColor: agreedToTerms ? COLORS.primary : "transparent",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              {agreedToTerms && (
                <Ionicons name="checkmark" size={12} color={COLORS.white} />
              )}
            </View>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.textDark,
                fontFamily: "Poppins_500Medium",
              }}
            >
              I agree to the{" "}
              <Text style={{ color: COLORS.primary, fontFamily: "Poppins_600SemiBold" }}>
                Terms and Conditions
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Signup Button */}
          <TouchableOpacity
            onPress={handleSignup}
            activeOpacity={0.8}
            disabled={loading || !firstName || !lastName || !email || !password}
            style={{
              backgroundColor:
                loading || !firstName || !lastName || !email || !password
                  ? COLORS.textLight
                  : COLORS.primary,
              borderRadius: 50,
              paddingVertical: 14,
              alignItems: "center",
              marginBottom: 20,
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
                fontSize: 15,
                fontFamily: "Poppins_700Bold",
              }}
            >
              {loading ? "Creating Account..." : "Register"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            <Text
              style={{
                marginHorizontal: 12,
                fontSize: 11,
                color: COLORS.textLight,
                fontFamily: "Poppins_500Medium",
              }}
            >
              Or continue with
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
          </View>

          {/* Social Buttons */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: COLORS.border,
                backgroundColor: COLORS.white,
              }}
              disabled={loading}
            >
              <Ionicons name="logo-google" size={18} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: COLORS.border,
                backgroundColor: COLORS.white,
              }}
              disabled={loading}
            >
              <Ionicons name="logo-apple" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}