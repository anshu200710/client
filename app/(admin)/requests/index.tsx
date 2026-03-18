import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ScrollView,
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

type RequestItem = {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceType: string;
  status: "pending" | "in-progress" | "completed" | "rejected";
  submittedAt: string;
  summary: string;
  details: Record<string, string>;
};

const initialRequests: RequestItem[] = [
  {
    id: "req_1",
    customerName: "Rajesh Kumar",
    customerEmail: "rajesh.k@vyaapar.in",
    serviceType: "GST Registration",
    status: "pending",
    submittedAt: "2h ago",
    summary: "GST registration for new business.",
    details: {
      "Business Name": "Kumar Traders",
      "PAN Number": "ABCDE1234F",
      "Business Address": "123 Market Rd, Ahmedabad",
      "Contact Number": "+91 98765 43210",
    },
  },
  {
    id: "req_2",
    customerName: "Anita Sharma",
    customerEmail: "anita.sharma@gmail.com",
    serviceType: "GST Return Filing",
    status: "in-progress",
    submittedAt: "6h ago",
    summary: "Filing GSTR-3B for April.",
    details: {
      GSTIN: "24ABCDE1234F1Z5",
      "Return Period": "Apr 2026",
      Turnover: "₹12,50,000",
      Attachment: "gstr3b_apr.pdf",
    },
  },
  {
    id: "req_3",
    customerName: "Vikram Kohli",
    customerEmail: "vikram.kohli88@yahoo.com",
    serviceType: "GST Cancellation",
    status: "completed",
    submittedAt: "1d ago",
    summary: "Cancel GST registration as business closed.",
    details: {
      GSTIN: "27ABCDE1234F1Z2",
      Reason: "Business closed",
      "Closure Date": "2026-03-10",
    },
  },
];

export default function RequestsListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "in-progress" | "completed" | "rejected"
  >("all");

  const filteredRequests = useMemo(() => {
    return initialRequests
      .filter((req) => {
        if (activeFilter === "all") return true;
        return req.status === activeFilter;
      })
      .filter((req) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        return (
          req.customerName.toLowerCase().includes(query) ||
          req.customerEmail.toLowerCase().includes(query) ||
          req.serviceType.toLowerCase().includes(query) ||
          req.summary.toLowerCase().includes(query)
        );
      });
  }, [searchQuery, activeFilter]);

  const RequestCard = ({ item }: { item: RequestItem }) => {
    const statusColor =
      item.status === "pending"
        ? COLORS.alertAmber
        : item.status === "in-progress"
          ? COLORS.primary
          : item.status === "completed"
            ? COLORS.success
            : COLORS.alertRed;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push(`/requests/${item.id}`)}
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: "rgba(226, 232, 240, 0.4)",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.textDark,
                marginBottom: 4,
              }}
            >
              {item.serviceType}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: COLORS.textGray,
              }}
            >
              {item.summary}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: statusColor,
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Poppins_600SemiBold",
                  color: statusColor,
                  textTransform: "capitalize",
                }}
              >
                {item.status}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Poppins_400Regular",
                color: COLORS.textLight,
              }}
            >
              {item.submittedAt}
            </Text>
          </View>
        </View>

        <View
          style={{ marginTop: 12, flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons name="person-circle" size={18} color={COLORS.textLight} />
          <Text
            style={{
              marginLeft: 6,
              fontSize: 12,
              fontFamily: "Poppins_500Medium",
              color: COLORS.textGray,
            }}
          >
            {item.customerName} • {item.customerEmail}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const FilterButton = ({
    label,
    value,
  }: {
    label: string;
    value: typeof activeFilter;
  }) => (
    <TouchableOpacity
      onPress={() => setActiveFilter(value)}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 50,
        backgroundColor: activeFilter === value ? COLORS.primary : COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: 10,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontFamily:
            activeFilter === value
              ? "Poppins_600SemiBold"
              : "Poppins_500Medium",
          color: activeFilter === value ? COLORS.white : COLORS.textGray,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

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
          Service Requests
        </Text>
        <TouchableOpacity
          onPress={() => setSearchQuery("")}
          style={{ padding: 4 }}
        >
          <Ionicons name="refresh" size={24} color={COLORS.textGray} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.white,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Ionicons
              name="search"
              size={20}
              color={COLORS.textLight}
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Search requests..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: COLORS.textDark,
                outlineStyle: "none" as any,
              }}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 6 }}
          >
            <FilterButton label="All" value="all" />
            <FilterButton label="Pending" value="pending" />
            <FilterButton label="In Progress" value="in-progress" />
            <FilterButton label="Completed" value="completed" />
            <FilterButton label="Rejected" value="rejected" />
          </ScrollView>

          <Text
            style={{
              fontSize: 13,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textGray,
              marginBottom: 12,
              marginTop: 6,
            }}
          >
            {filteredRequests.length} requests
          </Text>

          {filteredRequests.map((request) => (
            <RequestCard key={request.id} item={request} />
          ))}

          {filteredRequests.length === 0 && (
            <View style={{ paddingVertical: 32, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textGray,
                }}
              >
                No requests match your search.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
