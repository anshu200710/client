import { LinearGradient } from "expo-linear-gradient";
import { Stack, router } from "expo-router";
import React from "react";
import {
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#0066CC",
  secondary: "#FF9900",
  white: "#FFFFFF",
  accentDark: "#004BA3",
};

const FONTS = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semiBold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extraBold: "PlusJakartaSans_800ExtraBold",
};

export default function OnboardingScreen() {
  const { height } = useWindowDimensions();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[COLORS.primary, COLORS.accentDark, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Content */}
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            paddingHorizontal: 24,
            paddingVertical: 40,
          }}
        >
          {/* Top Section - Logo/Branding */}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: height * 0.1,
            }}
          >
            <Text
              style={{
                fontSize: 48,
                fontFamily: FONTS.extraBold,
                color: COLORS.white,
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              VYAAPAR
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: FONTS.medium,
                color: COLORS.white,
                textAlign: "center",
                opacity: 0.95,
                letterSpacing: 1,
              }}
            >
              SAATHI
            </Text>
          </View>

          {/* Middle Section - Tagline */}
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: FONTS.semiBold,
                color: COLORS.white,
                textAlign: "center",
                lineHeight: 28,
              }}
            >
              Smart Platform for Your Business
            </Text>
          </View>

          {/* Bottom Section - Buttons */}
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={() => router.push("/signup")}
              style={{
                backgroundColor: COLORS.white,
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  color: COLORS.primary,
                  fontFamily: FONTS.bold,
                  fontSize: 16,
                }}
              >
                Create Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/login")}
              style={{
                backgroundColor: "transparent",
                paddingVertical: 14,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: COLORS.white,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.bold,
                  fontSize: 16,
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
