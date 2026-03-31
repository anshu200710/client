import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#1E4FA3", // #0066FF-like in the screenshot, let's keep consistency or adapt
  primaryLight: "#E5F0FF",
  primaryHover: "#2B5AFF",
  secondary: "#2ECC71",
  success: "#22c55e",
  successLight: "#DCFCE7",
  alertRed: "#ef4444",
  alertRedLight: "#FEE2E2",
  alertAmber: "#F59E0B",
  alertAmberLight: "#FEF3C7",
  lightGrey: "#F8FAFC", // Slightly lighter for overall background to match image
  lightGrey2: "#F1F5F9",
  white: "#FFFFFF",
  textDark: "#0F172A", // Darker blue-gray
  textGray: "#64748B", // Slate gray
  textLight: "#94A3B8",
  border: "#E2E8F0",
  
  // Specific segment colors
  segmentActiveBg: "#0C8CE9", // Match the screenshot's distinct blue
  segmentActiveBadge: "#3B9DEF",
  
  // Avatars
  avatarBlueText: "#2563EB",
  avatarBlueBg: "#DBEAFE",
  avatarPurpleText: "#9333EA",
  avatarPurpleBg: "#F3E8FF",
  avatarOrangeText: "#EA580C",
  avatarOrangeBg: "#FFEDD5",
};

