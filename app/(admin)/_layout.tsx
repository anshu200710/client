import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity, useWindowDimensions, View } from "react-native";

const COLORS = {
  primary: "#1E4FA3",
  primaryLight: "#E5F0FF",
  textLight: "#9FA3B1",
  white: "#FFFFFF",
  background: "#F8FAFC",
};

const TabIcon = ({ icon, color, focused, size }: { icon: string; color: string; focused: boolean; size: number }) => (
  <View
    style={{
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
    }}
  >
    <View
      style={{
        width: size - 10,
        height: size - 10,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: focused ? COLORS.primaryLight : "transparent",
      }}
    >
      <Ionicons name={icon as any} size={22} color={color} />
    </View>
  </View>
);

export default function AdminLayout() {
  const { width } = useWindowDimensions();
  const tabItemSize = Math.max(44, Math.min(58, Math.floor((width - 72) / 7)));
  const fabContainerSize = tabItemSize + 24;

  const CenterFABButton = (props: any) => (
    <View
      style={[props.style, {
        width: fabContainerSize,
        height: fabContainerSize,
        justifyContent: "center",
        alignItems: "center",
      }]}
    >
      <TouchableOpacity
        onPress={props.onPress}
        activeOpacity={0.85}
        style={{
          position: "absolute",
          top: -32,
          width: 74,
          height: 74,
          borderRadius: 37,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.primary,
          borderWidth: 4,
          borderColor: COLORS.white,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.18,
          shadowRadius: 20,
          elevation: 18,
          zIndex: 20,
        }}
      >
        <Ionicons name="add" size={32} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Tabs
        screenOptions={({ route }: { route: { name: string } }) => {
          const visibleRoutes = ["subscription", "users", "action", "offers", "payment"];
          const isHidden = !visibleRoutes.includes(route.name) || route.name.startsWith("requests/");
          const isAction = route.name === "action";

          return {
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.textLight,
            tabBarButton: isHidden ? () => null : isAction ? (props: any) => <CenterFABButton {...props} /> : undefined,
            tabBarIcon: isAction ? () => null : undefined,
            tabBarStyle: {
              position: "absolute",
              bottom: 16,
              left: 14,
              right: 14,
              height: Platform.OS === "ios" ? 98 : 84,
              borderRadius: 32,
              backgroundColor: COLORS.white,
              borderTopWidth: 0,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.12,
              shadowRadius: 24,
              elevation: 16,
              paddingTop: 12,
              paddingBottom: Platform.OS === "ios" ? 22 : 14,
              paddingHorizontal: 16,
              justifyContent: "space-between",
              alignItems: "center",
            },
            tabBarIconStyle: {
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            },
            tabBarItemStyle: {
              width: tabItemSize,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 0,
              paddingHorizontal: 0,
            },
          };
        }}
      >
      <Tabs.Screen
        name="subscription"
        options={{
          title: "Subscription",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="layers" color={color} focused={focused as boolean} size={tabItemSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="people" color={color} focused={focused as boolean} size={tabItemSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="action"
        options={{
          title: "Action",
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: "Offers",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="pricetags" color={color} focused={focused as boolean} size={tabItemSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          title: "Payment",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="card" color={color} focused={focused as boolean} size={tabItemSize} />
          ),
        }}
      />
      {/* Hide unwanted admin page routes from the tab bar */}
      <Tabs.Screen name="dashboard" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="notifications" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="subscription-new" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="requests" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="requests/[id]" options={{ tabBarButton: () => null }} />
    </Tabs>
    </View>
  );
}
