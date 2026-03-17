import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const FaqRow = ({ title }: { title: string }) => (
  <View
    style={{
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#EEF2F7",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Text
      style={{
        fontSize: 14,
        color: COLORS.textDark,
        fontFamily: "Poppins_500Medium",
        paddingRight: 16,
      }}
    >
      {title}
    </Text>
    <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
  </View>
);

export default function HelpSupportScreen() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      edges={["top"]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
          backgroundColor: COLORS.white,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: COLORS.white,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Poppins_700Bold",
            color: COLORS.textDark,
            marginLeft: 12,
          }}
        >
          Help & Support
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textLight,
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            QUICK HELP
          </Text>
          <FaqRow title="How to upload GST documents?" />
          <FaqRow title="Where can I track filing status?" />
          <FaqRow title="How to contact tax expert directly?" />
        </View>

        <View
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 16,
              fontFamily: "Poppins_700Bold",
              marginBottom: 4,
            }}
          >
            Need direct assistance?
          </Text>
          <Text
            style={{
              color: "#D7E8FF",
              fontSize: 12,
              marginBottom: 12,
              fontFamily: "Poppins_400Regular",
            }}
          >
            Our support team is available Mon-Sat, 9 AM to 7 PM.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: COLORS.primary,
                fontFamily: "Poppins_600SemiBold",
                fontSize: 14,
              }}
            >
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
