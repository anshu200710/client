import { Ionicons } from "@expo/vector-icons";
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

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
}: any) => (
  <View className="mb-4">
    <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      className="border border-[#E5EAF0] rounded-xl px-4 py-3 text-gray-900 font-medium text-base"
    />
  </View>
);

export default function GSTCalculatorScreen() {
  const [taxableAmount, setTaxableAmount] = useState("");
  const [gstSlab, setGstSlab] = useState(18);
  const [customGst, setCustomGst] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [discountType, setDiscountType] = useState("flat"); // 'flat' or 'percent'
  const [discountValue, setDiscountValue] = useState("0");

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
    const gstAmount = (amountAfterDiscount * selectedSlab) / 100;
    const totalPayable = amountAfterDiscount + gstAmount;

    return {
      baseAmount: baseAmount.toFixed(2),
      discount: discount.toFixed(2),
      amountAfterDiscount: amountAfterDiscount.toFixed(2),
      gstRate: selectedSlab,
      gstAmount: gstAmount.toFixed(2),
      totalPayable: totalPayable.toFixed(2),
    };
  };

  const handleCalculate = () => {
    const result = calculateGST();
    if (result) {
      Alert.alert(
        "GST Calculated",
        `Base Amount: ₹${result.baseAmount}\nDiscount: ₹${result.discount}\nAmount After Discount: ₹${result.amountAfterDiscount}\n\nGST Rate: ${result.gstRate}%\nGST Amount: ₹${result.gstAmount}\n\nTotal Payable: ₹${result.totalPayable}`,
        [{ text: "OK", onPress: () => {} }],
      );
    }
  };

  const result = calculateGST();

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Info Banner */}
          <View className="mx-4 mt-4 bg-[#F0F9FF] border border-[#0EA5E9] rounded-xl p-3.5 flex-row items-start mb-6">
            <Ionicons
              name="information-circle"
              size={18}
              color="#0369A1"
              style={{ marginRight: 10, marginTop: 2 }}
            />
            <Text className="text-xs text-[#0369A1] font-medium leading-4 flex-1">
              Calculate GST instantly for your invoices. Enter the taxable value
              below.
            </Text>
          </View>

          {/* Taxable Amount Section */}
          <View className="px-4 py-5 bg-white rounded-2xl border border-[#E5EAF0] mx-4 mb-4">
            <View className="flex-row items-center mb-4">
              <Text className="text-lg font-bold text-gray-900 flex-1">
                Taxable Value (Base Amount)
              </Text>
              <Text className="text-2xl font-bold text-gray-900">₹</Text>
            </View>

            <TextInput
              placeholder="Enter amount without tax"
              placeholderTextColor="#94A3B8"
              value={taxableAmount}
              onChangeText={setTaxableAmount}
              keyboardType="decimal-pad"
              className="border border-[#E5EAF0] rounded-xl px-4 py-3 text-gray-900 font-medium text-base text-right"
            />

            <Text className="text-xs text-gray-500 mt-2 text-right">
              Enter amount without tax
            </Text>
          </View>

          {/* GST Slab Selection */}
          <View className="px-4 py-5 bg-white rounded-2xl border border-[#E5EAF0] mx-4 mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900">
                GST Slab (%)
              </Text>
              {!showCustomInput && (
                <TouchableOpacity
                  onPress={() => {
                    setShowCustomInput(true);
                    setCustomGst("");
                  }}
                  className="px-3 py-1.5 bg-[#0EA5E9] rounded-lg"
                >
                  <Text className="text-xs font-semibold text-white">
                    Custom
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {!showCustomInput ? (
              <>
                <View className="flex-row gap-2 mb-3 flex-wrap">
                  {standardSlabs.map((slab) => (
                    <TouchableOpacity
                      key={slab}
                      onPress={() => setGstSlab(slab)}
                      className={`flex-1 min-w-[48%] py-3 rounded-xl border-2 ${
                        gstSlab === slab
                          ? "bg-[#0066CC] border-[#0066CC]"
                          : "bg-white border-[#E5EAF0]"
                      }`}
                    >
                      <Text
                        className={`font-bold text-center text-base ${
                          gstSlab === slab ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {slab}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View className="border-b border-[#E5EAF0] mb-3" />
                <Text className="text-xs text-center text-gray-500 font-medium">
                  STANDARD SLABS
                </Text>
              </>
            ) : (
              <View>
                <View className="flex-row items-center gap-2 mb-3">
                  <Text className="text-sm font-semibold text-gray-700 flex-1">
                    Enter custom %
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowCustomInput(false);
                      setCustomGst("");
                    }}
                    className="px-3 py-1.5 bg-gray-200 rounded-lg"
                  >
                    <Text className="text-xs font-semibold text-gray-700">
                      Back
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center gap-2">
                  <TextInput
                    placeholder="Enter custom %"
                    placeholderTextColor="#94A3B8"
                    value={customGst}
                    onChangeText={setCustomGst}
                    keyboardType="decimal-pad"
                    className="flex-1 border border-[#E5EAF0] rounded-xl px-4 py-3 text-gray-900 font-medium text-base"
                  />
                  <Text className="text-lg font-semibold text-gray-900">%</Text>
                </View>
              </View>
            )}
          </View>

          {/* Discount Section */}
          <View className="px-4 py-5 bg-white rounded-2xl border border-[#E5EAF0] mx-4 mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900">
                Discount (Optional)
              </Text>
              <View className="flex-row gap-2 bg-gray-100 rounded-lg p-1">
                <TouchableOpacity
                  onPress={() => setDiscountType("flat")}
                  className={`px-3 py-1.5 rounded-md ${
                    discountType === "flat"
                      ? "bg-white border border-[#E5EAF0]"
                      : ""
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      discountType === "flat"
                        ? "text-gray-900"
                        : "text-gray-600"
                    }`}
                  >
                    ₹ Flat
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDiscountType("percent")}
                  className={`px-3 py-1.5 rounded-md ${
                    discountType === "percent"
                      ? "bg-white border border-[#E5EAF0]"
                      : ""
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      discountType === "percent"
                        ? "text-gray-900"
                        : "text-gray-600"
                    }`}
                  >
                    Percent %
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row items-center gap-2">
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                value={discountValue}
                onChangeText={setDiscountValue}
                keyboardType="decimal-pad"
                className="flex-1 border border-[#E5EAF0] rounded-xl px-4 py-3 text-gray-900 font-medium text-base"
              />
              <Text className="text-lg font-semibold text-gray-900 w-8 text-center">
                {discountType === "flat" ? "₹" : "%"}
              </Text>
            </View>
          </View>

          {/* Results Section */}
          {result && taxableAmount && (
            <View className="px-4 py-5 bg-white rounded-2xl border border-[#E5EAF0] mx-4 mb-4">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Summary
              </Text>

              <View className="space-y-3">
                <View className="flex-row justify-between items-center pb-3 border-b border-[#E5EAF0]">
                  <Text className="text-sm text-gray-600">Base Amount</Text>
                  <Text className="text-sm font-semibold text-gray-900">
                    ₹{result.baseAmount}
                  </Text>
                </View>

                {parseFloat(result.discount) > 0 && (
                  <View className="flex-row justify-between items-center pb-3 border-b border-[#E5EAF0]">
                    <Text className="text-sm text-gray-600">Discount</Text>
                    <Text className="text-sm font-semibold text-red-600">
                      - ₹{result.discount}
                    </Text>
                  </View>
                )}

                <View className="flex-row justify-between items-center pb-3 border-b border-[#E5EAF0]">
                  <Text className="text-sm text-gray-600">
                    Amount After Discount
                  </Text>
                  <Text className="text-sm font-semibold text-gray-900">
                    ₹{result.amountAfterDiscount}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center pb-3 border-b border-[#E5EAF0]">
                  <Text className="text-sm text-gray-600">
                    GST ({result.gstRate}%)
                  </Text>
                  <Text className="text-sm font-semibold text-blue-600">
                    + ₹{result.gstAmount}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center pt-2">
                  <Text className="text-base font-bold text-gray-900">
                    Total Payable
                  </Text>
                  <Text className="text-2xl font-bold text-[#0066CC]">
                    ₹{result.totalPayable}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Calculate Button */}
          <View className="px-4 pb-6">
            <TouchableOpacity
              onPress={handleCalculate}
              className="bg-[#0066CC] rounded-xl py-3.5 flex-row items-center justify-center gap-2"
            >
              <Ionicons name="calculator" size={20} color="white" />
              <Text className="text-white font-bold text-base">
                Calculate GST
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
