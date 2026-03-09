import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const requestId = `#VS-${Math.floor(9000 + Math.random() * 1000)}`;
    const formattedDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

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
                    onPress={() => setShowSuccessPopup(true)}
                >
                    <Text className="text-white text-sm font-bold">Pay Rs{fee} and Submit</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={showSuccessPopup} transparent animationType="fade" onRequestClose={() => setShowSuccessPopup(false)}>
                <View className="flex-1 bg-black/30 items-center justify-center px-5">
                    <View className="w-full max-w-[360px] bg-white rounded-3xl border border-[#DCE5EF] p-4 overflow-hidden">
                        <View className="items-center pt-2">
                            <View className="w-24 h-24 rounded-full bg-[#DDF6FF] items-center justify-center">
                                <View className="w-16 h-16 rounded-full bg-[#22C1E6] items-center justify-center">
                                    <Ionicons name="checkmark" size={34} color="#FFFFFF" />
                                </View>
                            </View>

                            <Text className="text-2xl text-center font-bold text-[#0F172A] mt-4">Request Submitted</Text>
                            <Text className="text-2xl text-center font-bold text-[#0F172A]">Successfully!</Text>
                            <Text className="text-xs text-center text-[#64748B] mt-2 px-4">
                                We have received your request and our admin team will review it shortly.
                            </Text>
                        </View>

                        <View className="mt-5 bg-[#F8FBFF] border border-[#DFE8F2] rounded-2xl p-3.5">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-sm font-bold text-[#0F172A]">Request Details</Text>
                                <View className="bg-[#DCFCE7] px-2 py-1 rounded-full">
                                    <Text className="text-[10px] font-semibold text-[#15803D]">Submitted</Text>
                                </View>
                            </View>

                            <View className="mt-3">
                                <Text className="text-[11px] text-[#94A3B8]">Request ID</Text>
                                <Text className="text-sm font-semibold text-[#0F172A] mt-0.5">{requestId}</Text>
                            </View>

                            <View className="mt-2">
                                <Text className="text-[11px] text-[#94A3B8]">Service Name</Text>
                                <Text className="text-sm font-semibold text-[#0F172A] mt-0.5">{service}</Text>
                            </View>

                            <View className="mt-2">
                                <Text className="text-[11px] text-[#94A3B8]">Date</Text>
                                <Text className="text-sm font-semibold text-[#0F172A] mt-0.5">{formattedDate}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            className="bg-[#22C1E6] rounded-xl py-3 mt-4 items-center"
                            onPress={() => {
                                setShowSuccessPopup(false);
                                router.replace('/(dashboard)/profile-pages/my-services');
                            }}
                        >
                            <Text className="text-white text-sm font-bold">View My Requests {'->'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-white border border-[#DCE5EF] rounded-xl py-3 mt-2 items-center"
                            onPress={() => {
                                setShowSuccessPopup(false);
                                router.replace('/(dashboard)/home');
                            }}
                        >
                            <Text className="text-sm font-semibold text-[#334155]">Back to Home</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
