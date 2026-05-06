import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#EEF2FF",
  secondary: "#10B981",
  secondaryLight: "#ECFDF5",
  accent: "#F59E0B",
  accentLight: "#FFFBEB",
  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
  success: "#10B981",
  alertRed: "#EF4444",
  alertAmber: "#F59E0B",
  white: "#FFFFFF",
  textDark: "#0F172A",
  textGray: "#475569",
  textLight: "#94A3B8",
  border: "#E2E8F0",
};

const GRADIENTS = {
  premium: ["#4F46E5", "#6366F1"] as const,
  success: ["#10B981", "#059669"] as const,
  warning: ["#F59E0B", "#D97706"] as const,
  danger: ["#EF4444", "#DC2626"] as const,
  slate: ["#1E293B", "#0F172A"] as const,
};

type ServiceItem = {
    title: string;
    subtitle: string;
    feeLabel: string;
    fee: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    iconBg: readonly [string, string];
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
        iconBg: GRADIENTS.success,
        iconColor: COLORS.white,
        popular: true,
    },
    {
        title: 'ITR Filing',
        subtitle: 'Expert assisted tax filing for FY 2023-24.',
        feeLabel: 'Starting from',
        fee: '499',
        icon: 'business',
        iconBg: GRADIENTS.premium,
        iconColor: COLORS.white,
    },
    {
        title: 'Udyam Registration',
        subtitle: 'MSME registration for government benefits.',
        feeLabel: 'Government Fee',
        fee: 'Free',
        icon: 'grid',
        iconBg: GRADIENTS.warning,
        iconColor: COLORS.white,
    },
    {
        title: 'Trademark Registration',
        subtitle: 'Protect your brand identity legally.',
        feeLabel: 'Starting from',
        fee: '4,999',
        icon: 'shield-checkmark',
        iconBg: GRADIENTS.danger,
        iconColor: COLORS.white,
    },
    {
        title: 'Shop Act License',
        subtitle: 'Gumasta license for your shop.',
        feeLabel: 'Starting from',
        fee: '1,499',
        icon: 'storefront',
        iconBg: GRADIENTS.slate,
        iconColor: COLORS.white,
    },
];

const CategoryChip = ({ label, active }: { label: string; active?: boolean }) => (
    <TouchableOpacity style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        marginRight: 12,
        backgroundColor: active ? COLORS.primary : COLORS.slate[50],
        borderWidth: active ? 0 : 1,
        borderColor: COLORS.slate[200],
    }}>
        <Text style={{
            fontSize: 13,
            fontFamily: "PlusJakartaSans_600SemiBold",
            color: active ? COLORS.white : COLORS.slate[600]
        }}>
            {label}
        </Text>
    </TouchableOpacity>
);

export default function ServicesScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.slate[50] }} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ paddingHorizontal: 24, paddingVertical: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 28, fontFamily: "PlusJakartaSans_800ExtraBold", color: COLORS.textDark }}>Services</Text>
                <TouchableOpacity
                    onPress={() => router.push('/(dashboard)/notifications')}
                    style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 }}
                >
                    <Ionicons name="notifications-outline" size={22} color={COLORS.textDark} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
                {/* Search & Filter Header */}
                <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
                    
                    {/* Search Bar */}
                    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16, borderWidth: 1, borderColor: COLORS.slate[100], shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
                        <Ionicons name="search" size={20} color={COLORS.textLight} style={{ marginRight: 10 }} />
                        <TextInput
                            placeholder="Search for GST, ITR, etc."
                            placeholderTextColor={COLORS.textLight}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={{ flex: 1, fontSize: 15, fontFamily: "PlusJakartaSans_500Medium", color: COLORS.textDark, outlineStyle: "none" as any }}
                        />
                    </View>

                    {/* Chips */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24, paddingBottom: 8 }}>
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
                            borderRadius: 28,
                            padding: 20,
                            marginBottom: 20,
                            shadowColor: "#000",
                            shadowOpacity: 0.04,
                            shadowRadius: 15,
                            shadowOffset: { width: 0, height: 8 },
                            elevation: 4,
                            borderWidth: 1,
                            borderColor: COLORS.slate[50]
                        }}>
                            {/* Card Top / Header */}
                            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                                <LinearGradient
                                  colors={item.iconBg}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 1 }}
                                  style={{ width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center", marginRight: 16 }}
                                >
                                    <Ionicons name={item.icon} size={24} color={item.iconColor} />
                                </LinearGradient>

                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                                        <Text style={{ fontSize: 18, fontFamily: "PlusJakartaSans_700Bold", color: COLORS.textDark }}>{item.title}</Text>
                                        {item.popular && (
                                            <View style={{ marginLeft: 8, backgroundColor: COLORS.accentLight, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 }}>
                                                <Text style={{ fontSize: 9, fontFamily: "PlusJakartaSans_800ExtraBold", color: COLORS.accent, letterSpacing: 0.5 }}>POPULAR</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={{ fontSize: 13, fontFamily: "PlusJakartaSans_500Medium", color: COLORS.textGray, lineHeight: 20 }}>{item.subtitle}</Text>
                                </View>
                            </View>

                            <View style={{ height: 1, backgroundColor: COLORS.slate[100], marginVertical: 20 }} />

                            {/* Card Bottom / Actions */}
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View>
                                    <Text style={{ fontSize: 12, fontFamily: "PlusJakartaSans_600SemiBold", color: COLORS.textLight, marginBottom: 2 }}>{item.feeLabel}</Text>
                                    <Text style={{ fontSize: 24, fontFamily: "PlusJakartaSans_800ExtraBold", color: COLORS.primary }}>
                                        {item.fee === 'Free' ? item.fee : `₹${item.fee}`}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingHorizontal: 24, paddingVertical: 14 }}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/(dashboard)/service-pages/request-form',
                                            params: { service: item.title, fee: item.fee === 'Free' ? '0' : item.fee },
                                        })
                                    }
                                >
                                    <Text style={{ color: COLORS.white, fontSize: 14, fontFamily: "PlusJakartaSans_700Bold" }}>Request</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
