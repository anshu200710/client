import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

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
        iconBg: 'bg-[#E8F2FF]',
        iconColor: '#2563EB',
        popular: true,
    },
    {
        title: 'ITR Filing',
        subtitle: 'Expert assisted tax filing for FY 2023-24.',
        feeLabel: 'Starting from',
        fee: '499',
        icon: 'business',
        iconBg: 'bg-[#EAFBF2]',
        iconColor: '#059669',
    },
    {
        title: 'Udyam Registration',
        subtitle: 'MSME registration for government benefits.',
        feeLabel: 'Government Fee',
        fee: 'Free',
        icon: 'grid',
        iconBg: 'bg-[#F2EAFE]',
        iconColor: '#9333EA',
    },
    {
        title: 'Trademark Registration',
        subtitle: 'Protect your brand identity legally.',
        feeLabel: 'Starting from',
        fee: '4,999',
        icon: 'shield-checkmark',
        iconBg: 'bg-[#FFF5E8]',
        iconColor: '#EA580C',
    },
    {
        title: 'Shop Act License',
        subtitle: 'Gumasta license for your shop.',
        feeLabel: 'Starting from',
        fee: '1,499',
        icon: 'storefront',
        iconBg: 'bg-[#E6FCF5]',
        iconColor: '#0F766E',
    },
];

const CategoryChip = ({ label, active }: { label: string; active?: boolean }) => (
    <TouchableOpacity className={`px-4 py-2 rounded-full mr-2 ${active ? 'bg-[#2A83E8]' : 'bg-[#EFF3F8]'}`}>
        <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-[#475569]'}`}>{label}</Text>
    </TouchableOpacity>
);

export default function ServicesScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#F4F7FB]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-5 pt-2 pb-3 flex-row items-center justify-between bg-white border-b border-[#E8EDF3]">
                <Text className="text-[30px] font-bold text-[#0F172A]">Services</Text>
                <TouchableOpacity className="w-9 h-9 rounded-full items-center justify-center" onPress={() => router.push('/(dashboard)/notifications')}>
                    <Ionicons name="notifications-outline" size={20} color="#475569" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
                <View className="px-4 py-3 bg-white border-b border-[#E8EDF3]">
                    <View className="bg-[#F1F5F9] rounded-xl border border-[#DEE6F0] px-3 py-2.5 flex-row items-center">
                        <Ionicons name="search" size={16} color="#94A3B8" />
                        <TextInput
                            className="ml-2 flex-1 text-sm text-[#334155]"
                            placeholder="Search for GST, ITR, etc."
                            placeholderTextColor="#94A3B8"
                        />
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
                        <CategoryChip label="All" active />
                        <CategoryChip label="Tax Filing" />
                        <CategoryChip label="Registration" />
                        <CategoryChip label="Legal" />
                    </ScrollView>
                </View>

                <View className="px-3 pt-3">
                    {services.map((item) => (
                        <View key={item.title} className="bg-white rounded-2xl border border-[#E5EAF0] px-3.5 py-3.5 mb-3">
                            <View className="flex-row items-start">
                                <View className={`w-9 h-9 rounded-lg items-center justify-center mr-3 ${item.iconBg}`}>
                                    <Ionicons name={item.icon} size={16} color={item.iconColor} />
                                </View>

                                <View className="flex-1">
                                    <View className="flex-row items-center flex-wrap">
                                        <Text className="text-[15px] font-bold text-[#0F172A]">{item.title}</Text>
                                        {item.popular && (
                                            <View className="ml-2 bg-[#FFE7C2] rounded-full px-2 py-0.5">
                                                <Text className="text-[9px] font-bold text-[#C2410C]">POPULAR</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text className="text-xs text-[#64748B] mt-0.5 leading-4">{item.subtitle}</Text>
                                </View>
                            </View>

                            <View className="h-[1px] bg-[#EEF2F7] my-3" />

                            <View className="flex-row items-end justify-between">
                                <View>
                                    <Text className="text-[11px] text-[#94A3B8]">{item.feeLabel}</Text>
                                    <Text className="text-[24px] font-bold text-[#0066CC]">
                                        {item.fee === 'Free' ? item.fee : `Rs${item.fee}`}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    className="bg-[#2A83E8] rounded-xl px-4 py-2.5"
                                    onPress={() =>
                                        router.push({
                                            pathname: '/(dashboard)/service-pages/request-form',
                                            params: { service: item.title, fee: item.fee === 'Free' ? '0' : item.fee },
                                        })
                                    }
                                >
                                    <Text className="text-white text-xs font-bold">Request -></Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
