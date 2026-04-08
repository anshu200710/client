import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Modal,
} from "react-native";
import { Stack, useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSubscription } from "@/context/SubscriptionContext";

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
  warning: "#f59e0b",
  danger: "#ef4444",
};

export default function SubscriptionManagementScreen() {
  const router = useRouter();
  const {
    userSubscription,
    hasActiveSubscription,
    subscriptionTier,
    userSubscriptionLoading,
    cancelSubscription,
    refreshSubscriptionStatus,
  } = useSubscription();

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshSubscriptionStatus();
    }, [])
  );

  const handleCancelSubscription = async () => {
    if (!cancellationReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    try {
      setCancelLoading(true);
      await cancelSubscription(cancellationReason);
      setCancelModalVisible(false);
      alert("Subscription cancelled successfully");
    } catch (error: any) {
      alert("Failed to cancel subscription: " + error.message);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleUpgradeOrDowngrade = () => {
    router.push("/(dashboard)/subscription/choose");
  };

  if (userSubscriptionLoading) {
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
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
            }}
          >
            My Subscription
          </Text>
        </View>

        {hasActiveSubscription && userSubscription ? (
          <>
            {/* Active Subscription Card */}
            <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
              <LinearGradient
                colors={[COLORS.primary, "#2B6FE6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 24,
                  padding: 24,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 20,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Poppins_500Medium",
                        color: "rgba(255, 255, 255, 0.8)",
                        marginBottom: 4,
                      }}
                    >
                      CURRENT PLAN
                    </Text>
                    <Text
                      style={{
                        fontSize: 28,
                        fontFamily: "Poppins_700Bold",
                        color: COLORS.white,
                      }}
                    >
                      {subscriptionTier === "monthly"
                        ? "Monthly"
                        : subscriptionTier === "yearly"
                        ? "Yearly"
                        : "Free"}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="star" size={32} color={COLORS.white} />
                  </View>
                </View>

                {/* Subscription Details */}
                <View style={{ marginBottom: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons
                      name="calendar"
                      size={16}
                      color={COLORS.white}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins_400Regular",
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      Started: {new Date(userSubscription.startDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons
                      name="time"
                      size={16}
                      color={COLORS.white}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins_400Regular",
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      Renews: {new Date(userSubscription.endDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={COLORS.white}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins_400Regular",
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      {userSubscription.daysRemaining} days remaining
                    </Text>
                  </View>
                </View>

                {/* Auto Renew Status */}
                <View
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.white,
                    }}
                  >
                    {userSubscription.autoRenew
                      ? "✓ Auto-renewal enabled"
                      : "⚠ Auto-renewal disabled"}
                  </Text>
                </View>
              </LinearGradient>
            </View>

            {/* Benefits Section */}
            <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.textDark,
                  marginBottom: 12,
                }}
              >
                Your Benefits
              </Text>

              <View
                style={{
                  backgroundColor: COLORS.lightGrey,
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                {[
                  "⚡ Fast document delivery (2-3x faster)",
                  "🎨 Premium templates & freebies",
                  "💬 WhatsApp message templates",
                  "📄 Advanced invoice maker",
                  "🎯 Visiting card generator",
                  "🔔 Priority customer support",
                ].map((benefit, idx) => (
                  <View
                    key={idx}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: idx < 5 ? 12 : 0,
                    }}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={COLORS.success}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins_500Medium",
                        color: COLORS.textDark,
                      }}
                    >
                      {benefit}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
              <TouchableOpacity
                onPress={handleUpgradeOrDowngrade}
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
                  Upgrade or Downgrade Plan
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCancelModalVisible(true)}
                style={{
                  backgroundColor: COLORS.lightGrey,
                  borderRadius: 16,
                  paddingVertical: 14,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: COLORS.danger,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.danger,
                  }}
                >
                  Cancel Subscription
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* No Subscription */}
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 40,
                alignItems: "center",
                paddingVertical: 40,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: COLORS.lightGrey,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <Ionicons name="star-outline" size={40} color={COLORS.textLight} />
              </View>

              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.textDark,
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                No Active Subscription
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textGray,
                  textAlign: "center",
                  marginBottom: 24,
                  lineHeight: 20,
                }}
              >
                Upgrade to premium to unlock exclusive features and benefits.
              </Text>

              <TouchableOpacity
                onPress={handleUpgradeOrDowngrade}
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: 16,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.white,
                  }}
                >
                  View Plans
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* FAQ Section */}
        <View style={{ marginHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.textDark,
              marginBottom: 12,
            }}
          >
            FAQ
          </Text>

          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
              overflow: "hidden",
            }}
          >
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes, cancel anytime without penalties.",
              },
              {
                q: "When does renewal happen?",
                a: "On the date shown in your subscription card.",
              },
              {
                q: "Can I change my plan?",
                a: "Yes, upgrade or downgrade plans instantly.",
              },
            ].map((item, idx) => (
              <View
                key={idx}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: idx < 2 ? 1 : 0,
                  borderBottomColor: COLORS.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                    marginBottom: 6,
                  }}
                >
                  {item.q}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textGray,
                  }}
                >
                  {item.a}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Cancellation Modal */}
      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 24,
              padding: 24,
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textDark,
                marginBottom: 12,
              }}
            >
              Cancel Subscription?
            </Text>

            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_400Regular",
                color: COLORS.textGray,
                marginBottom: 16,
                lineHeight: 20,
              }}
            >
              We'd love to know why you're leaving. This helps us improve.
            </Text>

            {/* Reason Input */}
            <View
              style={{
                backgroundColor: COLORS.lightGrey,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 16,
                minHeight: 80,
              }}
            >
              <Text editable
                multiline
                placeholder="Tell us why..."
                placeholderTextColor={COLORS.textLight}
                value={cancellationReason}
                onChangeText={setCancellationReason}
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textDark,
                  paddingVertical: 12,
                }}
              />
            </View>

            {/* Buttons */}
            <TouchableOpacity
              onPress={handleCancelSubscription}
              disabled={cancelLoading || !cancellationReason.trim()}
              style={{
                backgroundColor: COLORS.danger,
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
                marginBottom: 10,
                opacity: cancelLoading || !cancellationReason.trim() ? 0.6 : 1,
              }}
            >
              {cancelLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.white,
                  }}
                >
                  Yes, Cancel Subscription
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCancelModalVisible(false)}
              disabled={cancelLoading}
              style={{
                backgroundColor: COLORS.lightGrey,
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.textDark,
                }}
              >
                Keep My Subscription
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
