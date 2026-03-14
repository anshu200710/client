import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

// Match Dashboard/Auth Colors
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
  
  // Custom pastels matching home.tsx
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

type NotificationItem = {
    id: string;
    title: string;
    message: string;
    time: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    iconColor: string;
    iconBg: string;
    unread?: boolean;
    actionLabel?: string;
};

const todayItems: NotificationItem[] = [
    {
        id: '1',
        title: 'Payment Received',
        message: 'You received ₹2,500 from Ramesh Traders via UPI.',
        time: 'Just now',
        icon: 'logo-usd',
        iconColor: COLORS.actionGreenIcon,
        iconBg: COLORS.actionGreenBg,
        unread: true,
    },
    {
        id: '2',
        title: 'New Loan Offer',
        message: 'Pre-approved business loan up to ₹5 Lakhs is now available for your shop.',
        time: '1h ago',
        icon: 'megaphone',
        iconColor: COLORS.primary,
        iconBg: COLORS.actionBlueBg,
        unread: true,
        actionLabel: 'View Offer',
    },
    {
        id: '3',
        title: 'Low Stock Alert',
        message: "Item 'Basmati Rice 5kg' is running low. Only 3 units left.",
        time: '4h ago',
        icon: 'archive',
        iconColor: COLORS.actionYellowIcon,
        iconBg: COLORS.actionYellowBg,
        unread: false,
    },
];

const yesterdayItems: NotificationItem[] = [
    {
        id: '4',
        title: 'KYC Verified',
        message: 'Your business documents have been successfully verified. You can now accept international payments.',
        time: 'Yesterday',
        icon: 'shield-checkmark',
        iconColor: COLORS.actionPurpleIcon,
        iconBg: COLORS.actionPurpleBg,
    },
    {
        id: '5',
        title: 'App Update',
        message: 'New inventory tracking features are now live. Update to v2.4.',
        time: '2 days ago',
        icon: 'phone-portrait',
        iconColor: COLORS.actionGreyIcon,
        iconBg: COLORS.actionGreyBg,
    },
];

const NotificationCard = ({ item }: { item: NotificationItem }) => (
    <View style={{ 
        flexDirection: "row", 
        backgroundColor: item.unread ? COLORS.actionBlueBg : COLORS.white, 
        borderRadius: 20, 
        padding: 16, 
        marginBottom: 12, 
        borderWidth: 1, 
        borderColor: item.unread ? `${COLORS.primary}33` : COLORS.border 
    }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: item.iconBg, alignItems: "center", justifyContent: "center", marginRight: 16 }}>
            <Ionicons name={item.icon} size={20} color={item.iconColor} />
        </View>

        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <Text style={{ fontSize: 15, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, flex: 1, paddingRight: 8 }}>{item.title}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                    <Text style={{ fontSize: 11, fontFamily: "Poppins_500Medium", color: COLORS.textLight }}>{item.time}</Text>
                    {item.unread && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginLeft: 6 }} />}
                </View>
            </View>
            
            <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textGray, lineHeight: 20 }}>{item.message}</Text>

            {item.actionLabel && (
                <TouchableOpacity style={{ alignSelf: "flex-start", marginTop: 12, backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}>
                    <Text style={{ color: COLORS.white, fontSize: 12, fontFamily: "Poppins_600SemiBold" }}>{item.actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    </View>
);

export default function NotificationsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lightGrey, alignItems: "center", justifyContent: "center", marginRight: 16 }}
                    >
                        <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, fontFamily: "Poppins_700Bold", color: COLORS.textDark }}>Notifications</Text>
                </View>
                <TouchableOpacity>
                    <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: COLORS.primary }}>Mark all read</Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 120 }}>
                {/* Section: Today */}
                <Text style={{ fontSize: 13, fontFamily: "Poppins_700Bold", color: COLORS.textLight, letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>TODAY</Text>
                {todayItems.map((item) => (
                    <NotificationCard key={item.id} item={item} />
                ))}

                {/* Section: Yesterday */}
                <Text style={{ fontSize: 13, fontFamily: "Poppins_700Bold", color: COLORS.textLight, letterSpacing: 1, marginTop: 24, marginBottom: 12, marginLeft: 4 }}>YESTERDAY</Text>
                {yesterdayItems.map((item) => (
                    <NotificationCard key={item.id} item={item} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
