import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const InputField = ({ label, placeholder, value, onChangeText, keyboardType = 'default' }: any) => (
    <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>
        <TextInput
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            className="border border-[#E5EAF0] rounded-xl px-4 py-3 text-gray-900 font-medium text-base"
        />
    </View>
);

export default function DeliveryChallanScreen() {
    const [formData, setFormData] = useState({
        clientName: '',
        clientAddress: '',
        challanNo: 'DC-' + Date.now().toString().slice(-6),
        date: new Date().toISOString().split('T')[0],
        transportMode: 'Courier',
        goodsDescription: '',
        quantity: '1',
        weight: '',
        referenceNo: '',
        notes: 'This is a delivery challan without invoice. Goods accompany this document during transport.',
    });

    const handleGenerateChallan = () => {
        if (!formData.clientName || !formData.goodsDescription || !formData.quantity) {
            Alert.alert('Missing Information', 'Please fill all required fields');
            return;
        }

        Alert.alert(
            'Delivery Challan Created',
            `Challan #${formData.challanNo}\n\nClient: ${formData.clientName}\nGoods: ${formData.goodsDescription}\nQuantity: ${formData.quantity}\n\nDelivery challan generated successfully! Attach it to the shipment.`,
            [{ text: 'OK', onPress: () => {} }]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Info Banner */}
                    <View className="mx-4 mt-4 bg-[#F3E8FF] border border-[#DDD6FE] rounded-xl p-3.5 flex-row items-start mb-6">
                        <Ionicons name="information-circle" size={18} color="#7C3AED" style={{ marginRight: 10, marginTop: 2 }} />
                        <Text className="text-xs text-[#7C3AED] font-medium leading-4 flex-1">
                            Create delivery chalan documents to accompany goods during transport without invoice.
                        </Text>
                    </View>

                    {/* Recipient Information */}
                    <View className="px-4 py-5 bg-white rounded-2xl border border-[#E5EAF0] mx-4 mb-4">
                        <Text className="text-lg font-bold text-gray-900 mb-4">Recipient Information</Text>

                        <InputField
                            label="Recipient Name *"
                            placeholder="Enter recipient name"
                            value={formData.clientName}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, clientName: text })
                            }
                        />

                        <TextInput
                            placeholder="Complete delivery address..."
                            placeholderTextColor="#94A3B8"
                            value={formData.clientAddress}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, clientAddress: text })
                            }
                            multiline
                            numberOfLines={3}
                            className="border border-[#E5EAF0] rounded-xl px-4 py-3 text-gray-900 font-medium mb-4"
                        />

                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Challan #</Text>
                                <View className="border border-[#E5EAF0] rounded-xl px-4 py-3 bg-gray-50">
                                    <Text className="text-gray-600 font-medium text-sm">{formData.challanNo}</Text>
                                </View>
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Date</Text>
                                <View className="border border-[#E5EAF0] rounded-xl px-4 py-3 bg-gray-50">
                                    <Text className="text-gray-600 font-medium text-sm">{formData.date}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Goods Details */}
                    <View className="px-4 py-5 bg-white rounded-2xl border border-[#E5EAF0] mx-4 mb-4">
                        <Text className="text-lg font-bold text-gray-900 mb-4">Goods Details</Text>

                        <InputField
                            label="Description of Goods *"
                            placeholder="e.g., Electronics equipments, Clothing items, etc."
                            value={formData.goodsDescription}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, goodsDescription: text })
                            }
                        />

                        <View className="flex-row gap-3 mb-4">
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Quantity *</Text>
                                <TextInput
                                    placeholder="1"
                                    placeholderTextColor="#94A3B8"
                                    value={formData.quantity}
                                    onChangeText={(text: string) =>
                                        setFormData({ ...formData, quantity: text })
                                    }
                                    keyboardType="decimal-pad"
                                    className="border border-[#E5EAF0] rounded-xl px-4 py-3 text-gray-900 font-medium"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Weight (kg)</Text>
                                <TextInput
                                    placeholder="0.00"
                                    placeholderTextColor="#94A3B8"
                                    value={formData.weight}
                                    onChangeText={(text: string) =>
                                        setFormData({ ...formData, weight: text })
                                    }
                                    keyboardType="decimal-pad"
                                    className="border border-[#E5EAF0] rounded-xl px-4 py-3 text-gray-900 font-medium"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Transport Details */}
                    <View className="px-4 py-5 bg-white rounded-2xl border border-[#E5EAF0] mx-4 mb-4">
                        <Text className="text-lg font-bold text-gray-900 mb-4">Transport Details</Text>

                        <InputField
                            label="Mode of Transport"
                            placeholder="e.g., Courier, Road, Train, Air"
                            value={formData.transportMode}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, transportMode: text })
                            }
                        />

                        <InputField
                            label="Reference No."
                            placeholder="Tracking or Order No."
                            value={formData.referenceNo}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, referenceNo: text })
                            }
                        />
                    </View>

                    {/* Additional Notes */}
                    <View className="px-4 py-5 bg-white rounded-2xl border border-[#E5EAF0] mx-4 mb-4">
                        <Text className="text-base font-bold text-gray-900 mb-3">Notes</Text>

                        <TextInput
                            placeholder="Add any special instructions or notes..."
                            placeholderTextColor="#94A3B8"
                            value={formData.notes}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, notes: text })
                            }
                            multiline
                            numberOfLines={3}
                            className="border border-[#E5EAF0] rounded-xl px-4 py-3 text-gray-900 font-medium"
                        />
                    </View>

                    {/* Summary Section */}
                    <View className="px-4 py-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 mx-4 mb-6">
                        <View className="flex-row items-start mb-4">
                            <Ionicons name="car" size={24} color="#9333EA" style={{ marginRight: 12 }} />
                            <View className="flex-1">
                                <Text className="text-base font-bold text-gray-900">Delivery Details</Text>
                                <Text className="text-xs text-gray-600 font-medium mt-1">Ready for transport</Text>
                            </View>
                        </View>

                        <View className="border-t border-purple-300 pt-3 mt-3">
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-sm text-gray-600">Goods</Text>
                                <Text className="text-sm font-bold text-gray-900">{formData.goodsDescription || 'Not specified'}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-sm text-gray-600">Transport Mode</Text>
                                <Text className="text-sm font-bold text-gray-900">{formData.transportMode}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Button */}
                    <View className="px-4 mb-6">
                        <TouchableOpacity
                            onPress={handleGenerateChallan}
                            className="bg-[#9333EA] rounded-xl py-4 items-center flex-row justify-center"
                        >
                            <Ionicons name="car" size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text className="text-white font-bold text-base">Generate Challan</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
