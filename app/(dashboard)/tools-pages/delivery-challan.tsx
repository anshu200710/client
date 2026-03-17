import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
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

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
}: any) => (
  <View style={{ marginBottom: 16 }}>
    <Text
      style={{
        fontSize: 14,
        fontFamily: "Poppins_600SemiBold",
        color: COLORS.textGray,
        marginBottom: 8,
      }}
    >
      {label}
    </Text>
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={COLORS.textLight}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      style={{
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: COLORS.textDark,
        fontFamily: "Poppins_500Medium",
        fontSize: 16,
      }}
    />
  </View>
);

export default function DeliveryChallanScreen() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientAddress: "",
    challanNo: "DC-" + Date.now().toString().slice(-6),
    date: new Date().toISOString().split("T")[0],
    transportMode: "Courier",
    goodsDescription: "",
    quantity: "1",
    weight: "",
    referenceNo: "",
    notes:
      "This is a delivery challan without invoice. Goods accompany this document during transport.",
  });

  const handleGenerateChallan = () => {
    if (
      !formData.clientName ||
      !formData.goodsDescription ||
      !formData.quantity
    ) {
      Alert.alert("Missing Information", "Please fill all required fields");
      return;
    }

    Alert.alert(
      "Delivery Challan Created",
      `Challan #${formData.challanNo}\n\nClient: ${formData.clientName}\nGoods: ${formData.goodsDescription}\nQuantity: ${formData.quantity}\n\nDelivery challan generated successfully! Attach it to the shipment.`,
      [{ text: "OK", onPress: () => {} }],
    );
  };

  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      edges={["bottom"]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header with Back Button */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
          backgroundColor: COLORS.white,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 8,
            paddingVertical: 8,
          }}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.textDark,
              marginLeft: 8,
            }}
          >
            Delivery Challan
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Info Banner */}
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 16,
              backgroundColor: "#F3E8FF",
              borderWidth: 1,
              borderColor: "#DDD6FE",
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 24,
            }}
          >
            <Ionicons
              name="information-circle"
              size={18}
              color="#7C3AED"
              style={{ marginRight: 10, marginTop: 2 }}
            />
            <Text
              style={{
                fontSize: 12,
                color: "#7C3AED",
                fontFamily: "Poppins_500Medium",
                lineHeight: 18,
                flex: 1,
              }}
            >
              Create delivery chalan documents to accompany goods during
              transport without invoice.
            </Text>
          </View>

          {/* Recipient Information */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 20,
              backgroundColor: COLORS.white,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: COLORS.border,
              marginHorizontal: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textDark,
                marginBottom: 16,
              }}
            >
              Recipient Information
            </Text>

            <InputField
              label="Recipient Name *"
              placeholder="Enter recipient name"
              value={formData.clientName}
              onChangeText={(text: string) =>
                setFormData({ ...formData, clientName: text })
              }
            />

            <TextInput
              placeholder="Complete delivery address..."
              placeholderTextColor={COLORS.textLight}
              value={formData.clientAddress}
              onChangeText={(text: string) =>
                setFormData({ ...formData, clientAddress: text })
              }
              multiline
              numberOfLines={3}
              style={{
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                color: COLORS.textDark,
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                marginBottom: 16,
                textAlignVertical: "top",
              }}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textGray,
                    marginBottom: 8,
                  }}
                >
                  Challan #
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: "#F5F7FB",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.textGray,
                      fontFamily: "Poppins_500Medium",
                      fontSize: 14,
                    }}
                  >
                    {formData.challanNo}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textGray,
                    marginBottom: 8,
                  }}
                >
                  Date
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: "#F5F7FB",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.textGray,
                      fontFamily: "Poppins_500Medium",
                      fontSize: 14,
                    }}
                  >
                    {formData.date}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Goods Details */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 20,
              backgroundColor: COLORS.white,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: COLORS.border,
              marginHorizontal: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textDark,
                marginBottom: 16,
              }}
            >
              Goods Details
            </Text>

            <InputField
              label="Description of Goods *"
              placeholder="e.g., Electronics equipments, Clothing items, etc."
              value={formData.goodsDescription}
              onChangeText={(text: string) =>
                setFormData({ ...formData, goodsDescription: text })
              }
            />

            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textGray,
                    marginBottom: 8,
                  }}
                >
                  Quantity *
                </Text>
                <TextInput
                  placeholder="1"
                  placeholderTextColor={COLORS.textLight}
                  value={formData.quantity}
                  onChangeText={(text: string) =>
                    setFormData({ ...formData, quantity: text })
                  }
                  keyboardType="decimal-pad"
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    color: COLORS.textDark,
                    fontFamily: "Poppins_500Medium",
                    fontSize: 16,
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textGray,
                    marginBottom: 8,
                  }}
                >
                  Weight (kg)
                </Text>
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor={COLORS.textLight}
                  value={formData.weight}
                  onChangeText={(text: string) =>
                    setFormData({ ...formData, weight: text })
                  }
                  keyboardType="decimal-pad"
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    color: COLORS.textDark,
                    fontFamily: "Poppins_500Medium",
                    fontSize: 16,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Transport Details */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 20,
              backgroundColor: COLORS.white,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: COLORS.border,
              marginHorizontal: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textDark,
                marginBottom: 16,
              }}
            >
              Transport Details
            </Text>

            <InputField
              label="Mode of Transport"
              placeholder="e.g., Courier, Road, Train, Air"
              value={formData.transportMode}
              onChangeText={(text: string) =>
                setFormData({ ...formData, transportMode: text })
              }
            />

            <InputField
              label="Reference No."
              placeholder="Tracking or Order No."
              value={formData.referenceNo}
              onChangeText={(text: string) =>
                setFormData({ ...formData, referenceNo: text })
              }
            />
          </View>

          {/* Additional Notes */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 20,
              backgroundColor: COLORS.white,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: COLORS.border,
              marginHorizontal: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textDark,
                marginBottom: 16,
              }}
            >
              Notes
            </Text>

            <TextInput
              placeholder="Add any special instructions or notes..."
              placeholderTextColor={COLORS.textLight}
              value={formData.notes}
              onChangeText={(text: string) =>
                setFormData({ ...formData, notes: text })
              }
              multiline
              numberOfLines={3}
              style={{
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                color: COLORS.textDark,
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                textAlignVertical: "top",
              }}
            />
          </View>

          {/* Summary Section */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 20,
              backgroundColor: "#F3E8FF",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#DDD6FE",
              marginHorizontal: 16,
              marginBottom: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <Ionicons
                name="car"
                size={24}
                color="#9333EA"
                style={{ marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.textDark,
                  }}
                >
                  Delivery Details
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.textGray,
                    fontFamily: "Poppins_500Medium",
                    marginTop: 4,
                  }}
                >
                  Ready for transport
                </Text>
              </View>
            </View>

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#DDD6FE",
                paddingTop: 12,
                marginTop: 12,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.textGray,
                    fontFamily: "Poppins_500Medium",
                  }}
                >
                  Goods
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                  }}
                >
                  {formData.goodsDescription || "Not specified"}
                </Text>
              </View>
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
                    color: COLORS.textGray,
                    fontFamily: "Poppins_500Medium",
                  }}
                >
                  Transport Mode
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                  }}
                >
                  {formData.transportMode}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
            <TouchableOpacity
              onPress={handleGenerateChallan}
              style={{
                backgroundColor: "#9333EA",
                borderRadius: 12,
                paddingVertical: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Ionicons name="car" size={20} color="#fff" />
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: "Poppins_700Bold",
                  fontSize: 16,
                }}
              >
                Generate Challan
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
