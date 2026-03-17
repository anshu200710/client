import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
                  source={{ uri: "https://i.pravatar.cc/200?img=32" }}
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
                  backgroundColor: "#06B6D4",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: COLORS.white,
                }}
              >
                <Ionicons name="checkmark" size={12} color={COLORS.white} />
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
              Rajesh Kumar
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
                Rajesh Textiles Pvt Ltd
              </Text>
              <Ionicons
                name="checkmark-circle"
                size={12}
                color="#06B6D4"
                style={{ marginLeft: 4 }}
              />
            </View>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.textLight,
                marginTop: 2,
                fontFamily: "Poppins_400Regular",
              }}
            >
              rajesh.kumar@example.com
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
            <StatBlock value="85%" label="COMPLETE" />
            <View
              style={{ height: 32, width: 1, backgroundColor: "#D6DEE8" }}
            />
            <StatBlock value="Pro" label="PLAN" accent="#06B6D4" />
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
            icon="reader-outline"
            iconBg="#E8F8FE"
            title="Request Details"
            subtitle="Update documents and chat with admin"
            onPress={() =>
              router.push("/(dashboard)/profile-pages/request-details")
            }
          />
          <View style={{ height: 1, backgroundColor: "#EEF2F7" }} />
          <ProfileRow
            icon="folder-open-outline"
            iconBg="#E8F8FE"
            title="My Services"
            subtitle="Track requests, payments and downloads"
            onPress={() =>
              router.push("/(dashboard)/profile-pages/my-services")
            }
          />
          <View style={{ height: 1, backgroundColor: "#EEF2F7" }} />
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
            subtitle="Manage documents & GST"
            onPress={() =>
              router.push("/(dashboard)/profile-pages/business-details")
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
            title="Log Out"
            isDanger
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
