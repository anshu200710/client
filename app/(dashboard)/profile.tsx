import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useSubscription } from "../../context/SubscriptionContext";

// Match other pages colors
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
        fontFamily: "Poppins_800ExtraBold",
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
        fontFamily: "Poppins_600SemiBold",
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
    style={{ paddingVertical: 12, flexDirection: "row", alignItems: "center" }}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: iconBg,
      }}
    >
      <Ionicons
        name={icon}
        size={18}
        color={isDanger ? COLORS.alertRed : "#06B6D4"}
      />
    </View>
    <View style={{ marginLeft: 12, flex: 1 }}>
      <Text
        style={{
          fontSize: 15,
          fontFamily: "Poppins_600SemiBold",
          color: isDanger ? COLORS.alertRed : COLORS.textDark,
        }}
      >
        {title}
      </Text>
      {!!subtitle && (
        <Text
          style={{
            fontSize: 12,
            color: COLORS.textLight,
            marginTop: 2,
            fontFamily: "Poppins_400Regular",
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
    {!isDanger && (
      <Ionicons name="chevron-forward" size={17} color={COLORS.textLight} />
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
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: COLORS.textDark, fontFamily: "Poppins_600SemiBold" }}>
          Please log in to view your profile
        </Text>
      </SafeAreaView>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const profileCompletion = user.isEmailVerified ? "90%" : "50%";

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white }}
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
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontFamily: "Poppins_700Bold",
            color: COLORS.textDark,
          }}
        >
          Profile
        </Text>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => router.push("/(dashboard)/notifications")}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={COLORS.textDark}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 120,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View
          style={{
            backgroundColor: "#EAF8FF",
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "#DFECF5",
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 16,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <View style={{ position: "relative" }}>
              <View
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  borderWidth: 2,
                  borderColor: "#7DD3FC",
                  backgroundColor: COLORS.white,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
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
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: user.isEmailVerified ? "#06B6D4" : COLORS.alertAmber,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: COLORS.white,
                }}
              >
                <Ionicons 
                  name={user.isEmailVerified ? "checkmark" : "alert-circle"} 
                  size={12} 
                  color={COLORS.white} 
                />
              </View>
            </View>

            <Text
              style={{
                fontSize: 24,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textDark,
                marginTop: 12,
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
                  fontSize: 13,
                  color: COLORS.textGray,
                  fontFamily: "Poppins_500Medium",
                }}
              >
                {user.businessName || user.accountType.charAt(0).toUpperCase() + user.accountType.slice(1)}
              </Text>
              {user.isEmailVerified && (
                <Ionicons
                  name="checkmark-circle"
                  size={12}
                  color="#06B6D4"
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.textLight,
                marginTop: 2,
                fontFamily: "Poppins_400Regular",
              }}
            >
              {user.email}
            </Text>
          </View>

          <View
            style={{
              marginTop: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderTopWidth: 1,
              borderTopColor: "#D8E9F5",
              paddingTop: 16,
            }}
          >
            <StatBlock value={profileCompletion} label="COMPLETE" />
            <View
              style={{ height: 32, width: 1, backgroundColor: "#D6DEE8" }}
            />
            <StatBlock value={user.accountType} label="TYPE" accent="#06B6D4" />
          </View>
        </View>

        {/* Account Settings Section */}
        <Text
          style={{
            fontSize: 11,
            color: COLORS.textLight,
            fontFamily: "Poppins_700Bold",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginTop: 24,
            marginBottom: 12,
            paddingHorizontal: 4,
          }}
        >
          ACCOUNT SETTINGS
        </Text>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 12,
          }}
        >
          <ProfileRow
            icon="person-outline"
            iconBg="#E8F8FE"
            title="Edit Profile"
            subtitle="Update your personal info"
            onPress={() =>
              router.push("/(dashboard)/profile-pages/edit-profile")
            }
          />
          <View style={{ height: 1, backgroundColor: "#EEF2F7" }} />
          <ProfileRow
            icon="business-outline"
            iconBg="#E8F8FE"
            title="Business Details"
            subtitle={user.accountType === "business" ? "Manage GST & company info" : "Set up business account"}
            onPress={() =>
              router.push("/(dashboard)/profile-pages/business-details")
            }
          />
          <View style={{ height: 1, backgroundColor: "#EEF2F7" }} />
          <ProfileRow
            icon="document-text-outline"
            iconBg="#E8F8FE"
            title="Documents"
            subtitle="Upload PAN, Aadhaar, GST"
            onPress={() =>
              router.push("/(dashboard)/profile-pages/documents")
            }
          />
          <View style={{ height: 1, backgroundColor: "#EEF2F7" }} />
          <ProfileRow
            icon="settings-outline"
            iconBg="#E8F8FE"
            title="Settings"
            subtitle="App preferences & security"
            onPress={() => router.push("/(dashboard)/profile-pages/settings")}
          />
        </View>

        {/* Subscription & Premium Section */}
        <Text
          style={{
            fontSize: 11,
            color: COLORS.textLight,
            fontFamily: "Poppins_700Bold",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginTop: 24,
            marginBottom: 12,
            paddingHorizontal: 4,
          }}
        >
          SUBSCRIPTION & PREMIUM
        </Text>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 12,
            overflow: "hidden",
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => router.push("/(dashboard)/profile-pages/subscription")}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: hasActiveSubscription ? "#FEF3C7" : "#F3E8FF",
              }}
            >
              <Ionicons
                name={hasActiveSubscription ? "star" : "star-outline"}
                size={18}
                color={hasActiveSubscription ? "#D97706" : "#8B5CF6"}
              />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.textDark,
                }}
              >
                My Subscription
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.textLight,
                  marginTop: 2,
                  fontFamily: "Poppins_400Regular",
                }}
              >
                {hasActiveSubscription
                  ? `${subscriptionTier?.charAt(0).toUpperCase()}${subscriptionTier?.slice(1)} - ${userSubscription?.daysRemaining || 0} days left`
                  : "No active subscription"}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: hasActiveSubscription ? "#FEF3C7" : "#F3E8FF",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_600SemiBold",
                  color: hasActiveSubscription ? "#D97706" : "#8B5CF6",
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
            fontSize: 11,
            color: COLORS.textLight,
            fontFamily: "Poppins_700Bold",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginTop: 24,
            marginBottom: 12,
            paddingHorizontal: 4,
          }}
        >
          BUSINESS MANAGEMENT
        </Text>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 12,
          }}
        >
          <ProfileRow
            icon="briefcase-outline"
            iconBg="#E8F8FE"
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
            fontSize: 11,
            color: COLORS.textLight,
            fontFamily: "Poppins_700Bold",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginTop: 24,
            marginBottom: 12,
            paddingHorizontal: 4,
          }}
        >
          SUPPORT & MORE
        </Text>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 12,
          }}
        >
          <ProfileRow
            icon="help-circle-outline"
            iconBg="#EEF5FF"
            title="Help & Support"
            onPress={() =>
              router.push("/(dashboard)/profile-pages/help-support")
            }
          />
          <View style={{ height: 1, backgroundColor: "#EEF2F7" }} />
          <ProfileRow
            icon="log-out-outline"
            iconBg="#FFF1F2"
            title={loggingOut ? "Logging out..." : "Log Out"}
            isDanger
            onPress={handleLogout}
          />
        </View>

        <Text
          style={{
            textAlign: "center",
            fontSize: 10,
            color: COLORS.textLight,
            marginTop: 28,
            fontFamily: "Poppins_400Regular",
          }}
        >
          VyaaparSaathi v2.4.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
