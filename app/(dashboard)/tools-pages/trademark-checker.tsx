import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toolsService } from "../../../services";

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

const { width } = Dimensions.get("window");

interface SearchResult {
  id: string;
  trademark: string;
  owner: string;
  status: "available" | "registered" | "pending";
  class: string;
  application_number?: string;
  summary?: string;
  createdAt?: string;
  rawText?: string;
  classesList?: string[];
  image?: string;
}

export default function TrademarkCheckerScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSearch = async (
    term?: string,
    opts?: { class?: string | null; status?: string | null }
  ) => {
    const effectiveTerm = typeof term === "string" ? term : searchTerm;
    const cls =
      opts && Object.prototype.hasOwnProperty.call(opts, "class")
        ? opts.class
        : selectedClass;
    const statusOpt =
      opts && Object.prototype.hasOwnProperty.call(opts, "status")
        ? opts.status
        : statusFilter;

    if (
      !effectiveTerm ||
      !effectiveTerm.trim() ||
      effectiveTerm.trim().length < 2
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(false);
      setExpandedId(null);

      const payload: any = { trademark: effectiveTerm };
      if (cls) payload.classes = [cls];

      const timeoutMs = 25000;
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), timeoutMs)
      );

      const resp = (await Promise.race([
        toolsService.checkTrademark(payload),
        timeoutPromise,
      ])) as any;

      const normalize = (r: any): SearchResult => {
        const raw = (r.brand_name || r.name || "") as string;
        const lines = raw
          .split("\n")
          .map((l: string) => l.trim())
          .filter(Boolean);

        let dateLine = "";
        let idLine = "";
        let titleLine = "";

        for (let i = 0; i < Math.min(6, lines.length); i++) {
          const ln = lines[i];
          if (!dateLine && /\d{1,2}\s+\w+\s+\d{4}/.test(ln)) dateLine = ln;
          if (!idLine && /ID[:\s]/i.test(ln)) idLine = ln;
        }

        titleLine =
          lines.find(
            (l) =>
              l !== dateLine && l !== idLine && l.length > 2 && l.length < 50
          ) || searchTerm;

        const classesList: string[] = [];
        const classMatch =
          raw.match(/Class\s*[:\]]\s*([0-9,\s]+)/i) ||
          raw.match(/\[Class\s*:\s*([^\]]+)\]/i);

        if (classMatch && classMatch[1]) {
          classMatch[1]
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
            .forEach((c: string) => classesList.push(c));
        }

        const description = lines
          .slice(
            Math.max(0, lines.indexOf(titleLine) + 1),
            Math.max(0, lines.indexOf(titleLine) + 4)
          )
          .join(" ")
          .slice(0, 120);

        return {
          id:
            r._id ||
            r.id ||
            r.application_number ||
            Math.random().toString(36).slice(2),
          trademark: titleLine,
          owner: r.owner || "Unknown",
          status: r.status || (r.available ? "available" : "registered"),
          class: classesList[0] || r.class || r.trademarkClass || "",
          application_number: r.application_number || "",
          image: r.image || "",
          summary: description || lines.slice(1, 3).join(" "),
          createdAt: r.createdAt || dateLine || "",
          rawText: raw,
          classesList,
        };
      };

      let mapped: SearchResult[] = (resp.results || []).map(normalize);

      const seen = new Set<string>();
      mapped = mapped.filter((m) => {
        const key = (m.trademark || "").toString().trim().toLowerCase();
        if (!key) return true;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      if (statusOpt) {
        mapped = mapped.filter((m) => {
          if (statusOpt === "available") return m.status === "available";
          if (statusOpt === "registered") return m.status === "registered";
          return true;
        });
      }

      setSearchResults(mapped);
      setHasSearched(true);
    } catch (err: any) {
      console.error("Trademark search failed:", err);
      setError(err?.message || "Search failed. Please try again.");
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
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
            backgroundColor: COLORS.lightGrey,
            alignItems: "center",
            justifyContent: "center",
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
            flex: 1,
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
              fontSize: 13,
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
              marginBottom: 12,
            }}
          >
            Search Trademark
          </Text>

          {/* Search Input */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TextInput
              placeholder="Enter trademark name..."
              placeholderTextColor={COLORS.textLight}
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={() => handleSearch(searchTerm)}
              editable={!loading}
              style={{
                flex: 1,
                backgroundColor: COLORS.lightGrey,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                fontFamily: "Poppins_500Medium",
                color: COLORS.textDark,
              }}
            />
            <TouchableOpacity
              onPress={() => handleSearch(searchTerm)}
              disabled={loading}
              style={{
                backgroundColor: loading ? COLORS.textLight : COLORS.primary,
                width: 48,
                height: 48,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Ionicons name="search" size={22} color={COLORS.white} />
              )}
            </TouchableOpacity>
          </View>

          {/* Class Chips */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 14,
            }}
          >
            {["1", "9", "25", "35", "41"].map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => {
                  const newClass = selectedClass === c ? null : c;
                  setSelectedClass(newClass);
                  if (
                    searchTerm.trim() &&
                    searchTerm.trim().length >= 2 &&
                    !loading
                  ) {
                    handleSearch(searchTerm, { class: newClass });
                  }
                }}
                disabled={loading}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor:
                    selectedClass === c ? COLORS.primary : COLORS.lightGrey,
                  borderWidth: 1,
                  borderColor:
                    selectedClass === c ? COLORS.primary : COLORS.border,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                <Text
                  style={{
                    color:
                      selectedClass === c ? COLORS.white : COLORS.textDark,
                    fontFamily: "Poppins_500Medium",
                    fontSize: 12,
                  }}
                >
                  Class {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Status Filters */}
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            {["all", "available", "registered"].map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => {
                  const newStatus = s === "all" ? null : s;
                  setStatusFilter(newStatus);
                  if (
                    searchTerm.trim() &&
                    searchTerm.trim().length >= 2 &&
                    !loading
                  ) {
                    handleSearch(searchTerm, { status: newStatus });
                  }
                }}
                disabled={loading}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor:
                    statusFilter === s ||
                    (s === "all" && statusFilter === null)
                      ? COLORS.primary
                      : COLORS.lightGrey,
                  borderWidth: 1,
                  borderColor:
                    statusFilter === s ||
                    (s === "all" && statusFilter === null)
                      ? COLORS.primary
                      : COLORS.border,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                <Text
                  style={{
                    color:
                      statusFilter === s ||
                      (s === "all" && statusFilter === null)
                        ? COLORS.white
                        : COLORS.textDark,
                    fontFamily: "Poppins_500Medium",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Loading Screen */}
        {loading && (
          <View
            style={{
              paddingVertical: 60,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: COLORS.lightGrey,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: COLORS.textDark,
                marginBottom: 8,
              }}
            >
              Searching Trademarks
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 13,
                color: COLORS.textGray,
              }}
            >
              Please wait while we search databases...
            </Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 16,
              paddingHorizontal: 16,
              paddingVertical: 16,
              backgroundColor: "#FEF2F2",
              borderRadius: 10,
              borderLeftWidth: 4,
              borderLeftColor: COLORS.alertRed,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Ionicons name="alert-circle" size={20} color={COLORS.alertRed} />
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 14,
                  color: COLORS.alertRed,
                  marginLeft: 8,
                }}
              >
                Search Failed
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 13,
                color: COLORS.textGray,
                lineHeight: 18,
              }}
            >
              {error}
            </Text>
          </View>
        )}

        {/* Search Results */}
        {hasSearched && !loading && (
          <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
            {searchResults.length > 0 ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.textDark,
                    }}
                  >
                    Search Results
                  </Text>
                  <View
                    style={{
                      marginLeft: 8,
                      backgroundColor: COLORS.primary,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Poppins_600SemiBold",
                        color: COLORS.white,
                      }}
                    >
                      {searchResults.length}
                    </Text>
                  </View>
                </View>

                {searchResults.map((result, index) => (
                  <View
                    key={result.id}
                    style={{
                      backgroundColor: COLORS.white,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      borderRadius: 12,
                      padding: 14,
                      marginBottom: 12,
                      overflow: "hidden",
                    }}
                  >
                    {/* Header */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 12,
                        gap: 10,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: "Poppins_700Bold",
                            color: COLORS.textDark,
                            marginBottom: 4,
                          }}
                          numberOfLines={2}
                        >
                          {result.trademark}
                        </Text>
                        {result.createdAt && (
                          <Text
                            style={{
                              fontSize: 11,
                              fontFamily: "Poppins_400Regular",
                              color: COLORS.textLight,
                            }}
                          >
                            {result.createdAt}
                          </Text>
                        )}
                      </View>

                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 8,
                          overflow: "hidden",
                          backgroundColor: COLORS.lightGrey,
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: COLORS.border,
                        }}
                      >
                        {result.image ? (
                          <Image
                            source={{ uri: result.image }}
                            style={{ width: 60, height: 60 }}
                            resizeMode="cover"
                          />
                        ) : (
                          <Text
                            style={{
                              fontSize: 24,
                              fontFamily: "Poppins_700Bold",
                              color: COLORS.primary,
                            }}
                          >
                            {(result.trademark || "").slice(0, 1).toUpperCase()}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Status & Classes */}
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        marginBottom: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 6,
                          backgroundColor:
                            result.status === "available"
                              ? "#ECFDF5"
                              : result.status === "registered"
                              ? "#FEF2F2"
                              : "#FFFBEB",
                          borderWidth: 1,
                          borderColor:
                            result.status === "available"
                              ? "#D1FAE5"
                              : result.status === "registered"
                              ? "#FECACA"
                              : "#FCD34D",
                        }}
                      >
                        <Text
                          style={{
                            color: getStatusColor(result.status),
                            fontFamily: "Poppins_600SemiBold",
                            fontSize: 11,
                            textTransform: "capitalize",
                          }}
                        >
                          {result.status}
                        </Text>
                      </View>

                      {result.classesList && result.classesList.length > 0 ? (
                        result.classesList.slice(0, 2).map((c) => (
                          <View
                            key={c}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                              borderRadius: 6,
                              backgroundColor: "#F3F4F6",
                              borderWidth: 1,
                              borderColor: COLORS.border,
                            }}
                          >
                            <Text
                              style={{
                                color: COLORS.textDark,
                                fontFamily: "Poppins_500Medium",
                                fontSize: 11,
                              }}
                            >
                              Class {c}
                            </Text>
                          </View>
                        ))
                      ) : result.class ? (
                        <View
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 6,
                            backgroundColor: "#F3F4F6",
                            borderWidth: 1,
                            borderColor: COLORS.border,
                          }}
                        >
                          <Text
                            style={{
                              color: COLORS.textDark,
                              fontFamily: "Poppins_500Medium",
                              fontSize: 11,
                            }}
                          >
                            Class {result.class}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    {/* Summary */}
                    {result.summary && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: COLORS.textGray,
                          lineHeight: 16,
                          marginBottom: 12,
                        }}
                        numberOfLines={2}
                      >
                        {result.summary}
                      </Text>
                    )}

                    {/* Details Box */}
                    <View
                      style={{
                        backgroundColor: COLORS.lightGrey,
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 12,
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: "Poppins_500Medium",
                            color: COLORS.textLight,
                            marginBottom: 4,
                          }}
                        >
                          OWNER
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: "Poppins_600SemiBold",
                            color: COLORS.textDark,
                          }}
                          numberOfLines={1}
                        >
                          {result.owner || "Unknown"}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          paddingLeft: 8,
                          borderLeftWidth: 1,
                          borderLeftColor: COLORS.border,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: "Poppins_500Medium",
                            color: COLORS.textLight,
                            marginBottom: 4,
                          }}
                        >
                          ID
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: "Poppins_600SemiBold",
                            color: COLORS.textDark,
                          }}
                          numberOfLines={1}
                        >
                          {result.application_number ||
                            `Itg-${(index + 1).toString().padStart(3, "0")}`}
                        </Text>
                      </View>
                    </View>

                    {/* View Details Button */}
                    <TouchableOpacity
                      onPress={() =>
                        setExpandedId(
                          expandedId === result.id ? null : result.id
                        )
                      }
                      style={{
                        paddingVertical: 11,
                        paddingHorizontal: 12,
                        borderRadius: 8,
                        backgroundColor: COLORS.primary,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name={
                          expandedId === result.id
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={18}
                        color={COLORS.white}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={{
                          color: COLORS.white,
                          fontFamily: "Poppins_600SemiBold",
                          fontSize: 13,
                        }}
                      >
                        {expandedId === result.id
                          ? "Hide Details"
                          : "View Details"}
                      </Text>
                    </TouchableOpacity>

                    {/* Expandable Details */}
                    {expandedId === result.id && (
                      <View
                        style={{
                          marginTop: 12,
                          backgroundColor: "#FAFAFA",
                          padding: 12,
                          borderRadius: 8,
                          borderLeftWidth: 3,
                          borderLeftColor: COLORS.primary,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: "Poppins_600SemiBold",
                            color: COLORS.textLight,
                            marginBottom: 8,
                            textTransform: "uppercase",
                          }}
                        >
                          Full Details
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: COLORS.textGray,
                            lineHeight: 18,
                          }}
                        >
                          {result.rawText || "No additional details"}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </>
            ) : (
              <View
                style={{
                  paddingVertical: 40,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: COLORS.lightGrey,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Ionicons
                    name="search-outline"
                    size={35}
                    color={COLORS.textGray}
                  />
                </View>
                <Text
                  style={{
                    color: COLORS.textGray,
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 15,
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  No Results Found
                </Text>
                <Text
                  style={{
                    color: COLORS.textLight,
                    fontFamily: "Poppins_400Regular",
                    fontSize: 13,
                    textAlign: "center",
                    marginHorizontal: 20,
                  }}
                >
                  Try searching for a different trademark or adjust your
                  filters
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Empty State */}
        {!hasSearched && !loading && (
          <View
            style={{
              paddingVertical: 50,
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                backgroundColor: "#EFF6FF",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Ionicons
                name="shield-outline"
                size={45}
                color={COLORS.primary}
              />
            </View>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: COLORS.textDark,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Start by Searching a Trademark
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 13,
                color: COLORS.textGray,
                textAlign: "center",
                lineHeight: 18,
              }}
            >
              Enter a trademark name above and click search to check
              availability across registries
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
