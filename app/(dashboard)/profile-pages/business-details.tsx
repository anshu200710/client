import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

export default function BusinessDetailsScreen() {
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
                <Text className="text-lg font-bold text-[#0F172A] ml-3">Business Details</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
                <View className="bg-white rounded-2xl p-4 border border-[#E7ECF3]">
                    <Text className="text-xs font-semibold text-[#64748B] mb-2">BUSINESS NAME</Text>
                    <TextInput className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-3 mb-4 text-[#0F172A]" value="Rajesh Textiles Pvt Ltd" />

                    <Text className="text-xs font-semibold text-[#64748B] mb-2">GST NUMBER</Text>
                    <TextInput className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-3 mb-4 text-[#0F172A]" value="27ABCDE1234F1Z5" />

                    <Text className="text-xs font-semibold text-[#64748B] mb-2">BUSINESS TYPE</Text>
                    <TextInput className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-3 text-[#0F172A]" value="Private Limited" />
                </View>

                <TouchableOpacity className="bg-[#0066CC] rounded-2xl mt-5 py-4 items-center">
                    <Text className="text-white font-bold text-sm">Update Details</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
