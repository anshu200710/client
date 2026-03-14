import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Match login.tsx colors
const COLORS = {
  primary: "#0066CC",
  secondary: "#FF9900",
  success: "#28A745",
  alertRed: "#DC3545",
  alertAmber: "#FFC107",
  lightGrey: "#F8F9FA",
  white: "#FFFFFF",
  textDark: "#1A1D2E",
  textGray: "#666666",
  textLight: "#9FA3B1",
  border: "#E4E7EF",
  
  // Custom pastels from screenshot
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

export default function DashboardScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const ActionButton = ({ icon, label, bg, color, onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={{ alignItems: "center", width: "30%", marginBottom: 24 }}>
      <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: bg, alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={{ fontSize: 13, fontFamily: "Poppins_500Medium", color: COLORS.textGray, textAlign: "center", lineHeight: 18 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ActivityItem = ({ icon, title, sub, status, statusColor, statusBg, time }: any) => (
    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border }}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lightGrey, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
         <Ionicons name={icon.name} size={18} color={icon.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, marginBottom: 2 }}>{title}</Text>
        <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textLight }}>{sub}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <View style={{ backgroundColor: statusBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 4 }}>
          <Text style={{ fontSize: 11, fontFamily: "Poppins_500Medium", color: statusColor }}>{status}</Text>
        </View>
        <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: COLORS.textLight }}>{time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View>
            <Text style={{ fontSize: 16, fontFamily: "Poppins_400Regular", color: COLORS.textGray }}>Good Morning,</Text>
            <Text style={{ fontSize: 28, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginTop: -4 }}>Welcome, Rahul</Text>
          </View>
          <TouchableOpacity style={{ padding: 8, marginTop: 4 }}>
            <View style={{ position: "absolute", top: 8, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.alertRed, zIndex: 1, borderWidth: 1.5, borderColor: COLORS.white }} />
            <Ionicons name="notifications-outline" size={26} color={COLORS.textDark} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.lightGrey, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14 }}>
            <Ionicons name="search" size={20} color={COLORS.textLight} style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Search services or documents..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1, fontSize: 15, fontFamily: "Poppins_400Regular", color: COLORS.textDark, outlineStyle: "none" as any }}
            />
          </View>
        </View>

        {/* Overview */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginBottom: 16 }}>Overview</Text>
          <View style={{ flexDirection: "row", gap: 16 }}>
            {/* Pending Card */}
            <View style={{ flex: 1, backgroundColor: COLORS.cardOrangeBg, borderRadius: 20, padding: 20 }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Ionicons name="hourglass-outline" size={22} color={COLORS.cardOrangeIcon} />
              </View>
              <Text style={{ fontSize: 36, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginBottom: -2 }}>1</Text>
              <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: COLORS.textGray }}>Pending Requests</Text>
            </View>
            
            {/* Completed Card */}
            <View style={{ flex: 1, backgroundColor: COLORS.cardGreenBg, borderRadius: 20, padding: 20 }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.cardGreenIcon} />
              </View>
              <Text style={{ fontSize: 36, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginBottom: -2 }}>14</Text>
              <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: COLORS.textGray }}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 24, marginBottom: 8 }}>
          <Text style={{ fontSize: 20, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginBottom: 20 }}>Quick Actions</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            <ActionButton icon="add-circle-outline" label={"Request\nService"} bg={COLORS.actionBlueBg} color={COLORS.primary} onPress={() => {}} />
            <ActionButton icon="cloud-upload" label={"Upload\nDocs"} bg={COLORS.actionPurpleBg} color={COLORS.actionPurpleIcon} onPress={() => {}} />
            <ActionButton icon="calculator" label={"GST\nCalculator"} bg={COLORS.actionGreenBg} color={COLORS.actionGreenIcon} onPress={() => {}} />
            <ActionButton icon="headset" label={"Help\nSupport"} bg={COLORS.actionRedBg} color={COLORS.actionRedIcon} onPress={() => {}} />
            <ActionButton icon="bar-chart" label={"My\nReports"} bg={COLORS.actionYellowBg} color={COLORS.actionYellowIcon} onPress={() => {}} />
            <ActionButton icon="ellipsis-horizontal" label={"View\nMore"} bg={COLORS.actionGreyBg} color={COLORS.actionGreyIcon} onPress={() => {}} />
          </View>
        </View>

        {/* Banner */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <View style={{ backgroundColor: "#2B5AFF", borderRadius: 20, padding: 24, overflow: "hidden" }}>
             {/* Decorative Background Elements */}
            <View style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
            <View style={{ position: "absolute", bottom: -30, right: 40, width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
            
            <Text style={{ fontSize: 22, fontFamily: "Poppins_700Bold", color: COLORS.white, marginBottom: 8 }}>Tax Season Sale!</Text>
            <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: "rgba(255, 255, 255, 0.9)", marginBottom: 20, lineHeight: 22, paddingRight: 40 }}>
              Get 20% off on premium assisted{"\n"}filing plans.
            </Text>
            <TouchableOpacity style={{ backgroundColor: COLORS.white, borderRadius: 50, paddingVertical: 10, paddingHorizontal: 20, alignSelf: "flex-start" }}>
              <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: "#2B5AFF" }}>Upgrade Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={{ paddingHorizontal: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 20, fontFamily: "Poppins_700Bold", color: COLORS.textDark }}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: COLORS.primary }}>View All</Text>
            </TouchableOpacity>
          </View>

          <ActivityItem 
            icon={{ name: "document-text", color: COLORS.primary }}
            title="GST Filing Submitted"
            sub="March 2024 Return"
            status="Processing"
            statusColor={COLORS.primary}
            statusBg={COLORS.actionBlueBg}
            time="2h ago"
          />
          <ActivityItem 
            icon={{ name: "briefcase", color: COLORS.actionYellowIcon }}
            title="New Service Request"
            sub="Annual Audit Service"
            status="Pending"
            statusColor={COLORS.actionYellowIcon}
            statusBg={COLORS.actionYellowBg}
            time="Yesterday"
          />
          <ActivityItem 
            icon={{ name: "shield-checkmark", color: COLORS.actionGreenIcon }}
            title="Document Verified"
            sub="PAN Card & Aadhar"
            status="Success"
            statusColor={COLORS.actionGreenIcon}
            statusBg={COLORS.actionGreenBg}
            time="2 days ago"
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}