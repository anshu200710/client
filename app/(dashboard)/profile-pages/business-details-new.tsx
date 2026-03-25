import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";

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

export default function BusinessDetailsScreen() {
  const { user, updateProfile, loading } = useAuth();

  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [gstNumber, setGstNumber] = useState(user?.profile?.gstNumber || "");
  const [businessType, setBusinessType] = useState(user?.profile?.businessType || "");
  const [companyName, setCompanyName] = useState(user?.profile?.companyName || "");
  const [isCompany, setIsCompany] = useState(user?.profile?.isCompany || false);
  const [phone, setPhone] = useState(user?.profile?.phone || user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.profile?.address || "");
  
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "advanced" | "status">("basic");

  const validateGST = (gst: string): boolean => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  const validatePhone = (phone: string): boolean => {
    return /^[0-9]{10}$/.test(phone.replace(/\D/g, ""));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!businessName || !businessName.trim()) {
      setError("Business name is required");
      return;
    }

    if (businessName.trim().length < 2) {
      setError("Business name must be at least 2 characters");
      return;
    }

    // Validate phone if provided
    if (phone && phone.trim()) {
      if (!validatePhone(phone)) {
        setError("Phone number must be 10 digits");
        return;
      }
    }

    // Validate GST if provided
    if (gstNumber && gstNumber.trim()) {
      if (!validateGST(gstNumber.trim())) {
        setError("GST number format is invalid. Example: 27ABCDE1234F1Z5");
        return;
      }
    }

    // Validate business type if provided
    const validBusinessTypes = ["sole_proprietor", "partnership", "pvt_ltd", "llp", "individual"];
    if (businessType && businessType.trim()) {
      const normalized = businessType.toLowerCase().replace(/\s+/g, "_");
      if (!validBusinessTypes.includes(normalized)) {
        setError("Please enter a valid business type");
        return;
      }
    }

    // Validate company name if isCompany is true
    if (isCompany && !companyName?.trim()) {
      setError("Company name is required for company accounts");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Build update payload
      const profileUpdate: any = {};
      if (phone && phone.trim()) profileUpdate.phone = phone.trim();
      if (address && address.trim()) profileUpdate.address = address.trim();
      if (gstNumber && gstNumber.trim()) profileUpdate.gstNumber = gstNumber.trim();
      if (businessType && businessType.trim()) {
        profileUpdate.businessType = businessType.toLowerCase().replace(/\s+/g, "_");
      }
      if (companyName && companyName.trim()) profileUpdate.companyName = companyName.trim();
      profileUpdate.isCompany = isCompany;

      const updatePayload = {
        businessName: businessName.trim(),
        ...(Object.keys(profileUpdate).length > 0 && { profile: profileUpdate }),
      };

      await updateProfile(updatePayload);

      Alert.alert("Success", "Business details updated successfully!");
      router.back();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update business details";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Clear Business Details",
      "This will delete all business information. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              setIsSaving(true);
              await updateProfile({
                businessName: "",
                profile: {
                  companyName: "",
                  gstNumber: "",
                  businessType: "",
                  isCompany: false,
                },
              });

              Alert.alert("Success", "Business details cleared");
              setBusinessName("");
              setCompanyName("");
              setGstNumber("");
              setBusinessType("");
              setIsCompany(false);
              setPhone("");
              setAddress("");
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to delete");
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    optional = false,
    maxLength,
    keyboardType = "default",
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    optional?: boolean;
    maxLength?: number;
    keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  }) => {
    const isEmpty = !value || !value.trim();
    const isFilled = value && value.trim().length > 0;

    return (
      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textLight,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {label} {optional ? (
              <Text style={{ color: COLORS.textGray }}>(Optional)</Text>
            ) : (
              <Text style={{ color: COLORS.alertRed }}>*</Text>
            )}
          </Text>
          {maxLength && (
            <Text
              style={{
                fontSize: 10,
                color: isFilled ? COLORS.primary : COLORS.textLight,
                fontFamily: "Poppins_400Regular",
              }}
            >
              {value.length}/{maxLength}
            </Text>
          )}
        </View>
        <TextInput
          style={{
            backgroundColor: isEmpty ? COLORS.lightGrey : "#EAF8FF",
            borderWidth: 1,
            borderColor: isFilled ? COLORS.primary : COLORS.border,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 12,
            fontSize: 14,
            color: COLORS.textDark,
            fontFamily: "Poppins_500Medium",
          }}
          value={value}
          onChangeText={(text) => {
            if (!maxLength || text.length <= maxLength) {
              onChangeText(text);
              setError(null);
            }
          }}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          editable={!isSaving && !loading}
          maxLength={maxLength}
          keyboardType={keyboardType as any}
        />
        {isFilled && (
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
            <Text
              style={{
                fontSize: 10,
                color: COLORS.success,
                fontFamily: "Poppins_400Regular",
                marginLeft: 4,
              }}
            >
              Filled
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (user?.accountType === "individual") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Business Details",
            headerTitleStyle: {
              fontFamily: "Poppins_700Bold",
              fontSize: 18,
              color: COLORS.textDark,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons
                  name="chevron-back"
                  size={28}
                  color={COLORS.primary}
                  style={{ marginLeft: 16 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Ionicons name="information-circle" size={64} color={COLORS.alertAmber} />
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textDark,
                marginTop: 16,
              }}
            >
              No Business Details
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.textGray,
                fontFamily: "Poppins_400Regular",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Your account is set up as an Individual. Business details are only for business accounts.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Business Details",
          headerTitleStyle: {
            fontFamily: "Poppins_700Bold",
            fontSize: 18,
            color: COLORS.textDark,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="chevron-back"
                size={28}
                color={COLORS.primary}
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Card */}
          <View
            style={{
              backgroundColor: "#E8F8FE",
              borderRadius: 12,
              borderLeftWidth: 4,
              borderLeftColor: COLORS.primary,
              padding: 12,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: COLORS.primary,
                fontFamily: "Poppins_500Medium",
              }}
            >
              Complete all business details to get verified and unlock advanced features.
            </Text>
          </View>

          {/* Tabs */}
          <View
            style={{
              flexDirection: "row",
              marginBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
              gap: 0,
            }}
          >
            {[
              { id: "basic", label: "Basic Info", icon: "briefcase" },
              { id: "advanced", label: "Details", icon: "settings" },
              { id: "status", label: "Status", icon: "shield-checkmark" },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id as any)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  borderBottomWidth: activeTab === tab.id ? 3 : 0,
                  borderBottomColor: activeTab === tab.id ? COLORS.primary : "transparent",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={16}
                  color={activeTab === tab.id ? COLORS.primary : COLORS.textLight}
                  style={{ marginBottom: 4 }}
                />
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily:
                      activeTab === tab.id ? "Poppins_600SemiBold" : "Poppins_500Medium",
                    color: activeTab === tab.id ? COLORS.primary : COLORS.textLight,
                  }}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <InputField
                label="Business Name"
                value={businessName}
                onChangeText={setBusinessName}
                placeholder="Enter your business name"
                maxLength={100}
              />

              <View style={{ marginBottom: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    backgroundColor: COLORS.lightGrey,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Poppins_700Bold",
                        color: COLORS.textLight,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Is Company
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Poppins_500Medium",
                        color: COLORS.textDark,
                      }}
                    >
                      {isCompany ? "Yes, I have a company" : "No, individual business"}
                    </Text>
                  </View>
                  <Switch
                    value={isCompany}
                    onValueChange={(val) => {
                      setIsCompany(val);
                      setError(null);
                    }}
                    disabled={isSaving || loading}
                    trackColor={{ false: COLORS.border, true: `${COLORS.primary}40` }}
                    thumbColor={isCompany ? COLORS.primary : COLORS.textLight}
                  />
                </View>
              </View>

              {isCompany && (
                <InputField
                  label="Registered Company Name"
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder="Enter registered company name"
                  maxLength={100}
                />
              )}

              <InputField
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholder="10-digit phone number"
                optional
                maxLength={10}
                keyboardType="phone-pad"
              />

              <InputField
                label="Business Address"
                value={address}
                onChangeText={setAddress}
                placeholder="Full business address"
                optional
                maxLength={200}
              />
            </View>
          )}

          {/* Advanced Details Tab */}
          {activeTab === "advanced" && (
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <InputField
                label="GST Number"
                value={gstNumber}
                onChangeText={setGstNumber}
                placeholder="27ABCDE1234F1Z5"
                optional
                maxLength={15}
              />

              <InputField
                label="Business Type"
                value={businessType}
                onChangeText={setBusinessType}
                placeholder="Sole Proprietor, Partnership, Pvt Ltd, LLP"
                optional
                maxLength={50}
              />

              <View
                style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: COLORS.alertAmber,
                  padding: 12,
                  marginTop: 16,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <Ionicons
                    name="information-circle"
                    size={16}
                    color={COLORS.alertAmber}
                    style={{ marginRight: 8, marginTop: 2 }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: COLORS.textDark,
                      fontFamily: "Poppins_400Regular",
                    }}
                  >
                    GST Number format: 2 digits + 5 letters + 4 digits + 1 letter + 1 digit + Z + 1 character
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Status Tab */}
          {activeTab === "status" && (
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              {/* KYC Status Card */}
              <View
                style={{
                  backgroundColor: "#E8F8FE",
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: COLORS.primary,
                  padding: 16,
                  marginBottom: 20,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <Ionicons
                    name="shield-checkmark"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.primary,
                      marginLeft: 12,
                      textTransform: "capitalize",
                    }}
                  >
                    Verification Status
                  </Text>
                </View>

                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.textDark,
                    fontFamily: "Poppins_400Regular",
                  }}
                >
                  Your KYC verification is pending. Upload all required documents to proceed with verification.
                </Text>
              </View>

              {/* Summary */}
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.textLight,
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Business Summary
              </Text>

              <View
                style={{
                  backgroundColor: COLORS.lightGrey,
                  borderRadius: 12,
                  padding: 12,
              }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.textLight,
                      fontFamily: "Poppins_500Medium",
                    }}
                  >
                    Business Name:
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.textDark,
                      fontFamily: "Poppins_600SemiBold",
                    }}
                  >
                    {businessName || "Not set"}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.textLight,
                      fontFamily: "Poppins_500Medium",
                    }}
                  >
                    Business Type:
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.textDark,
                      fontFamily: "Poppins_600SemiBold",
                    }}
                  >
                    {businessType || "Not set"}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.textLight,
                      fontFamily: "Poppins_500Medium",
                    }}
                  >
                    GST Number:
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.textDark,
                      fontFamily: "Poppins_600SemiBold",
                    }}
                  >
                    {gstNumber || "Not set"}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Error Message */}
          {error && (
            <View
              style={{
                backgroundColor: "#FEE2E2",
                borderRadius: 12,
                borderLeftWidth: 4,
                borderLeftColor: COLORS.alertRed,
                padding: 12,
                marginTop: 20,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Ionicons
                  name="alert-circle"
                  size={16}
                  color={COLORS.alertRed}
                  style={{ marginRight: 8, marginTop: 2 }}
                />
                <Text
                  style={{
                    color: COLORS.alertRed,
                    fontSize: 13,
                    fontFamily: "Poppins_500Medium",
                    flex: 1,
                  }}
                >
                  {error}
                </Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: isSaving || loading ? COLORS.lightGrey : COLORS.primary,
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
              }}
              onPress={handleSave}
              disabled={isSaving || loading}
            >
              {isSaving || loading ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="save"
                    size={16}
                    color={COLORS.white}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: COLORS.white,
                      fontFamily: "Poppins_700Bold",
                      fontSize: 14,
                    }}
                  >
                    Save
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexGrow: 1,
                backgroundColor: "#FEE2E2",
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
              }}
              onPress={handleDelete}
              disabled={isSaving || loading}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="trash"
                  size={16}
                  color={COLORS.alertRed}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    color: COLORS.alertRed,
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 14,
                  }}
                >
                  Clear
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              paddingVertical: 16,
              alignItems: "center",
              marginTop: 12,
            }}
            disabled={isSaving || loading}
          >
            <Text
              style={{
                color: COLORS.primary,
                fontFamily: "Poppins_600SemiBold",
                fontSize: 14,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
