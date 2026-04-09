import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity, View, Text } from "react-native";

const COLORS = {
  primary: "#1E4FA3",
  primaryLight: "#E5F0FF",
  secondary: "#2ECC71",
  danger: "#ef4444",
  warning: "#f59e0b",
  textLight: "#9FA3B1",
  textDark: "#1A1A1A",
  white: "#FFFFFF",
  border: "#E2E8F0",
  lightGrey: "#F5F7FB",
};

// Center FAB Button for Offers/Notifications
const CenterFABButton = ({ route = "offers" }) => {
  const router = useRouter();
  const isNotifications = route === "notifications";
  
  return (
    <TouchableOpacity
      onPress={() => router.push(`/(admin)/${route}`)}
      activeOpacity={0.85}
      style={{
        top: -28,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: isNotifications ? COLORS.danger : COLORS.primary,
          justifyContent: "center",
          alignItems: "center",
          elevation: 16,
          shadowColor: isNotifications ? COLORS.danger : COLORS.primary,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.45,
          shadowRadius: 18,
          borderWidth: 5,
          borderColor: COLORS.white,
        }}
      >
        <Ionicons 
          name={isNotifications ? "notifications" : "add-circle"} 
          size={36} 
          color={COLORS.white} 
        />
      </View>
    </TouchableOpacity>
  );
};

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 16,
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.lightGrey,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 100 : 85,
          paddingBottom: Platform.OS === "ios" ? 32 : 16,
          paddingTop: 8,
          paddingHorizontal: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Poppins_600SemiBold",
          marginTop: 6,
          letterSpacing: 0.3,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 6,
          paddingHorizontal: 2,
        },
      }}
    >
      {/* Left Side Navigation */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: focused ? COLORS.primaryLight : "transparent",
              }}
            >
              <Ionicons name="grid" size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="subscription"
        options={{
          title: "Plans",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: focused ? COLORS.primaryLight : "transparent",
              }}
            >
              <Ionicons name="layers" size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: focused ? COLORS.primaryLight : "transparent",
              }}
            >
              <Ionicons name="people" size={22} color={color} />
            </View>
          ),
        }}
      />

      {/* CENTER FAB - Offers */}
      <Tabs.Screen
        name="action"
        options={{
          title: "",
          tabBarIcon: () => null,
          tabBarLabel: () => null,
          tabBarButton: () => <CenterFABButton route="offers" />,
        }}
      />

      {/* Right Side Navigation */}
      <Tabs.Screen
        name="payment"
        options={{
          title: "Payment",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: focused ? COLORS.primaryLight : "transparent",
              }}
            >
              <Ionicons name="card" size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="requests"
        options={{
          title: "Requests",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: focused ? COLORS.primaryLight : "transparent",
              }}
            >
              <Ionicons name="arrow-forward-outline" size={22} color={color} />
            </View>
          ),
        }}
      />

      {/* Hidden Screens */}
      <Tabs.Screen name="offers" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
    </Tabs>
  );
}
