import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";

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
  const { user, updateProfile, loading } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.profile?.address || "");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const validateForm = () => {
    if (!firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return false;
    }
    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\D/g, ""))) {
      setError("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      setError(null);

      await updateProfile({
        firstName,
        lastName,
        phoneNumber,
        profile: {
          address,
        },
      });

      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      Alert.alert("Error", err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    multiline = false,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: string;
    multiline?: boolean;
  }) => (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: 13,
          fontFamily: "Poppins_600SemiBold",
          color: COLORS.textDark,
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          setError(null);
        }}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        keyboardType={keyboardType as any}
        multiline={multiline}
        editable={!isSaving && !loading}
        style={{
          backgroundColor: COLORS.lightGrey,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: multiline ? 12 : 14,
          fontSize: 14,
          color: COLORS.textDark,
          fontFamily: "Poppins_400Regular",
          minHeight: multiline ? 80 : 48,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Edit Profile",
          headerTitleStyle: {
            fontFamily: "Poppins_700Bold",
            fontSize: 18,
            color: COLORS.textDark,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="chevron-back"
                size={28}
                color={COLORS.primary}
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Current Info Card */}
          <View
            style={{
              backgroundColor: "#EAF8FF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#DFECF5",
              padding: 16,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: COLORS.textDark,
                fontFamily: "Poppins_600SemiBold",
                marginBottom: 12,
              }}
            >
              Account Info
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ fontSize: 11, color: COLORS.textLight, fontFamily: "Poppins_500Medium" }}>
                  Email
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.textDark,
                    fontFamily: "Poppins_600SemiBold",
                    marginTop: 4,
                  }}
                >
                  {user?.email}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <Text
            style={{
              fontSize: 13,
              color: COLORS.textLight,
              fontFamily: "Poppins_700Bold",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 16,
            }}
          >
            Personal Information
          </Text>

          <InputField
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="John"
          />

          <InputField
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Doe"
          />

          <InputField
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="9876543210"
            keyboardType="phone-pad"
          />

          <InputField
            label="Address (Optional)"
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            multiline
          />

          {/* Error Message */}
          {error && (
            <View
              style={{
                backgroundColor: "#FEE2E2",
                borderRadius: 12,
                borderLeftWidth: 4,
                borderLeftColor: COLORS.alertRed,
                padding: 12,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: COLORS.alertRed,
                  fontSize: 13,
                  fontFamily: "Poppins_500Medium",
                }}
              >
                {error}
              </Text>
            </View>
          )}

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: isSaving || loading ? COLORS.lightGrey : COLORS.primary,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
            }}
            disabled={isSaving || loading}
          >
            {isSaving || loading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 16,
                  fontFamily: "Poppins_700Bold",
                }}
              >
                Save Changes
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              paddingVertical: 14,
              alignItems: "center",
              marginTop: 12,
            }}
            disabled={isSaving || loading}
          >
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 16,
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
