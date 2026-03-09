import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

const FaqRow = ({ title }: { title: string }) => (
    <View className="py-4 border-b border-[#EEF2F7] flex-row justify-between items-center">
        <Text className="text-sm text-[#0F172A] font-medium pr-4">{title}</Text>
        <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
    </View>
);

export default function HelpSupportScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#F4F7FB]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-5 pt-2 pb-4 flex-row items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white items-center justify-center border border-[#E5EAF0]"
                >
                    <Ionicons name="chevron-back" size={20} color="#0F172A" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-[#0F172A] ml-3">Help & Support</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
                <View className="bg-white rounded-2xl p-4 border border-[#E7ECF3] mb-4">
                    <Text className="text-xs font-semibold text-[#64748B] mb-3">QUICK HELP</Text>
                    <FaqRow title="How to upload GST documents?" />
                    <FaqRow title="Where can I track filing status?" />
                    <FaqRow title="How to contact tax expert directly?" />
                </View>

                <View className="bg-[#0066CC] rounded-2xl p-4">
                    <Text className="text-white text-base font-bold mb-1">Need direct assistance?</Text>
                    <Text className="text-[#D7E8FF] text-xs mb-3">Our support team is available Mon-Sat, 9 AM to 7 PM.</Text>
                    <TouchableOpacity className="bg-white rounded-xl py-3 items-center">
                        <Text className="text-[#0066CC] font-semibold">Contact Support</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
