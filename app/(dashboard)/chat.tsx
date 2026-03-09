import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

const FilterChip = ({ label, active }: { label: string; active?: boolean }) => (
    <TouchableOpacity className={`px-4 py-2 rounded-full mr-2 border ${active ? 'bg-[#2A83E8] border-[#2A83E8]' : 'bg-white border-[#D7E0EA]'}`}>
        <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-[#475569]'}`}>{label}</Text>
    </TouchableOpacity>
);

export default function OffersScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#F4F7FB]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-5 pt-2 pb-3 bg-white border-b border-[#E8EDF3]">
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-[30px] font-bold text-[#0F172A]">Offers & Freebies</Text>
                        <Text className="text-xs text-[#64748B] mt-0.5">Exclusive deals for your business</Text>
                    </View>
                    <TouchableOpacity className="w-9 h-9 rounded-full items-center justify-center" onPress={() => router.push('/(dashboard)/notifications')}>
                        <Ionicons name="notifications-outline" size={20} color="#475569" />
                    </TouchableOpacity>
                </View>

                <View className="mt-4 bg-[#2A83E8] rounded-2xl p-4">
                    <Text className="text-[10px] font-bold text-[#CFE4FF]">PREMIUM MEMBER</Text>
                    <Text className="text-[24px] font-bold text-white mt-1">Exclusive Business Rewards</Text>
                    <Text className="text-xs text-[#E4F0FF] mt-1">Handpicked tools for your growth this month.</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
                    <FilterChip label="All Offers" active />
                    <FilterChip label="GST Filing" />
                    <FilterChip label="Business Loans" />
                    <FilterChip label="Software" />
                </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 120 }}>
                <View className="bg-white rounded-2xl border border-[#E5EAF0] overflow-hidden mb-3">
                    <View className="bg-[#E9EEF8] px-3 py-2.5 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 rounded-lg bg-[#DFE9FF] items-center justify-center mr-2">
                                <Ionicons name="document-text" size={15} color="#2563EB" />
                            </View>
                            <View>
                                <Text className="text-[10px] text-[#1D4ED8] uppercase tracking-wide">Taxation</Text>
                                <Text className="text-[15px] font-bold text-[#0F172A]">ClearTax Premium</Text>
                            </View>
                        </View>
                        <View className="bg-[#FEE2E2] px-2 py-1 rounded-md">
                            <Text className="text-[10px] font-bold text-[#DC2626]">Ends in 04:23:01</Text>
                        </View>
                    </View>

                    <View className="p-3.5">
                        <Text className="text-[24px] font-bold text-[#0F172A]">20% off on first GST filing</Text>
                        <Text className="text-xs text-[#64748B] mt-1">Save big on your quarterly returns. Expert assisted filing with zero errors guaranteed.</Text>

                        <View className="flex-row items-center justify-between mt-4">
                            <TouchableOpacity>
                                <Text className="text-[11px] text-[#94A3B8] underline">Terms Apply</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-[#2A83E8] rounded-xl px-5 py-2.5">
                                <Text className="text-white text-xs font-bold">Claim Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View className="bg-white rounded-2xl border border-[#2A83E8] p-3.5 mb-3">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 rounded-full bg-[#DCFCE7] items-center justify-center mr-2">
                                <Ionicons name="business" size={16} color="#16A34A" />
                            </View>
                            <View>
                                <Text className="text-[15px] font-bold text-[#0F172A]">Business Loan</Text>
                                <Text className="text-[11px] text-[#94A3B8]">Partner Bank</Text>
                            </View>
                        </View>
                        <View className="bg-[#FACC15] px-2 py-0.5 rounded-full">
                            <Text className="text-[9px] font-bold text-[#713F12]">POPULAR</Text>
                        </View>
                    </View>

                    <Text className="text-[24px] font-bold text-[#0F172A] mt-3">Zero Processing Fee</Text>
                    <Text className="text-xs text-[#64748B] mt-1">On all business loans above Rs1 Lakh. Approved within 24 hours.</Text>

                    <View className="mt-3 bg-[#F8FAFC] rounded-lg px-2.5 py-2 flex-row items-center">
                        <Ionicons name="alert-circle" size={14} color="#EF4444" />
                        <Text className="text-[11px] text-[#EF4444] ml-1">Only 12 slots left today</Text>
                    </View>

                    <TouchableOpacity className="bg-[#2A83E8] rounded-xl py-3 items-center mt-3">
                        <Text className="text-white text-xs font-bold">Check Eligibility</Text>
                    </TouchableOpacity>
                </View>

                <View className="rounded-2xl p-4 mb-3" style={{ backgroundColor: '#6D28D9' }}>
                    <View className="flex-row items-center justify-between">
                        <View className="bg-[#A78BFA] px-2 py-0.5 rounded">
                            <Text className="text-[9px] font-bold text-white">FREEBIE</Text>
                        </View>
                        <View className="w-8 h-8 rounded-lg bg-white items-center justify-center">
                            <Ionicons name="qr-code" size={15} color="#6D28D9" />
                        </View>
                    </View>

                    <Text className="text-[29px] font-bold text-white mt-4">Free Digital Business Card</Text>
                    <Text className="text-xs text-[#E9D5FF] mt-2">Create a professional digital identity for your business. Shareable on WhatsApp instantly.</Text>

                    <TouchableOpacity className="bg-white rounded-xl py-3 items-center mt-5">
                        <Text className="text-[#6D28D9] text-xs font-bold">Create Now -></Text>
                    </TouchableOpacity>

                    <Text className="text-[10px] text-[#DDD6FE] text-center mt-4">No credit card required</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
