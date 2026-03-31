import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#1E4FA3",
  primaryLight: "#E5F0FF",
  primaryHover: "#2B5AFF",
  secondary: "#2ECC71",
  success: "#22c55e",
  successLight: "#DCFCE7",
  alertRed: "#ef4444",
  alertRedLight: "#FEE2E2",
  alertAmber: "#F59E0B",
  alertAmberLight: "#FEF3C7",
  lightGrey: "#F8FAFC",
  lightGrey2: "#F1F5F9",
  white: "#FFFFFF",
  textDark: "#0F172A",
  textGray: "#64748B",
  textLight: "#94A3B8",
  border: "#E2E8F0",
};

type Offer = {
  id: string;
  title: string;
  code: string;
  value: string;
  expiry: string;
  active: boolean;
  createdAt: string;
};

const initialOffers: Offer[] = [
  {
    id: "offer_1",
    title: "Monsoon Mega Sale",
    code: "MONSOON50",
    value: "25%",
    expiry: "Oct 24",
    active: true,
    createdAt: "2 days ago",
  },
  {
    id: "offer_2",
    title: "New User Bonus",
    code: "WELCOME10",
    value: "10%",
    expiry: "No Expiry",
    active: true,
    createdAt: "4 days ago",
  },
  {
    id: "offer_3",
    title: "Flash Deal Friday",
    code: "FLASH50",
    value: "50%",
    expiry: "Jun 10",
    active: false,
    createdAt: "1 week ago",
  },
];

export default function OffersScreen() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");
  const [expiry, setExpiry] = useState("");
  const [isActive, setIsActive] = useState(true);

  const selectedOffer = useMemo(() => {
    return offers.find((offer) => offer.id === selectedOfferId) || null;
  }, [offers, selectedOfferId]);

  const resetForm = () => {
    setSelectedOfferId(null);
    setTitle("");
    setCode("");
    setValue("");
    setExpiry("");
    setIsActive(true);
  };

  const handleSave = () => {
    const newOffer: Offer = {
      id: selectedOfferId ?? `offer_${Date.now()}`,
      title: title.trim() || "New Offer",
      code: code.trim() || "NEWCODE",
      value: value.trim() || "0%",
      expiry: expiry.trim() || "No Expiry",
      active: isActive,
      createdAt: "Just now",
    };

    setOffers((prev) => {
      if (selectedOfferId) {
        return prev.map((o) => (o.id === selectedOfferId ? newOffer : o));
      }
      return [newOffer, ...prev];
    });

    resetForm();
  };

  const handleSelectOffer = (offer: Offer) => {
    setSelectedOfferId(offer.id);
    setTitle(offer.title);
    setCode(offer.code);
    setValue(offer.value);
    setExpiry(offer.expiry);
    setIsActive(offer.active);
  };

  const handleToggleOffer = (offer: Offer) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offer.id ? { ...o, active: !o.active } : o)),
    );
  };

  const handleDelete = (offerId: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
    if (selectedOfferId === offerId) resetForm();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGrey }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={28} color={COLORS.textGray} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            fontFamily: "Poppins_600SemiBold",
            color: COLORS.textDark,
            flex: 1,
            textAlign: "center",
          }}
        >
          {selectedOffer ? "Edit Offer" : "Create Offer"}
        </Text>

        <TouchableOpacity onPress={resetForm} style={{ padding: 4 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.primary,
            }}
          >
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 20,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.textDark,
                marginBottom: 12,
              }}
            >
              Upload Banner
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                borderStyle: "dashed",
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 16,
                height: 120,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.lightGrey2,
              }}
            >
              <Ionicons
                name="image-outline"
                size={30}
                color={COLORS.textLight}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_500Medium",
                  color: COLORS.textGray,
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                PNG, JPG up to 5MB
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_500Medium",
                  color: COLORS.primary,
                  marginTop: 4,
                }}
              >
                Tap to upload
              </Text>
            </TouchableOpacity>

            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.textGray,
                  marginBottom: 8,
                }}
              >
                Offer Name
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Summer Sale Bonanza"
                placeholderTextColor={COLORS.textLight}
                style={{
                  backgroundColor: COLORS.lightGrey2,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textDark,
                }}
              />
            </View>

            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.textGray,
                  marginBottom: 8,
                }}
              >
                Discount Code
              </Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="e.g. SUMMER2024"
                placeholderTextColor={COLORS.textLight}
                style={{
                  backgroundColor: COLORS.lightGrey2,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textDark,
                }}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textGray,
                    marginBottom: 8,
                  }}
                >
                  Value
                </Text>
                <TextInput
                  value={value}
                  onChangeText={setValue}
                  placeholder="% 25"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: COLORS.lightGrey2,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 14,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textDark,
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textGray,
                    marginBottom: 8,
                  }}
                >
                  Expiry Date
                </Text>
                <TextInput
                  value={expiry}
                  onChangeText={setExpiry}
                  placeholder="mm/dd/yyyy"
                  placeholderTextColor={COLORS.textLight}
                  style={{
                    backgroundColor: COLORS.lightGrey2,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 14,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textDark,
                  }}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textGray,
                  }}
                >
                  Publish Offer
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textLight,
                  }}
                >
                  Toggle on to make it live for customers.
                </Text>
              </View>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={isActive ? COLORS.white : COLORS.white}
              />
            </View>

            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.8}
              style={{
                marginTop: 20,
                backgroundColor: COLORS.primary,
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.white,
                }}
              >
                Publish Offer
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 26 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textLight,
                marginBottom: 14,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Active Offers
            </Text>

            {offers.map((offer) => (
              <View
                key={offer.id}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: "rgba(226, 232, 240, 0.4)",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Poppins_600SemiBold",
                        color: COLORS.textDark,
                        marginBottom: 2,
                      }}
                    >
                      {offer.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textGray,
                      }}
                    >
                      Code: {offer.code}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textGray,
                        marginTop: 4,
                      }}
                    >
                      Expires: {offer.expiry}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textGray,
                        marginTop: 2,
                      }}
                    >
                      Created: {offer.createdAt}
                    </Text>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_600SemiBold",
                          color: offer.active
                            ? COLORS.success
                            : COLORS.textLight,
                        }}
                      >
                        {offer.active ? "Active" : "Inactive"}
                      </Text>
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: offer.active
                            ? COLORS.success
                            : COLORS.textLight,
                          marginLeft: 8,
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => handleToggleOffer(offer)}
                      style={{
                        marginTop: 12,
                        backgroundColor: offer.active
                          ? COLORS.successLight
                          : COLORS.lightGrey2,
                        borderRadius: 12,
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_600SemiBold",
                          color: offer.active
                            ? COLORS.success
                            : COLORS.textGray,
                        }}
                      >
                        {offer.active ? "Deactivate" : "Activate"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(offer.id)}
                      style={{
                        marginTop: 10,
                        backgroundColor: COLORS.alertRedLight,
                        borderRadius: 12,
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_600SemiBold",
                          color: COLORS.alertRed,
                        }}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleSelectOffer(offer)}
                      style={{
                        marginTop: 10,
                        backgroundColor: COLORS.primaryLight,
                        borderRadius: 12,
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_600SemiBold",
                          color: COLORS.primary,
                        }}
                      >
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
