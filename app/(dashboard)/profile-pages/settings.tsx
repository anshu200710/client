import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
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

export default function SettingsScreen() {
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
          Settings
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
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#EEF2F7",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.textDark,
                }}
              >
                Push Notifications
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.textGray,
                  marginTop: 4,
                  fontFamily: "Poppins_400Regular",
                }}
              >
                Receive service and payment alerts
              </Text>
            </View>
            <Switch
              value
              thumbColor={COLORS.white}
              trackColor={{ false: "#CBD5E1", true: COLORS.primary }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#EEF2F7",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.textDark,
                }}
              >
                Biometric Login
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.textGray,
                  marginTop: 4,
                  fontFamily: "Poppins_400Regular",
                }}
              >
                Use fingerprint or Face ID
              </Text>
            </View>
            <Switch
              value={false}
              thumbColor={COLORS.white}
              trackColor={{ false: "#CBD5E1", true: COLORS.primary }}
            />
          </View>

          <TouchableOpacity style={{ paddingVertical: 12 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.textDark,
              }}
            >
              Change Password
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.textGray,
                marginTop: 4,
                fontFamily: "Poppins_400Regular",
              }}
            >
              Update your account password
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
