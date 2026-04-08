import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
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
};

export default function SubscriptionCheckoutScreen() {
  const router = useRouter();
  const { subscriptionId } = useLocalSearchParams<{ subscriptionId: string }>();
  const { subscriptions, initiatePurchase, verifyPayment } = useSubscription();

  const [loading, setLoading] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  useEffect(() => {
    if (subscriptionId && subscriptions.length > 0) {
      const selected = subscriptions.find((sub) => sub._id === subscriptionId);
      setSelectedSubscription(selected);
    }
  }, [subscriptionId, subscriptions]);

  const handlePayment = async () => {
    if (!selectedSubscription) {
      Alert.alert("Error", "Subscription not found");
      return;
    }

    try {
      setLoading(true);

      // Initiate purchase on backend
      const orderData = await initiatePurchase(selectedSubscription._id);

      // TODO: Integrate actual Razorpay payment
      // For now, show a mock payment screen
      Alert.alert(
        "Payment Integration",
        `Ready to process payment of ₹${selectedSubscription.price}\n\nNote: Razorpay integration will be handled via WebView`,
        [
          {
            text: "Cancel",
            onPress: () => setLoading(false),
          },
          {
            text: "Mock Success",
            onPress: async () => {
              // Mock success payment
              try {
                await verifyPayment({
                  subscriptionId: selectedSubscription._id,
                  paymentId: "pay_mock_" + Date.now(),
                  orderId: "order_mock_" + Date.now(),
                  signature: "sig_mock_" + Date.now(),
                });

                Alert.alert("Success", "Subscription activated!", [
                  {
                    text: "View Subscription",
                    onPress: () => {
                      router.push(
                        "/(dashboard)/profile-pages/subscription"
                      );
                    },
                  },
                ]);
              } catch (error: any) {
                Alert.alert("Error", error.message);
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
      setLoading(false);
    }
  };

  if (!selectedSubscription) {
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
            }}
          >
            Checkout
          </Text>
        </View>

        {/* Order Summary */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.textLight,
              marginBottom: 12,
              letterSpacing: 0.5,
            }}
          >
            ORDER SUMMARY
          </Text>

          <View
            style={{
              backgroundColor: COLORS.lightGrey,
              borderRadius: 16,
              padding: 16,
            }}
          >
            {/* Plan Details */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                  }}
                >
                  {selectedSubscription.name} Plan
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textGray,
                    marginTop: 2,
                  }}
                >
                  {selectedSubscription.durationInDays} days validity
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.primary,
                }}
              >
                ₹{selectedSubscription.price.toLocaleString("en-IN")}
              </Text>
            </View>

            <View style={{ borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: 12 }} />

            {/* Subtotal */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textGray,
                }}
              >
                Subtotal
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_500Medium",
                  color: COLORS.textDark,
                }}
              >
                ₹{selectedSubscription.price.toLocaleString("en-IN")}
              </Text>
            </View>

            {/* Tax (0 for now) */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textGray,
                }}
              >
                Tax (18% GST)
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_500Medium",
                  color: COLORS.textDark,
                }}
              >
                ₹{(selectedSubscription.price * 0.18).toLocaleString("en-IN")}
              </Text>
            </View>

            <View style={{ borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12 }} />

            {/* Total */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
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
                Total Amount
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.primary,
                }}
              >
                ₹{(selectedSubscription.price * 1.18).toLocaleString("en-IN")}
              </Text>
            </View>
          </View>
        </View>

        {/* Billing Info */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.textLight,
              marginBottom: 12,
              letterSpacing: 0.5,
            }}
          >
            INCLUDED BENEFITS
          </Text>

          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
              padding: 16,
            }}
          >
            {selectedSubscription.benefits.map((benefit: string, idx: number) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: idx < selectedSubscription.benefits.length - 1 ? 12 : 0,
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={COLORS.success}
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
                >
                  {benefit}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Secure Payment Info */}
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 24,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 10,
            backgroundColor: "#EFF6FF",
            borderRadius: 12,
          }}
        >
          <Ionicons
            name="shield-checkmark"
            size={18}
            color={COLORS.primary}
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_500Medium",
              color: COLORS.primary,
              flex: 1,
            }}
          >
            Your payment is secure and encrypted
          </Text>
        </View>

        {/* Terms */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: COLORS.textGray,
              textAlign: "center",
              lineHeight: 18,
            }}
          >
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            Subscription will renew automatically.
          </Text>
        </View>
      </ScrollView>

      {/* Pay Button */}
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
        }}
      >
        <TouchableOpacity
          onPress={handlePayment}
          disabled={loading}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 16,
            paddingVertical: 14,
            alignItems: "center",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.white,
              }}
            >
              Pay ₹{(selectedSubscription.price * 1.18).toLocaleString("en-IN")}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
