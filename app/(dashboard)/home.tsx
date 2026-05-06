import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState, useContext } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  useColorScheme,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "@/context/AuthContext";

const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#EEF2FF",
  secondary: "#10B981",
  secondaryLight: "#ECFDF5",
  accent: "#F59E0B",
  accentLight: "#FFFBEB",
  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
  success: "#10B981",
  alertRed: "#EF4444",
  alertAmber: "#F59E0B",
  white: "#FFFFFF",
  textDark: "#0F172A",
  textGray: "#475569",
  textLight: "#94A3B8",
  border: "#E2E8F0",
  actionGreenIcon: "#10B981",
  actionYellowIcon: "#F59E0B",
  actionPurpleIcon: "#8B5CF6",
  actionRedIcon: "#EF4444",
  actionGreyIcon: "#64748B",
  cardOrangeBg: "#FFF7ED",
  cardOrangeIcon: "#F97316",
};

const GRADIENTS = {
  premium: ["#4F46E5", "#6366F1"] as const,
  success: ["#10B981", "#059669"] as const,
  warning: ["#F59E0B", "#D97706"] as const,
  danger: ["#EF4444", "#DC2626"] as const,
  slate: ["#1E293B", "#0F172A"] as const,
  glass: ["rgba(255,255,255,0.8)", "rgba(255,255,255,0.4)"] as const,
  blue: ["#3B82F6", "#2563EB"] as const,
  teal: ["#14B8A6", "#0D9488"] as const,
  orange: ["#F97316", "#EA580C"] as const,
  purple: ["#8B5CF6", "#7C3AED"] as const,
  red: ["#EF4444", "#DC2626"] as const,
  green: ["#22C55E", "#16A34A"] as const,
  cyan: ["#06B6D4", "#0891B2"] as const,
  yellow: ["#EAB308", "#CA8A04"] as const,
  gray: ["#6B7280", "#4B5563"] as const,
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
    iconBg: GRADIENTS.premium,
    iconColor: COLORS.primary,
    popular: true,
    accentColor: COLORS.primaryLight,
    cardBg: GRADIENTS.premium,
    layout: "square",
    subItems: ["Private Ltd", "LLP"],
  },
  {
    title: "GST Registration",
    subtitle: "Simplified compliance for your business",
    feeLabel: "Starting from",
    fee: "999",
    icon: "document-text",
    iconBg: GRADIENTS.success,
    iconColor: COLORS.secondary,
    popular: true,
    accentColor: COLORS.secondaryLight,
    cardBg: GRADIENTS.success,
    layout: "square",
  },
  {
    title: "Trademark Registration",
    subtitle: "Protect your brand identity legally",
    feeLabel: "Starting from",
    fee: "4,999",
    icon: "shield-checkmark",
    iconBg: GRADIENTS.warning,
    iconColor: COLORS.accent,
    popular: true,
    accentColor: COLORS.accentLight,
    cardBg: GRADIENTS.warning,
    layout: "wide",
  },
  {
    title: "Startup India Certificate",
    subtitle: "Get support for your Startup India application",
    fee: "899",
    icon: "ribbon",
    iconBg: GRADIENTS.premium,
    iconColor: COLORS.primary,
    accentColor: COLORS.primaryLight,
    cardBg: GRADIENTS.premium,
    layout: "wide",
  },
  {
    title: "ISO Certification",
    subtitle: "Choose the certification type you need",
    fee: "1,499",
    icon: "duplicate",
    iconBg: GRADIENTS.warning,
    iconColor: COLORS.accent,
    accentColor: COLORS.accentLight,
    cardBg: GRADIENTS.warning,
    layout: "wide",
    subItems: ["ISO 9001", "ISO 14001"],
  },
  {
    title: "FSSAI",
    subtitle: "Registration, state license or central license",
    fee: "699",
    icon: "restaurant",
    iconBg: GRADIENTS.success,
    iconColor: COLORS.secondary,
    accentColor: COLORS.secondaryLight,
    cardBg: GRADIENTS.success,
    layout: "square",
    subItems: ["Registration", "State License"],
  },
  {
    title: "Income Tax Returns",
    subtitle: "File your income tax returns accurately",
    feeLabel: "Starting from",
    fee: "499",
    icon: "calculator",
    iconBg: GRADIENTS.premium,
    iconColor: COLORS.primary,
    accentColor: COLORS.primaryLight,
    cardBg: GRADIENTS.premium,
  },
  {
    title: "MSME Registration",
    subtitle: "Free MSME registration support",
    fee: "Free",
    icon: "grid",
    iconBg: GRADIENTS.slate,
    iconColor: COLORS.slate[400],
    accentColor: COLORS.slate[100],
    cardBg: GRADIENTS.slate,
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
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get("window");
  const isSmallPhone = width < 360;
  const bottomPadding = insets.bottom ?? 16;
  const { user } = useContext(AuthContext)!;

  // ─── Quick Action Grid ────────────────────────────────────────────────────
  const QuickActionButton = ({ icon, label, bg, onPress }: any) => {
    const buttonSize = Math.max(48, screenWidth * 0.16);
    const iconSize = Math.max(22, buttonSize * 0.42);

    return (
      <TouchableOpacity
        onPress={onPress}
        className="items-center w-[23%] mb-4"
        activeOpacity={0.7}
      >
        <View
          className="items-center justify-center mb-2"
          style={{
            width: buttonSize,
            height: buttonSize,
            borderRadius: 18,
            backgroundColor: COLORS.white,
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 2,
          }}
        >
          <Ionicons name={icon} size={iconSize} color={COLORS.primary} />
        </View>
        <Text
          style={{
            fontSize: getResponsiveFontSize(11),
            fontFamily: "PlusJakartaSans_600SemiBold",
            color: COLORS.slate[600],
            textAlign: "center",
            lineHeight: 14,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  // ─── NEW: Service Card component ──────────────────────────────────────────
  const ServiceCard = ({ item, onPress }: { item: ServiceItem; onPress: () => void }) => {
    const cardWidth = screenWidth > 768 ? 240 : screenWidth * 0.58;

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          width: cardWidth,
          borderRadius: 28,
          backgroundColor: COLORS.white,
          marginRight: 20,
          marginBottom: 16,
          padding: 16,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 15,
          shadowOffset: { width: 0, height: 10 },
          elevation: 5,
          borderWidth: 1,
          borderColor: COLORS.slate[50],
        }}
      >
        <LinearGradient
          colors={item.cardBg}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Ionicons name={item.icon as any} size={28} color={COLORS.white} />
        </LinearGradient>

        <Text
          style={{
            fontSize: 18,
            fontFamily: "PlusJakartaSans_700Bold",
            color: COLORS.textDark,
            lineHeight: 24,
            marginBottom: 8,
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        
        <Text
          style={{
            fontSize: 13,
            fontFamily: "PlusJakartaSans_500Medium",
            color: COLORS.textGray,
            lineHeight: 18,
            marginBottom: 16,
            minHeight: 36,
          }}
          numberOfLines={2}
        >
          {item.subtitle}
        </Text>

        <View className="flex-row items-center justify-between mt-auto">
          <View className="flex-row items-center px-3 py-1.5 rounded-full bg-slate-50">
            <Text
              style={{
                fontSize: 14,
                fontFamily: "PlusJakartaSans_700Bold",
                color: COLORS.primary,
              }}
            >
              {item.fee === "Free" ? "FREE" : `₹${item.fee}`}
            </Text>
          </View>
          <View className="p-2 rounded-full bg-indigo-50">
            <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
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
        borderBottomColor: COLORS.slate[100],
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 15,
            fontFamily: "PlusJakartaSans_600SemiBold",
            color: COLORS.textDark,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontFamily: "PlusJakartaSans_500Medium",
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
              fontFamily: "PlusJakartaSans_600SemiBold",
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
              fontFamily: "PlusJakartaSans_700Bold",
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
    <View style={{ flex: 1, backgroundColor: COLORS.slate[50] }}>
      <StatusBar 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent" 
        translucent={true} 
      />
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── MAIN SCROLL ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: bottomPadding + 120 }}
      >
        {/* ── PREMIUM HEADER ── */}
        <View style={{ height: 260 }}>
          <LinearGradient
            colors={[COLORS.primary, "#6366F1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
            }}
          />
          
          {/* Header Content */}
          <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24 }}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="p-2 rounded-2xl bg-white/20">
                  <Image
                    source={require("../../assets/images/transLogo.png")}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>
                <View className="ml-3">
                  <Text className="text-white text-lg font-[PlusJakartaSans_700Bold]">
                    EaseMyVyaapar
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/(dashboard)/notifications")}
                className="p-3 rounded-2xl bg-white/20"
              >
                <Ionicons name="notifications" size={20} color={COLORS.white} />
                <View className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-indigo-600" />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 32 }}>
              <Text 
                style={{ 
                  fontSize: 28, 
                  fontFamily: "PlusJakartaSans_800ExtraBold", 
                  color: COLORS.white 
                }}
              >
                Hi, {user?.firstName || "Partner"}! 👋
              </Text>
              <Text 
                style={{ 
                  fontSize: 16, 
                  fontFamily: "PlusJakartaSans_500Medium", 
                  color: "rgba(255,255,255,0.8)",
                  marginTop: 4
                }}
              >
                Your business is looking good today.
              </Text>
            </View>
          </View>

          {/* Quick Actions Card (Overlapping) */}
          <View 
            style={{ 
              position: 'absolute',
              bottom: -60,
              left: 20,
              right: 20,
              backgroundColor: COLORS.white,
              borderRadius: 32,
              padding: 20,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 10 },
              elevation: 10,
            }}
          >
            <View className="flex-row items-center justify-between">
              <QuickActionButton icon="rocket" label="Launch" bg={GRADIENTS.premium} onPress={() => {}} />
              <QuickActionButton icon="stats-chart" label="Stats" bg={GRADIENTS.premium} onPress={() => {}} />
              <QuickActionButton icon="document-text" label="Reports" bg={GRADIENTS.premium} onPress={() => {}} />
              <QuickActionButton icon="settings" label="Config" bg={GRADIENTS.premium} onPress={() => {}} />
            </View>
          </View>
        </View>

        <View style={{ marginTop: 80 }}>
          {/* Welcome section replaced by overlapping card */}
        </View>


          <View style={{ marginHorizontal: 24, marginTop: 20 }}>
            <View 
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 32,
                padding: 24,
                borderWidth: 1,
                borderColor: COLORS.slate[100],
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flex: 1 }}>
                <View className="flex-row items-center mb-2">
                  <View className="px-2 py-1 rounded-md bg-indigo-50 mr-2">
                    <Text className="text-[10px] font-[PlusJakartaSans_800ExtraBold] text-indigo-600">
                      FREE TOOL
                    </Text>
                  </View>
                  <Ionicons name="sparkles" size={14} color={COLORS.accent} />
                </View>
                <Text 
                  style={{ 
                    fontSize: 20, 
                    fontFamily: "PlusJakartaSans_700Bold", 
                    color: COLORS.textDark,
                    marginBottom: 4
                  }}
                >
                  Business Health Check
                </Text>
                <Text 
                  style={{ 
                    fontSize: 14, 
                    fontFamily: "PlusJakartaSans_500Medium", 
                    color: COLORS.textGray,
                    marginBottom: 16
                  }}
                >
                  Get your free score & insights in 2 mins.
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(dashboard)/health-check")}
                  style={{
                    backgroundColor: COLORS.primary,
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 16,
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "PlusJakartaSans_700Bold",
                      color: COLORS.white,
                      marginRight: 8
                    }}
                  >
                    Start Analysis
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              
              <View 
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 24,
                  backgroundColor: COLORS.slate[50],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 16
                }}
              >
                <Ionicons name="pulse" size={40} color={COLORS.primary} />
              </View>
            </View>
          </View>

        {/* ════════════════════════════════════════════════════
            ── POPULAR SERVICES  (NEW CARD UI) ──
            ════════════════════════════════════════════════════ */}
        <View className="mt-12">
          {/* Section header */}
          <View className="flex-row items-center justify-between px-6 mb-6">
            <View>
              <Text 
                style={{ 
                  fontSize: 22, 
                  fontFamily: "PlusJakartaSans_800ExtraBold", 
                  color: COLORS.textDark 
                }}
              >
                Popular Services
              </Text>
              <Text 
                style={{ 
                  fontSize: 14, 
                  fontFamily: "PlusJakartaSans_500Medium", 
                  color: COLORS.textLight 
                }}
              >
                Essential for your business
              </Text>
            </View>
            <TouchableOpacity className="px-4 py-2 rounded-full bg-slate-100">
              <Text className="text-slate-600 font-[PlusJakartaSans_700Bold] text-xs">
                See All
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

        <View className="mt-10">
          <View className="flex-row items-center justify-between px-6 mb-6">
            <View>
              <Text 
                style={{ 
                  fontSize: 22, 
                  fontFamily: "PlusJakartaSans_800ExtraBold", 
                  color: COLORS.textDark 
                }}
              >
                More Services
              </Text>
              <Text 
                style={{ 
                  fontSize: 14, 
                  fontFamily: "PlusJakartaSans_500Medium", 
                  color: COLORS.textLight 
                }}
              >
                Scale your operations
              </Text>
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

        <View 
          className="mx-6 mt-12 bg-white rounded-[32px] p-6 shadow-sm border border-slate-50"
        >
          <View className="mb-8">
            <Text 
              style={{ 
                fontSize: 20, 
                fontFamily: "PlusJakartaSans_800ExtraBold", 
                color: COLORS.textDark 
              }}
            >
              Tools & Utilities
            </Text>
            <Text 
              style={{ 
                fontSize: 14, 
                fontFamily: "PlusJakartaSans_500Medium", 
                color: COLORS.textLight 
              }}
            >
              Professional resources for you
            </Text>
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
            marginHorizontal: 24,
            marginTop: 32,
            backgroundColor: COLORS.white,
            borderRadius: 32,
            padding: 24,
            shadowColor: "#000",
            shadowOpacity: 0.03,
            shadowRadius: 10,
            elevation: 2,
            borderWidth: 1,
            borderColor: COLORS.slate[50],
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "PlusJakartaSans_800ExtraBold",
                  color: COLORS.textDark,
                }}
              >
                News & Updates
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "PlusJakartaSans_500Medium",
                  color: COLORS.textLight,
                }}
              >
                Stay informed
              </Text>
            </View>
            <TouchableOpacity className="px-4 py-2 rounded-full bg-slate-100">
              <Text className="text-slate-600 font-[PlusJakartaSans_700Bold] text-xs">
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.slate[100],
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.alertRed + "15",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "PlusJakartaSans_700Bold",
                    color: COLORS.alertRed,
                  }}
                >
                  IMPORTANT
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "PlusJakartaSans_500Medium",
                  color: COLORS.textLight,
                }}
              >
                2 hrs ago
              </Text>
            </View>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "PlusJakartaSans_700Bold",
                color: COLORS.textDark,
                marginBottom: 6,
              }}
            >
              New GST Return Filing Guidelines
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "PlusJakartaSans_500Medium",
                color: COLORS.textGray,
                lineHeight: 18,
              }}
              numberOfLines={2}
            >
              The latest circular outlines new deadlines for GSTR-1 and GSTR-3B
              filings starting next month.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ paddingTop: 16, paddingBottom: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.success + "15",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "PlusJakartaSans_700Bold",
                    color: COLORS.success,
                  }}
                >
                  FEATURE
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "PlusJakartaSans_500Medium",
                  color: COLORS.textLight,
                }}
              >
                1 day ago
              </Text>
            </View>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "PlusJakartaSans_700Bold",
                color: COLORS.textDark,
                marginBottom: 6,
              }}
            >
              Introducing Free Logo Maker
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "PlusJakartaSans_500Medium",
                color: COLORS.textGray,
                lineHeight: 18,
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
          borderTopColor: COLORS.slate[100],
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          paddingVertical: 10,
          paddingBottom: bottomPadding + 10,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Ionicons name="home" size={24} color={COLORS.primary} />
          <Text
            style={{
              fontSize: 11,
              fontFamily: "PlusJakartaSans_700Bold",
              color: COLORS.primary,
              marginTop: 4,
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
              fontFamily: "PlusJakartaSans_600SemiBold",
              color: COLORS.textLight,
              marginTop: 4,
            }}
          >
            Ledger
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(dashboard)/action")}
          style={{ alignItems: "center", marginTop: -32 }}
        >
          <LinearGradient
            colors={GRADIENTS.premium}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: COLORS.primary,
              shadowOpacity: 0.4,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 8,
              borderWidth: 4,
              borderColor: COLORS.white,
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
              fontFamily: "PlusJakartaSans_600SemiBold",
              color: COLORS.textLight,
              marginTop: 4,
            }}
          >
            Add
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(dashboard)/profile-pages/help-support")}
          style={{ alignItems: "center" }}
        >
          <Ionicons name="grid-outline" size={24} color={COLORS.textLight} />
          <Text
            style={{
              fontSize: 11,
              fontFamily: "PlusJakartaSans_600SemiBold",
              color: COLORS.textLight,
              marginTop: 4,
            }}
          >
            More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}