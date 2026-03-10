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

export default function ProformaInvoiceScreen() {
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        deliveryDate: '',
        proformaNo: 'PI-' + Date.now().toString().slice(-6),
        date: new Date().toISOString().split('T')[0],
        itemDescription: '',
        quantity: '1',
        rate: '',
        notes: 'Payment terms: 50% advance, 50% on delivery',
    });

    const calculateTotals = () => {
        const rate = parseFloat(formData.rate) || 0;
        const quantity = parseFloat(formData.quantity) || 0;
        const subtotal = rate * quantity;
        return {
            subtotal: subtotal.toFixed(2),
        };
    };

    const handleGenerateProforma = () => {
        if (!formData.clientName || !formData.itemDescription || !formData.rate) {
            Alert.alert('Missing Information', 'Please fill all required fields');
            return;
        }

        const totals = calculateTotals();

        Alert.alert(
            'Proforma Invoice Created',
            `Proforma #${formData.proformaNo}\n\nClient: ${formData.clientName}\nAmount: ₹${totals.subtotal}\n\nProforma invoice generated! Ready to send to customer before delivery.`,
            [{ text: 'OK', onPress: () => {} }]
        );
    };

    const totals = calculateTotals();

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Info Banner */}
                    <View className="mx-4 mt-4 bg-[#F0FDF4] border border-[#86EFAC] rounded-xl p-3.5 flex-row items-start mb-6">
                        <Ionicons name="information-circle" size={18} color="#166534" style={{ marginRight: 10, marginTop: 2 }} />
                        <Text className="text-xs text-[#166534] font-medium leading-4 flex-1">
                            Create preliminary bills to send to customers before delivery. Great for confirming orders.
                        </Text>
                    </View>

                    {/* Form Section */}
                    <View className="px-4 py-5 bg-white rounded-2xl border border-[#E5EAF0] mx-4 mb-4">
                        <Text className="text-lg font-bold text-gray-900 mb-4">Customer Information</Text>

                        <InputField
                            label="Customer Name *"
                            placeholder="Enter customer name"
                            value={formData.clientName}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, clientName: text })
                            }
                        />

                        <InputField
                            label="Customer Email"
                            placeholder="customer@example.com"
                            value={formData.clientEmail}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, clientEmail: text })
                            }
                        />

                        <InputField
                            label="Expected Delivery Date"
                            placeholder="YYYY-MM-DD"
                            value={formData.deliveryDate}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, deliveryDate: text })
                            }
                        />

                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Proforma #</Text>
                                <View className="border border-[#E5EAF0] rounded-xl px-4 py-3 bg-gray-50">
                                    <Text className="text-gray-600 font-medium">{formData.proformaNo}</Text>
                                </View>
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Date</Text>
                                <View className="border border-[#E5EAF0] rounded-xl px-4 py-3 bg-gray-50">
                                    <Text className="text-gray-600 font-medium">{formData.date}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Items Section */}
                    <View className="px-4 py-5 bg-white rounded-2xl border border-[#E5EAF0] mx-4 mb-4">
                        <Text className="text-lg font-bold text-gray-900 mb-4">Item Details</Text>

                        <InputField
                            label="Item Description *"
                            placeholder="e.g., Custom Furniture Set"
                            value={formData.itemDescription}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, itemDescription: text })
                            }
                        />

                        <View className="flex-row gap-3 mb-4">
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Quantity</Text>
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
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Rate *</Text>
                                <TextInput
                                    placeholder="0.00"
                                    placeholderTextColor="#94A3B8"
                                    value={formData.rate}
                                    onChangeText={(text: string) =>
                                        setFormData({ ...formData, rate: text })
                                    }
                                    keyboardType="decimal-pad"
                                    className="border border-[#E5EAF0] rounded-xl px-4 py-3 text-gray-900 font-medium"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Terms Section */}
                    <View className="px-4 py-5 bg-white rounded-2xl border border-[#E5EAF0] mx-4 mb-4">
                        <Text className="text-base font-bold text-gray-900 mb-3">Terms & Notes</Text>

                        <TextInput
                            placeholder="Add payment terms or special notes..."
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
                    <View className="px-4 py-5 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 mx-4 mb-6">
                        <Text className="text-base font-bold text-gray-900 mb-4">Estimated Amount</Text>

                        <View className="flex-row justify-between items-center">
                            <Text className="text-sm text-gray-700 font-medium">Total Amount</Text>
                            <Text className="text-2xl font-bold text-[#059669]">₹{totals.subtotal}</Text>
                        </View>

                        <View className="mt-4 pt-4 border-t border-green-300">
                            <Text className="text-xs text-gray-600 font-medium">Status: Preliminary Bill</Text>
                        </View>
                    </View>

                    {/* Action Button */}
                    <View className="px-4 mb-6">
                        <TouchableOpacity
                            onPress={handleGenerateProforma}
                            className="bg-[#059669] rounded-xl py-4 items-center flex-row justify-center"
                        >
                            <Ionicons name="document" size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text className="text-white font-bold text-base">Generate Proforma</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
