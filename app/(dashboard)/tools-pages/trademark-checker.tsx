import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
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

interface SearchResult {
  id: string;
  trademark: string;
  owner: string;
  status: "available" | "registered" | "pending";
  class: string;
}

export default function TrademarkCheckerScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Mock search results - in real app, this would call an API
      const mockResults: SearchResult[] = [
        {
          id: "1",
          trademark: searchTerm,
          owner: "ABC Corporation Ltd.",
          status: "registered",
          class: "Class 35 - Business Services",
        },
        {
          id: "2",
          trademark: `${searchTerm} Pro`,
          owner: "XYZ Industries",
          status: "pending",
          class: "Class 09 - Software",
        },
        {
          id: "3",
          trademark: `The ${searchTerm}`,
          owner: "Available",
          status: "available",
          class: "Class 41 - Education",
        },
      ];
      setSearchResults(mockResults);
      setHasSearched(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return COLORS.secondary;
      case "registered":
        return COLORS.alertRed;
      case "pending":
        return COLORS.alertAmber;
      default:
        return COLORS.textGray;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return "checkmark-circle";
      case "registered":
        return "close-circle";
      case "pending":
        return "time";
      default:
        return "help-circle";
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      edges={["top"]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
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
          Trademark Checker
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Info Banner */}
        <View
          style={{
            backgroundColor: "#FEF2F2",
            borderLeftWidth: 4,
            borderLeftColor: COLORS.alertRed,
            marginTop: 16,
            marginHorizontal: 16,
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_500Medium",
              color: COLORS.alertRed,
              lineHeight: 18,
            }}
          >
            Search for trademark availability across national and international
            registries to protect your brand.
          </Text>
        </View>

        {/* Search Section */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.textDark,
              marginBottom: 10,
            }}
          >
            Search Trademark
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <TextInput
              placeholder="Enter trademark name..."
              placeholderTextColor={COLORS.textLight}
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={handleSearch}
              style={{
                flex: 1,
                backgroundColor: COLORS.lightGrey,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                fontFamily: "Poppins_500Medium",
                color: COLORS.textDark,
              }}
            />
            <TouchableOpacity
              onPress={handleSearch}
              style={{
                backgroundColor: COLORS.primary,
                width: 44,
                height: 44,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="search" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Results */}
        {hasSearched && (
          <View style={{ paddingHorizontal: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.textDark,
                marginBottom: 12,
              }}
            >
              Search Results ({searchResults.length})
            </Text>

            {searchResults.map((result) => (
              <View
                key={result.id}
                style={{
                  backgroundColor: COLORS.white,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: "Poppins_600SemiBold",
                        color: COLORS.textDark,
                        marginBottom: 4,
                      }}
                    >
                      {result.trademark}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textGray,
                        marginBottom: 8,
                      }}
                    >
                      Owner: {result.owner}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Poppins_400Regular",
                        color: COLORS.textLight,
                      }}
                    >
                      {result.class}
                    </Text>
                  </View>

                  <View
                    style={{
                      alignItems: "center",
                      marginLeft: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor:
                          result.status === "available"
                            ? "#ECFDF5"
                            : result.status === "registered"
                              ? "#FEF2F2"
                              : "#FFFBEB",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 4,
                      }}
                    >
                      <Ionicons
                        name={getStatusIcon(result.status)}
                        size={24}
                        color={getStatusColor(result.status)}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: "Poppins_600SemiBold",
                        color: getStatusColor(result.status),
                        textTransform: "capitalize",
                      }}
                    >
                      {result.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!hasSearched && (
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 40,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#EFF6FF",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={40}
                color={COLORS.primary}
              />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.textDark,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Search for Trademarks
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_400Regular",
                color: COLORS.textGray,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Enter a trademark name above to check availability and search
              results worldwide.
            </Text>
          </View>
        )}

        {/* Info Section */}
        <View
          style={{
            backgroundColor: COLORS.lightGrey,
            borderRadius: 12,
            marginHorizontal: 16,
            marginTop: 24,
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textGray,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 12,
            }}
          >
            How It Works
          </Text>
          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: COLORS.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.white,
                  }}
                >
                  1
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textDark,
                  flex: 1,
                }}
              >
                Enter your trademark name
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: COLORS.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.white,
                  }}
                >
                  2
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textDark,
                  flex: 1,
                }}
              >
                Check availability status
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: COLORS.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_700Bold",
                    color: COLORS.white,
                  }}
                >
                  3
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textDark,
                  flex: 1,
                }}
              >
                Register your trademark immediately
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
