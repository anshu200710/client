import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

type ServiceItem = {
    title: string;
    subtitle: string;
    feeLabel: string;
    fee: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    iconBg: string;
    iconColor: string;
    popular?: boolean;
};

const services: ServiceItem[] = [
    {
        title: 'GST Registration',
        subtitle: 'Get your new GST number within 7 days.',
        feeLabel: 'Starting from',
        fee: '999',
        icon: 'document-text',
        iconBg: COLORS.actionBlueBg,
        iconColor: COLORS.primary,
        popular: true,
    },
    {
        title: 'ITR Filing',
        subtitle: 'Expert assisted tax filing for FY 2023-24.',
        feeLabel: 'Starting from',
        fee: '499',
        icon: 'business',
        iconBg: COLORS.actionGreenBg,
        iconColor: COLORS.actionGreenIcon,
    },
    {
        title: 'Udyam Registration',
        subtitle: 'MSME registration for government benefits.',
        feeLabel: 'Government Fee',
        fee: 'Free',
        icon: 'grid',
        iconBg: COLORS.actionPurpleBg,
        iconColor: COLORS.actionPurpleIcon,
    },
    {
        title: 'Trademark Registration',
        subtitle: 'Protect your brand identity legally.',
        feeLabel: 'Starting from',
        fee: '4,999',
        icon: 'shield-checkmark',
        iconBg: COLORS.actionYellowBg,
        iconColor: COLORS.actionYellowIcon,
    },
    {
        title: 'Shop Act License',
        subtitle: 'Gumasta license for your shop.',
        feeLabel: 'Starting from',
        fee: '1,499',
        icon: 'storefront',
        iconBg: COLORS.actionGreyBg,
        iconColor: COLORS.actionGreyIcon,
    },
];

const CategoryChip = ({ label, active }: { label: string; active?: boolean }) => (
    <TouchableOpacity style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        marginRight: 12,
        backgroundColor: active ? COLORS.primary : COLORS.lightGrey,
    }}>
        <Text style={{
            fontSize: 13,
            fontFamily: "Poppins_600SemiBold",
            color: active ? COLORS.white : COLORS.textGray
        }}>
            {label}
        </Text>
    </TouchableOpacity>
);

export default function ServicesScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ paddingHorizontal: 24, paddingVertical: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 28, fontFamily: "Poppins_700Bold", color: COLORS.textDark }}>Services</Text>
                <TouchableOpacity
                    onPress={() => router.push('/(dashboard)/notifications')}
                    style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lightGrey, alignItems: "center", justifyContent: "center" }}
                >
                    <Ionicons name="notifications-outline" size={20} color={COLORS.textDark} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
                {/* Search & Filter Header (Sticky-like) */}
                <View style={{ paddingHorizontal: 24, paddingBottom: 16, backgroundColor: COLORS.white }}>
                    
                    {/* Search Bar - Matches Dashboard */}
                    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.lightGrey, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16 }}>
                        <Ionicons name="search" size={20} color={COLORS.textLight} style={{ marginRight: 10 }} />
                        <TextInput
                            placeholder="Search for GST, ITR, etc."
                            placeholderTextColor={COLORS.textLight}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={{ flex: 1, fontSize: 15, fontFamily: "Poppins_400Regular", color: COLORS.textDark, outlineStyle: "none" as any }}
                        />
                    </View>

                    {/* Chips */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24 }}>
                        <CategoryChip label="All" active />
                        <CategoryChip label="Tax Filing" />
                        <CategoryChip label="Registration" />
                        <CategoryChip label="Legal" />
                    </ScrollView>
                </View>

                {/* Services List */}
                <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
                    {services.map((item) => (
                        <View key={item.title} style={{
                            backgroundColor: COLORS.white,
                            borderRadius: 20,
                            padding: 16,
                            marginBottom: 16,
                            borderWidth: 1,
                            borderColor: COLORS.border
                        }}>
                            {/* Card Top / Header */}
                            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                                <View style={{ width: 44, height: 44, borderRadius: 16, backgroundColor: item.iconBg, alignItems: "center", justifyContent: "center", marginRight: 16 }}>
                                    <Ionicons name={item.icon} size={22} color={item.iconColor} />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginBottom: 2 }}>
                                        <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold", color: COLORS.textDark }}>{item.title}</Text>
                                        {item.popular && (
                                            <View style={{ marginLeft: 8, backgroundColor: COLORS.actionYellowBg, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 }}>
                                                <Text style={{ fontSize: 9, fontFamily: "Poppins_700Bold", color: COLORS.actionYellowIcon, letterSpacing: 0.5 }}>POPULAR</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textGray, lineHeight: 20 }}>{item.subtitle}</Text>
                                </View>
                            </View>

                            <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 16 }} />

                            {/* Card Bottom / Actions */}
                            <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
                                <View>
                                    <Text style={{ fontSize: 12, fontFamily: "Poppins_500Medium", color: COLORS.textLight, marginBottom: 2 }}>{item.feeLabel}</Text>
                                    <Text style={{ fontSize: 22, fontFamily: "Poppins_700Bold", color: COLORS.primary }}>
                                        {item.fee === 'Free' ? item.fee : `₹${item.fee}`}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={{ backgroundColor: COLORS.primary, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12 }}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/(dashboard)/service-pages/request-form',
                                            params: { service: item.title, fee: item.fee === 'Free' ? '0' : item.fee },
                                        })
                                    }
                                >
                                    <Text style={{ color: COLORS.white, fontSize: 13, fontFamily: "Poppins_700Bold" }}>Request</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
