import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";

const COLORS = {
  primary: "#1E4FA3",
  primaryLight: "#E5F0FF",
  secondary: "#2ECC71",
  textLight: "#9FA3B1",
  textDark: "#1A1A1A",
  white: "#FFFFFF",
  border: "#E2E8F0",
};

// Center Add Button
const AddButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push("/(admin)/offers")}
      activeOpacity={0.9}
      style={{
        top: -25,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: COLORS.primary,
          justifyContent: "center",
          alignItems: "center",
          elevation: 12,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          borderWidth: 5,
          borderColor: COLORS.white,
        }}
      >
        <Ionicons name="add" size={32} color={COLORS.white} />
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
          elevation: 8,
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 95 : 80,
          paddingBottom: Platform.OS === "ios" ? 32 : 16,
          paddingTop: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Poppins_600SemiBold",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={22} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="action"
        options={{
          title: "",
          // Empty icon/label since custom button overrides it
          tabBarIcon: () => null,
          tabBarLabel: () => null,
          tabBarButton: () => <AddButton />,
        }}
      />

      {/* KEEP PAYMENT AND REQUEST ICON TABS ON THE RIGHT SIDE */}
      <Tabs.Screen
        name="requests"
        options={{
          title: "Requests",
          tabBarIcon: ({ color }) => (
            // A redirect style icon as requested
            <Ionicons name="arrow-forward-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="payment"
        options={{
          title: "Payment",
          tabBarIcon: ({ color }) => (
            <Ionicons name="card" size={22} color={color} />
          ),
        }}
      />

      {/* Hidden Screens */}
      <Tabs.Screen name="offers" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
    </Tabs>
  );
}
