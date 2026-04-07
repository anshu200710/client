import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

const GRADIENTS = {
  blue: ["#60A5FA", "#2563EB"] as const,
  green: ["#34D399", "#059669"] as const,
  purple: ["#A78BFA", "#7C3AED"] as const,
  yellow: ["#FBBF24", "#D97706"] as const,
  red: ["#F87171", "#DC2626"] as const,
  orange: ["#FB923C", "#EA580C"] as const,
  teal: ["#2DD4BF", "#0D9488"] as const,
  cyan: ["#22D3EE", "#0891B2"] as const,
  gray: ["#94A3B8", "#475569"] as const,
};

// ─── RESPONSIVE DESIGN HELPERS ───────────────────────────────────────────────
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const DEVICE_TYPE = (() => {
  const aspectRatio = screenHeight / screenWidth;
  if (screenWidth >= 768) return "tablet";
  if (screenWidth < 375) return "small";
  if (screenWidth < 410) return "medium";
  return "large";
})();

const getResponsiveFontSize = (baseSize: number) => {
  const scale = screenWidth / 375;
  return baseSize * scale;
};

const getResponsivePadding = (basePadding: number) => {
  const scale = screenWidth / 375;
  return basePadding * Math.min(scale, 1.2);
};

// ─── UPDATED ServiceItem interface ────────────────────────────────────────────
interface ServiceItem {
  title: string;
  subtitle: string;
  feeLabel?: string;
  fee: string;
  icon: string;
  iconBg: readonly [string, string, ...string[]];
  iconColor: string;
  popular?: boolean;
  accentColor: string;
  cardBg: readonly [string, string];
  layout?: "square" | "wide";
  subItems?: string[];
}

// ─── UPDATED services data ────────────────────────────────────────────────────
const services: ServiceItem[] = [
  {
    title: "Startup Registration",
    subtitle: "Private Ltd or LLP registration options",
    fee: "2,999",
    icon: "business",
    iconBg: GRADIENTS.blue,
    iconColor: COLORS.primary,
    popular: true,
    accentColor: "#EFF6FF",
    cardBg: ["#60A5FA", "#2563EB"],
    layout: "square",
    subItems: ["Private Ltd", "LLP"],
  },
  {
    title: "GST Registration",
    subtitle: "Simplified compliance for your business",
    feeLabel: "Starting from",
    fee: "999",
    icon: "document-text",
    iconBg: GRADIENTS.teal,
    iconColor: COLORS.actionGreenIcon,
    popular: true,
    accentColor: "#F0FDF4",
    cardBg: ["#2DD4BF", "#0D9488"],
    layout: "square",
  },
  {
    title: "Trademark Registration Application",
    subtitle: "Protect your brand identity legally",
    feeLabel: "Starting from",
    fee: "4,999",
    icon: "shield-checkmark",
    iconBg: GRADIENTS.orange,
    iconColor: COLORS.actionYellowIcon,
    popular: true,
    accentColor: "#FFF7ED",
    cardBg: ["#FB923C", "#EA580C"],
    layout: "wide",
  },
  {
    title: "Startup India Certificate Assistance",
    subtitle: "Get support for your Startup India application",
    fee: "899",
    icon: "ribbon",
    iconBg: GRADIENTS.purple,
    iconColor: COLORS.actionPurpleIcon,
    accentColor: "#F5F3FF",
    cardBg: ["#A78BFA", "#7C3AED"],
    layout: "wide",
  },
  {
    title: "ISO Certification",
    subtitle: "Choose the certification type you need",
    fee: "1,499",
    icon: "duplicate",
    iconBg: GRADIENTS.yellow,
    iconColor: COLORS.actionYellowIcon,
    accentColor: "#FFFBEB",
    cardBg: ["#FBBF24", "#D97706"],
    layout: "wide",
    subItems: ["ISO 9001", "ISO 14001", "ISO 45001"],
  },
  {
    title: "FSSAI",
    subtitle: "Registration, state license or central license",
    fee: "699",
    icon: "restaurant",
    iconBg: GRADIENTS.green,
    iconColor: COLORS.actionGreenIcon,
    accentColor: "#ECFDF5",
    cardBg: ["#34D399", "#059669"],
    layout: "square",
    subItems: ["Registration", "State License", "Central License"],
  },
  {
    title: "Income Tax Returns Filing",
    subtitle: "File your income tax returns accurately",
    feeLabel: "Starting from",
    fee: "499",
    icon: "calculator",
    iconBg: GRADIENTS.cyan,
    iconColor: "#0891B2",
    accentColor: "#ECFEFF",
    cardBg: ["#22D3EE", "#0891B2"],
  },
  {
    title: "MSME Registration",
    subtitle: "Free MSME registration support",
    fee: "Free",
    icon: "grid",
    iconBg: GRADIENTS.gray,
    iconColor: COLORS.actionGreyIcon,
    accentColor: "#F8FAFC",
    cardBg: ["#94A3B8", "#475569"],
    layout: "wide",
  },
];

