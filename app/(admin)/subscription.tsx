import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import * as subscriptionService from "@/services/subscription-service";

const COLORS = {
  primary: "#1E4FA3",
  secondary: "#2ECC71",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textGray: "#666666",
  textLight: "#9FA3B1",
  border: "#E4E7EF",
  lightGrey: "#F5F7FB",
  danger: "#ef4444",
  success: "#22c55e",
};

interface Subscription {
  _id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  benefits: string[];
  isActive: boolean;
}

export default function AdminSubscriptionScreen() {
  const { token, user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [editedPrice, setEditedPrice] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Check admin access
  useEffect(() => {
    if (user?.role !== "admin") {
      Alert.alert("Access Denied", "Only admins can access this page");
      return;
    }
    loadData();
  }, [user, token]);

  const loadData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const [subsResponse, statsResponse] = await Promise.all([
        subscriptionService.getAllSubscriptionsAdmin(token),
        subscriptionService.getSubscriptionStats(token),
      ]);

      if (subsResponse.success) {
        setSubscriptions(subsResponse.data);
      }
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPrice = async () => {
    if (!selectedSub || !editedPrice || !token) return;

    try {
      setEditLoading(true);
      const response = await subscriptionService.updateSubscription(
        selectedSub._id,
        { price: parseInt(editedPrice) },
        token
      );

      if (response.success) {
        Alert.alert("Success", "Price updated successfully");
        setEditModalVisible(false);
        loadData();
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleStatus = async (subscriptionId: string) => {
    if (!token) return;

    try {
      const response = await subscriptionService.toggleSubscriptionStatus(
        subscriptionId,
        token
      );

      if (response.success) {
        Alert.alert("Success", response.message);
        loadData();
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (loading) {
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
        <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textDark,
            }}
          >
            Subscription Admin
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Poppins_400Regular",
              color: COLORS.textGray,
              marginTop: 4,
            }}
          >
            Manage subscription plans and pricing
          </Text>
        </View>

        {/* Statistics */}
        {stats && (
          <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
            <View
              style={{
                backgroundColor: COLORS.lightGrey,
                borderRadius: 16,
                padding: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_500Medium",
                      color: COLORS.textLight,
                      marginBottom: 4,
                    }}
                  >
                    Active Subscriptions
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Poppins_700Bold",
                      color: COLORS.primary,
                    }}
                  >
                    {stats.totalActiveSubscriptions}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_500Medium",
                      color: COLORS.textLight,
                      marginBottom: 4,
                    }}
                  >
                    Total Revenue
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Poppins_700Bold",
                      color: COLORS.success,
                    }}
                  >
                    ₹{(stats.totalRevenue || 0).toLocaleString("en-IN")}
                  </Text>
                </View>
              </View>

              {/* Subscription Breakdown */}
              {stats.subscriptionsByType && stats.subscriptionsByType.length > 0 && (
                <View style={{ borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.textDark,
                      marginBottom: 8,
                    }}
                  >
                    Breakdown
                  </Text>
                  {stats.subscriptionsByType.map((item: any, idx: number) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: idx < stats.subscriptionsByType.length - 1 ? 6 : 0,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_400Regular",
                          color: COLORS.textGray,
                        }}
                      >
                        {item._id}: {item.count} active
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_500Medium",
                          color: COLORS.textDark,
                        }}
                      >
                        ₹{(item.totalRevenue / 100).toLocaleString("en-IN")}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Subscriptions List */}
        <View style={{ marginHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.textDark,
              marginBottom: 12,
            }}
          >
            Subscription Plans
          </Text>

          {subscriptions.map((subscription) => (
            <View
              key={subscription._id}
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: subscription.isActive ? COLORS.border : "#ffcccc",
                padding: 16,
                marginBottom: 12,
              }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: "Poppins_700Bold",
                      color: COLORS.textDark,
                    }}
                  >
                    {subscription.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_400Regular",
                      color: COLORS.textGray,
                      marginTop: 2,
                    }}
                  >
                    {subscription.interval}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: subscription.isActive
                      ? "#D1FAE5"
                      : "#FEE2E2",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: "Poppins_600SemiBold",
                      color: subscription.isActive
                        ? COLORS.success
                        : COLORS.danger,
                    }}
                  >
                    {subscription.isActive ? "Active" : "Inactive"}
                  </Text>
                </View>
              </View>

              {/* Price Section */}
              <View
                style={{
                  backgroundColor: COLORS.lightGrey,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_500Medium",
                      color: COLORS.textGray,
                    }}
                  >
                    Current Price
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "Poppins_700Bold",
                      color: COLORS.primary,
                      marginTop: 2,
                    }}
                  >
                    ₹{subscription.price.toLocaleString("en-IN")}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedSub(subscription);
                    setEditedPrice(subscription.price.toString());
                    setEditModalVisible(true);
                  }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    backgroundColor: COLORS.primary,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.white,
                    }}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Features Preview */}
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                    marginBottom: 6,
                  }}
                >
                  Features
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                  {subscription.features.slice(0, 3).map((feature, idx) => (
                    <View
                      key={idx}
                      style={{
                        backgroundColor: COLORS.lightGrey,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontFamily: "Poppins_500Medium",
                          color: COLORS.textDark,
                        }}
                      >
                        {feature}
                      </Text>
                    </View>
                  ))}
                  {subscription.features.length > 3 && (
                    <View
                      style={{
                        backgroundColor: COLORS.lightGrey,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontFamily: "Poppins_500Medium",
                          color: COLORS.textDark,
                        }}
                      >
                        +{subscription.features.length - 3}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Action Buttons */}
              <TouchableOpacity
                onPress={() => handleToggleStatus(subscription._id)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: subscription.isActive ? "#FEE2E2" : "#D1FAE5",
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: subscription.isActive ? COLORS.danger : COLORS.success,
                  }}
                >
                  {subscription.isActive ? "Deactivate" : "Activate"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
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
              Edit {selectedSub?.name} Price
            </Text>

            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_400Regular",
                color: COLORS.textGray,
                marginBottom: 16,
              }}
            >
              Current price: ₹{selectedSub?.price}
            </Text>

            {/* Input */}
            <View
              style={{
                backgroundColor: COLORS.lightGrey,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <TextInput
                placeholder="Enter new price"
                placeholderTextColor={COLORS.textLight}
                value={editedPrice}
                onChangeText={setEditedPrice}
                keyboardType="numeric"
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textDark,
                  paddingVertical: 12,
                }}
              />
            </View>

            {/* Buttons */}
            <TouchableOpacity
              onPress={handleEditPrice}
              disabled={editLoading || !editedPrice}
              style={{
                backgroundColor: COLORS.primary,
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
                marginBottom: 10,
                opacity: editLoading || !editedPrice ? 0.6 : 1,
              }}
            >
              {editLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.white,
                  }}
                >
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setEditModalVisible(false)}
              disabled={editLoading}
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
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
