import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const COLORS = {
  primary: "#1E4FA3",
  secondary: "#2ECC71",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textGray: "#666666",
  textLight: "#9FA3B1",
  border: "#E4E7EF",
  lightGrey: "#F5F7FB",
  dark: "#000000",
};

interface PremiumPaywallProps {
  visible: boolean;
  onClose: () => void;
  featureName?: string;
  onUpgradePress?: () => void;
}

export const PremiumPaywall: React.FC<PremiumPaywallProps> = ({
  visible,
  onClose,
  featureName = "This feature",
  onUpgradePress,
}) => {
  const router = useRouter();

  const handleUpgrade = () => {
    if (onUpgradePress) {
      onUpgradePress();
    } else {
      router.push("/subscription/choose");
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 24,
            paddingBottom: 32,
            maxHeight: "80%",
          }}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10,
            }}
          >
            <Ionicons name="close" size={24} color={COLORS.textDark} />
          </TouchableOpacity>

          {/* Icon */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#EFF6FF",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
              alignSelf: "center",
            }}
          >
            <Ionicons name="star" size={40} color={COLORS.primary} />
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textDark,
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            Unlock Premium
          </Text>

          {/* Description */}
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Poppins_400Regular",
              color: COLORS.textGray,
              textAlign: "center",
              marginBottom: 24,
              lineHeight: 22,
            }}
          >
            {featureName} is a premium feature. Upgrade your subscription to
            access exclusive tools and benefits.
          </Text>

          {/* Features List */}
          <View
            style={{
              backgroundColor: COLORS.lightGrey,
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
            }}
          >
            {[
              "Fast document delivery",
              "Premium templates & freebies",
              "WhatsApp message templates",
              "Priority support",
            ].map((feature, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: index < 3 ? 12 : 0,
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={COLORS.primary}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Poppins_500Medium",
                    color: COLORS.textDark,
                  }}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          {/* Buttons */}
          <TouchableOpacity
            onPress={handleUpgrade}
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.white,
              }}
            >
              Upgrade Now
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: COLORS.lightGrey,
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.textDark,
              }}
            >
              Maybe Later
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PremiumPaywall;
