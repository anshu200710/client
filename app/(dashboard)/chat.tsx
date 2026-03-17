import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Match home.tsx colors
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

  // Custom pastels from screenshot
  cardOrangeBg: "#FFF7ED",
  cardOrangeIcon: "#FF8A00",
  cardGreenBg: "#ECFDF5",
  cardGreenIcon: "#10B981",
  actionBlueBg: "#EFF6FF",
  actionPurpleBg: "#F5F3FF",
  actionPurpleIcon: "#8B5CF6",
  actionGreenBg: "#ECFDF5",
  actionGreenIcon: "#10B981",
  actionRedBg: "#FEF2F2",
  actionRedIcon: "#EF4444",
  actionYellowBg: "#FFFBEB",
  actionYellowIcon: "#F59E0B",
  actionGreyBg: "#F8FAFC",
  actionGreyIcon: "#94A3B8",
};

const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginRight: 12,
      borderRadius: 20,
      backgroundColor: active ? COLORS.primary : COLORS.lightGrey,
      borderWidth: 1,
      borderColor: active ? COLORS.primary : COLORS.border,
    }}
  >
    <Text
      style={{
        fontSize: 12,
        fontFamily: "Poppins_500Medium",
        color: active ? COLORS.white : COLORS.textLight,
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const OfferCard = ({
  category,
  categoryColor,
  title,
  discount,
  description,
  timeLeft,
  icon,
  onClaim,
}: any) => (
  <View
    style={{
      backgroundColor: COLORS.white,
      borderRadius: 20,
      marginBottom: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: COLORS.border,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#F0F4FF",
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: COLORS.white,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name={icon} size={20} color={categoryColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Poppins_700Bold",
            color: categoryColor,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {category}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_700Bold",
            color: COLORS.textDark,
            marginTop: 2,
          }}
        >
          {title}
        </Text>
      </View>
      {timeLeft && (
        <View
          style={{
            backgroundColor: "#FEE2E2",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Poppins_700Bold",
              color: COLORS.alertRed,
            }}
          >
            {timeLeft}
          </Text>
        </View>
      )}
    </View>
    <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
      <Text
        style={{
          fontSize: 26,
          fontFamily: "Poppins_800ExtraBold",
          color: COLORS.textDark,
          marginBottom: 8,
        }}
      >
        {discount}
      </Text>
      <Text
        style={{
          fontSize: 13,
          fontFamily: "Poppins_400Regular",
          color: COLORS.textLight,
          lineHeight: 20,
          marginBottom: 16,
        }}
      >
        {description}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Poppins_400Regular",
              color: COLORS.textLight,
              textDecorationLine: "underline",
            }}
          >
            Terms Apply
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onClaim}
          style={{
            backgroundColor: COLORS.primary,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_700Bold",
              color: COLORS.white,
            }}
          >
            Claim Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default function OffersScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = ["All Offers", "GST Filing", "Business Loans", "Software"];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      edges={["top"]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 8,
          backgroundColor: COLORS.white,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 28,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textDark,
              }}
            >
              Offers
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: COLORS.textLight,
                marginTop: 2,
              }}
            >
              Exclusive deals for your business
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: COLORS.lightGrey,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => router.push("/(dashboard)/notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={COLORS.textDark}
            />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 4 }}
        >
          {filters.map((filter, idx) => (
            <FilterChip
              key={idx}
              label={filter}
              active={activeFilter === filter.toLowerCase()}
              onPress={() => setActiveFilter(filter.toLowerCase())}
            />
          ))}
        </ScrollView>
      </View>

      {/* Offers List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 130,
        }}
      >
        <OfferCard
          icon="document-text"
          category="Taxation"
          categoryColor="#2563EB"
          title="ClearTax Premium"
          discount="20% off"
          description="Save big on your quarterly returns. Expert assisted filing with zero errors guaranteed."
          timeLeft="Ends in 04:23:01"
          onClaim={() => {}}
        />

        <View
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 20,
            padding: 16,
            marginBottom: 16,
            borderWidth: 2,
            borderColor: COLORS.primary,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#E0E8FF",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="business" size={20} color={COLORS.secondary} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_800ExtraBold",
                    color: COLORS.white,
                  }}
                >
                  Business Loan
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "Poppins_400Regular",
                    color: "#B8D4FF",
                    marginTop: 2,
                  }}
                >
                  Partner Bank
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "#FACC15",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Poppins_800ExtraBold",
                  color: "#713F12",
                }}
              >
                POPULAR
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Poppins_800ExtraBold",
              color: COLORS.white,
              marginBottom: 4,
            }}
          >
            Zero Processing
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: "#E0E8FF",
              marginBottom: 12,
              lineHeight: 18,
            }}
          >
            On all business loans above Rs1 Lakh. Approved within 24 hours.
          </Text>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Ionicons name="alert-circle" size={14} color="#FACC15" />
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Poppins_500Medium",
                color: "#FACC15",
                marginLeft: 8,
              }}
            >
              Only 12 slots left today
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.secondary,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_700Bold",
                color: COLORS.white,
              }}
            >
              Check Eligibility
            </Text>
          </TouchableOpacity>
        </View>

        <OfferCard
          icon="document"
          category="Documentation"
          categoryColor="#8B5CF6"
          title="Invoice Templates"
          discount="100% Free"
          description="Professional invoice templates for GST-compliant billing. Create unlimited invoices instantly."
          onClaim={() => {}}
        />

        {/* Freebie Card */}
        <View
          style={{
            backgroundColor: "#7C3AED",
            borderRadius: 20,
            padding: 16,
            marginBottom: 20,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                backgroundColor: "#A78BFA",
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Poppins_800ExtraBold",
                  color: COLORS.white,
                  textTransform: "uppercase",
                }}
              >
                Freebie
              </Text>
            </View>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: COLORS.white,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="qr-code" size={20} color="#7C3AED" />
            </View>
          </View>
          <Text
            style={{
              fontSize: 26,
              fontFamily: "Poppins_800ExtraBold",
              color: COLORS.white,
              marginBottom: 8,
            }}
          >
            Digital Card
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: "#E9D5FF",
              marginBottom: 16,
              lineHeight: 18,
            }}
          >
            Create a professional digital identity for your business. Shareable
            on WhatsApp instantly.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.white,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_700Bold",
                color: "#7C3AED",
              }}
            >
              Create Now →
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Poppins_400Regular",
              color: "#DDD6FE",
              textAlign: "center",
              marginTop: 12,
            }}
          >
            No credit card required
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
