import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#1E4FA3",
  primaryLight: "#E5F0FF",
  secondary: "#2ECC71",
  accent: "#6366F1",
  textLight: "#9FA3B1",
  textDark: "#1A1A1A",
  white: "#FFFFFF",
  lightGrey: "#F8FAFC",
  border: "#E2E8F0",
};

export default function PaymentScreen() {
  const paymentStats = [
    {
      title: "Total Revenue",
      amount: "₹2,45,000",
      icon: "cash",
      color: COLORS.secondary,
    },
    {
      title: "Pending Payments",
      amount: "₹15,000",
      icon: "time",
      color: COLORS.accent,
    },
    {
      title: "Completed This Month",
      amount: "₹1,80,000",
      icon: "checkmark-circle",
      color: COLORS.primary,
    },
    {
      title: "Failed Transactions",
      amount: "₹2,500",
      icon: "close-circle",
      color: "#EF4444",
    },
  ];

  const recentTransactions = [
    {
      id: "TXN001",
      customer: "John Doe",
      service: "GST Filing",
      amount: "₹5,000",
      status: "Completed",
      date: "2024-01-15",
    },
    {
      id: "TXN002",
      customer: "Jane Smith",
      service: "Trademark Check",
      amount: "₹3,000",
      status: "Pending",
      date: "2024-01-14",
    },
    {
      id: "TXN003",
      customer: "Bob Johnson",
      service: "Business Registration",
      amount: "₹8,000",
      status: "Completed",
      date: "2024-01-13",
    },
    {
      id: "TXN004",
      customer: "Alice Brown",
      service: "GST Calculator",
      amount: "₹1,500",
      status: "Failed",
      date: "2024-01-12",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return COLORS.secondary;
      case "Pending":
        return COLORS.accent;
      case "Failed":
        return "#EF4444";
      default:
        return COLORS.textLight;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGrey }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: COLORS.white,
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.textDark,
              marginBottom: 4,
            }}
          >
            Payment Management
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: COLORS.textLight,
            }}
          >
            Monitor transactions and revenue
          </Text>
        </View>

        {/* Payment Stats */}
        <View style={{ padding: 16 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.textDark,
              marginBottom: 16,
            }}
          >
            Overview
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {paymentStats.map((stat, index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  minWidth: "45%",
                  backgroundColor: COLORS.white,
                  borderRadius: 12,
                  padding: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: stat.color + "20",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <Ionicons
                      name={stat.icon as any}
                      size={20}
                      color={stat.color}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textLight,
                        marginBottom: 2,
                      }}
                    >
                      {stat.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "Poppins_600SemiBold",
                        color: COLORS.textDark,
                      }}
                    >
                      {stat.amount}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={{ padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.textDark,
              }}
            >
              Recent Transactions
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_500Medium",
                  color: COLORS.primary,
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 12 }}>
            {recentTransactions.map((transaction) => (
              <View
                key={transaction.id}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 12,
                  padding: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "Poppins_600SemiBold",
                        color: COLORS.textDark,
                        marginBottom: 4,
                      }}
                    >
                      {transaction.customer}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textLight,
                      }}
                    >
                      {transaction.service} • {transaction.id}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "Poppins_600SemiBold",
                        color: COLORS.primary,
                        marginBottom: 4,
                      }}
                    >
                      {transaction.amount}
                    </Text>
                    <View
                      style={{
                        backgroundColor:
                          getStatusColor(transaction.status) + "20",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_500Medium",
                          color: getStatusColor(transaction.status),
                        }}
                      >
                        {transaction.status}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textLight,
                  }}
                >
                  {transaction.date}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
