import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

type ServiceTrack = {
    id: string;
    name: string;
    requestedOn: string;
    amount: string;
    serviceStatus: 'In Review' | 'Pending Documents' | 'Completed';
    paymentStatus: 'Paid' | 'Pending';
    canDownload?: boolean;
};

const items: ServiceTrack[] = [
    {
        id: 'SRV-1024',
        name: 'GST Registration',
        requestedOn: '10 Mar 2026',
        amount: 'Rs999',
        serviceStatus: 'In Review',
        paymentStatus: 'Paid',
    },
    {
        id: 'SRV-1018',
        name: 'Trademark Registration',
        requestedOn: '08 Mar 2026',
        amount: 'Rs4,999',
        serviceStatus: 'Pending Documents',
        paymentStatus: 'Pending',
    },
    {
        id: 'SRV-1007',
        name: 'ITR Filing',
        requestedOn: '02 Mar 2026',
        amount: 'Rs499',
        serviceStatus: 'Completed',
        paymentStatus: 'Paid',
        canDownload: true,
    },
];

const StatusPill = ({ value }: { value: ServiceTrack['serviceStatus'] }) => {
    const map = {
        'In Review': 'bg-[#DBEAFE] text-[#1D4ED8]',
        'Pending Documents': 'bg-[#FEF3C7] text-[#B45309]',
        Completed: 'bg-[#DCFCE7] text-[#166534]',
    } as const;

    return (
        <View className={`px-2 py-1 rounded-full ${map[value]}`}>
            <Text className="text-[10px] font-bold">{value}</Text>
        </View>
    );
};

export default function MyServicesScreen() {
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
                <Text className="text-lg font-bold text-[#0F172A] ml-3">My Services</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                {items.map((item) => (
                    <View key={item.id} className="bg-white rounded-2xl border border-[#E5EAF0] p-4 mb-3">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-[15px] font-bold text-[#0F172A]">{item.name}</Text>
                            <StatusPill value={item.serviceStatus} />
                        </View>

                        <Text className="text-xs text-[#64748B] mt-1">Request ID: {item.id}</Text>
                        <Text className="text-xs text-[#64748B] mt-0.5">Requested on {item.requestedOn}</Text>

                        <View className="h-[1px] bg-[#EEF2F7] my-3" />

                        <View className="flex-row items-center justify-between mb-3">
                            <View>
                                <Text className="text-[11px] text-[#94A3B8]">Payment</Text>
                                <Text className={`text-sm font-semibold ${item.paymentStatus === 'Paid' ? 'text-[#16A34A]' : 'text-[#B45309]'}`}>
                                    {item.paymentStatus}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-[11px] text-[#94A3B8] text-right">Amount</Text>
                                <Text className="text-sm font-semibold text-[#0F172A]">{item.amount}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center">
                            <TouchableOpacity className="bg-[#EFF6FF] rounded-xl px-3 py-2 mr-2">
                                <Text className="text-xs font-semibold text-[#1D4ED8]">View Details</Text>
                            </TouchableOpacity>

                            {item.canDownload ? (
                                <TouchableOpacity className="bg-[#0066CC] rounded-xl px-3 py-2">
                                    <Text className="text-xs font-semibold text-white">Download Files</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity className="bg-[#F1F5F9] rounded-xl px-3 py-2">
                                    <Text className="text-xs font-semibold text-[#64748B]">Download Pending</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