const moreServices: ServiceItem[] = [
  {
    title: "ROC Filing of Companies",
    subtitle: "Annual ROC compliance filings",
    fee: "999",
    icon: "document-attach",
    iconBg: GRADIENTS.blue,
    iconColor: COLORS.primary,
    accentColor: "#EFF6FF",
    cardBg: ["#60A5FA", "#2563EB"],
    layout: "wide",
  },
  {
    title: "GST Returns",
    subtitle: "Monthly and quarterly GST filings",
    fee: "699",
    icon: "file-tray-full",
    iconBg: GRADIENTS.teal,
    iconColor: COLORS.actionGreenIcon,
    accentColor: "#F0FDF4",
    cardBg: ["#2DD4BF", "#0D9488"],
    layout: "square",
  },
  {
    title: "ISI",
    subtitle: "Industrial Safety Inspection services",
    fee: "1,299",
    icon: "checkmark-done-circle",
    iconBg: GRADIENTS.orange,
    iconColor: COLORS.actionYellowIcon,
    accentColor: "#FFF7ED",
    cardBg: ["#FB923C", "#EA580C"],
    layout: "square",
  },
  {
    title: "BIS",
    subtitle: "Bureau of Indian Standards certification",
    fee: "1,299",
    icon: "business",
    iconBg: GRADIENTS.purple,
    iconColor: COLORS.actionPurpleIcon,
    accentColor: "#F5F3FF",
    cardBg: ["#A78BFA", "#7C3AED"],
    layout: "wide",
  },
  {
    title: "Pasara Registration Application",
    subtitle: "Apply for liquor retail or wholesale license",
    fee: "999",
    icon: "shield-checkmark",
    iconBg: GRADIENTS.red,
    iconColor: COLORS.actionRedIcon,
    accentColor: "#FEF2F2",
    cardBg: ["#F87171", "#DC2626"],
  },
  {
    title: "APEDA Registration",
    subtitle: "Export promotion for agricultural products",
    fee: "799",
    icon: "leaf",
    iconBg: GRADIENTS.green,
    iconColor: COLORS.actionGreenIcon,
    accentColor: "#ECFDF5",
    cardBg: ["#34D399", "#059669"],
  },
  {
    title: "Digital Signature Certificate",
    subtitle: "Secure online documents with DSC",
    fee: "499",
    icon: "finger-print",
    iconBg: GRADIENTS.cyan,
    iconColor: "#0891B2",
    accentColor: "#ECFEFF",
    cardBg: ["#22D3EE", "#0891B2"],
    layout: "wide",
  },
  {
    title: "EPF / ESI Registration",
    subtitle: "Employee social security registrations",
    fee: "899",
    icon: "people",
    iconBg: GRADIENTS.yellow,
    iconColor: COLORS.actionYellowIcon,
    accentColor: "#FFFBEB",
    cardBg: ["#FBBF24", "#D97706"],
  },
  {
    title: "LLP Annual Compliance",
    subtitle: "Annual filings for LLP businesses",
    fee: "799",
    icon: "clipboard",
    iconBg: GRADIENTS.blue,
    iconColor: COLORS.primary,
    accentColor: "#EFF6FF",
    cardBg: ["#60A5FA", "#2563EB"],
  },
  {
    title: "Appointment & Removal of Director / Partners",
    subtitle: "Update company records and filings",
    fee: "999",
    icon: "people-circle",
    iconBg: GRADIENTS.purple,
    iconColor: COLORS.actionPurpleIcon,
    accentColor: "#F5F3FF",
    cardBg: ["#A78BFA", "#7C3AED"],
    layout: "wide",
  },
  {
    title: "Section 8 Company / NGO / Society Registration",
    subtitle: "Register a non-profit or society",
    fee: "1,499",
    icon: "business",
    iconBg: GRADIENTS.gray,
    iconColor: COLORS.actionGreyIcon,
    accentColor: "#F8FAFC",
    cardBg: ["#94A3B8", "#475569"],
  },
];

