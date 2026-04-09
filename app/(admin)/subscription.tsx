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
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [editedPrice, setEditedPrice] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Create Plan form state
  const [createForm, setCreateForm] = useState({
    name: "",
    price: "",
    interval: "monthly",
    durationInDays: "",
    features: "",
    benefits: "",
    displayOrder: "",
  });
  const [createLoading, setCreateLoading] = useState(false);

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

  const handleCreatePlan = async () => {
    if (
      !createForm.name ||
      !createForm.price ||
      !createForm.durationInDays ||
      !createForm.features ||
      !token
    ) {
      Alert.alert("Validation Error", "Please fill all required fields");
      return;
    }

    try {
      setCreateLoading(true);

      const featuresArray = createForm.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f);
      const benefitsArray = createForm.benefits
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f);

      const planData = {
        name: createForm.name,
        price: parseInt(createForm.price),
        interval: createForm.interval,
        durationInDays: parseInt(createForm.durationInDays),
        features: featuresArray,
        benefits: benefitsArray,
        displayOrder: createForm.displayOrder
          ? parseInt(createForm.displayOrder)
          : subscriptions.length + 1,
        isActive: true,
      };

      const response = await subscriptionService.createSubscription(
        planData,
        token
      );

      if (response.success) {
        Alert.alert("Success", "Plan created successfully");
        setCreateForm({
          name: "",
          price: "",
          interval: "monthly",
          durationInDays: "",
          features: "",
          benefits: "",
          displayOrder: "",
        });
        setCreateModalVisible(false);
        loadData();
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create plan");
    } finally {
      setCreateLoading(false);
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.textDark,
              }}
            >
              Subscription Plans
            </Text>
            <TouchableOpacity
              onPress={() => setCreateModalVisible(true)}
              style={{
                backgroundColor: COLORS.primary,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Ionicons name="add" size={16} color={COLORS.white} />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.white,
                }}
              >
                New Plan
              </Text>
            </TouchableOpacity>
          </View>

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

      {/* Create Plan Modal */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.textDark,
                }}
              >
                Create New Plan
              </Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 24 }}>
              {/* Plan Name */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                    marginBottom: 6,
                  }}
                >
                  Plan Name *
                </Text>
                <View
                  style={{
                    backgroundColor: COLORS.lightGrey,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <TextInput
                    placeholder="e.g., Monthly Pro"
                    placeholderTextColor={COLORS.textLight}
                    value={createForm.name}
                    onChangeText={(text) =>
                      setCreateForm({ ...createForm, name: text })
                    }
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_400Regular",
                      color: COLORS.textDark,
                      paddingVertical: 12,
                    }}
                  />
                </View>
              </View>

              {/* Price */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                    marginBottom: 6,
                  }}
                >
                  Price (₹) *
                </Text>
                <View
                  style={{
                    backgroundColor: COLORS.lightGrey,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <TextInput
                    placeholder="Enter price"
                    placeholderTextColor={COLORS.textLight}
                    value={createForm.price}
                    onChangeText={(text) =>
                      setCreateForm({ ...createForm, price: text })
                    }
                    keyboardType="numeric"
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_400Regular",
                      color: COLORS.textDark,
                      paddingVertical: 12,
                    }}
                  />
                </View>
              </View>

              {/* Interval */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                    marginBottom: 6,
                  }}
                >
                  Interval *
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  {["monthly", "yearly"].map((interval) => (
                    <TouchableOpacity
                      key={interval}
                      onPress={() =>
                        setCreateForm({ ...createForm, interval })
                      }
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 12,
                        backgroundColor:
                          createForm.interval === interval
                            ? COLORS.primary
                            : COLORS.lightGrey,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "Poppins_600SemiBold",
                          color:
                            createForm.interval === interval
                              ? COLORS.white
                              : COLORS.textDark,
                        }}
                      >
                        {interval.charAt(0).toUpperCase() + interval.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Duration in Days */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                    marginBottom: 6,
                  }}
                >
                  Duration (days) *
                </Text>
                <View
                  style={{
                    backgroundColor: COLORS.lightGrey,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <TextInput
                    placeholder="e.g., 30"
                    placeholderTextColor={COLORS.textLight}
                    value={createForm.durationInDays}
                    onChangeText={(text) =>
                      setCreateForm({ ...createForm, durationInDays: text })
                    }
                    keyboardType="numeric"
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_400Regular",
                      color: COLORS.textDark,
                      paddingVertical: 12,
                    }}
                  />
                </View>
              </View>

              {/* Features */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                    marginBottom: 6,
                  }}
                >
                  Features (comma-separated) *
                </Text>
                <View
                  style={{
                    backgroundColor: COLORS.lightGrey,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <TextInput
                    placeholder="Fast processing, Premium templates"
                    placeholderTextColor={COLORS.textLight}
                    value={createForm.features}
                    onChangeText={(text) =>
                      setCreateForm({ ...createForm, features: text })
                    }
                    multiline
                    numberOfLines={3}
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_400Regular",
                      color: COLORS.textDark,
                      paddingVertical: 12,
                      textAlignVertical: "top",
                    }}
                  />
                </View>
              </View>

              {/* Benefits */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                    marginBottom: 6,
                  }}
                >
                  Benefits (comma-separated)
                </Text>
                <View
                  style={{
                    backgroundColor: COLORS.lightGrey,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <TextInput
                    placeholder="Priority support, Premium access"
                    placeholderTextColor={COLORS.textLight}
                    value={createForm.benefits}
                    onChangeText={(text) =>
                      setCreateForm({ ...createForm, benefits: text })
                    }
                    multiline
                    numberOfLines={3}
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_400Regular",
                      color: COLORS.textDark,
                      paddingVertical: 12,
                      textAlignVertical: "top",
                    }}
                  />
                </View>
              </View>

              {/* Display Order */}
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                    marginBottom: 6,
                  }}
                >
                  Display Order (optional)
                </Text>
                <View
                  style={{
                    backgroundColor: COLORS.lightGrey,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <TextInput
                    placeholder="Leave blank for auto"
                    placeholderTextColor={COLORS.textLight}
                    value={createForm.displayOrder}
                    onChangeText={(text) =>
                      setCreateForm({ ...createForm, displayOrder: text })
                    }
                    keyboardType="numeric"
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_400Regular",
                      color: COLORS.textDark,
                      paddingVertical: 12,
                    }}
                  />
                </View>
              </View>

              {/* Buttons */}
              <TouchableOpacity
                onPress={handleCreatePlan}
                disabled={createLoading}
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  marginBottom: 10,
                  opacity: createLoading ? 0.6 : 1,
                }}
              >
                {createLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.white,
                    }}
                  >
                    Create Plan
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCreateModalVisible(false)}
                disabled={createLoading}
                style={{
                  backgroundColor: COLORS.lightGrey,
                  borderRadius: 12,
                  paddingVertical: 14,
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
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
