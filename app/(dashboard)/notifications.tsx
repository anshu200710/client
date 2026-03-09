import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

type NotificationItem = {
    id: string;
    title: string;
    message: string;
    time: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    iconColor: string;
    iconBg: string;
    unread?: boolean;
    highlighted?: boolean;
    actionLabel?: string;
};

const todayItems: NotificationItem[] = [
    {
        id: '1',
        title: 'Payment Received',
        message: 'You received Rs2,500 from Ramesh Traders via UPI.',
        time: 'Just now',
        icon: 'logo-usd',
        iconColor: '#059669',
        iconBg: 'bg-[#CCFBF1]',
        unread: true,
        highlighted: true,
    },
    {
        id: '2',
        title: 'New Loan Offer',
        message: 'Pre-approved business loan up to Rs5 Lakhs is now available for your shop.',
        time: '1h ago',
        icon: 'megaphone',
        iconColor: '#3B82F6',
        iconBg: 'bg-[#DBEAFE]',
        unread: true,
        highlighted: true,
        actionLabel: 'View Offer',
    },
    {
        id: '3',
        title: 'Low Stock Alert',
        message: "Item 'Basmati Rice 5kg' is running low. Only 3 units left.",
        time: '4h ago',
        icon: 'archive',
        iconColor: '#D97706',
        iconBg: 'bg-[#FEF3C7]',
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
        iconColor: '#2563EB',
        iconBg: 'bg-[#DBEAFE]',
    },
    {
        id: '5',
        title: 'App Update',
        message: 'New inventory tracking features are now live. Update to v2.4.',
        time: '2 days ago',
        icon: 'phone-portrait',
        iconColor: '#334155',
        iconBg: 'bg-[#F1F5F9]',
    },
];

const NotificationCard = ({ item }: { item: NotificationItem }) => (
    <View className={`rounded-2xl border p-3.5 mb-3 ${item.highlighted ? 'bg-[#EDF5FF] border-[#CFE2FF]' : 'bg-white border-[#E6ECF2]'}`}>
        <View className="flex-row items-start">
            <View className={`w-9 h-9 rounded-lg items-center justify-center mr-3 ${item.iconBg}`}>
                <Ionicons name={item.icon} size={17} color={item.iconColor} />
            </View>

            <View className="flex-1 pr-2">
                <Text className="text-[15px] font-semibold text-[#0F172A]">{item.title}</Text>
                <Text className="text-xs text-[#475569] mt-0.5 leading-4">{item.message}</Text>

                {item.actionLabel && (
                    <TouchableOpacity className="self-start mt-2 bg-[#0066CC] px-3 py-1.5 rounded-md">
                        <Text className="text-white text-[11px] font-semibold">{item.actionLabel}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View className="items-end min-w-[64px]">
                <View className="flex-row items-center">
                    <Text className="text-[11px] text-[#64748B]">{item.time}</Text>
                    {item.unread && <View className="w-2 h-2 rounded-full bg-[#3B82F6] ml-1.5" />}
                </View>
            </View>
        </View>
    </View>
);

export default function NotificationsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#F4F7FB]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-4 pt-2 pb-3 border-b border-[#E5EAF0] bg-white">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-9 h-9 rounded-full items-center justify-center mr-1"
                        >
                            <Ionicons name="chevron-back" size={20} color="#0F172A" />
                        </TouchableOpacity>
                        <Text className="text-[30px] font-bold text-[#0F172A]">Notifications</Text>
                    </View>
                    <TouchableOpacity>
                        <Text className="text-xs text-[#0066CC] font-semibold">Mark all as read</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 120 }}>
                <Text className="text-[11px] text-[#94A3B8] font-bold tracking-wide mb-2">TODAY</Text>
                {todayItems.map((item) => (
                    <NotificationCard key={item.id} item={item} />
                ))}

                <Text className="text-[11px] text-[#94A3B8] font-bold tracking-wide mt-3 mb-2">YESTERDAY</Text>
                {yesterdayItems.map((item) => (
                    <NotificationCard key={item.id} item={item} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
