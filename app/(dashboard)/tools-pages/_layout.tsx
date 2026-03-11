import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function ToolsPagesLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
          color: "#0F172A",
        },
        headerTintColor: "#0066CC",
        headerShadowVisible: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} className="pl-2">
            <Ionicons name="chevron-back" size={24} color="#0066CC" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="gst-invoice"
        options={{
          title: "GST Invoice",
        }}
      />
      <Stack.Screen
        name="proforma-invoice"
        options={{
          title: "Proforma Invoice",
        }}
      />
      <Stack.Screen
        name="quotation"
        options={{
          title: "Quotation / Estimate",
        }}
      />
      <Stack.Screen
        name="delivery-challan"
        options={{
          title: "Delivery Challan",
        }}
      />
      <Stack.Screen
        name="gst-calculator"
        options={{
          title: "GST Calculator",
        }}
      />
    </Stack>
  );
}
