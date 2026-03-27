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

  const handleSearch = (opts?: { class?: string | null; status?: string | null }) => {
    const cls = opts && Object.prototype.hasOwnProperty.call(opts, 'class') ? opts.class : selectedClass;
    const statusOpt = opts && Object.prototype.hasOwnProperty.call(opts, 'status') ? opts.status : statusFilter;

    if (!searchTerm.trim() || searchTerm.trim().length < 2) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        setHasSearched(false);
        const resp = await toolsService.checkTrademark({ trademark: searchTerm, class: cls });

        const normalize = (r: any): SearchResult => {
          const raw = (r.brand_name || r.name || '') as string;
          const lines = raw.split('\n').map((l: string) => l.trim()).filter(Boolean);

          // Try to find date and ID lines
          let dateLine = '';
          let idLine = '';
          let titleLine = '';
          for (let i = 0; i < Math.min(6, lines.length); i++) {
            const ln = lines[i];
            if (!dateLine && /\d{1,2}\s+\w+\s+\d{4}/.test(ln)) dateLine = ln;
            if (!idLine && /ID[:\s]/i.test(ln)) idLine = ln;
          }
          // pick title as first non-date/id short line
          titleLine = lines.find((l) => l !== dateLine && l !== idLine && l.length > 2) || searchTerm;

          // extract classes by pattern like "Class: 35" or "[Class : 35]"
          const classesList: string[] = [];
          const classMatch = raw.match(/Class\s*[:\]]\s*([0-9,\s]+)/i) || raw.match(/\[Class\s*:\s*([^\]]+)\]/i);
          if (classMatch && classMatch[1]) {
            classMatch[1].split(',').map((s: string) => s.trim()).filter(Boolean).forEach((c: string) => classesList.push(c));
          }

          const description = lines.slice( lines.indexOf(titleLine) + 1, lines.indexOf(titleLine) + 4 ).join(' ');

          return {
            id: r._id || r.id || r.application_number || Math.random().toString(36).slice(2),
            trademark: titleLine,
            owner: r.owner || 'Unknown',
            status: r.status || (r.available ? 'available' : 'registered'),
            class: (classesList[0] || r.class || r.trademarkClass || ''),
            application_number: r.application_number || '',
            image: r.image || '',
            summary: description || (lines.slice(1,3).join(' ')),
            createdAt: r.createdAt || dateLine || '',
            rawText: raw,
            classesList,
          };
        };

        let mapped: SearchResult[] = (resp.results || []).map(normalize);

        // deduplicate by normalized trademark title (keep first occurrence)
        const seen = new Set<string>();
        mapped = mapped.filter((m) => {
          const key = (m.trademark || '').toString().trim().toLowerCase();
          if (!key) return true;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        // apply client-side status filter (use statusOpt override when provided)
        const statusToApply = statusOpt;
        if (statusToApply) {
          mapped = mapped.filter((m) => {
            if (statusToApply === 'available') return m.status === 'available';
            if (statusToApply === 'registered') return m.status === 'registered';
            return true;
          });
        }

        setSearchResults(mapped);
        setHasSearched(true);
      } catch (err) {
        console.error("Trademark search failed:", err);
        setError(err?.message || "Search failed");
        setSearchResults([]);
        setHasSearched(true);
      }
      finally {
        setLoading(false);
      }
    })();
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

          {/* Quick class chips sample (click to filter) */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {['1','9','25','35','41'].map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => {
                  const newClass = selectedClass === c ? null : c;
                  setSelectedClass(newClass);
                  // trigger search with new class filter if a term exists
                  if (searchTerm.trim() && searchTerm.trim().length >= 2) {
                    handleSearch({ class: newClass });
                  }
                }}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: selectedClass === c ? COLORS.primary : COLORS.lightGrey,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  marginRight: 8,
                }}
              >
                <Text style={{ color: selectedClass === c ? COLORS.white : COLORS.textDark, fontFamily: 'Poppins_500Medium' }}>Class {c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Status filters */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            {['all','available','registered'].map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => {
                  const newStatus = s === 'all' ? null : s;
                  setStatusFilter(newStatus);
                  // if there's a search term, re-run search with updated status filter
                  if (searchTerm.trim() && searchTerm.trim().length >= 2) {
                    handleSearch({ status: newStatus });
                  }
                }}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: (statusFilter === s || (s === 'all' && statusFilter === null)) ? COLORS.primary : COLORS.lightGrey,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <Text style={{ color: (statusFilter === s || (s === 'all' && statusFilter === null)) ? COLORS.white : COLORS.textDark, fontFamily: 'Poppins_500Medium' }}>{s.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
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

            {searchResults.length > 0 ? (
              searchResults.map((result) => (
              <View key={result.id} style={{ backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  {/* Image placeholder */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={{ fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: COLORS.textDark }}>{result.trademark}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, alignItems: 'center' }}>
                          <View style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, backgroundColor: result.status === 'available' ? '#ECFDF5' : result.status === 'registered' ? '#F0FDF4' : '#FFFBEB', borderWidth: 1, borderColor: COLORS.border }}>
                            <Text style={{ color: getStatusColor(result.status), fontFamily: 'Poppins_600SemiBold', fontSize: 12 }}>{result.status}</Text>
                          </View>
                          {result.classesList && result.classesList.length ? result.classesList.slice(0,3).map((c) => (
                            <View key={c} style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: COLORS.border }}>
                              <Text style={{ color: COLORS.textDark, fontFamily: 'Poppins_500Medium', fontSize: 12 }}>Class: {c}</Text>
                            </View>
                          )) : (result.class ? <View style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: COLORS.border }}><Text style={{ color: COLORS.textDark, fontFamily: 'Poppins_500Medium', fontSize: 12 }}>Class: {result.class}</Text></View> : null)}
                        </View>

                        <Text style={{ marginTop: 8, fontSize: 13, color: COLORS.textGray, lineHeight: 18 }}>{result.summary || ''}</Text>

                        {/* Details toggle (moved here to avoid duplicate display) */}
                        <TouchableOpacity onPress={() => {
                          setSearchResults(prev => prev.map(p => p.id === result.id ? { ...p, _showDetails: !p._showDetails } : p));
                        }} style={{ marginTop: 8 }}>
                          <Text style={{ color: COLORS.primary, fontFamily: 'Poppins_600SemiBold' }}>{(result as any)._showDetails ? 'Hide details' : 'View details'}</Text>
                        </TouchableOpacity>
                        {(result as any)._showDetails ? (
                          <View style={{ marginTop: 8, backgroundColor: '#FAFAFA', padding: 8, borderRadius: 8 }}>
                            <Text style={{ fontSize: 12, color: COLORS.textGray }}>{(result as any).rawText || ''}</Text>
                          </View>
                        ) : null}
                      </View>

                      <View style={{ alignItems: 'center', marginLeft: 12 }}>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={{ fontSize: 12, color: COLORS.textGray }}>{result.createdAt ? result.createdAt : ''}</Text>
                          <Text style={{ fontSize: 12, color: COLORS.textGray }}>ID: {result.application_number || result.id}</Text>
                        </View>
                        <View style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', marginTop: 8, backgroundColor: COLORS.lightGrey, alignItems: 'center', justifyContent: 'center' }}>
                          {result.image ? (
                            <Image source={{ uri: result.image }} style={{ width: 80, height: 80 }} resizeMode="cover" />
                          ) : (
                            <View style={{ width: 80, height: 80, alignItems: 'center', justifyContent: 'center' }}>
                              <Text style={{ fontSize: 22, fontFamily: 'Poppins_600SemiBold', color: COLORS.textDark }}>{(result.trademark || '').slice(0,2).toUpperCase()}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    
                  </View>

                  <View style={{ alignItems: 'center' }}>
                    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: result.status === 'available' ? '#ECFDF5' : result.status === 'registered' ? '#FEF2F2' : '#FFFBEB', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                      <Ionicons name={getStatusIcon(result.status)} size={24} color={getStatusColor(result.status)} />
                    </View>
                    <Text style={{ fontSize: 10, fontFamily: 'Poppins_600SemiBold', color: getStatusColor(result.status), textTransform: 'capitalize' }}>{result.status}</Text>
                  </View>
                </View>
              </View>
              ))) : (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <Text style={{ color: COLORS.textGray }}>No results found.</Text>
                </View>
              )}
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

        {/* Loading / Error */}
        {loading && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <Text style={{ color: COLORS.primary }}>Searching...</Text>
          </View>
        )}

        {error && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <Text style={{ color: COLORS.alertRed }}>{error}</Text>
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
