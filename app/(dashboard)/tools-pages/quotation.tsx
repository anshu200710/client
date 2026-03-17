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

export default function QuotationScreen() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    quotationNo: "QT-" + Date.now().toString().slice(-6),
    date: new Date().toISOString().split("T")[0],
    validTill: "",
    serviceTitle: "",
    serviceDescription: "",
    quantity: "1",
    rate: "",
    discount: "0",
    notes: "Thank you for considering us! We look forward to working with you.",
  });

  const calculateTotals = () => {
    const rate = parseFloat(formData.rate) || 0;
    const quantity = parseFloat(formData.quantity) || 0;
    const discount = parseFloat(formData.discount) || 0;

    const subtotal = rate * quantity;
    const discountAmount = (subtotal * discount) / 100;
    const totalAmount = subtotal - discountAmount;

    return {
      subtotal: subtotal.toFixed(2),
      discount: discountAmount.toFixed(2),
      total: totalAmount.toFixed(2),
    };
  };

  const handleGenerateQuote = () => {
    if (!formData.clientName || !formData.serviceTitle || !formData.rate) {
      Alert.alert("Missing Information", "Please fill all required fields");
      return;
    }

    const totals = calculateTotals();

    Alert.alert(
      "Quotation Generated",
      `Quote #${formData.quotationNo}\n\nClient: ${formData.clientName}\nAmount: ₹${totals.total}\n\nQuotation created successfully! Ready to send to win the deal.`,
      [{ text: "OK", onPress: () => {} }],
    );
  };

  const totals = calculateTotals();
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
            Quotation
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
              backgroundColor: "#FEF3C7",
              borderWidth: 1,
              borderColor: "#FCD34D",
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
              color="#92400E"
              style={{ marginRight: 10, marginTop: 2 }}
            />
            <Text
              style={{
                fontSize: 12,
                color: "#92400E",
                fontFamily: "Poppins_500Medium",
                lineHeight: 18,
                flex: 1,
              }}
            >
              Send price estimates to potential clients. Make compelling offers
              to win new deals quickly.
            </Text>
          </View>

          {/* Form Section */}
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
              Client Information
            </Text>

            <InputField
              label="Client Name *"
              placeholder="Enter client name"
              value={formData.clientName}
              onChangeText={(text: string) =>
                setFormData({ ...formData, clientName: text })
              }
            />

            <InputField
              label="Client Phone"
              placeholder="+91 XXXXXXXXXX"
              value={formData.clientPhone}
              onChangeText={(text: string) =>
                setFormData({ ...formData, clientPhone: text })
              }
              keyboardType="phone-pad"
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
                  Quote #
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
                    {formData.quotationNo}
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

            <InputField
              label="Valid Till"
              placeholder="YYYY-MM-DD"
              value={formData.validTill}
              onChangeText={(text: string) =>
                setFormData({ ...formData, validTill: text })
              }
            />
          </View>

          {/* Service Details Section */}
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
              Service Details
            </Text>

            <InputField
              label="Service Title *"
              placeholder="e.g., Website Design & Development"
              value={formData.serviceTitle}
              onChangeText={(text: string) =>
                setFormData({ ...formData, serviceTitle: text })
              }
            />

            <TextInput
              placeholder="Detailed description of the service..."
              placeholderTextColor={COLORS.textLight}
              value={formData.serviceDescription}
              onChangeText={(text: string) =>
                setFormData({ ...formData, serviceDescription: text })
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
                  Quantity/Hours
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
                  Rate *
                </Text>
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor={COLORS.textLight}
                  value={formData.rate}
                  onChangeText={(text: string) =>
                    setFormData({ ...formData, rate: text })
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
                  Discount (%)
                </Text>
                <TextInput
                  placeholder="0"
                  placeholderTextColor={COLORS.textLight}
                  value={formData.discount}
                  onChangeText={(text: string) =>
                    setFormData({ ...formData, discount: text })
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
              <View style={{ flex: 1 }} />
            </View>
          </View>

          {/* Notes Section */}
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
              Additional Notes
            </Text>

            <TextInput
              placeholder="Add terms, conditions, or special offers..."
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
              backgroundColor: "#FFFBEB",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#FDE047",
              marginHorizontal: 16,
              marginBottom: 24,
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
              Quote Summary
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#FDE047",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.textGray,
                  fontFamily: "Poppins_500Medium",
                }}
              >
                Subtotal
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.textDark,
                }}
              >
                ₹{totals.subtotal}
              </Text>
            </View>

            {parseFloat(formData.discount) > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                  paddingBottom: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#FDE047",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.textGray,
                    fontFamily: "Poppins_500Medium",
                  }}
                >
                  Discount
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color: "#10B981",
                  }}
                >
                  -₹{totals.discount}
                </Text>
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.textDark,
                }}
              >
                Final Quote
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Poppins_800ExtraBold",
                  color: "#D97706",
                }}
              >
                ₹{totals.total}
              </Text>
            </View>
          </View>

          {/* Action Button */}
          <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
            <TouchableOpacity
              onPress={handleGenerateQuote}
              style={{
                backgroundColor: "#D97706",
                borderRadius: 12,
                paddingVertical: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Ionicons name="pricetag" size={20} color="#fff" />
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: "Poppins_700Bold",
                  fontSize: 16,
                }}
              >
                Generate Quotation
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
