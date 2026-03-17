import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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

type ServiceTrack = {
  id: string;
  name: string;
  requestedOn: string;
  amount: string;
  serviceStatus: "In Review" | "Pending Documents" | "Completed";
  paymentStatus: "Paid" | "Pending";
  canDownload?: boolean;
};

const items: ServiceTrack[] = [
  {
    id: "SRV-1024",
    name: "GST Registration",
    requestedOn: "10 Mar 2026",
    amount: "Rs999",
    serviceStatus: "In Review",
    paymentStatus: "Paid",
  },
  {
    id: "SRV-1018",
    name: "Trademark Registration",
    requestedOn: "08 Mar 2026",
    amount: "Rs4,999",
    serviceStatus: "Pending Documents",
    paymentStatus: "Pending",
  },
  {
    id: "SRV-1007",
    name: "ITR Filing",
    requestedOn: "02 Mar 2026",
    amount: "Rs499",
    serviceStatus: "Completed",
    paymentStatus: "Paid",
    canDownload: true,
  },
];

const StatusPill = ({ value }: { value: ServiceTrack["serviceStatus"] }) => {
  const map = {
    "In Review": { bg: "#DBEAFE", color: "#1D4ED8" },
    "Pending Documents": { bg: "#FEF3C7", color: "#B45309" },
    Completed: { bg: "#DCFCE7", color: "#166534" },
  } as const;

  const { bg, color } = map[value];

  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: bg,
      }}
    >
      <Text style={{ fontSize: 10, fontFamily: "Poppins_700Bold", color }}>
        {value}
      </Text>
    </View>
  );
};

export default function MyServicesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      edges={["top"]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
          backgroundColor: COLORS.white,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: COLORS.white,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Poppins_700Bold",
            color: COLORS.textDark,
            marginLeft: 12,
          }}
        >
          My Services
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
              paddingHorizontal: 16,
              paddingVertical: 16,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.textDark,
                }}
              >
                {item.name}
              </Text>
              <StatusPill value={item.serviceStatus} />
            </View>

            <Text
              style={{ fontSize: 12, color: COLORS.textGray, marginTop: 4 }}
            >
              Request ID: {item.id}
            </Text>
            <Text
              style={{ fontSize: 12, color: COLORS.textGray, marginTop: 2 }}
            >
              Requested on {item.requestedOn}
            </Text>

            <View
              style={{
                height: 1,
                backgroundColor: "#EEF2F7",
                marginVertical: 12,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 11,
                    color: "#94A3B8",
                    fontFamily: "Poppins_500Medium",
                  }}
                >
                  Payment
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color:
                      item.paymentStatus === "Paid" ? "#16A34A" : "#B45309",
                    marginTop: 2,
                  }}
                >
                  {item.paymentStatus}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 11,
                    color: "#94A3B8",
                    textAlign: "right",
                    fontFamily: "Poppins_500Medium",
                  }}
                >
                  Amount
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                    marginTop: 2,
                  }}
                >
                  {item.amount}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#EFF6FF",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginRight: 8,
                }}
                onPress={() =>
                  router.push({
                    pathname: "/(dashboard)/profile-pages/request-details",
                    params: { service: item.name, requestId: item.id },
                  })
                }
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: "#1D4ED8",
                  }}
                >
                  View Details
                </Text>
              </TouchableOpacity>

              {item.canDownload ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.primary,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.white,
                    }}
                  >
                    Download Files
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#F1F5F9",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.textGray,
                    }}
                  >
                    Download Pending
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