export default function UserManagementScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSegment, setActiveSegment] = useState("All Users");

  const SegmentButton = ({ label, count, isActive }: any) => (
    <TouchableOpacity
      onPress={() => setActiveSegment(label)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: isActive ? COLORS.segmentActiveBg : COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 50,
        borderWidth: isActive ? 0 : 1,
        borderColor: COLORS.border,
        marginRight: 10,
      }}
    >
      <Text style={{
        fontSize: 14,
        fontFamily: isActive ? "Poppins_600SemiBold" : "Poppins_500Medium",
        color: isActive ? COLORS.white : COLORS.textGray,
        marginRight: 6,
      }}>
        {label}
      </Text>
      <View style={{
        backgroundColor: isActive ? COLORS.segmentActiveBadge : COLORS.lightGrey2,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
      }}>
        <Text style={{
          fontSize: 11,
          fontFamily: "Poppins_600SemiBold",
          color: isActive ? COLORS.white : COLORS.textLight,
        }}>{count}</Text>
      </View>
    </TouchableOpacity>
  );

  const UserItem = ({ type = "image", initial, avatarBg, avatarColor, isOnline, name, email, status, statusText, statusBg, time, showBorder = true }: any) => (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.white,
      padding: 16,
      borderRadius: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 6,
      elevation: 2,
      borderWidth: 1,
      borderColor: "rgba(226, 232, 240, 0.4)",
    }}>
      <View style={{ position: 'relative', marginRight: 16 }}>
        {type === "image" ? (
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.lightGrey2, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="person" size={32} color={COLORS.textLight} style={{marginTop: 8}} />
          </View>
        ) : (
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: avatarBg, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 18, fontFamily: "Poppins_600SemiBold", color: avatarColor }}>{initial}</Text>
          </View>
        )}
        {isOnline && (
          <View style={{
            position: "absolute",
            bottom: 2,
            right: 0,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: COLORS.success,
            borderWidth: 2,
            borderColor: COLORS.white,
          }} />
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, marginBottom: 2 }}>{name}</Text>
        <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textGray, marginBottom: 6 }}>{email}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{
            backgroundColor: statusBg,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: statusBg.replace("0.1", "0.2"), 
          }}>
            <Text style={{ fontSize: 10, fontFamily: "Poppins_700Bold", color: status, textTransform: "uppercase" }}>{statusText}</Text>
          </View>
          {time && (
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: COLORS.textLight, marginLeft: 8 }}>
               {time}
            </Text>
          )}
        </View>
      </View>

      <View style={{ paddingLeft: 12 }}>
        <Ionicons name="chevron-forward" size={20} color={COLORS.border} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGrey }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header Fixed */}
      <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <Ionicons name="chevron-back" size={28} color={COLORS.textGray} />
        </TouchableOpacity>
        
        <Text style={{ fontSize: 20, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, flex: 1, textAlign: "center" }}>
            User Management
        </Text>

        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryLight, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="add" size={24} color={COLORS.primaryHover} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Search & Filter */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 16, flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginRight: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1, borderWidth: 1, borderColor: COLORS.border }}>
            <Ionicons name="search" size={20} color={COLORS.textLight} style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Search by name or email..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1, fontSize: 14, fontFamily: "Poppins_400Regular", color: COLORS.textDark, outlineStyle: "none" as any }}
            />
          </View>
          <TouchableOpacity style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1, borderWidth: 1, borderColor: COLORS.border }}>
            <Ionicons name="options-outline" size={24} color={COLORS.textGray} />
          </TouchableOpacity>
        </View>

        {/* Segments */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <SegmentButton label="All Users" count="1,248" isActive={activeSegment === "All Users"} />
          <SegmentButton label="Active" count="982" isActive={activeSegment === "Active"} />
          <SegmentButton label="Inactive" count="266" isActive={activeSegment === "Inactive"} />
        </ScrollView>

        {/* Recently Added Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontFamily: "Poppins_700Bold", color: COLORS.textLight, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.5 }}>RECENTLY ADDED</Text>
          
          <UserItem
            type="image"
            name="Rajesh Kumar"
            email="rajesh.k@vyaapar.in"
            status={COLORS.success}
            statusText="ACTIVE"
            statusBg={COLORS.successLight}
            time="• Added today"
            isOnline={true}
          />
          <UserItem
            type="text"
            initial="AS"
            avatarBg={COLORS.avatarBlueBg}
            avatarColor={COLORS.avatarBlueText}
            name="Anita Sharma"
            email="anita.sharma@gmail.com"
            status={COLORS.textGray}
            statusText="INACTIVE"
            statusBg={COLORS.lightGrey2}
            time="• 2h ago"
            isOnline={false}
          />
        </View>

        {/* All Users Section */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 13, fontFamily: "Poppins_700Bold", color: COLORS.textLight, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.5 }}>ALL USERS</Text>
          
          <UserItem
            type="image"
            name="Priya Desai"
            email="priya.d@fashionhub.co.in"
            status={COLORS.success}
            statusText="ACTIVE"
            statusBg={COLORS.successLight}
            isOnline={false}
          />
          
          <UserItem
            type="text"
            initial="VK"
            avatarBg={COLORS.avatarPurpleBg}
            avatarColor={COLORS.avatarPurpleText}
            name="Vikram Kohli"
            email="vikram.kohli88@yahoo.com"
            status={COLORS.alertRed}
            statusText="SUSPENDED"
            statusBg={COLORS.alertRedLight}
            isOnline={false}
          />
          
          <UserItem
            type="image"
            name="Amit Patel"
            email="amit.patel@gujarattextiles.in"
            status={COLORS.success}
            statusText="ACTIVE"
            statusBg={COLORS.successLight}
            isOnline={false}
          />
          
          <UserItem
            type="text"
            initial="SM"
            avatarBg={COLORS.avatarOrangeBg}
            avatarColor={COLORS.avatarOrangeText}
            name="Sunita Mehra"
            email="s.mehra@boutique.com"
            status={COLORS.alertAmber}
            statusText="PENDING"
            statusBg={COLORS.alertAmberLight}
            isOnline={false}
          />
        </View>
        
        {/* Placeholder Loader */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, opacity: 0.5 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.border, marginRight: 16 }} />
                <View>
                    <View style={{ height: 12, width: 120, backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 8 }} />
                    <View style={{ height: 10, width: 180, backgroundColor: COLORS.border, borderRadius: 5 }} />
                </View>
            </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
