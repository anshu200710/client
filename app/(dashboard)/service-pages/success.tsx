import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

export default function ServiceSuccessScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ service?: string; fee?: string; method?: string }>();

    return (
        <SafeAreaView className="flex-1 bg-[#F4F7FB]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 px-6 items-center justify-center">
                <View className="w-20 h-20 rounded-full bg-[#DCFCE7] items-center justify-center mb-5">
                    <Ionicons name="checkmark" size={40} color="#16A34A" />
                </View>

                <Text className="text-2xl font-bold text-[#0F172A] text-center">Request Submitted</Text>
                <Text className="text-sm text-[#475569] text-center mt-2 leading-5">
                    Your {params.service ?? 'service'} request and payment (Rs{params.fee ?? '0'}) were submitted to admin.
                </Text>
                <Text className="text-xs text-[#64748B] mt-2">Payment Method: {params.method ?? 'UPI'}</Text>

                <View className="bg-white rounded-2xl border border-[#E5EAF0] px-4 py-3 w-full mt-6">
                    <Text className="text-xs text-[#94A3B8] font-semibold">NEXT STEP</Text>
                    <Text className="text-sm text-[#0F172A] mt-1">Admin will verify your documents and update service status in My Services.</Text>
                </View>

                <TouchableOpacity
                    className="bg-[#0066CC] rounded-2xl py-4 items-center w-full mt-6"
                    onPress={() => router.replace('/(dashboard)/profile-pages/my-services')}
                >
                    <Text className="text-white text-sm font-bold">Track in My Services</Text>
                </TouchableOpacity>

                <TouchableOpacity className="py-4" onPress={() => router.replace('/(dashboard)/services')}>
                    <Text className="text-[#0066CC] text-sm font-semibold">Back to Services</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
