import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

const docOptions = ['PAN Card', 'Aadhar Card', 'Business Proof', 'Bank Statement'];

export default function ServiceRequestFormScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ service?: string; fee?: string }>();
    const service = params.service ?? 'Service Request';
    const fee = params.fee ?? '999';

    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const [businessName, setBusinessName] = useState('Rajesh Textiles Pvt Ltd');
    const [contactNumber, setContactNumber] = useState('+91 98765 43210');

    const canProceed = useMemo(() => businessName.trim().length > 2 && contactNumber.trim().length > 8, [businessName, contactNumber]);

    const toggleDoc = (doc: string) => {
        setSelectedDocs((prev) => (prev.includes(doc) ? prev.filter((item) => item !== doc) : [...prev, doc]));
    };

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
                <Text className="text-lg font-bold text-[#0F172A] ml-3">Request {service}</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                <View className="bg-white rounded-2xl border border-[#E5EAF0] p-4 mb-4">
                    <Text className="text-xs text-[#94A3B8] font-semibold mb-2">SERVICE</Text>
                    <Text className="text-[15px] font-semibold text-[#0F172A]">{service}</Text>
                    <Text className="text-xs text-[#64748B] mt-1">Your request will be submitted to admin for verification.</Text>
                </View>

                <View className="bg-white rounded-2xl border border-[#E5EAF0] p-4 mb-4">
                    <Text className="text-xs text-[#94A3B8] font-semibold mb-2">BUSINESS NAME</Text>
                    <TextInput
                        className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-3 text-[#0F172A] mb-4"
                        value={businessName}
                        onChangeText={setBusinessName}
                        placeholder="Enter business name"
                        placeholderTextColor="#94A3B8"
                    />

                    <Text className="text-xs text-[#94A3B8] font-semibold mb-2">CONTACT NUMBER</Text>
                    <TextInput
                        className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-3 text-[#0F172A]"
                        value={contactNumber}
                        onChangeText={setContactNumber}
                        keyboardType="phone-pad"
                        placeholder="Enter phone number"
                        placeholderTextColor="#94A3B8"
                    />
                </View>

                <View className="bg-white rounded-2xl border border-[#E5EAF0] p-4 mb-4">
                    <Text className="text-xs text-[#94A3B8] font-semibold mb-3">UPLOAD REQUIRED DOCUMENTS</Text>
                    {docOptions.map((doc) => {
                        const selected = selectedDocs.includes(doc);
                        return (
                            <TouchableOpacity
                                key={doc}
                                onPress={() => toggleDoc(doc)}
                                className={`rounded-xl border px-3 py-3 mb-2 flex-row items-center justify-between ${selected ? 'border-[#0066CC] bg-[#EFF6FF]' : 'border-[#E5EAF0] bg-white'}`}
                            >
                                <View className="flex-row items-center">
                                    <Ionicons name="document-text-outline" size={16} color={selected ? '#0066CC' : '#64748B'} />
                                    <Text className={`ml-2 text-sm ${selected ? 'text-[#0F172A] font-semibold' : 'text-[#334155]'}`}>{doc}</Text>
                                </View>
                                <View className={`px-2 py-1 rounded-md ${selected ? 'bg-[#DBEAFE]' : 'bg-[#F1F5F9]'}`}>
                                    <Text className={`text-[11px] font-semibold ${selected ? 'text-[#1D4ED8]' : 'text-[#64748B]'}`}>
                                        {selected ? 'Uploaded' : 'Upload'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                    <Text className="text-[11px] text-[#94A3B8] mt-1">Selected: {selectedDocs.length} documents</Text>
                </View>

                <View className="bg-[#FFF8EE] rounded-2xl border border-[#F8D8A8] p-4 mb-4">
                    <Text className="text-xs text-[#B45309] font-semibold">PAYMENT DUE</Text>
                    <Text className="text-[24px] font-bold text-[#0F172A] mt-1">Rs{fee}</Text>
                    <Text className="text-xs text-[#92400E] mt-1">Pay now to complete and send request to admin.</Text>
                </View>

                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: '/(dashboard)/service-pages/payment',
                            params: { service, fee, docs: String(selectedDocs.length) },
                        })
                    }
                    disabled={!canProceed}
                    className={`rounded-2xl py-4 items-center ${canProceed ? 'bg-[#0066CC]' : 'bg-[#93C5FD]'}`}
                >
                    <Text className="text-white text-sm font-bold">Continue to Payment</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
