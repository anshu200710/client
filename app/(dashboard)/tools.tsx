import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
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

type ToolItem = {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconBg: string;
  iconColor: string;
};

const tools: ToolItem[] = [
  {
    title: "GST Invoice",
    subtitle: "Create tax-compliant bills with automatic GST calculation.",
    icon: "receipt",
    iconBg: COLORS.actionBlueBg,
    iconColor: "#2563EB",
  },
  {
    title: "Proforma Invoice",
    subtitle: "Send preliminary bills to customers before delivery.",
    icon: "document-attach",
    iconBg: COLORS.actionGreenBg,
    iconColor: COLORS.actionGreenIcon,
  },
  {
    title: "Quotation / Estimate",
    subtitle: "Send price estimates to win new deals quickly.",
    icon: "pricetag",
    iconBg: COLORS.actionYellowBg,
    iconColor: COLORS.actionYellowIcon,
  },
  {
    title: "Delivery Challan",
    subtitle: "Accompany goods during transport without invoice.",
    icon: "car",
    iconBg: COLORS.actionPurpleBg,
    iconColor: COLORS.actionPurpleIcon,
  },
  {
    title: "GST Calculator",
    subtitle: "Calculate GST instantly for your invoices and quotes.",
    icon: "calculator",
    iconBg: COLORS.actionBlueBg,
    iconColor: "#0EA5E9",
  },
];

const QuickAction = ({ iconName, iconColor, bg, label, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flex: 1,
      marginHorizontal: 6,
      alignItems: "center",
      backgroundColor: COLORS.white,
      borderRadius: 20,
      paddingVertical: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}
  >
    <View
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        backgroundColor: bg,
      }}
    >
      <Ionicons name={iconName} size={24} color={iconColor} />
    </View>
    <Text
      style={{
        fontSize: 11,
        textAlign: "center",
        color: COLORS.textGray,
        fontFamily: "Poppins_600SemiBold",
        width: 56,
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default function ToolsScreen() {
  const router = useRouter();

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
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: COLORS.white,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: COLORS.textGray,
            }}
          >
            Tools &
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textDark,
              marginTop: -4,
            }}
          >
            Utilities
          </Text>
        </View>
        <TouchableOpacity
          style={{ padding: 8, marginTop: 4 }}
          onPress={() => router.push("/(dashboard)/notifications")}
        >
          <View
            style={{
              position: "absolute",
              top: 8,
              right: 10,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: COLORS.alertRed,
              zIndex: 1,
              borderWidth: 1.5,
              borderColor: COLORS.white,
            }}
          />
          <Ionicons
            name="notifications-outline"
            size={26}
            color={COLORS.textDark}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {/* Hero Section */}
        <View
          style={{
            paddingHorizontal: 24,
            paddingVertical: 24,
            backgroundColor: "#F0F4FF",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: COLORS.white,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="calculator" size={24} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.textDark,
                }}
              >
                Calculators
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textGray,
                  marginTop: 8,
                  lineHeight: 20,
                }}
              >
                Create professional documents instantly. Select a tool below to
                generate GST compliant invoices.
              </Text>
            </View>
          </View>
        </View>

        {/* Tools List */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          {tools.map((tool) => {
            const handlePress = () => {
              if (tool.title === "GST Invoice") {
                router.push("/(dashboard)/tools-pages/gst-invoice");
              } else if (tool.title === "Proforma Invoice") {
                router.push("/(dashboard)/tools-pages/proforma-invoice");
              } else if (tool.title === "Quotation / Estimate") {
                router.push("/(dashboard)/tools-pages/quotation");
              } else if (tool.title === "Delivery Challan") {
                router.push("/(dashboard)/tools-pages/delivery-challan");
              } else if (tool.title === "GST Calculator") {
                router.push("/(dashboard)/tools-pages/gst-calculator");
              }
            };

            return (
              <TouchableOpacity
                key={tool.title}
                onPress={handlePress}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    marginBottom: 12,
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 16,
                      backgroundColor: tool.iconBg,
                    }}
                  >
                    <Ionicons
                      name={tool.icon}
                      size={24}
                      color={tool.iconColor}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: "Poppins_600SemiBold",
                        color: COLORS.textDark,
                        marginBottom: 4,
                      }}
                    >
                      {tool.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textLight,
                        lineHeight: 18,
                      }}
                    >
                      {tool.subtitle}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={COLORS.textLight}
                    style={{ marginLeft: 8, marginTop: 4 }}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Actions Section */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 24 }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textGray,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>
          <View style={{ flexDirection: "row" }}>
            <QuickAction
              iconName="person-add"
              iconColor="#2563EB"
              bg={COLORS.actionBlueBg}
              label="Add Client"
              onPress={() => {
                alert("Add Client feature coming soon!");
              }}
            />
            <QuickAction
              iconName="grid"
              iconColor={COLORS.actionGreenIcon}
              bg={COLORS.actionGreenBg}
              label="Manage Items"
              onPress={() => {
                alert("Manage Items feature coming soon!");
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
