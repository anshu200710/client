import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
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

interface ServiceRequest {
  id: string;
  serviceTitle: string;
  clientName: string;
  amount: number;
  status: "pending" | "approved" | "completed" | "rejected";
  createdAt: string;
  completedAt?: string;
  description: string;
  clientEmail?: string;
  clientPhone?: string;
}

// Mock data - replace with real API calls
const mockRequests: ServiceRequest[] = [
  {
    id: "1",
    serviceTitle: "Trademark Registration",
    clientName: "Amit Sharma",
    amount: 5000,
    status: "pending",
    createdAt: "2024-03-20",
    description: "Register my business trademark",
    clientEmail: "amit@example.com",
    clientPhone: "9876543210",
  },
  {
    id: "2",
    serviceTitle: "GST Filing",
    clientName: "Priya Gupta",
    amount: 2500,
    status: "approved",
    createdAt: "2024-03-18",
    description: "Monthly GST return filing",
    clientEmail: "priya@example.com",
    clientPhone: "9876543211",
  },
  {
    id: "3",
    serviceTitle: "Invoice Generation",
    clientName: "Rajesh Kumar",
    amount: 1500,
    status: "completed",
    createdAt: "2024-03-15",
    completedAt: "2024-03-19",
    description: "Generate bulk invoices",
    clientEmail: "rajesh@example.com",
    clientPhone: "9876543212",
  },
  {
    id: "4",
    serviceTitle: "Business Registration",
    clientName: "Neha Singh",
    amount: 4000,
    status: "pending",
    createdAt: "2024-03-19",
    description: "Register new business",
    clientEmail: "neha@example.com",
    clientPhone: "9876543213",
  },
  {
    id: "5",
    serviceTitle: "PAN Card Support",
    clientName: "Vikram Patel",
    amount: 1000,
    status: "completed",
    createdAt: "2024-03-10",
    completedAt: "2024-03-17",
    description: "Help with PAN card application",
    clientEmail: "vikram@example.com",
    clientPhone: "9876543214",
  },
];

type TabType = "pending" | "approved" | "completed" | "all";

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}

const tabs: TabConfig[] = [
  { id: "pending", label: "Pending", icon: "time-outline", color: COLORS.alertAmber },
  { id: "approved", label: "Approved", icon: "checkmark-circle-outline", color: COLORS.primary },
  { id: "completed", label: "Completed", icon: "checkmark-done-circle-outline", color: COLORS.success },
];

const RequestCard = ({ request }: { request: ServiceRequest }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return COLORS.alertAmber;
      case "approved":
        return COLORS.primary;
      case "completed":
        return COLORS.success;
      case "rejected":
        return COLORS.alertRed;
      default:
        return COLORS.textLight;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "time-outline";
      case "approved":
        return "checkmark-circle-outline";
      case "completed":
        return "checkmark-done-circle-outline";
      case "rejected":
        return "close-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 16,
        marginBottom: 12,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.textDark,
            }}
          >
            {request.serviceTitle}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: COLORS.textGray,
              fontFamily: "Poppins_400Regular",
              marginTop: 4,
            }}
          >
            {request.clientName}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: `${getStatusColor(request.status)}15`,
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Ionicons
            name={getStatusIcon(request.status) as any}
            size={14}
            color={getStatusColor(request.status)}
          />
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Poppins_600SemiBold",
              color: getStatusColor(request.status),
              marginLeft: 4,
              textTransform: "capitalize",
            }}
          >
            {request.status}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text
        style={{
          fontSize: 12,
          color: COLORS.textLight,
          fontFamily: "Poppins_400Regular",
          marginBottom: 12,
        }}
      >
        {request.description}
      </Text>

      {/* Info Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 10,
              color: COLORS.textLight,
              fontFamily: "Poppins_500Medium",
              textTransform: "uppercase",
            }}
          >
            Amount
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_700Bold",
              color: COLORS.primary,
              marginTop: 2,
            }}
          >
            ₹{request.amount.toLocaleString()}
          </Text>
        </View>

        <View>
          <Text
            style={{
              fontSize: 10,
              color: COLORS.textLight,
              fontFamily: "Poppins_500Medium",
              textTransform: "uppercase",
            }}
          >
            Created
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_500Medium",
              color: COLORS.textDark,
              marginTop: 2,
            }}
          >
            {new Date(request.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {request.completedAt && (
          <View>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.textLight,
                fontFamily: "Poppins_500Medium",
                textTransform: "uppercase",
              }}
            >
              Completed
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_500Medium",
                color: COLORS.success,
                marginTop: 2,
              }}
            >
              {new Date(request.completedAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <View
    style={{
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    }}
  >
    <Ionicons name="document-outline" size={64} color={COLORS.lightGrey} />
    <Text
      style={{
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
        color: COLORS.textGray,
        marginTop: 16,
      }}
    >
      {message}
    </Text>
  </View>
);

export default function MyRequestsScreen() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [isLoading, setIsLoading] = useState(false);

  const getFilteredRequests = () => {
    if (activeTab === "all") {
      return mockRequests;
    }
    return mockRequests.filter((r) => r.status === activeTab);
  };

  const filteredRequests = getFilteredRequests();

  // Count by status
  const stats = {
    pending: mockRequests.filter((r) => r.status === "pending").length,
    approved: mockRequests.filter((r) => r.status === "approved").length,
    completed: mockRequests.filter((r) => r.status === "completed").length,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "My Requests",
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

      {/* Stats Card */}
      <View
        style={{
          backgroundColor: COLORS.white,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Poppins_700Bold",
                color: COLORS.alertAmber,
              }}
            >
              {stats.pending}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.textLight,
                fontFamily: "Poppins_500Medium",
                marginTop: 4,
              }}
            >
              Pending
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: COLORS.border }} />
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Poppins_700Bold",
                color: COLORS.primary,
              }}
            >
              {stats.approved}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.textLight,
                fontFamily: "Poppins_500Medium",
                marginTop: 4,
              }}
            >
              Approved
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: COLORS.border }} />
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Poppins_700Bold",
                color: COLORS.success,
              }}
            >
              {stats.completed}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.textLight,
                fontFamily: "Poppins_500Medium",
                marginTop: 4,
              }}
            >
              Completed
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              marginRight: 8,
              backgroundColor:
                activeTab === tab.id
                  ? `${tab.color}15`
                  : COLORS.lightGrey,
            }}
          >
            <Ionicons
              name={tab.icon}
              size={16}
              color={activeTab === tab.id ? tab.color : COLORS.textLight}
            />
            <Text
              style={{
                fontSize: 12,
                fontFamily:
                  activeTab === tab.id
                    ? "Poppins_600SemiBold"
                    : "Poppins_500Medium",
                color:
                  activeTab === tab.id
                    ? tab.color
                    : COLORS.textLight,
                marginLeft: 6,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Requests List */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={{ paddingVertical: 40 }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))
        ) : (
          <EmptyState message={`No ${activeTab} requests yet`} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
