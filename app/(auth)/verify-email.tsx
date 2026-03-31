import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
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
 * Email Verification Screen Component
 * Allows users to verify their email with a verification code
 */
export default function VerifyEmailScreen() {
  // Route Parameters
  const { email: routeEmail } = useLocalSearchParams();
  
  // State Management
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState<string>(() => {
    return typeof routeEmail === "string" ? routeEmail : routeEmail?.[0] || "";
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | number | null>(null);

  // Auth Context
  const { verifyEmail, resendVerificationCode, loading, error, clearError } = useAuth();

  /**
   * Setup timer for resend button
   */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /**
   * Format time display for countdown
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  /**
   * Handle verification code submission
   */
  const handleVerify = async () => {
    try {
      // Clear previous errors
      setValidationError(null);
      clearError();

      // Validation
      if (!email.trim()) {
        setValidationError("Email is required");
        return;
      }

      if (!verificationCode.trim()) {
        setValidationError("Verification code is required");
        return;
      }

      if (verificationCode.trim().length < 4) {
        setValidationError("Verification code must be at least 4 characters");
        return;
      }

      // Attempt email verification
      await verifyEmail(email, verificationCode);

      // Navigate to success screen or dashboard
      Alert.alert("Success", "Email verified successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(dashboard)/home"),
        },
      ]);
    } catch (err: any) {
      const errorMessage = err.message || "Verification failed. Please try again.";
      Alert.alert("Verification Error", errorMessage, [{ text: "OK" }]);
      console.error("Verification error:", err);
    }
  };

  /**
   * Handle resend verification code
   */
  const handleResend = async () => {
    try {
      setValidationError(null);
      clearError();

      if (!email.trim()) {
        setValidationError("Email is required to resend code");
        return;
      }

      await resendVerificationCode(email);
      setTimeLeft(600);
      setCanResend(false);

      Alert.alert(
        "Code Resent",
        "A new verification code has been sent to your email.",
        [{ text: "OK" }]
      );
    } catch (err: any) {
      const errorMessage = err.message || "Failed to resend verification code";
      Alert.alert("Resend Error", errorMessage, [{ text: "OK" }]);
      console.error("Resend error:", err);
    }
  };

  /**
   * Navigate back to login
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
            justifyContent: "center",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            {/* Icon */}
            <View
              style={{
                width: 80,
                height: 80,
                backgroundColor: COLORS.lightGrey,
                borderRadius: 40,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Ionicons
                name="mail-open-outline"
                size={40}
                color={COLORS.primary}
              />
            </View>

            {/* Title */}
            <Text
              style={{
                fontSize: 26,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textDark,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Verify Your Email
            </Text>

            {/* Description */}
            <Text
              style={{
                fontSize: 14,
                color: COLORS.textGray,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              We have sent a verification code to{"\n"}
              <Text style={{ fontFamily: "Poppins_600SemiBold", color: COLORS.primary }}>
                {email}
              </Text>
            </Text>
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

          {/* Verification Code Input */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_500Medium",
                color: COLORS.textDark,
                marginBottom: 10,
                marginLeft: 4,
              }}
            >
              Verification Code
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
                borderColor: validationError && !verificationCode ? COLORS.alertRed : "transparent",
              }}
            >
              <Ionicons
                name="key-outline"
                size={20}
                color={COLORS.textLight}
                style={{ marginRight: 8 }}
              />
              <TextInput
                placeholder="Enter 4-6 digit code"
                placeholderTextColor={COLORS.textLight}
                keyboardType="number-pad"
                maxLength={10}
                editable={!loading}
                value={verificationCode}
                onChangeText={(text) => {
                  setVerificationCode(text);
                  setValidationError(null);
                }}
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: COLORS.textDark,
                  outlineStyle: "none" as any,
                  letterSpacing: 2,
                }}
              />
            </View>
          </View>

          {/* Email Display & Change Option */}
          <View style={{ marginBottom: 28 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: COLORS.lightGrey,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderRadius: 12,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={COLORS.primary}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.textDark,
                    fontFamily: "Poppins_500Medium",
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {email}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setEmail("")}
                disabled={loading}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={COLORS.alertRed}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleVerify}
            activeOpacity={0.8}
            disabled={loading || !email || !verificationCode}
            style={{
              backgroundColor:
                loading || !email || !verificationCode
                  ? COLORS.textLight
                  : COLORS.primary,
              borderRadius: 50,
              paddingVertical: 14,
              alignItems: "center",
              marginBottom: 16,
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
              {loading ? "Verifying..." : "Verify Email"}
            </Text>
          </TouchableOpacity>

          {/* Resend Code Section */}
          <View
            style={{
              backgroundColor: COLORS.lightGrey,
              padding: 16,
              borderRadius: 12,
              marginBottom: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.textGray,
                  fontFamily: "Poppins_500Medium",
                }}
              >
                Did not receive the code?
              </Text>
              {!canResend && timeLeft > 0 && (
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.alertRed,
                    fontFamily: "Poppins_600SemiBold",
                  }}
                >
                  {formatTime(timeLeft)}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleResend}
              disabled={!canResend || loading}
              style={{ alignItems: "center" }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: canResend && !loading ? COLORS.primary : COLORS.textLight,
                  fontFamily: "Poppins_600SemiBold",
                }}
              >
                {canResend ? "Resend Code" : `Resend in ${formatTime(timeLeft)}`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            onPress={navigateToLogin}
            disabled={loading}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={COLORS.primary}
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                fontSize: 13,
                color: COLORS.primary,
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              Back to Login
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
