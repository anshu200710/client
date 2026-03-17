import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
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

export default function EditProfileScreen() {
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
          Edit Profile
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
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textLight,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            FULL NAME
          </Text>
          <TextInput
            style={{
              backgroundColor: COLORS.lightGrey,
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 12,
              marginBottom: 16,
              fontSize: 14,
              color: COLORS.textDark,
              fontFamily: "Poppins_500Medium",
            }}
            value="Rajesh Kumar"
          />

          <Text
            style={{
              fontSize: 11,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textLight,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            EMAIL
          </Text>
          <TextInput
            style={{
              backgroundColor: COLORS.lightGrey,
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 12,
              marginBottom: 16,
              fontSize: 14,
              color: COLORS.textDark,
              fontFamily: "Poppins_500Medium",
            }}
            value="rajesh.kumar@example.com"
          />

          <Text
            style={{
              fontSize: 11,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textLight,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            PHONE
          </Text>
          <TextInput
            style={{
              backgroundColor: COLORS.lightGrey,
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 12,
              fontSize: 14,
              color: COLORS.textDark,
              fontFamily: "Poppins_500Medium",
            }}
            value="+91 98765 43210"
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 16,
            marginTop: 20,
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontFamily: "Poppins_700Bold",
              fontSize: 14,
            }}
          >
            Save Changes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
