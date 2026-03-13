import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  DimensionValue,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ── Brand colors ──
const C = {
  primary: "#0066CC",
  secondary: "#FF9900",
  success: "#28A745",
  alertRed: "#DC3545",
  alertAmber: "#FFC107",
  lightGrey: "#F8F9FA",
  white: "#FFFFFF",
  textDark: "#0D1B2A",
  textMid: "#475569",
  textLight: "#94A3B8",
  border: "#E8EDF5",
  cardBg: "#FFFFFF",
};

// ── Tiny SVG-style donut using Views ──
const DonutRing = ({
  percent,
  size = 100,
  stroke = 10,
  color,
  centerLabel,
  subLabel,
}: {
  percent: number;
  size?: number;
  stroke?: number;
  color: string;
  centerLabel: string;
  subLabel: string;
}) => {
  const filled = Math.round(percent);
  const empty = 100 - filled;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Fake donut using border trick */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderColor: C.border,
          position: "absolute",
        }}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderColor: "transparent",
          borderTopColor: color,
          borderRightColor: filled > 25 ? color : "transparent",
          borderBottomColor: filled > 50 ? color : "transparent",
          borderLeftColor: filled > 75 ? color : "transparent",
          position: "absolute",
          transform: [{ rotate: "-90deg" }],
        }}
      />
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "800", color: C.textDark }}>{centerLabel}</Text>
        <Text style={{ fontSize: 9, color: C.textLight, fontWeight: "600", letterSpacing: 0.5 }}>{subLabel}</Text>
      </View>
    </View>
  );
};

// ── Mini bar chart ──
const MiniBarChart = ({
  data,
  color,
  height = 50,
}: {
  data: number[];
  color: string;
  height?: number;
}) => {
  const max = Math.max(...data);
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 3, height }}>
      {data.map((val, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: (val / max) * height,
            backgroundColor: color,
            borderRadius: 3,
            opacity: i === data.length - 2 ? 1 : 0.35 + (i / data.length) * 0.65,
          }}
        />
      ))}
    </View>
  );
};

