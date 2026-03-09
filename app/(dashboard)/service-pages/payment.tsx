import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

const paymentMethods = ['UPI', 'Card', 'Net Banking'];

export default function ServicePaymentScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ service?: string; fee?: string; docs?: string }>();
    const service = params.service ?? 'Service Request';
    const fee = params.fee ?? '999';
    const docs = params.docs ?? '0';
    const [method, setMethod] = useState('UPI');

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
                <Text className="text-lg font-bold text-[#0F172A] ml-3">Complete Payment</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                <View className="bg-white rounded-2xl border border-[#E5EAF0] p-4 mb-4">
                    <Text className="text-xs text-[#94A3B8] font-semibold mb-2">SERVICE SUMMARY</Text>
                    <Text className="text-[15px] font-semibold text-[#0F172A]">{service}</Text>
                    <Text className="text-xs text-[#64748B] mt-1">Documents uploaded: {docs}</Text>
                    <View className="mt-3 pt-3 border-t border-[#EEF2F7] flex-row items-center justify-between">
                        <Text className="text-sm text-[#64748B]">Payable Amount</Text>
                        <Text className="text-xl font-bold text-[#0066CC]">Rs{fee}</Text>
                    </View>
                </View>

                <View className="bg-white rounded-2xl border border-[#E5EAF0] p-4 mb-4">
                    <Text className="text-xs text-[#94A3B8] font-semibold mb-3">SELECT PAYMENT METHOD</Text>
                    {paymentMethods.map((item) => {
                        const selected = item === method;
                        return (
                            <TouchableOpacity
                                key={item}
                                onPress={() => setMethod(item)}
                                className={`rounded-xl border px-3 py-3 mb-2 flex-row items-center justify-between ${selected ? 'border-[#0066CC] bg-[#EFF6FF]' : 'border-[#E5EAF0] bg-white'}`}
                            >
                                <Text className={`text-sm ${selected ? 'font-semibold text-[#0F172A]' : 'text-[#334155]'}`}>{item}</Text>
                                {selected && <Ionicons name="checkmark-circle" size={18} color="#0066CC" />}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity
                    className="bg-[#0066CC] rounded-2xl py-4 items-center"
                    onPress={() =>
                        router.push({
                            pathname: '/(dashboard)/service-pages/success',
                            params: { service, fee, method },
                        })
                    }
                >
                    <Text className="text-white text-sm font-bold">Pay Rs{fee} and Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
