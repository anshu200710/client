import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
  
  // Custom pastels matching the user image
  cardBlueLight: "#F0F6FF",
  cardGreenLight: "#ECFDF5",
  cardOrangeLight: "#FFF7ED",
  cardOrangeOutline: "#F97316",
  actionBlueBg: "#EFF6FF",
  SystemGreenBg: "#D1FAE5",
  SystemGreenText: "#059669",
};

export default function AdminDashboardScreen() {
  const router = useRouter();

  const ActionButton = ({ icon, label, bg, color, onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={{ alignItems: "center", width: "22%", marginBottom: 16 }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: bg, alignItems: "center", justifyContent: "center", marginBottom: 8, shadowColor: color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 }}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={{ fontSize: 13, fontFamily: "Poppins_500Medium", color: COLORS.textGray, textAlign: "center", lineHeight: 18 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ActivityItem = ({ icon, title, sub, time, dotColor, avatar }: any) => (
    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 1, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
      {avatar ? (
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lightGrey, marginRight: 12, overflow: "hidden" }}>
            <Ionicons name="person-circle" size={40} color={COLORS.textLight} style={{marginTop: -2, marginLeft: -2}} />
        </View>
      ) : (
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.cardGreenLight, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
          <Ionicons name={icon.name} size={20} color={icon.color} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, marginBottom: 2 }} numberOfLines={1}>{title}</Text>
        <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: COLORS.textLight }} numberOfLines={1}>{sub}</Text>
      </View>
      <View style={{ alignItems: "flex-end", justifyContent: "space-between", height: 36 }}>
        <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: COLORS.textLight }}>{time}</Text>
        {dotColor && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dotColor }} />}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header Fixed */}
      <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.lightGrey, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="menu" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginBottom: -4 }}>VyaaparSaathi</Text>
          <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: COLORS.textLight }}>Admin Dashboard</Text>
        </View>
        <TouchableOpacity style={{ padding: 8 }}>
          <View style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.alertRed, zIndex: 1, borderWidth: 1.5, borderColor: COLORS.white }} />
          <Ionicons name="notifications" size={24} color="#4A5568" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, backgroundColor: COLORS.lightGrey }}>
        
        {/* Welcome Block */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: COLORS.textLight }}>Welcome back,</Text>
            <Text style={{ fontSize: 26, fontFamily: "Poppins_700Bold", color: "#1E293B", marginTop: -2 }}>Admin Team</Text>
          </View>
          <View style={{ backgroundColor: COLORS.SystemGreenBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
            <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: COLORS.SystemGreenText }}>System Online</Text>
          </View>
        </View>

        {/* Overview Stats (Horizontal Scroll) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16, paddingBottom: 24 }}>
          {/* Total Users Card */}
          <View style={{ width: 260, backgroundColor: COLORS.white, borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, overflow: "hidden" }}>
             {/* Background Decoration Icon */}
             <Ionicons name="people" size={120} color={COLORS.lightGrey} style={{ position: "absolute", right: -20, top: 20, opacity: 0.5 }} />
             
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.cardBlueLight, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                <Ionicons name="people" size={20} color={COLORS.primary} />
              </View>
              <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: COLORS.textGray }}>Total Users</Text>
            </View>
            
            <View style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 8 }}>
                <Text style={{ fontSize: 32, fontFamily: "Poppins_700Bold", color: COLORS.textDark, lineHeight: 36 }}>1,240</Text>
                <View style={{ backgroundColor: COLORS.cardGreenLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginLeft: 12, marginBottom: 6 }}>
                    <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: COLORS.success }}>↗ 12%</Text>
                </View>
            </View>
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: COLORS.textLight }}>vs. last week</Text>
            
            <View style={{ height: 4, backgroundColor: COLORS.lightGrey, borderRadius: 2, marginTop: 16, overflow: "hidden" }}>
                <View style={{ width: "70%", height: "100%", backgroundColor: COLORS.primary }} />
            </View>
          </View>

          {/* Active Requests Card */}
          <View style={{ width: 260, backgroundColor: COLORS.white, borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.cardOrangeLight, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                <Ionicons name="clipboard" size={18} color={COLORS.cardOrangeOutline} />
              </View>
              <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: COLORS.textGray }}>Active Requests</Text>
            </View>
            
            <View style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 8 }}>
                <Text style={{ fontSize: 32, fontFamily: "Poppins_700Bold", color: COLORS.textDark, lineHeight: 36 }}>45</Text>
                <View style={{ backgroundColor: COLORS.cardOrangeLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginLeft: 12, marginBottom: 6 }}>
                    <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: COLORS.cardOrangeOutline }}>5 pending</Text>
                </View>
            </View>
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: COLORS.textLight }}>Pending approval</Text>
            
            <View style={{ height: 4, backgroundColor: COLORS.lightGrey, borderRadius: 2, marginTop: 16, overflow: "hidden" }}>
                <View style={{ width: "40%", height: "100%", backgroundColor: COLORS.cardOrangeOutline }} />
            </View>
          </View>
        </ScrollView>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={{ fontSize: 15, fontFamily: "Poppins_700Bold", color: "#1E293B", marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.5 }}>Quick Actions</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <ActionButton icon="person-add" label="Add User" bg={COLORS.primary} color={COLORS.white} />
            <ActionButton icon="checkmark-circle" label="Approve" bg={COLORS.white} color={COLORS.primary} />
            <ActionButton icon="document-text" label="Reports" bg={COLORS.white} color={COLORS.primary} />
            <ActionButton icon="settings" label="Settings" bg={COLORS.white} color={COLORS.primary} />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: COLORS.textDark }}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: "#3B82F6" }}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: COLORS.white, borderRadius: 20, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 }}>
            <ActivityItem 
                avatar={true}
                title="New Vendor: Sharma Electr..."
                sub="Registration pending approval"
                time="10:30 AM"
                dotColor={COLORS.cardOrangeOutline}
            />
            <ActivityItem 
                icon={{ name: "checkmark", color: COLORS.success }}
                title="Service Request #402 App..."
                sub="Processed by Admin Panel"
                time="09:45 AM"
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
