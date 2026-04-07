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

export default function GSTCalculatorScreen() {
  const [taxableAmount, setTaxableAmount] = useState("");
  const [gstSlab, setGstSlab] = useState(18);
  const [customGst, setCustomGst] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [discountType, setDiscountType] = useState("flat");
  const [discountValue, setDiscountValue] = useState("0");
  const [transactionType, setTransactionType] = useState<"intra" | "inter">("intra");

  const standardSlabs = [5, 12, 18, 28];

  const calculateGST = () => {
    const baseAmount = parseFloat(taxableAmount) || 0;
    if (baseAmount <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid taxable amount");
      return null;
    }

    let discount = 0;
    if (discountValue && parseFloat(discountValue) > 0) {
      const discountVal = parseFloat(discountValue);
      if (discountType === "flat") {
        discount = discountVal;
      } else {
        discount = (baseAmount * discountVal) / 100;
      }
    }

    const amountAfterDiscount = baseAmount - discount;
    const selectedSlab =
      showCustomInput && customGst ? parseFloat(customGst) : gstSlab;

    // IGST, SGST, CGST Calculation
    let sgstAmount = 0;
    let cgstAmount = 0;
    let igstAmount = 0;
    let totalTaxAmount = 0;

    if (transactionType === "intra") {
      // Intra-State: SGST + CGST = Half each
      sgstAmount = (amountAfterDiscount * selectedSlab) / 2 / 100;
      cgstAmount = (amountAfterDiscount * selectedSlab) / 2 / 100;
      totalTaxAmount = sgstAmount + cgstAmount;
    } else {
      // Inter-State: IGST = Full Rate
      igstAmount = (amountAfterDiscount * selectedSlab) / 100;
      totalTaxAmount = igstAmount;
    }

    const totalPayable = amountAfterDiscount + totalTaxAmount;

    return {
      baseAmount: baseAmount.toFixed(2),
      discount: discount.toFixed(2),
      amountAfterDiscount: amountAfterDiscount.toFixed(2),
      gstRate: selectedSlab,
      sgstAmount: sgstAmount.toFixed(2),
      cgstAmount: cgstAmount.toFixed(2),
      igstAmount: igstAmount.toFixed(2),
      totalTaxAmount: totalTaxAmount.toFixed(2),
      totalPayable: totalPayable.toFixed(2),
      transactionType: transactionType,
    };
  };

  const handleCalculate = () => {
    const result = calculateGST();
    if (result) {
      const taxDetails = result.transactionType === "intra"
        ? `SGST (${result.gstRate / 2}%): ₹${result.sgstAmount}\nCGST (${result.gstRate / 2}%): ₹${result.cgstAmount}`
        : `IGST (${result.gstRate}%): ₹${result.igstAmount}`;

      Alert.alert(
        "GST Calculated",
        `Base Amount: ₹${result.baseAmount}\nDiscount: ₹${result.discount}\nAmount After Discount: ₹${result.amountAfterDiscount}\n\n${taxDetails}\nTotal Tax: ₹${result.totalTaxAmount}\n\nTotal Payable: ₹${result.totalPayable}`,
        [{ text: "OK", onPress: () => {} }],
      );
    }
  };

  const router = useRouter();
  const result = calculateGST();

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
            GST Calculator
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Info Banner */}
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 16,
              backgroundColor: "#F0F9FF",
              borderWidth: 1,
              borderColor: "#0EA5E9",
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
              color="#0369A1"
              style={{ marginRight: 10, marginTop: 2 }}
            />
            <Text
              style={{
                fontSize: 12,
                color: "#0369A1",
                fontFamily: "Poppins_500Medium",
                lineHeight: 18,
                flex: 1,
              }}
            >
              Calculate GST instantly for your invoices. Select transaction type and enter the taxable value below.
            </Text>
          </View>

          {/* Transaction Type Selector */}
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
              Transaction Type
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => setTransactionType("intra")}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: transactionType === "intra" ? "#0066CC" : COLORS.border,
                  backgroundColor: transactionType === "intra" ? "#0066CC" : COLORS.white,
                }}
              >
                <Ionicons
                  name="layers-outline"
                  size={20}
                  color={transactionType === "intra" ? COLORS.white : COLORS.textGray}
                  style={{ textAlign: "center", marginBottom: 4 }}
                />
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    textAlign: "center",
                    fontSize: 13,
                    color: transactionType === "intra" ? COLORS.white : COLORS.textDark,
                  }}
                >
                  Intra-State
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    textAlign: "center",
                    fontSize: 10,
                    color: transactionType === "intra" ? "rgba(255,255,255,0.8)" : COLORS.textLight,
                    marginTop: 2,
                  }}
                >
                  SGST + CGST
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTransactionType("inter")}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: transactionType === "inter" ? "#0066CC" : COLORS.border,
                  backgroundColor: transactionType === "inter" ? "#0066CC" : COLORS.white,
                }}
              >
                <Ionicons
                  name="globe-outline"
                  size={20}
                  color={transactionType === "inter" ? COLORS.white : COLORS.textGray}
                  style={{ textAlign: "center", marginBottom: 4 }}
                />
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    textAlign: "center",
                    fontSize: 13,
                    color: transactionType === "inter" ? COLORS.white : COLORS.textDark,
                  }}
                >
                  Inter-State
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    textAlign: "center",
                    fontSize: 10,
                    color: transactionType === "inter" ? "rgba(255,255,255,0.8)" : COLORS.textLight,
                    marginTop: 2,
                  }}
                >
                  IGST
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Taxable Amount Section */}
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.textDark,
                  flex: 1,
                }}
              >
                Taxable Value (Base Amount)
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.textDark,
                }}
              >
                ₹
              </Text>
            </View>

            <TextInput
              placeholder="Enter amount without tax"
              placeholderTextColor={COLORS.textLight}
              value={taxableAmount}
              onChangeText={setTaxableAmount}
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
                textAlign: "right",
              }}
            />

            <Text
              style={{
                fontSize: 11,
                color: COLORS.textLight,
                marginTop: 8,
                textAlign: "right",
                fontFamily: "Poppins_400Regular",
              }}
            >
              Enter amount without tax
            </Text>
          </View>

          {/* GST Slab Selection */}
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.textDark,
                }}
              >
                GST Slab (%)
              </Text>
              {!showCustomInput && (
                <TouchableOpacity
                  onPress={() => {
                    setShowCustomInput(true);
                    setCustomGst("");
                  }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    backgroundColor: "#0EA5E9",
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.white,
                    }}
                  >
                    Custom
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {!showCustomInput ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    marginBottom: 12,
                    flexWrap: "wrap",
                  }}
                >
                  {standardSlabs.map((slab) => (
                    <TouchableOpacity
                      key={slab}
                      onPress={() => setGstSlab(slab)}
                      style={{
                        flex: 1,
                        minWidth: "48%",
                        paddingVertical: 12,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor:
                          gstSlab === slab ? "#0066CC" : COLORS.border,
                        backgroundColor:
                          gstSlab === slab ? "#0066CC" : COLORS.white,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Poppins_700Bold",
                          textAlign: "center",
                          fontSize: 16,
                          color:
                            gstSlab === slab ? COLORS.white : COLORS.textDark,
                        }}
                      >
                        {slab}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border,
                    marginBottom: 12,
                  }}
                />
                <Text
                  style={{
                    fontSize: 11,
                    textAlign: "center",
                    color: COLORS.textLight,
                    fontFamily: "Poppins_600SemiBold",
                  }}
                >
                  STANDARD SLABS
                </Text>
              </>
            ) : (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.textGray,
                      flex: 1,
                    }}
                  >
                    Enter custom %
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowCustomInput(false);
                      setCustomGst("");
                    }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      backgroundColor: COLORS.lightGrey,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Poppins_600SemiBold",
                        color: COLORS.textGray,
                      }}
                    >
                      Back
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <TextInput
                    placeholder="Enter custom %"
                    placeholderTextColor={COLORS.textLight}
                    value={customGst}
                    onChangeText={setCustomGst}
                    keyboardType="decimal-pad"
                    style={{
                      flex: 1,
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
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Poppins_700Bold",
                      color: COLORS.textDark,
                    }}
                  >
                    %
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Discount Section */}
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.textDark,
                }}
              >
                Discount (Optional)
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  backgroundColor: COLORS.lightGrey,
                  borderRadius: 8,
                  padding: 4,
                }}
              >
                <TouchableOpacity
                  onPress={() => setDiscountType("flat")}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 6,
                    backgroundColor:
                      discountType === "flat" ? COLORS.white : "transparent",
                    borderWidth: discountType === "flat" ? 1 : 0,
                    borderColor: COLORS.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: "Poppins_600SemiBold",
                      color:
                        discountType === "flat"
                          ? COLORS.textDark
                          : COLORS.textGray,
                    }}
                  >
                    ₹ Flat
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDiscountType("percent")}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 6,
                    backgroundColor:
                      discountType === "percent" ? COLORS.white : "transparent",
                    borderWidth: discountType === "percent" ? 1 : 0,
                    borderColor: COLORS.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: "Poppins_600SemiBold",
                      color:
                        discountType === "percent"
                          ? COLORS.textDark
                          : COLORS.textGray,
                    }}
                  >
                    Percent %
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <TextInput
                placeholder="0.00"
                placeholderTextColor={COLORS.textLight}
                value={discountValue}
                onChangeText={setDiscountValue}
                keyboardType="decimal-pad"
                style={{
                  flex: 1,
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
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.textDark,
                  width: 32,
                  textAlign: "center",
                }}
              >
                {discountType === "flat" ? "₹" : "%"}
              </Text>
            </View>
          </View>

          {/* Results Section */}
          {result && taxableAmount && (
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
                Summary
              </Text>

              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.textGray,
                      fontFamily: "Poppins_400Regular",
                    }}
                  >
                    Base Amount
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.textDark,
                    }}
                  >
                    ₹{result.baseAmount}
                  </Text>
                </View>

                {parseFloat(result.discount) > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.border,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: COLORS.textGray,
                        fontFamily: "Poppins_400Regular",
                      }}
                    >
                      Discount
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins_600SemiBold",
                        color: COLORS.alertRed,
                      }}
                    >
                      - ₹{result.discount}
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.textGray,
                      fontFamily: "Poppins_400Regular",
                    }}
                  >
                    Amount After Discount
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.textDark,
                    }}
                  >
                    ₹{result.amountAfterDiscount}
                  </Text>
                </View>

                {result.transactionType === "intra" ? (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.border,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: COLORS.textGray,
                          fontFamily: "Poppins_400Regular",
                        }}
                      >
                        SGST ({result.gstRate / 2}%)
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "Poppins_600SemiBold",
                          color: "#10B981",
                        }}
                      >
                        + ₹{result.sgstAmount}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.border,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: COLORS.textGray,
                          fontFamily: "Poppins_400Regular",
                        }}
                      >
                        CGST ({result.gstRate / 2}%)
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "Poppins_600SemiBold",
                          color: "#F59E0B",
                        }}
                      >
                        + ₹{result.cgstAmount}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.border,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: COLORS.textGray,
                        fontFamily: "Poppins_400Regular",
                      }}
                    >
                      IGST ({result.gstRate}%)
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins_600SemiBold",
                        color: "#0EA5E9",
                      }}
                    >
                      + ₹{result.igstAmount}
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: "Poppins_700Bold",
                      color: COLORS.textDark,
                    }}
                  >
                    Total Payable
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: "Poppins_800ExtraBold",
                      color: "#0066CC",
                    }}
                  >
                    ₹{result.totalPayable}
                  </Text>
                </View>

                {/* Tax Summary Badge */}
                <View
                  style={{
                    backgroundColor: result.transactionType === "intra" ? "rgba(16, 185, 129, 0.1)" : "rgba(14, 165, 233, 0.1)",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    marginTop: 16,
                    borderLeftWidth: 4,
                    borderLeftColor: result.transactionType === "intra" ? "#10B981" : "#0EA5E9",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_600SemiBold",
                      color: result.transactionType === "intra" ? "#059669" : "#0369A1",
                      marginBottom: 4,
                    }}
                  >
                    {result.transactionType === "intra" ? "INTRA-STATE TRANSACTION" : "INTER-STATE TRANSACTION"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: "Poppins_400Regular",
                      color: result.transactionType === "intra" ? "#059669" : "#0369A1",
                    }}
                  >
                    {result.transactionType === "intra"
                      ? `SGST: ₹${result.sgstAmount} + CGST: ₹${result.cgstAmount} = ₹${result.totalTaxAmount}`
                      : `IGST: ₹${result.igstAmount}`}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Calculate Button - Sticky at Bottom */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: COLORS.white,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
          }}
        >
          <TouchableOpacity
            onPress={handleCalculate}
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
            <Ionicons name="calculator" size={20} color={COLORS.white} />
            <Text
              style={{
                color: COLORS.white,
                fontFamily: "Poppins_700Bold",
                fontSize: 16,
              }}
            >
              Calculate GST
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
