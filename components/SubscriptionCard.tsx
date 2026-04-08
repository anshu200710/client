import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Subscription } from "@/context/SubscriptionContext";

const COLORS = {
  primary: "#1E4FA3",
  secondary: "#2ECC71",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textGray: "#666666",
  textLight: "#9FA3B1",
  border: "#E4E7EF",
  lightGrey: "#F5F7FB",
  success: "#22c55e",
};

interface SubscriptionCardProps {
  subscription: Subscription;
  isSelected?: boolean;
  onPress: (subscription: Subscription) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  isSelected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(subscription)}
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? COLORS.primary : COLORS.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: isSelected ? 8 : 4 },
        shadowOpacity: isSelected ? 0.15 : 0.08,
        shadowRadius: isSelected ? 16 : 8,
        elevation: isSelected ? 8 : 4,
      }}
    >
      {/* Badge */}
      {subscription.badge && (
        <View
          style={{
            position: "absolute",
            top: -12,
            right: 16,
            backgroundColor: COLORS.primary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            zIndex: 10,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.white,
              letterSpacing: 0.5,
            }}
          >
            {subscription.badge}
          </Text>
        </View>
      )}

      {/* Header */}
      <View style={{ marginBottom: 12 }}>
        <Text
          style={{
            fontSize: 24,
            fontFamily: "Poppins_700Bold",
            color: COLORS.textDark,
            marginBottom: 4,
          }}
        >
          {subscription.name}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontFamily: "Poppins_400Regular",
            color: COLORS.textGray,
          }}
        >
          {subscription.description}
        </Text>
      </View>

      {/* Price */}
      <View
        style={{
          marginBottom: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <Text
            style={{
              fontSize: 36,
              fontFamily: "Poppins_700Bold",
              color: COLORS.primary,
            }}
          >
            ₹{subscription.price.toLocaleString("en-IN")}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: COLORS.textGray,
              marginLeft: 8,
              marginBottom: 4,
            }}
          >
            /{subscription.interval}
          </Text>
        </View>
        {subscription.savingsPercentage > 0 && (
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.success,
              marginTop: 4,
            }}
          >
            Save {subscription.savingsPercentage}% annually
          </Text>
        )}
      </View>

      {/* Features List */}
      <View style={{ marginBottom: 20 }}>
        {subscription.benefits.slice(0, 4).map((benefit, index) => (
          <View
            key={index}
            style={{ flexDirection: "row", marginBottom: 10, alignItems: "flex-start" }}
          >
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={COLORS.primary}
              style={{ marginRight: 10, marginTop: 2 }}
            />
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_400Regular",
                color: COLORS.textDark,
                flex: 1,
                lineHeight: 18,
              }}
              numberOfLines={2}
            >
              {benefit}
            </Text>
          </View>
        ))}
        {subscription.benefits.length > 4 && (
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_500Medium",
              color: COLORS.primary,
              marginTop: 8,
            }}
          >
            + {subscription.benefits.length - 4} more benefits
          </Text>
        )}
      </View>

      {/* Select Button */}
      <TouchableOpacity
        onPress={() => onPress(subscription)}
        style={{
          backgroundColor: isSelected ? COLORS.primary : COLORS.lightGrey,
          borderRadius: 16,
          paddingVertical: 14,
          alignItems: "center",
          borderWidth: isSelected ? 0 : 1,
          borderColor: COLORS.border,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_600SemiBold",
            color: isSelected ? COLORS.white : COLORS.primary,
          }}
        >
          {isSelected ? "✓ Selected" : "Choose Plan"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default SubscriptionCard;
