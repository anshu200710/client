import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useSubscription } from "../../context/SubscriptionContext";
import { LinearGradient } from "expo-linear-gradient";

const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#EEF2FF",
  secondary: "#10B981",
  secondaryLight: "#ECFDF5",
  accent: "#F59E0B",
  accentLight: "#FFFBEB",
  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
  success: "#10B981",
  alertRed: "#EF4444",
  alertAmber: "#F59E0B",
  white: "#FFFFFF",
  textDark: "#0F172A",
  textGray: "#475569",
  textLight: "#94A3B8",
  border: "#E2E8F0",
};

const StatBlock = ({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: string;
}) => (
  <View style={{ alignItems: "center", flex: 1 }}>
    <Text
      style={{
        fontSize: 28,
        fontFamily: "PlusJakartaSans_800ExtraBold",
        color: accent ?? COLORS.textDark,
      }}
    >
      {value}
    </Text>
    <Text
      style={{
        fontSize: 10,
        letterSpacing: 0.5,
        color: COLORS.textLight,
        fontFamily: "PlusJakartaSans_600SemiBold",
        marginTop: 4,
      }}
    >
      {label}
    </Text>
  </View>
);

const ProfileRow = ({
  icon,
  iconBg,
  title,
  subtitle,
  onPress,
  isDanger,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconBg: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  isDanger?: boolean;
}) => (
  <TouchableOpacity
    style={{ paddingVertical: 14, flexDirection: "row", alignItems: "center" }}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: iconBg,
      }}
    >
      <Ionicons
        name={icon}
        size={20}
        color={isDanger ? COLORS.alertRed : COLORS.primary}
      />
    </View>
    <View style={{ marginLeft: 14, flex: 1 }}>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "PlusJakartaSans_700Bold",
          color: isDanger ? COLORS.alertRed : COLORS.textDark,
        }}
      >
        {title}
      </Text>
      {!!subtitle && (
        <Text
          style={{
            fontSize: 13,
            color: COLORS.textLight,
            marginTop: 2,
            fontFamily: "PlusJakartaSans_500Medium",
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
    {!isDanger && (
      <Ionicons name="chevron-forward" size={18} color={COLORS.slate[300]} />
    )}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const { hasActiveSubscription, subscriptionTier, userSubscription } = useSubscription();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Log Out",
        onPress: async () => {
          try {
            setLoggingOut(true);
            await logout();
            router.replace("/(auth)/login");
          } catch (error) {
            Alert.alert("Error", "Failed to log out");
          } finally {
            setLoggingOut(false);
          }
        },
        style: "destructive",
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.slate[50], justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.slate[50], justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: COLORS.textDark, fontFamily: "PlusJakartaSans_600SemiBold" }}>
          Please log in to view your profile
        </Text>
      </SafeAreaView>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const profileCompletion = user.isEmailVerified ? "90%" : "50%";

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.slate[50] }}
      edges={["top"]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontFamily: "PlusJakartaSans_800ExtraBold",
            color: COLORS.textDark,
          }}
        >
          Profile
        </Text>
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: COLORS.white,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 5,
          }}
          onPress={() => router.push("/(dashboard)/notifications")}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={COLORS.textDark}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 120,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <LinearGradient
          colors={["#EEF2FF", "#FFFFFF"]}
          style={{
            borderRadius: 32,
            borderWidth: 1,
            borderColor: COLORS.white,
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 20,
            shadowColor: COLORS.primary,
            shadowOpacity: 0.05,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 8 },
            elevation: 4,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <View style={{ position: "relative" }}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 4,
                  borderColor: COLORS.white,
                  backgroundColor: COLORS.slate[100],
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                  elevation: 5,
                }}
              >
                <Image
                  source={{ 
                    uri: user.profilePicture || `https://i.pravatar.cc/200?u=${user.email}`
                  }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
              <View
                style={{
                  position: "absolute",
                  right: -4,
                  bottom: 4,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: user.isEmailVerified ? COLORS.success : COLORS.alertAmber,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 3,
                  borderColor: COLORS.white,
                }}
              >
                <Ionicons 
                  name={user.isEmailVerified ? "checkmark" : "alert-circle"} 
                  size={14} 
                  color={COLORS.white} 
                />
              </View>
            </View>

            <Text
              style={{
                fontSize: 24,
                fontFamily: "PlusJakartaSans_800ExtraBold",
                color: COLORS.textDark,
                marginTop: 16,
              }}
            >
              {fullName}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.textGray,
                  fontFamily: "PlusJakartaSans_600SemiBold",
                }}
              >
                {user.businessName || user.accountType.charAt(0).toUpperCase() + user.accountType.slice(1)}
              </Text>
              {user.isEmailVerified && (
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={COLORS.success}
                  style={{ marginLeft: 6 }}
                />
              )}
            </View>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.textLight,
                marginTop: 4,
                fontFamily: "PlusJakartaSans_500Medium",
              }}
            >
              {user.email}
            </Text>
          </View>

          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderTopWidth: 1,
              borderTopColor: COLORS.slate[100],
              paddingTop: 20,
            }}
          >
            <StatBlock value={profileCompletion} label="COMPLETE" />
            <View
              style={{ height: 40, width: 1, backgroundColor: COLORS.slate[200] }}
            />
            <StatBlock value={user.accountType.toUpperCase()} label="TYPE" accent={COLORS.primary} />
          </View>
        </LinearGradient>

        {/* Account Settings Section */}
        <Text
          style={{
            fontSize: 12,
            color: COLORS.textLight,
            fontFamily: "PlusJakartaSans_800ExtraBold",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginTop: 32,
            marginBottom: 12,
            paddingHorizontal: 8,
          }}
        >
          Account Settings
        </Text>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: COLORS.slate[100],
            paddingHorizontal: 16,
            shadowColor: "#000",
            shadowOpacity: 0.02,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <ProfileRow
            icon="person-outline"
            iconBg={COLORS.primaryLight}
            title="Edit Profile"
            subtitle="Update your personal info"
            onPress={() =>
              router.push("/(dashboard)/profile-pages/edit-profile")
            }
          />
          <View style={{ height: 1, backgroundColor: COLORS.slate[50] }} />
          <ProfileRow
            icon="business-outline"
            iconBg={COLORS.primaryLight}
            title="Business Details"
            subtitle={user.accountType === "business" ? "Manage GST & company info" : "Set up business account"}
            onPress={() =>
              router.push("/(dashboard)/profile-pages/business-details")
            }
          />
          <View style={{ height: 1, backgroundColor: COLORS.slate[50] }} />
          <ProfileRow
            icon="document-text-outline"
            iconBg={COLORS.primaryLight}
            title="Documents"
            subtitle="Upload PAN, Aadhaar, GST"
            onPress={() =>
              router.push("/(dashboard)/profile-pages/documents")
            }
          />
          <View style={{ height: 1, backgroundColor: COLORS.slate[50] }} />
          <ProfileRow
            icon="settings-outline"
            iconBg={COLORS.primaryLight}
            title="Settings"
            subtitle="App preferences & security"
            onPress={() => router.push("/(dashboard)/profile-pages/settings")}
          />
        </View>

        {/* Subscription & Premium Section */}
        <Text
          style={{
            fontSize: 12,
            color: COLORS.textLight,
            fontFamily: "PlusJakartaSans_800ExtraBold",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginTop: 32,
            marginBottom: 12,
            paddingHorizontal: 8,
          }}
        >
          Subscription & Premium
        </Text>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: COLORS.slate[100],
            paddingHorizontal: 16,
            shadowColor: "#000",
            shadowOpacity: 0.02,
            shadowRadius: 8,
            elevation: 2,
            overflow: "hidden",
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => router.push("/(dashboard)/profile-pages/subscription")}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: hasActiveSubscription ? COLORS.accentLight : COLORS.primaryLight,
              }}
            >
              <Ionicons
                name={hasActiveSubscription ? "star" : "star-outline"}
                size={20}
                color={hasActiveSubscription ? COLORS.accent : COLORS.primary}
              />
            </View>
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "PlusJakartaSans_700Bold",
                  color: COLORS.textDark,
                }}
              >
                My Subscription
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.textLight,
                  marginTop: 2,
                  fontFamily: "PlusJakartaSans_500Medium",
                }}
              >
                {hasActiveSubscription
                  ? `${subscriptionTier?.charAt(0).toUpperCase()}${subscriptionTier?.slice(1)} - ${userSubscription?.daysRemaining || 0} days left`
                  : "No active subscription"}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: hasActiveSubscription ? COLORS.accentLight : COLORS.primaryLight,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "PlusJakartaSans_700Bold",
                  color: hasActiveSubscription ? COLORS.accent : COLORS.primary,
                }}
              >
                {hasActiveSubscription ? "Manage" : "Buy"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Service Requests Section */}
        <Text
          style={{
            fontSize: 12,
            color: COLORS.textLight,
            fontFamily: "PlusJakartaSans_800ExtraBold",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginTop: 32,
            marginBottom: 12,
            paddingHorizontal: 8,
          }}
        >
          Business Management
        </Text>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: COLORS.slate[100],
            paddingHorizontal: 16,
            shadowColor: "#000",
            shadowOpacity: 0.02,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <ProfileRow
            icon="briefcase-outline"
            iconBg={COLORS.primaryLight}
            title="My Service Requests"
            subtitle="View pending, approved & completed"
            onPress={() =>
              router.push("/(dashboard)/profile-pages/my-requests")
            }
          />
        </View>

        {/* Support Section */}
        <Text
          style={{
            fontSize: 12,
            color: COLORS.textLight,
            fontFamily: "PlusJakartaSans_800ExtraBold",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginTop: 32,
            marginBottom: 12,
            paddingHorizontal: 8,
          }}
        >
          Support & More
        </Text>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: COLORS.slate[100],
            paddingHorizontal: 16,
            shadowColor: "#000",
            shadowOpacity: 0.02,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <ProfileRow
            icon="help-circle-outline"
            iconBg={COLORS.primaryLight}
            title="Help & Support"
            onPress={() =>
              router.push("/(dashboard)/profile-pages/help-support")
            }
          />
          <View style={{ height: 1, backgroundColor: COLORS.slate[50] }} />
          <ProfileRow
            icon="log-out-outline"
            iconBg={COLORS.alertRed + "10"}
            title={loggingOut ? "Logging out..." : "Log Out"}
            isDanger
            onPress={handleLogout}
          />
        </View>

        <Text
          style={{
            textAlign: "center",
            fontSize: 11,
            color: COLORS.textLight,
            marginTop: 32,
            fontFamily: "PlusJakartaSans_500Medium",
          }}
        >
          VyaaparSaathi v2.4.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
