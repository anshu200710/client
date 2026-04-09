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
  FlatList,
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
  warning: "#f59e0b",
};

interface Subscription {
  _id: string;
  name: string;
  description?: string;
  price: number;
  interval: string;
  durationInDays: number;
  features: string[];
  benefits: string[];
  isActive: boolean;
  badge?: string;
  displayOrder?: number;
}

interface EditingPlan {
  _id: string;
  name: string;
  description: string;
  price: string;
  interval: string;
  durationInDays: string;
  features: string[];
  benefits: string[];
  badge: string;
}

export default function AdminSubscriptionEnhancedScreen() {
  const { token, user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  // Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<EditingPlan | null>(null);
  const [newFeature, setNewFeature] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Create Modal State
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    price: "",
    interval: "monthly" as const,
    durationInDays: "",
    features: [] as string[],
    benefits: [] as string[],
    badge: "",
    newFeature: "",
    newBenefit: "",
  });
  const [createLoading, setCreateLoading] = useState(false);

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

  const handleDeletePlan = (subscriptionId: string) => {
    Alert.alert(
      "Delete Plan",
      "Are you sure you want to delete this plan? This action cannot be undone.",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              if (!token) return;
              const response = await subscriptionService.deleteSubscription?.(
                subscriptionId,
                token
              );
              if (response?.success) {
                Alert.alert("Success", "Plan deleted successfully");
                loadData();
              }
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete plan");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleEditPlan = async () => {
    if (
      !editingPlan ||
      !editingPlan.name ||
      !editingPlan.price ||
      !editingPlan.durationInDays ||
      !token
    ) {
      Alert.alert("Validation Error", "Please fill all required fields");
      return;
    }

    try {
      setEditLoading(true);
      const updateData = {
        name: editingPlan.name,
        description: editingPlan.description,
        price: parseInt(editingPlan.price),
        interval: editingPlan.interval,
        durationInDays: parseInt(editingPlan.durationInDays),
        features: editingPlan.features,
        benefits: editingPlan.benefits,
        badge: editingPlan.badge || undefined,
      };

      const response = await subscriptionService.updateSubscription(
        editingPlan._id,
        updateData,
        token
      );

      if (response?.success) {
        Alert.alert("Success", "Plan updated successfully");
        setEditModalVisible(false);
        setEditingPlan(null);
        loadData();
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update plan");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    if (
      !createForm.name ||
      !createForm.price ||
      !createForm.durationInDays ||
      createForm.features.length === 0 ||
      !token
    ) {
      Alert.alert(
        "Validation Error",
        "Please fill all required fields and add at least one feature"
      );
      return;
    }

    try {
      setCreateLoading(true);
      const planData = {
        name: createForm.name,
        description: createForm.description,
        price: parseInt(createForm.price),
        interval: createForm.interval,
        durationInDays: parseInt(createForm.durationInDays),
        features: createForm.features,
        benefits: createForm.benefits,
        badge: createForm.badge || undefined,
        displayOrder: subscriptions.length + 1,
        isActive: true,
      };

      const response = await subscriptionService.createSubscription(
        planData,
        token
      );

      if (response?.success) {
        Alert.alert("Success", "Plan created successfully");
        setCreateForm({
          name: "",
          description: "",
          price: "",
          interval: "monthly",
          durationInDays: "",
          features: [],
          benefits: [],
          badge: "",
          newFeature: "",
          newBenefit: "",
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

  const openEditModal = (plan: Subscription) => {
    setEditingPlan({
      _id: plan._id,
      name: plan.name,
      description: plan.description || "",
      price: plan.price.toString(),
      interval: plan.interval,
      durationInDays: plan.durationInDays.toString(),
      features: [...plan.features],
      benefits: [...plan.benefits],
      badge: plan.badge || "",
    });
    setEditModalVisible(true);
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textDark,
              }}
            >
              Subscription Plans
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: COLORS.textGray,
                marginTop: 4,
              }}
            >
              Manage all subscription plans
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setCreateModalVisible(true)}
            style={{
              backgroundColor: COLORS.primary,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Ionicons name="add" size={20} color={COLORS.white} />
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.white,
              }}
            >
              New Plan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        {stats && (
          <View style={{ marginHorizontal: 20, marginTop: 20, marginBottom: 20 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: COLORS.lightGrey,
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "Poppins_500Medium",
                    color: COLORS.textLight,
                    marginBottom: 4,
                  }}
                >
                  Active Plans
                </Text>
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.primary,
                  }}
                >
                  {subscriptions.filter((s) => s.isActive).length}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: COLORS.lightGrey,
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "Poppins_500Medium",
                    color: COLORS.textLight,
                    marginBottom: 4,
                  }}
                >
                  Total Revenue
                </Text>
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.success,
                  }}
                >
                  ₹{(stats.totalRevenue || 0).toLocaleString("en-IN")}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Plans List */}
        <View style={{ marginHorizontal: 20 }}>
          {subscriptions.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                paddingVertical: 40,
                backgroundColor: COLORS.lightGrey,
                borderRadius: 16,
              }}
            >
              <Ionicons
                name="layers-outline"
                size={48}
                color={COLORS.textLight}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.textGray,
                  marginTop: 12,
                }}
              >
                No plans created yet
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textLight,
                  marginTop: 4,
                }}
              >
                Create your first subscription plan
              </Text>
            </View>
          ) : (
            subscriptions.map((plan) => (
              <View
                key={plan._id}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: plan.isActive ? COLORS.border : COLORS.danger,
                  padding: 16,
                  marginBottom: 16,
                  overflow: "hidden",
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
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: "Poppins_700Bold",
                        color: COLORS.textDark,
                      }}
                    >
                      {plan.name}
                    </Text>
                    {plan.description && (
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_400Regular",
                          color: COLORS.textGray,
                          marginTop: 4,
                        }}
                      >
                        {plan.description}
                      </Text>
                    )}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 8,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: plan.isActive ? "#D1FAE5" : "#FEE2E2",
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 6,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: "Poppins_600SemiBold",
                            color: plan.isActive
                              ? COLORS.success
                              : COLORS.danger,
                          }}
                        >
                          {plan.isActive ? "●  Active" : "●  Inactive"}
                        </Text>
                      </View>
                      {plan.badge && (
                        <View
                          style={{
                            backgroundColor: COLORS.warning + "22",
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 6,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: "Poppins_600SemiBold",
                              color: COLORS.warning,
                            }}
                          >
                            ★ {plan.badge}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Price Section */}
                <View
                  style={{
                    backgroundColor: COLORS.lightGrey,
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 12,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Poppins_500Medium",
                        color: COLORS.textLight,
                      }}
                    >
                      PRICE & DURATION
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 24,
                          fontFamily: "Poppins_700Bold",
                          color: COLORS.primary,
                        }}
                      >
                        ₹{plan.price.toLocaleString("en-IN")}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_500Medium",
                          color: COLORS.textGray,
                        }}
                      >
                        / {plan.interval}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textLight,
                        marginTop: 4,
                      }}
                    >
                      {plan.durationInDays} days validity
                    </Text>
                  </View>
                </View>

                {/* Features */}
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.textDark,
                      marginBottom: 8,
                    }}
                  >
                    ✨ Features ({plan.features.length})
                  </Text>
                  <View
                    style={{
                      backgroundColor: COLORS.lightGrey,
                      borderRadius: 10,
                      padding: 8,
                    }}
                  >
                    {plan.features.length === 0 ? (
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_400Regular",
                          color: COLORS.textLight,
                          fontStyle: "italic",
                        }}
                      >
                        No features added
                      </Text>
                    ) : (
                      plan.features.map((feature, idx) => (
                        <View
                          key={idx}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 6,
                            borderBottomWidth:
                              idx < plan.features.length - 1 ? 1 : 0,
                            borderBottomColor: COLORS.border,
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
                              fontSize: 12,
                              fontFamily: "Poppins_500Medium",
                              color: COLORS.textDark,
                              flex: 1,
                            }}
                          >
                            {feature}
                          </Text>
                        </View>
                      ))
                    )}
                  </View>
                </View>

                {/* Action Buttons */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => openEditModal(plan)}
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.primary,
                      borderRadius: 10,
                      paddingVertical: 12,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Ionicons
                      name="pencil"
                      size={16}
                      color={COLORS.white}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins_600SemiBold",
                        color: COLORS.white,
                      }}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeletePlan(plan._id)}
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.danger,
                      borderRadius: 10,
                      paddingVertical: 12,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Ionicons
                      name="trash"
                      size={16}
                      color={COLORS.white}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins_600SemiBold",
                        color: COLORS.white,
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 100,
            }}
          >
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
                Edit Plan
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
              {editingPlan && (
                <>
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
                    <TextInput
                      placeholder="e.g., Premium Monthly"
                      placeholderTextColor={COLORS.textLight}
                      value={editingPlan.name}
                      onChangeText={(text) =>
                        setEditingPlan({ ...editingPlan, name: text })
                      }
                      style={{
                        backgroundColor: COLORS.lightGrey,
                        borderRadius: 10,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textDark,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                      }}
                    />
                  </View>

                  {/* Description */}
                  <View style={{ marginBottom: 16 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Poppins_600SemiBold",
                        color: COLORS.textDark,
                        marginBottom: 6,
                      }}
                    >
                      Description (Sub-heading)
                    </Text>
                    <TextInput
                      placeholder="e.g., Perfect for growing businesses"
                      placeholderTextColor={COLORS.textLight}
                      value={editingPlan.description}
                      onChangeText={(text) =>
                        setEditingPlan({ ...editingPlan, description: text })
                      }
                      multiline
                      numberOfLines={2}
                      style={{
                        backgroundColor: COLORS.lightGrey,
                        borderRadius: 10,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textDark,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                        textAlignVertical: "top",
                      }}
                    />
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
                    <TextInput
                      placeholder="Enter price"
                      placeholderTextColor={COLORS.textLight}
                      value={editingPlan.price}
                      onChangeText={(text) =>
                        setEditingPlan({ ...editingPlan, price: text })
                      }
                      keyboardType="numeric"
                      style={{
                        backgroundColor: COLORS.lightGrey,
                        borderRadius: 10,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textDark,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                      }}
                    />
                  </View>

                  {/* Duration */}
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
                    <TextInput
                      placeholder="e.g., 30"
                      placeholderTextColor={COLORS.textLight}
                      value={editingPlan.durationInDays}
                      onChangeText={(text) =>
                        setEditingPlan({
                          ...editingPlan,
                          durationInDays: text,
                        })
                      }
                      keyboardType="numeric"
                      style={{
                        backgroundColor: COLORS.lightGrey,
                        borderRadius: 10,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textDark,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                      }}
                    />
                  </View>

                  {/* Badge */}
                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Poppins_600SemiBold",
                        color: COLORS.textDark,
                        marginBottom: 6,
                      }}
                    >
                      Badge (e.g., POPULAR, BEST VALUE)
                    </Text>
                    <TextInput
                      placeholder="Optional badge text"
                      placeholderTextColor={COLORS.textLight}
                      value={editingPlan.badge}
                      onChangeText={(text) =>
                        setEditingPlan({ ...editingPlan, badge: text })
                      }
                      style={{
                        backgroundColor: COLORS.lightGrey,
                        borderRadius: 10,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textDark,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                      }}
                    />
                  </View>

                  {/* Features Management */}
                  <View style={{ marginBottom: 20 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_600SemiBold",
                          color: COLORS.textDark,
                        }}
                      >
                        Features ({editingPlan.features.length})
                      </Text>
                    </View>

                    {/* Add Feature Input */}
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        marginBottom: 12,
                      }}
                    >
                      <TextInput
                        placeholder="Add a feature..."
                        placeholderTextColor={COLORS.textLight}
                        value={newFeature}
                        onChangeText={setNewFeature}
                        style={{
                          flex: 1,
                          backgroundColor: COLORS.lightGrey,
                          borderRadius: 10,
                          paddingHorizontal: 12,
                          paddingVertical: 10,
                          fontSize: 13,
                          fontFamily: "Poppins_400Regular",
                          color: COLORS.textDark,
                          borderWidth: 1,
                          borderColor: COLORS.border,
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          if (newFeature.trim()) {
                            setEditingPlan({
                              ...editingPlan,
                              features: [
                                ...editingPlan.features,
                                newFeature.trim(),
                              ],
                            });
                            setNewFeature("");
                          }
                        }}
                        style={{
                          backgroundColor: COLORS.success,
                          borderRadius: 10,
                          paddingHorizontal: 12,
                          paddingVertical: 10,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons name="add" size={20} color={COLORS.white} />
                      </TouchableOpacity>
                    </View>

                    {/* Features List */}
                    <View
                      style={{
                        backgroundColor: COLORS.lightGrey,
                        borderRadius: 10,
                        padding: 10,
                      }}
                    >
                      {editingPlan.features.length === 0 ? (
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: "Poppins_400Regular",
                            color: COLORS.textLight,
                            fontStyle: "italic",
                            textAlign: "center",
                            paddingVertical: 12,
                          }}
                        >
                          No features added yet
                        </Text>
                      ) : (
                        editingPlan.features.map((feature, idx) => (
                          <View
                            key={idx}
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              paddingVertical: 8,
                              paddingHorizontal: 10,
                              backgroundColor: COLORS.white,
                              borderRadius: 8,
                              marginBottom:
                                idx < editingPlan.features.length - 1
                                  ? 6
                                  : 0,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: "Poppins_500Medium",
                                color: COLORS.textDark,
                                flex: 1,
                              }}
                            >
                              ✓ {feature}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                setEditingPlan({
                                  ...editingPlan,
                                  features: editingPlan.features.filter(
                                    (_, i) => i !== idx
                                  ),
                                });
                              }}
                            >
                              <Ionicons
                                name="close-circle"
                                size={18}
                                color={COLORS.danger}
                              />
                            </TouchableOpacity>
                          </View>
                        ))
                      )}
                    </View>
                  </View>

                  {/* Save Button */}
                  <TouchableOpacity
                    onPress={handleEditPlan}
                    disabled={editLoading}
                    style={{
                      backgroundColor: COLORS.primary,
                      borderRadius: 12,
                      paddingVertical: 14,
                      alignItems: "center",
                      opacity: editLoading ? 0.6 : 1,
                      marginBottom: 10,
                    }}
                  >
                    {editLoading ? (
                      <ActivityIndicator color={COLORS.white} />
                    ) : (
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: "Poppins_600SemiBold",
                          color: COLORS.white,
                        }}
                      >
                        Save Changes
                      </Text>
                    )}
                  </TouchableOpacity>

                  {/* Cancel Button */}
                  <TouchableOpacity
                    onPress={() => setEditModalVisible(false)}
                    disabled={editLoading}
                    style={{
                      backgroundColor: COLORS.lightGrey,
                      borderRadius: 12,
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
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Create Modal */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 100,
            }}
          >
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
            <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
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
                <TextInput
                  placeholder="e.g., Professional Plan"
                  placeholderTextColor={COLORS.textLight}
                  value={createForm.name}
                  onChangeText={(text) =>
                    setCreateForm({ ...createForm, name: text })
                  }
                  style={{
                    backgroundColor: COLORS.lightGrey,
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 14,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textDark,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                />
              </View>

              {/* Description */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                    marginBottom: 6,
                  }}
                >
                  Description (Sub-heading)
                </Text>
                <TextInput
                  placeholder="e.g., Best for professionals & startups"
                  placeholderTextColor={COLORS.textLight}
                  value={createForm.description}
                  onChangeText={(text) =>
                    setCreateForm({ ...createForm, description: text })
                  }
                  multiline
                  numberOfLines={2}
                  style={{
                    backgroundColor: COLORS.lightGrey,
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 14,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textDark,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    textAlignVertical: "top",
                  }}
                />
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
                <TextInput
                  placeholder="Enter price"
                  placeholderTextColor={COLORS.textLight}
                  value={createForm.price}
                  onChangeText={(text) =>
                    setCreateForm({ ...createForm, price: text })
                  }
                  keyboardType="numeric"
                  style={{
                    backgroundColor: COLORS.lightGrey,
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 14,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textDark,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                />
              </View>

              {/* Duration */}
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
                <TextInput
                  placeholder="e.g., 30"
                  placeholderTextColor={COLORS.textLight}
                  value={createForm.durationInDays}
                  onChangeText={(text) =>
                    setCreateForm({ ...createForm, durationInDays: text })
                  }
                  keyboardType="numeric"
                  style={{
                    backgroundColor: COLORS.lightGrey,
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 14,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textDark,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                />
              </View>

              {/* Badge */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                    marginBottom: 6,
                  }}
                >
                  Badge (e.g., POPULAR, BEST VALUE)
                </Text>
                <TextInput
                  placeholder="Optional badge text"
                  placeholderTextColor={COLORS.textLight}
                  value={createForm.badge}
                  onChangeText={(text) =>
                    setCreateForm({ ...createForm, badge: text })
                  }
                  style={{
                    backgroundColor: COLORS.lightGrey,
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 14,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textDark,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                />
              </View>

              {/* Features Management */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                    marginBottom: 10,
                  }}
                >
                  Features * ({createForm.features.length})
                </Text>

                {/* Add Feature Input */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <TextInput
                    placeholder="Add a feature..."
                    placeholderTextColor={COLORS.textLight}
                    value={createForm.newFeature}
                    onChangeText={(text) =>
                      setCreateForm({ ...createForm, newFeature: text })
                    }
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.lightGrey,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      fontSize: 13,
                      fontFamily: "Poppins_400Regular",
                      color: COLORS.textDark,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (createForm.newFeature.trim()) {
                        setCreateForm({
                          ...createForm,
                          features: [
                            ...createForm.features,
                            createForm.newFeature.trim(),
                          ],
                          newFeature: "",
                        });
                      }
                    }}
                    style={{
                      backgroundColor: COLORS.success,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="add" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                </View>

                {/* Features List */}
                <View
                  style={{
                    backgroundColor: COLORS.lightGrey,
                    borderRadius: 10,
                    padding: 10,
                  }}
                >
                  {createForm.features.length === 0 ? (
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textLight,
                        fontStyle: "italic",
                        textAlign: "center",
                        paddingVertical: 12,
                      }}
                    >
                      No features added yet
                    </Text>
                  ) : (
                    createForm.features.map((feature, idx) => (
                      <View
                        key={idx}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingVertical: 8,
                          paddingHorizontal: 10,
                          backgroundColor: COLORS.white,
                          borderRadius: 8,
                          marginBottom:
                            idx < createForm.features.length - 1 ? 6 : 0,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: "Poppins_500Medium",
                            color: COLORS.textDark,
                            flex: 1,
                          }}
                        >
                          ✓ {feature}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setCreateForm({
                              ...createForm,
                              features: createForm.features.filter(
                                (_, i) => i !== idx
                              ),
                            });
                          }}
                        >
                          <Ionicons
                            name="close-circle"
                            size={18}
                            color={COLORS.danger}
                          />
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              </View>

              {/* Create Button */}
              <TouchableOpacity
                onPress={handleCreatePlan}
                disabled={createLoading}
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  opacity: createLoading ? 0.6 : 1,
                  marginBottom: 10,
                }}
              >
                {createLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.white,
                    }}
                  >
                    Create Plan
                  </Text>
                )}
              </TouchableOpacity>

              {/* Cancel Button */}
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
                    fontSize: 15,
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
