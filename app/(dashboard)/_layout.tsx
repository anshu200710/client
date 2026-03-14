import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";

// Custom colors from auth flow / modern dashboard
const COLORS = {
  primary: "#2B5AFF", // Bright modern blue from screenshot banner
  textLight: "#9FA3B1",
  textDark: "#1A1D2E"
};

// Custom Add Button Component for the center tab
const AddButton = ({ onPress }: { onPress?: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      top: -20,
      justifyContent: "center",
      alignItems: "center",
    }}
    activeOpacity={0.9}
  >
    <View
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      }}
    >
      <Ionicons name="add" size={32} color="#fff" />
    </View>
  </TouchableOpacity>
);

export default function DashboardLayout() {
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
          elevation: 0,
          backgroundColor: "#ffffff",
          borderTopColor: "#F0F3F7",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 75,
          paddingBottom: Platform.OS === "ios" ? 28 : 12,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Poppins_500Medium",
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Hub",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="action"
        options={{
          title: "",
          tabBarIcon: () => null,
          tabBarLabel: () => null,
          tabBarButton: (props: any) => <AddButton onPress={props.onPress} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
      
      {/* Hidden Screens */}
      <Tabs.Screen name="tools" options={{ href: null }} />
      <Tabs.Screen name="profile-pages" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="service-pages" options={{ href: null }} />
      <Tabs.Screen name="tools-pages" options={{ href: null }} />
    </Tabs>
  );
}