// ── Segmented filter ──
const SegmentFilter = ({
  options,
  active,
  onSelect,
}: {
  options: string[];
  active: string;
  onSelect: (s: string) => void;
}) => (
  <View
    style={{
      flexDirection: "row",
      backgroundColor: C.lightGrey,
      borderRadius: 30,
      padding: 3,
    }}
  >
    {options.map((opt) => (
      <TouchableOpacity
        key={opt}
        onPress={() => onSelect(opt)}
        style={{
          paddingVertical: 6,
          paddingHorizontal: 14,
          borderRadius: 28,
          backgroundColor: active === opt ? C.primary : "transparent",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: active === opt ? C.white : C.textMid,
          }}
        >
          {opt}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// ── Stat card ──
const KpiCard = ({
  label,
  value,
  sub,
  trend,
  trendUp,
  color,
  barData,
}: {
  label: string;
  value: string;
  sub: string;
  trend: string;
  trendUp: boolean;
  color: string;
  barData: number[];
}) => (
  <View
    style={{
      backgroundColor: C.cardBg,
      borderRadius: 20,
      padding: 16,
      flex: 1,
      borderWidth: 1,
      borderColor: C.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    }}
  >
    <Text style={{ fontSize: 10, fontWeight: "700", color: C.textLight, letterSpacing: 0.8, marginBottom: 4 }}>
      {label}
    </Text>
    <Text style={{ fontSize: 26, fontWeight: "800", color: C.textDark, letterSpacing: -1 }}>{value}</Text>
    <Text style={{ fontSize: 10, color: C.textLight, marginBottom: 10 }}>{sub}</Text>
    <MiniBarChart data={barData} color={color} height={36} />
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
      <Ionicons
        name={trendUp ? "trending-up" : "trending-down"}
        size={12}
        color={trendUp ? C.success : C.alertRed}
      />
      <Text style={{ fontSize: 10, color: trendUp ? C.success : C.alertRed, fontWeight: "700", marginLeft: 3 }}>
        {trend}
      </Text>
    </View>
  </View>
);

// ── Activity table row ──
const TableRow = ({
  label,
  pct,
  value,
  color,
  isLast,
}: {
  label: string;
  pct: string;
  value: string;
  color: string;
  isLast?: boolean;
}) => (
  <View>
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 11 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: "600", color: C.textDark }}>{label}</Text>
      </View>
      <Text style={{ fontSize: 12, color: C.textMid, width: 50, textAlign: "right" }}>{pct}</Text>
      <Text style={{ fontSize: 12, fontWeight: "700", color: C.textDark, width: 58, textAlign: "right" }}>{value}</Text>
    </View>
    {/* Progress bar */}
    <View style={{ height: 3, backgroundColor: C.border, borderRadius: 2, marginBottom: 4 }}>
      <View
        style={{
          height: 3,
          width: pct as DimensionValue,
          backgroundColor: color,
          borderRadius: 2,
        }}
      />
    </View>
    {!isLast && <View style={{ height: 1, backgroundColor: C.border }} />}
  </View>
);

// ── Quick action button ──
const QuickBtn = ({
  icon,
  label,
  color,
  bg,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  color: string;
  bg: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={{ alignItems: "center", width: (SCREEN_WIDTH - 56) / 4 }}>
    <View
      style={{
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6,
        borderWidth: 1,
        borderColor: `${color}22`,
      }}
    >
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={{ fontSize: 10, color: C.textMid, fontWeight: "600", textAlign: "center", lineHeight: 13 }}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function DashboardScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState("Monthly");

  const salesByPeriod: Record<string, number[]> = {
    Daily: [12, 18, 9, 22, 15, 28, 19],
    Weekly: [45, 62, 38, 75, 55, 88, 71],
    Monthly: [320, 410, 290, 520, 480, 610, 570],
    Annually: [3800, 4200, 3100, 5800, 5100, 6400, 5700],
  };

  const invoiceByPeriod: Record<string, string> = {
    Daily: "28",
    Weekly: "184",
    Monthly: "1,243",
    Annually: "14,920",
  };

  const revenueByPeriod: Record<string, string> = {
    Daily: "12,480",
    Weekly: "84,320",
    Monthly: "5,71,900",
    Annually: "68,40,000",
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.lightGrey }} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* ── Header ── */}
        <View
          style={{
            backgroundColor: C.white,
            paddingHorizontal: 20,
            paddingTop: 6,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: C.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontSize: 12, color: C.textLight, fontWeight: "500" }}>Good Morning,</Text>
              <Text style={{ fontSize: 22, fontWeight: "800", color: C.textDark, letterSpacing: -0.5 }}>
                Rahul 👋
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => router.push("/(dashboard)/notifications")}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: C.lightGrey,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 7,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: C.alertRed,
                    borderWidth: 1.5,
                    borderColor: C.white,
                    zIndex: 1,
                  }}
                />
                <Ionicons name="notifications-outline" size={20} color={C.textMid} />
              </TouchableOpacity>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: C.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "800", color: C.white }}>R</Text>
              </View>
            </View>
          </View>

          {/* Period filter */}
          <View style={{ marginTop: 14 }}>
            <SegmentFilter
              options={["Daily", "Weekly", "Monthly", "Annually"]}
              active={period}
              onSelect={setPeriod}
            />
          </View>
        </View>

        {/* ── Hero KPI ── */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            borderRadius: 24,
            backgroundColor: C.primary,
            padding: 20,
            overflow: "hidden",
          }}
        >
          {/* decorative circles */}
          <View
            style={{
              position: "absolute",
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: "#ffffff14",
              top: -40,
              right: -30,
            }}
          />
          <View
            style={{
              position: "absolute",
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: "#ffffff0e",
              bottom: -20,
              left: 60,
            }}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: "#ffffffaa", fontWeight: "600", letterSpacing: 1, marginBottom: 4 }}>
                TOTAL REVENUE
              </Text>
              <Text style={{ fontSize: 34, fontWeight: "800", color: C.white, letterSpacing: -1 }}>
                ₹{revenueByPeriod[period]}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
                <View
                  style={{
                    backgroundColor: "#28A74530",
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <Ionicons name="trending-up" size={11} color={C.success} />
                  <Text style={{ fontSize: 11, color: "#6EE09A", fontWeight: "700" }}>+12.4%</Text>
                </View>
                <Text style={{ fontSize: 11, color: "#ffffff88", marginLeft: 8 }}>vs last {period.toLowerCase()}</Text>
              </View>
            </View>

            {/* Donut */}
            <DonutRing
              percent={68}
              size={90}
              stroke={9}
              color={C.secondary}
              centerLabel="68%"
              subLabel="TARGET"
            />
          </View>

          {/* Mini stats row */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 18,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: "#ffffff1a",
              gap: 0,
            }}
          >
            {[
              { label: "Invoices", value: invoiceByPeriod[period], icon: "receipt-outline" as const },
              { label: "Clients", value: "47", icon: "people-outline" as const },
              { label: "Pending", value: "₹28,400", icon: "hourglass-outline" as const },
            ].map((item, idx) => (
              <View
                key={item.label}
                style={{
                  flex: 1,
                  alignItems: "center",
                  borderRightWidth: idx < 2 ? 1 : 0,
                  borderRightColor: "#ffffff1a",
                }}
              >
                <Ionicons name={item.icon} size={14} color="#ffffff88" />
                <Text style={{ fontSize: 16, fontWeight: "800", color: C.white, marginTop: 3 }}>{item.value}</Text>
                <Text style={{ fontSize: 9, color: "#ffffff77", fontWeight: "600", letterSpacing: 0.5 }}>
                  {item.label.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── KPI Cards Row ── */}
        <View style={{ flexDirection: "row", marginHorizontal: 16, marginTop: 14, gap: 10 }}>
          <KpiCard
            label="SALES"
            value={salesByPeriod[period][6].toString()}
            sub="transactions"
            trend="+8.2% this week"
            trendUp
            color={C.primary}
            barData={salesByPeriod[period]}
          />
          <KpiCard
            label="COLLECTIONS"
            value="94.6%"
            sub="payment rate"
            trend="+2.1% improved"
            trendUp
            color={C.secondary}
            barData={[60, 72, 65, 80, 78, 88, 94]}
          />
        </View>

        {/* ── Quick Actions ── */}
        <View
          style={{
            backgroundColor: C.white,
            marginHorizontal: 16,
            marginTop: 14,
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: C.border,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "800", color: C.textDark, marginBottom: 14, letterSpacing: 0.2 }}>
            Quick Actions
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <QuickBtn
              icon="receipt"
              label="GST Invoice"
              color={C.primary}
              bg="#E8F2FF"
              onPress={() => router.push("/(dashboard)/tools-pages/gst-invoice")}
            />
            <QuickBtn
              icon="cloud-upload-outline"
              label="Upload Doc"
              color="#8B5CF6"
              bg="#F5F3FF"
              onPress={() => router.push("/(dashboard)/action")}
            />
            <QuickBtn
              icon="calculator"
              label="GST Calc"
              color={C.success}
              bg="#EAFBF0"
              onPress={() => router.push("/(dashboard)/tools-pages/gst-calculator")}
            />
            <QuickBtn
              icon="headset"
              label="Support"
              color={C.alertRed}
              bg="#FFECEE"
              onPress={() => router.push("/(dashboard)/profile-pages/help-support")}
            />
          </View>
        </View>

        {/* ── Sales Chart Card ── */}
        <View
          style={{
            backgroundColor: C.white,
            marginHorizontal: 16,
            marginTop: 14,
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: C.border,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <View>
              <Text style={{ fontSize: 13, fontWeight: "800", color: C.textDark }}>Sales Overview</Text>
              <Text style={{ fontSize: 10, color: C.textLight, marginTop: 1 }}>
                {period} performance • Live
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 6 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: C.primary }} />
                <Text style={{ fontSize: 9, color: C.textLight, fontWeight: "600" }}>Sales</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: C.secondary }} />
                <Text style={{ fontSize: 9, color: C.textLight, fontWeight: "600" }}>Target</Text>
              </View>
            </View>
          </View>

          {/* Grouped bar chart */}
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6, height: 80 }}>
            {["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"].map((month, i) => {
              const vals = [45, 62, 38, 75, 55, 88, 71];
              const targets = [55, 58, 55, 70, 65, 80, 85];
              const maxV = 88;
              return (
                <View key={month} style={{ flex: 1, alignItems: "center", gap: 2 }}>
                  <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 2, height: 64 }}>
                    <View
                      style={{
                        width: 8,
                        height: (vals[i] / maxV) * 64,
                        backgroundColor: i === 5 ? C.primary : `${C.primary}55`,
                        borderRadius: 3,
                      }}
                    />
                    <View
                      style={{
                        width: 8,
                        height: (targets[i] / maxV) * 64,
                        backgroundColor: i === 5 ? C.secondary : `${C.secondary}55`,
                        borderRadius: 3,
                      }}
                    />
                  </View>
                  <Text style={{ fontSize: 7, color: C.textLight, fontWeight: "600" }}>{month}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Billing breakdown table ── */}
        <View
          style={{
            backgroundColor: C.white,
            marginHorizontal: 16,
            marginTop: 14,
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: C.border,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: "800", color: C.textDark }}>Billing & Transactions</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.success }} />
              <Text style={{ fontSize: 9, color: C.textLight, fontWeight: "600" }}>Live • 1h ago</Text>
            </View>
          </View>

          {/* Table header */}
          <View style={{ flexDirection: "row", paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: C.border }}>
            <Text style={{ flex: 1, fontSize: 10, color: C.textLight, fontWeight: "700", letterSpacing: 0.5 }}>FEATURE</Text>
            <Text style={{ width: 50, fontSize: 10, color: C.textLight, fontWeight: "700", textAlign: "right" }}>%</Text>
            <Text style={{ width: 58, fontSize: 10, color: C.textLight, fontWeight: "700", textAlign: "right", letterSpacing: 0.5 }}>COUNT</Text>
          </View>

          <TableRow label="Payment Received" pct="94%" value="79,615" color={C.success} />
          <TableRow label="Invoice Created" pct="51%" value="4,292" color={C.primary} />
          <TableRow label="Cancelled" pct="3%" value="253" color={C.alertRed} isLast />
        </View>

        {/* ── User Retention / Cohort chart ── */}
        <View
          style={{
            backgroundColor: C.white,
            marginHorizontal: 16,
            marginTop: 14,
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: C.border,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <Text style={{ fontSize: 13, fontWeight: "800", color: C.textDark }}>Customer Retention</Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 4,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 10, color: C.textMid, fontWeight: "600" }}>Get Report</Text>
              <Ionicons name="chevron-down" size={10} color={C.textMid} />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 10, color: C.textLight, marginBottom: 14 }}>Performing • 1h</Text>

          {/* Stacked bar chart simulation */}
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 5, height: 80 }}>
            {[
              [40, 30], [55, 25], [35, 40], [70, 20], [50, 35],
              [65, 25], [45, 40], [80, 15], [60, 30],
            ].map(([a, b], i) => (
              <View key={i} style={{ flex: 1, gap: 2, alignItems: "center" }}>
                <View style={{ width: "100%", gap: 2 }}>
                  <View
                    style={{
                      height: (a / 95) * 50,
                      backgroundColor: C.secondary,
                      borderRadius: 3,
                      opacity: 0.5 + i * 0.06,
                    }}
                  />
                  <View
                    style={{
                      height: (b / 95) * 30,
                      backgroundColor: C.primary,
                      borderRadius: 3,
                      opacity: 0.4 + i * 0.06,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginTop: 12 }}>
            <Text style={{ fontSize: 26, fontWeight: "800", color: C.textDark }}>40%</Text>
            <View>
              <Text style={{ fontSize: 10, color: C.textLight }}>After 8 months</Text>
              <Text style={{ fontSize: 9, color: C.textLight }}>Feb – Sep</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: C.secondary }} />
              <Text style={{ fontSize: 10, color: C.textMid, fontWeight: "600" }}>First-Time Buyers</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: C.primary }} />
              <Text style={{ fontSize: 10, color: C.textMid, fontWeight: "600" }}>Loyal Customers</Text>
            </View>
          </View>
        </View>

        {/* ── Promo banner ── */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 14,
            borderRadius: 20,
            backgroundColor: C.alertAmber + "18",
            borderWidth: 1,
            borderColor: C.alertAmber + "44",
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: C.alertAmber + "33",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 14,
            }}
          >
            <Ionicons name="flash" size={22} color={C.alertAmber} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: "800", color: C.textDark }}>Tax Season Sale! 🎉</Text>
            <Text style={{ fontSize: 11, color: C.textMid, marginTop: 2 }}>
              20% off on premium assisted filing plans.
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: C.primary,
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 7,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: "800", color: C.white }}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        {/* ── Recent Activity ── */}
        <View
          style={{
            backgroundColor: C.white,
            marginHorizontal: 16,
            marginTop: 14,
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: C.border,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <Text style={{ fontSize: 13, fontWeight: "800", color: C.textDark }}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 11, color: C.primary, fontWeight: "700" }}>View All</Text>
            </TouchableOpacity>
          </View>

          {[
            {
              icon: "document-text" as const,
              iconColor: C.primary,
              iconBg: "#E8F2FF",
              title: "GST Filing Submitted",
              sub: "March 2024 Return",
              status: "Processing",
              statusColor: C.primary,
              statusBg: "#E8F2FF",
            },
            {
              icon: "briefcase" as const,
              iconColor: C.secondary,
              iconBg: "#FFF5E6",
              title: "New Service Request",
              sub: "Annual Audit Service",
              status: "Pending",
              statusColor: C.secondary,
              statusBg: "#FFF5E6",
            },
            {
              icon: "shield-checkmark" as const,
              iconColor: C.success,
              iconBg: "#EAFBF0",
              title: "Document Verified",
              sub: "PAN Card & Aadhar",
              status: "Success",
              statusColor: C.success,
              statusBg: "#EAFBF0",
            },
          ].map((item, idx) => (
            <View key={idx}>
              <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 13,
                    backgroundColor: item.iconBg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name={item.icon} size={18} color={item.iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: C.textDark }}>{item.title}</Text>
                  <Text style={{ fontSize: 11, color: C.textLight, marginTop: 1 }}>{item.sub}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: item.statusBg,
                    paddingHorizontal: 9,
                    paddingVertical: 4,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: "700", color: item.statusColor }}>{item.status}</Text>
                </View>
              </View>
              {idx < 2 && <View style={{ height: 1, backgroundColor: C.border }} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}