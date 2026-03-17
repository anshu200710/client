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

export default function GSTInvoiceScreen() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    invoiceNo: "INV-" + Date.now().toString().slice(-6),
    date: new Date().toISOString().split("T")[0],
    itemDescription: "",
    quantity: "1",
    rate: "",
    gstRate: "18",
  });

  const calculateTotals = () => {
    const rate = parseFloat(formData.rate) || 0;
    const quantity = parseFloat(formData.quantity) || 0;
    const gstRate = parseFloat(formData.gstRate) || 0;

    const subtotal = rate * quantity;
    const gstAmount = (subtotal * gstRate) / 100;
    const total = subtotal + gstAmount;

    return {
      subtotal: subtotal.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const handleGenerateInvoice = () => {
    if (!formData.clientName || !formData.itemDescription || !formData.rate) {
      Alert.alert("Missing Information", "Please fill all required fields");
      return;
    }

    const totals = calculateTotals();

    Alert.alert(
      "Invoice Generated",
      `Invoice #${formData.invoiceNo}\n\nClient: ${formData.clientName}\nSubtotal: ₹${totals.subtotal}\nGST (${formData.gstRate}%): ₹${totals.gstAmount}\nTotal: ₹${totals.total}\n\nInvoice created successfully! Ready to send to client.`,
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
            GST Invoice
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
              backgroundColor: "#DBEAFE",
              borderWidth: 1,
              borderColor: "#93C5FD",
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
              color="#1E40AF"
              style={{ marginRight: 10, marginTop: 2 }}
            />
            <Text
              style={{
                fontSize: 12,
                color: "#1E40AF",
                fontFamily: "Poppins_500Medium",
                lineHeight: 18,
                flex: 1,
              }}
            >
              Fill in the details below to create a GST-compliant invoice with
              automatic calculations.
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
              label="Client Email"
              placeholder="client@example.com"
              value={formData.clientEmail}
              onChangeText={(text: string) =>
                setFormData({ ...formData, clientEmail: text })
              }
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
                  Invoice #
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
                    }}
                  >
                    {formData.invoiceNo}
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
                    }}
                  >
                    {formData.date}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Items Section */}
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
              Item Details
            </Text>

            <InputField
              label="Item Description *"
              placeholder="e.g., Website Development Service"
              value={formData.itemDescription}
              onChangeText={(text: string) =>
                setFormData({ ...formData, itemDescription: text })
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
                  Quantity
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
                  GST Rate (%)
                </Text>
                <TextInput
                  placeholder="18"
                  placeholderTextColor={COLORS.textLight}
                  value={formData.gstRate}
                  onChangeText={(text: string) =>
                    setFormData({ ...formData, gstRate: text })
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

          {/* Summary Section */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 20,
              backgroundColor: "#EFF6FF",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#BFDBFE",
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
              Amount Summary
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#BFDBFE",
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

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#BFDBFE",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.textGray,
                  fontFamily: "Poppins_500Medium",
                }}
              >
                GST ({formData.gstRate}%)
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.textDark,
                }}
              >
                ₹{totals.gstAmount}
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
                  fontSize: 16,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.textDark,
                }}
              >
                Total Amount
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Poppins_800ExtraBold",
                  color: "#0066CC",
                }}
              >
                ₹{totals.total}
              </Text>
            </View>
          </View>

          {/* Action Button */}
          <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
            <TouchableOpacity
              onPress={handleGenerateInvoice}
              style={{
                backgroundColor: "#0066CC",
                borderRadius: 12,
                paddingVertical: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Ionicons
                name="document-text"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: "Poppins_700Bold",
                  fontSize: 16,
                }}
              >
                Generate Invoice
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
