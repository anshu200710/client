import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSubscription } from "@/context/SubscriptionContext";
import SubscriptionCard from "@/components/SubscriptionCard";

const COLORS = {
  primary: "#1E4FA3",
  secondary: "#2ECC71",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textGray: "#666666",
  textLight: "#9FA3B1",
  border: "#E4E7EF",
  lightGrey: "#F5F7FB",
};

export default function SubscriptionChooseScreen() {
  const router = useRouter();
  const { subscriptions, loadingSubscriptions, userSubscriptionLoading, hasActiveSubscription } =
    useSubscription();
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    string | null
  >(null);

  // Sort subscriptions by display order
  const sortedSubscriptions = useMemo(() => {
    return [...subscriptions].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [subscriptions]);

  const handleSelectPlan = (subscriptionId: string) => {
    setSelectedSubscriptionId(subscriptionId);
  };

  const handleContinue = () => {
    if (selectedSubscriptionId) {
      router.push({
        pathname: "/subscription/checkout",
        params: { subscriptionId: selectedSubscriptionId },
      });
    }
  };

  if (loadingSubscriptions || userSubscriptionLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.white,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textDark,
              marginLeft: 16,
              flex: 1,
            }}
          >
            Choose Your Plan
          </Text>
        </View>

        {/* Title Section */}
        {hasActiveSubscription && (
          <View
            style={{
              marginHorizontal: 20,
              marginBottom: 24,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: "#FEF3C7",
              borderRadius: 12,
              borderLeftWidth: 4,
              borderLeftColor: "#F59E0B",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_600SemiBold",
                color: "#92400E",
              }}
            >
              💡 You can upgrade or switch plans anytime
            </Text>
          </View>
        )}

        {/* Description */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.textDark,
              marginBottom: 8,
            }}
          >
            Select a subscription plan
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: COLORS.textGray,
              lineHeight: 20,
            }}
          >
            Get access to premium features, fast document processing, and exclusive tools.
          </Text>
        </View>

        {/* Subscription Cards */}
        <View style={{ paddingHorizontal: 20 }}>
          {sortedSubscriptions.length > 0 ? (
            sortedSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription._id}
                subscription={subscription}
                isSelected={selectedSubscriptionId === subscription._id}
                onPress={(sub) => handleSelectPlan(sub._id)}
              />
            ))
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins_500Medium",
                  color: COLORS.textGray,
                }}
              >
                No subscription plans available
              </Text>
            </View>
          )}
        </View>

        {/* Comparison Section */}
        {sortedSubscriptions.length > 0 && (
          <View style={{ marginHorizontal: 20, marginTop: 32, marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.textDark,
                marginBottom: 16,
              }}
            >
              Why Choose Premium?
            </Text>

            <View
              style={{
                backgroundColor: COLORS.lightGrey,
                borderRadius: 16,
                padding: 20,
              }}
            >
              {[
                {
                  icon: "flash",
                  title: "Fast Processing",
                  desc: "Get documents processed 2-3x faster",
                },
                {
                  icon: "star",
                  title: "Premium Templates",
                  desc: "Access exclusive templates and freebies",
                },
                {
                  icon: "shield-checkmark",
                  title: "Priority Support",
                  desc: "24/7 priority customer support",
                },
                {
                  icon: "trending-up",
                  title: "Advanced Tools",
                  desc: "Premium invoice maker and business tools",
                },
              ].map((item, idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: idx < 3 ? 16 : 0,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: COLORS.white,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins_600SemiBold",
                        color: COLORS.textDark,
                        marginBottom: 2,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textGray,
                      }}
                    >
                      {item.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Continue Button */}
      {sortedSubscriptions.length > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: COLORS.white,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            padding: 20,
            paddingBottom: 24,
          }}
        >
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!selectedSubscriptionId}
            style={{
              backgroundColor: selectedSubscriptionId
                ? COLORS.primary
                : COLORS.textLight,
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.white,
              }}
            >
              Continue to Payment
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
