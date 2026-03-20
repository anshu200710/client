import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View, Clipboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#1E4FA3",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textGray: "#666666",
  textLight: "#9FA3B1",
  border: "#E4E7EF",
  actionGreenBg: "#ECFDF5",
  actionGreenIcon: "#10B981",
};

const TEMPLATES = [
  {
    id: 1,
    title: "Welcome Message",
    content: "Hello! Welcome to [Your Business Name]. How can we help you today? Reply to this message to chat with our executive.",
  },
  {
    id: 2,
    title: "Payment Reminder",
    content: "Dear Customer, this is a gentle reminder that your payment of [Amount] is due on [Date]. Please clear it at the earliest to avoid late fees. Thank you!",
  },
  {
    id: 3,
    title: "Discount Offer",
    content: "🎉 Special Offer! Get 20% off on your next purchase at [Business Name]. Use code: SAVE20. Valid till [Date]. Shop now: [Link]",
  },
  {
    id: 4,
    title: "Order Confirmation",
    content: "Hi! Your order #[Order ID] has been successfully placed. It will be delivered by [Date]. Track your order here: [Link]",
  },
];

export default function WhatsAppTemplatesScreen() {
  const router = useRouter();

  const handleCopy = (text: string) => {
    alert("Copied to clipboard!");
    // Requires Expo Clipboard in a real app or react-native clipboard
    // Clipboard.setString(text);
  };

  const handleSend = () => {
    alert("Opening WhatsApp...");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "WhatsApp Templates",
          headerTitleStyle: { fontFamily: "Poppins_600SemiBold", fontSize: 18, color: COLORS.textDark },
          headerStyle: { backgroundColor: COLORS.white },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 8, marginRight: 16 }}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        <View style={{ alignItems: "center", marginBottom: 32, padding: 24, backgroundColor: COLORS.actionGreenBg, borderRadius: 20 }}>
          <Ionicons name="logo-whatsapp" size={48} color={COLORS.actionGreenIcon} />
          <Text style={{ fontSize: 20, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginTop: 16, textAlign: "center" }}>
            Marketing Templates
          </Text>
          <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: COLORS.textGray, marginTop: 8, textAlign: "center", lineHeight: 22 }}>
            Ready-to-use professional messages to engage your customers quickly via WhatsApp.
          </Text>
        </View>

        {TEMPLATES.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: COLORS.white,
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 15, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, marginBottom: 8 }}>
              {item.title}
            </Text>
            <View style={{ backgroundColor: "#F9FAFB", padding: 12, borderRadius: 8, marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textGray, lineHeight: 20 }}>
                {item.content}
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                onPress={() => handleCopy(item.content)}
                style={{ flex: 1, marginRight: 8, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, alignItems: "center" }}
              >
                <Text style={{ fontFamily: "Poppins_500Medium", color: COLORS.textDark, fontSize: 13 }}>Copy Text</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSend}
                style={{ flex: 1, marginLeft: 8, paddingVertical: 10, borderRadius: 8, backgroundColor: COLORS.actionGreenIcon, alignItems: "center" }}
              >
                <Text style={{ fontFamily: "Poppins_500Medium", color: COLORS.white, fontSize: 13 }}>Send message</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
