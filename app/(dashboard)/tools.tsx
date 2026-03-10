import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ToolItem = {
    title: string;
    subtitle: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    iconBg: string;
    iconColor: string;
};

const tools: ToolItem[] = [
    {
        title: 'GST Invoice',
        subtitle: 'Create tax-compliant bills with automatic GST calculation.',
        icon: 'receipt',
        iconBg: 'bg-[#EBF5FF]',
        iconColor: '#2563EB',
    },
    {
        title: 'Proforma Invoice',
        subtitle: 'Send preliminary bills to customers before delivery.',
        icon: 'document-attach',
        iconBg: 'bg-[#F0FDF4]',
        iconColor: '#16A34A',
    },
    {
        title: 'Quotation / Estimate',
        subtitle: 'Send price estimates to win new deals quickly.',
        icon: 'pricetag',
        iconBg: 'bg-[#FEF3C7]',
        iconColor: '#D97706',
    },
    {
        title: 'Delivery Challan',
        subtitle: 'Accompany goods during transport without invoice.',
        icon: 'car',
        iconBg: 'bg-[#F3E8FF]',
        iconColor: '#9333EA',
    },
];

const QuickAction = ({ iconName, iconColor, bg, label, onPress }: any) => (
    <TouchableOpacity
        onPress={onPress}
        className="flex-1 mx-1.5 items-center bg-white rounded-2xl py-5 border border-[#E5EAF0] shadow-sm"
    >
        <View className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${bg}`}>
            <Ionicons name={iconName} size={24} color={iconColor} />
        </View>
        <Text className="text-[11px] text-center text-gray-600 font-semibold w-14">{label}</Text>
    </TouchableOpacity>
);

export default function ToolsScreen() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('All');

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="px-5 pt-2 pb-3 flex-row items-center justify-between bg-white border-b border-[#E5EAF0]">
                <View>
                    <Text className="text-sm text-gray-500 font-medium">Tools &</Text>
                    <Text className="text-2xl font-bold text-gray-900">Utilities</Text>
                </View>
                <TouchableOpacity
                    className="w-9 h-9 rounded-full items-center justify-center"
                    onPress={() => router.push('/(dashboard)/notifications')}
                >
                    <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white z-10" />
                    <Ionicons name="notifications-outline" size={20} color="#475569" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
                {/* Hero Section */}
                <View className="px-5 py-6 bg-gradient-to-r from-blue-50 to-blue-100">
                    <View className="flex-row items-start">
                        <Ionicons name="calculator" size={32} color="#2563EB" style={{ marginRight: 12 }} />
                        <View className="flex-1">
                            <Text className="text-xl font-bold text-gray-900">Calculators</Text>
                            <Text className="text-sm text-gray-600 mt-1">Create professional documents instantly. Select a tool below to generate GST compliant invoices or estimates for your clients.</Text>
                        </View>
                    </View>
                </View>

                {/* Tools List */}
                <View className="px-4 pt-4">
                    {tools.map((tool) => {
                        const handlePress = () => {
                            if (tool.title === 'GST Invoice') {
                                router.push('/(dashboard)/tools-pages/gst-invoice');
                            } else if (tool.title === 'Proforma Invoice') {
                                router.push('/(dashboard)/tools-pages/proforma-invoice');
                            } else if (tool.title === 'Quotation / Estimate') {
                                router.push('/(dashboard)/tools-pages/quotation');
                            } else if (tool.title === 'Delivery Challan') {
                                router.push('/(dashboard)/tools-pages/delivery-challan');
                            }
                        };

                        return (
                        <TouchableOpacity
                            key={tool.title}
                            onPress={handlePress}
                            activeOpacity={0.7}
                        >
                            <View className="bg-white rounded-2xl border border-[#E5EAF0] px-4 py-4 mb-3 flex-row items-start active:bg-[#F8FAFC]">
                                <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${tool.iconBg} flex-shrink-0`}>
                                    <Ionicons name={tool.icon} size={24} color={tool.iconColor} />
                                </View>

                                <View className="flex-1">
                                    <Text className="text-[15px] font-bold text-gray-900 mb-1">{tool.title}</Text>
                                    <Text className="text-xs text-gray-500 leading-4">{tool.subtitle}</Text>
                                </View>

                                <Ionicons name="chevron-forward" size={20} color="#94A3B8" style={{ marginLeft: 8, marginTop: 4 }} />
                            </View>
                        </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Quick Actions Section */}
                <View className="px-5 py-6">
                    <Text className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">Quick Actions</Text>
                    <View className="flex-row">
                        <QuickAction
                            iconName="person-add"
                            iconColor="#2563EB"
                            bg="bg-[#EBF5FF]"
                            label="Add Client"
                            onPress={() => {
                                // Add client functionality
                                alert('Add Client feature coming soon!');
                            }}
                        />
                        <QuickAction
                            iconName="grid"
                            iconColor="#059669"
                            bg="bg-[#F0FDF4]"
                            label="Manage Items"
                            onPress={() => {
                                // Manage items functionality
                                alert('Manage Items feature coming soon!');
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