interface ToolItem {
  title: string;
  subtitle: string;
  icon: string;
  iconBg: readonly [string, string, ...string[]];
  iconColor: string;
}

const tools: ToolItem[] = [
  {
    title: "GST Invoice",
    subtitle: "Create tax-compliant bills with automatic GST calculation.",
    icon: "receipt",
    iconBg: GRADIENTS.blue,
    iconColor: "#2563EB",
  },
  {
    title: "Proforma Invoice",
    subtitle: "Send preliminary bills to customers before delivery.",
    icon: "document-attach",
    iconBg: GRADIENTS.teal,
    iconColor: COLORS.actionGreenIcon,
  },
  {
    title: "Quotation / Estimate",
    subtitle: "Send price estimates to win new deals quickly.",
    icon: "pricetag",
    iconBg: GRADIENTS.orange,
    iconColor: COLORS.actionYellowIcon,
  },
  {
    title: "Delivery Challan",
    subtitle: "Accompany goods during transport without invoice.",
    icon: "car",
    iconBg: GRADIENTS.purple,
    iconColor: COLORS.actionPurpleIcon,
  },
  {
    title: "GST Calculator",
    subtitle: "Calculate GST instantly for your invoices and quotes.",
    icon: "calculator",
    iconBg: GRADIENTS.blue,
    iconColor: "#0EA5E9",
  },
  {
    title: "Trademark Checker",
    subtitle: "Check trademark availability and search existing trademarks.",
    icon: "shield-checkmark",
    iconBg: GRADIENTS.red,
    iconColor: COLORS.actionRedIcon,
  },
  {
    title: "Free Logo Maker",
    subtitle: "Create an AI-powered logo for your business instantly.",
    icon: "color-palette",
    iconBg: GRADIENTS.yellow,
    iconColor: COLORS.actionYellowIcon,
  },
  {
    title: "Visiting Card Generator",
    subtitle: "Design and export professional business cards.",
    icon: "id-card",
    iconBg: GRADIENTS.blue,
    iconColor: "#2563EB",
  },
  {
    title: "Social Media Posts",
    subtitle: "Canva style templates for festivals and offers.",
    icon: "logo-instagram",
    iconBg: GRADIENTS.purple,
    iconColor: COLORS.actionPurpleIcon,
  },
  {
    title: "WhatsApp Templates",
    subtitle: "Ready-to-use marketing messages for WhatsApp.",
    icon: "logo-whatsapp",
    iconBg: GRADIENTS.green,
    iconColor: COLORS.actionGreenIcon,
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get("window");
  const isSmallPhone = width < 360;
  const bottomPadding = insets.bottom ?? 16;

  // ─── Quick Action Grid ────────────────────────────────────────────────────
  const QuickActionButton = ({ icon, label, bg, onPress }: any) => {
    const buttonSize = Math.max(50, screenWidth * 0.18);
    const iconSize = Math.max(24, buttonSize * 0.45);

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          alignItems: "center",
          width: "23%",
          marginBottom: getResponsivePadding(16),
          backgroundColor: COLORS.white,
          borderRadius: 20,
          paddingVertical: getResponsivePadding(14),
          paddingHorizontal: 4,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }}
      >
        <LinearGradient
          colors={bg}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: buttonSize,
            height: buttonSize,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <Ionicons name={icon} size={iconSize} color={COLORS.white} />
        </LinearGradient>
        <Text
          style={{
            fontSize: getResponsiveFontSize(11),
            fontFamily: "Poppins_600SemiBold",
            color: COLORS.textDark,
            textAlign: "center",
            lineHeight: getResponsiveFontSize(14),
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  // ─── NEW: Service Card component ──────────────────────────────────────────
  const ServiceCard = ({ item, onPress }: { item: ServiceItem; onPress: () => void }) => {
    const cardWidth = screenWidth > 768 ? 250 : Math.max(200, screenWidth * 0.52);
    const imageHeight = screenWidth > 768 ? 160 : 150;
    const cardMinHeight = screenWidth > 768 ? 280 : 260;

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          width: cardWidth,
          minHeight: cardMinHeight,
          borderRadius: 24,
          overflow: "hidden",
          marginRight: 16,
          marginBottom: 16,
          backgroundColor: COLORS.white,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        }}
      >
        <LinearGradient
          colors={item.cardBg}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: imageHeight,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={item.icon as any} size={60} color={COLORS.white} />
        </LinearGradient>

        <View style={{ padding: getResponsivePadding(14), backgroundColor: COLORS.white, minHeight: 110 }}>
          <Text
            style={{
              fontSize: getResponsiveFontSize(15),
              fontFamily: "Poppins_700Bold",
              color: COLORS.textDark,
              lineHeight: getResponsiveFontSize(22),
              marginBottom: 6,
            }}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: getResponsiveFontSize(12),
              fontFamily: "Poppins_400Regular",
              color: COLORS.textGray,
              lineHeight: getResponsiveFontSize(18),
              marginBottom: 12,
            }}
            numberOfLines={3}
          >
            {item.subtitle}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 12,
                  backgroundColor: item.cardBg[0] + "22",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 8,
                }}
              >
                <Ionicons name={item.icon as any} size={16} color={item.cardBg[1]} />
              </View>
              {item.subItems ? (
                <Text
                  style={{
                    fontSize: getResponsiveFontSize(11),
                    fontFamily: "Poppins_500Medium",
                    color: COLORS.textGray,
                  }}
                  numberOfLines={1}
                >
                  {item.subItems.join(", ")}
                </Text>
              ) : null}
            </View>

            <View
              style={{
                backgroundColor: "#EFF6FF",
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 14,
              }}
            >
              <Text
                style={{
                  fontSize: getResponsiveFontSize(11),
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.primary,
                }}
              >
                {item.fee === "Free" ? "FREE" : `₹${item.fee}`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ─── Pending Task Row ─────────────────────────────────────────────────────
  const PendingTaskRow = ({
    title,
    sub,
    badgeLabel,
    badgeBg,
    badgeColor,
    amount,
  }: any) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 15,
            fontFamily: "Poppins_600SemiBold",
            color: COLORS.textDark,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontFamily: "Poppins_400Regular",
            color: COLORS.textLight,
          }}
        >
          {sub}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <View
          style={{
            backgroundColor: badgeBg,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 20,
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_500Medium",
              color: badgeColor,
            }}
          >
            {badgeLabel}
          </Text>
        </View>
        {amount ? (
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.textDark,
            }}
          >
            {amount}
          </Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} translucent={false} />
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── MAIN SCROLL ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: bottomPadding + 120 }}
      >
        {/* ── GRADIENT HEADER ── */}
        <LinearGradient
          colors={["#75bfe4ff", "#81df73ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingTop: insets.top,
            paddingBottom: 24,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            overflow: "hidden",
          }}
        >
          {/* Logo + Bell Row */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ width: 46 }} />
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../assets/images/transLogo.png")}
                  style={{ width: 64, height: 64, borderRadius: 12 }}
                />
              </View>
              <View style={{ alignItems: "center", marginTop: 6 }}>
                <Text
                  style={{
                    fontSize: isSmallPhone ? 18 : 22,
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.textDark,
                    lineHeight: 28,
                  }}
                >
                  <Text style={{ color: COLORS.textDark }}>EaseMy</Text>
                  <Text style={{ color: COLORS.secondary }}>Vyaapar</Text>
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textGray,
                    marginTop: -4,
                  }}
                >
                  powered by Vyapar Saathi
                </Text>
              </View>
            </View>

            {/* Bell */}
            <TouchableOpacity
              onPress={() => router.push("/(dashboard)/notifications")}
              style={{ position: "relative", padding: 4 }}
            >
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  backgroundColor: COLORS.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="notifications" size={22} color={COLORS.white} />
                <View
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: COLORS.alertRed,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1.5,
                    borderColor: COLORS.white,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      fontFamily: "Poppins_700Bold",
                      color: COLORS.white,
                    }}
                  >
                    3
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Welcome */}
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <Text
              style={{
                fontSize: getResponsiveFontSize(26),
                fontFamily: "Poppins_700Bold",
                color: COLORS.textDark,
              }}
            >
              Welcome, Ankit!
            </Text>
            <Text
              style={{
                fontSize: getResponsiveFontSize(14),
                fontFamily: "Poppins_400Regular",
                color: COLORS.textGray,
                marginTop: 2,
              }}
            >
              Here is your business overview
            </Text>
          </View>

          {/* ── BUSINESS HEALTH CHECK MVP ── */}
          <View style={{ marginHorizontal: 20, marginTop: 30 }}>
            <LinearGradient
              colors={[COLORS.primary, "#2B6FE6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                padding: 24,
                borderRadius: 24,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
                elevation: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "Poppins_700Bold",
                          color: COLORS.white,
                        }}
                      >
                        FREE SERVICE
                      </Text>
                    </View>
                    <Ionicons name="sparkles" size={16} color={COLORS.secondary} />
                  </View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Poppins_700Bold",
                      color: COLORS.white,
                      marginBottom: 4,
                    }}
                  >
                    Business Health Check
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Poppins_400Regular",
                      color: "rgba(255,255,255,0.8)",
                      marginBottom: 16,
                    }}
                  >
                    Get your free score & actionable insights in 2 mins.
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(dashboard)/health-check")}
                    style={{
                      backgroundColor: COLORS.white,
                      paddingHorizontal: 20,
                      paddingVertical: 12,
                      borderRadius: 14,
                      alignSelf: "flex-start",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Poppins_700Bold",
                        color: COLORS.primary,
                      }}
                    >
                      Start Free Check
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="fitness" size={48} color={COLORS.white} />
                </View>
              </View>
            </LinearGradient>
          </View>
        </LinearGradient>

        {/* ════════════════════════════════════════════════════
            ── POPULAR SERVICES  (NEW CARD UI) ──
            ════════════════════════════════════════════════════ */}
        <View
          style={{
            marginHorizontal: 10,
            marginTop: 44,
          }}
        >
          {/* Section header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: COLORS.actionBlueBg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="briefcase-outline" size={18} color={COLORS.primary} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: getResponsiveFontSize(16),
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.textDark,
                  }}
                >
                  Popular Services
                </Text>
                <Text
                  style={{
                    fontSize: getResponsiveFontSize(12),
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textLight,
                  }}
                >
                  Start your business journey
                </Text>
              </View>
            </View>

            <TouchableOpacity>
              <Text
                style={{
                  fontSize: getResponsiveFontSize(13),
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.primary,
                }}
              >
                View All &gt;
              </Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal scroll service cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, paddingVertical: 8 }}
          >
            {services.map((item, index) => (
              <ServiceCard
                key={index}
                item={item}
                onPress={() =>
                  router.push(
                    `/service-pages/request-form?service=${encodeURIComponent(
                      item.title
                    )}&fee=${encodeURIComponent(item.fee)}`
                  )
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* ── MORE SERVICES ── */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 28,
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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: COLORS.actionGreenBg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="layers-outline" size={18} color={COLORS.actionGreenIcon} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: getResponsiveFontSize(16),
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.textDark,
                  }}
                >
                  More Services
                </Text>
                <Text
                  style={{
                    fontSize: getResponsiveFontSize(12),
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textLight,
                  }}
                >
                  Additional business support services
                </Text>
              </View>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, paddingVertical: 8 }}
          >
            {moreServices.map((item, index) => (
              <ServiceCard
                key={index}
                item={item}
                onPress={() =>
                  router.push(
                    `/service-pages/request-form?service=${encodeURIComponent(
                      item.title
                    )}&fee=${encodeURIComponent(item.fee)}`
                  )
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* ── TOOLS & SERVICES ── */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 44,
            backgroundColor: COLORS.white,
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: "#FFF7ED",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="apps-outline" size={18} color="#EA580C" />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.textDark,
                  }}
                >
                  Tools & Services
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textLight,
                  }}
                >
                  Boost your business
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              marginTop: 8,
            }}
          >
            {tools.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: "25%",
                  alignItems: "center",
                  marginBottom: 20,
                }}
                onPress={() => {
                  const slug = item.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                  router.push(`/tools-pages/${slug}` as any);
                }}
              >
                <LinearGradient
                  colors={item.iconBg}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                    shadowColor: item.iconBg[1],
                    shadowOpacity: 0.35,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 3 },
                    elevation: 3,
                  }}
                >
                  <Ionicons name={item.icon as any} size={26} color={COLORS.white} />
                </LinearGradient>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "Poppins_500Medium",
                    color: COLORS.textDark,
                    textAlign: "center",
                    lineHeight: 14,
                    paddingHorizontal: 2,
                  }}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>


        {/* ── PENDING TASKS ── */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 20,
            backgroundColor: COLORS.white,
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: "#EFF6FF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="checkmark-done" size={18} color={COLORS.primary} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.textDark,
                  }}
                >
                  Pending Tasks
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textLight,
                  }}
                >
                  Do not forget to follow up!
                </Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.primary,
                }}
              >
                View All &gt;
              </Text>
            </TouchableOpacity>
          </View>

          <PendingTaskRow
            title="Invoice #123"
            sub="Due: ₹5,600"
            badgeLabel="3 days overdue"
            badgeBg={COLORS.alertRed}
            badgeColor={COLORS.white}
          />
          <PendingTaskRow
            title="Payment Reminder"
            sub="Sharma Traders"
            badgeLabel="Due today"
            badgeBg={COLORS.success}
            badgeColor={COLORS.white}
            amount="₹ 6,940"
          />
        </View>

        {/* ── AVAILABLE OFFERS ── */}
        <View style={{ marginHorizontal: 20, marginTop: 44, marginBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: COLORS.cardOrangeBg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="gift-outline" size={18} color={COLORS.cardOrangeIcon} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.textDark,
                  }}
                >
                  Available Offers
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textLight,
                  }}
                >
                  Save on premium services
                </Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
        >
          <LinearGradient
            colors={["#FF9A9E", "#FECFEF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 280,
              borderRadius: 20,
              padding: 16,
              marginRight: 16,
              shadowColor: "#FF9A9E",
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.textDark,
                  }}
                >
                  50% OFF
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Poppins_500Medium",
                    color: COLORS.textDark,
                    marginTop: 2,
                  }}
                >
                  Trademark Registration
                </Text>
              </View>
              <Ionicons name="shield-checkmark" size={32} color="rgba(0,0,0,0.1)" />
            </View>
            <View
              style={{
                marginTop: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.6)",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.textDark,
                  }}
                >
                  CODE: TM50
                </Text>
              </View>
              <TouchableOpacity>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                  }}
                >
                  Claim Now &gt;
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={["#a8edea", "#fed6e3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 280,
              borderRadius: 20,
              padding: 16,
              marginRight: 16,
              shadowColor: "#a8edea",
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.textDark,
                  }}
                >
                  Get ₹500
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Poppins_500Medium",
                    color: COLORS.textDark,
                    marginTop: 2,
                  }}
                >
                  Refer a business friend
                </Text>
              </View>
              <Ionicons name="people" size={32} color="rgba(0,0,0,0.1)" />
            </View>
            <View
              style={{
                marginTop: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.6)",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.textDark,
                  }}
                >
                  SHARE LINK
                </Text>
              </View>
              <TouchableOpacity>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                  }}
                >
                  Refer Now &gt;
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ScrollView>

        {/* ── NEWS & UPDATES ── */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 44,
            backgroundColor: COLORS.white,
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: COLORS.actionPurpleBg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="newspaper-outline"
                  size={18}
                  color={COLORS.actionPurpleIcon}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.textDark,
                  }}
                >
                  News & Updates
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textLight,
                  }}
                >
                  Stay informed
                </Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_600SemiBold",
                  color: COLORS.primary,
                }}
              >
                View All &gt;
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.actionRedBg,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.alertRed,
                  }}
                >
                  Important
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textLight,
                }}
              >
                2 hrs ago
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.textDark,
                marginBottom: 4,
              }}
            >
              New GST Return Filing Guidelines
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: COLORS.textGray,
              }}
              numberOfLines={2}
            >
              The latest circular outlines new deadlines for GSTR-1 and GSTR-3B
              filings starting next month.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ paddingVertical: 12 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.actionGreenBg,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.actionGreenIcon,
                  }}
                >
                  Feature
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textLight,
                }}
              >
                1 day ago
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.textDark,
                marginBottom: 4,
              }}
            >
              Introducing Free Logo Maker
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: COLORS.textGray,
              }}
              numberOfLines={2}
            >
              Create an AI-powered logo for your business instantly within our
              new tools dashboard!
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          paddingVertical: 10,
          paddingBottom: bottomPadding + 10,
        }}
      >
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Ionicons name="home" size={24} color={COLORS.primary} />
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Poppins_500Medium",
              color: COLORS.primary,
              marginTop: 2,
            }}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(dashboard)/tools")}
          style={{ alignItems: "center" }}
        >
          <Ionicons name="wallet-outline" size={24} color={COLORS.textLight} />
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Poppins_500Medium",
              color: COLORS.textLight,
              marginTop: 2,
            }}
          >
            Ledger
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(dashboard)/action")}
          style={{ alignItems: "center", marginTop: -24 }}
        >
          <LinearGradient
            colors={["#2ECC71", "#10B981"]}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#10B981",
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Ionicons name="add" size={32} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(dashboard)/tools")}
          style={{ alignItems: "center" }}
        >
          <Ionicons name="documents-outline" size={24} color={COLORS.textLight} />
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Poppins_500Medium",
              color: COLORS.textLight,
              marginTop: 2,
            }}
          >
            Add
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(dashboard)/profile-pages/help-support")}
          style={{ alignItems: "center" }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.textLight} />
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Poppins_500Medium",
              color: COLORS.textLight,
              marginTop: 2,
            }}
          >
            More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}