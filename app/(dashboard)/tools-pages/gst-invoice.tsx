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

export default function GSTInvoiceScreen() {
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        invoiceNo: 'INV-' + Date.now().toString().slice(-6),
        date: new Date().toISOString().split('T')[0],
        itemDescription: '',
        quantity: '1',
        rate: '',
        gstRate: '18',
    });

    const calculateTotals = () => {
        const rate = parseFloat(formData.rate) || 0;
        const quantity = parseFloat(formData.quantity) || 0;
        const gstRate = parseFloat(formData.gstRate) || 0;

        const subtotal = rate * quantity;
        const gstAmount = (subtotal * gstRate) / 100;
        const total = subtotal + gstAmount;

        return {
            subtotal: subtotal.toFixed(2),
            gstAmount: gstAmount.toFixed(2),
            total: total.toFixed(2),
        };
    };

    const handleGenerateInvoice = () => {
        if (!formData.clientName || !formData.itemDescription || !formData.rate) {
            Alert.alert('Missing Information', 'Please fill all required fields');
            return;
        }

        const totals = calculateTotals();

        Alert.alert(
            'Invoice Generated',
            `Invoice #${formData.invoiceNo}\n\nClient: ${formData.clientName}\nSubtotal: ₹${totals.subtotal}\nGST (${formData.gstRate}%): ₹${totals.gstAmount}\nTotal: ₹${totals.total}\n\nInvoice created successfully! Ready to send to client.`,
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
                    <View className="mx-4 mt-4 bg-[#DBEAFE] border border-[#93C5FD] rounded-xl p-3.5 flex-row items-start mb-6">
                        <Ionicons name="information-circle" size={18} color="#1E40AF" style={{ marginRight: 10, marginTop: 2 }} />
                        <Text className="text-xs text-[#1E40AF] font-medium leading-4 flex-1">
                            Fill in the details below to create a GST-compliant invoice with automatic calculations.
                        </Text>
                    </View>

                    {/* Form Section */}
                    <View className="px-4 py-5 bg-white rounded-2xl border border-[#E5EAF0] mx-4 mb-4">
                        <Text className="text-lg font-bold text-gray-900 mb-4">Client Information</Text>

                        <InputField
                            label="Client Name *"
                            placeholder="Enter client name"
                            value={formData.clientName}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, clientName: text })
                            }
                        />

                        <InputField
                            label="Client Email"
                            placeholder="client@example.com"
                            value={formData.clientEmail}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, clientEmail: text })
                            }
                        />

                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Invoice #</Text>
                                <View className="border border-[#E5EAF0] rounded-xl px-4 py-3 bg-gray-50">
                                    <Text className="text-gray-600 font-medium">{formData.invoiceNo}</Text>
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
                            placeholder="e.g., Website Development Service"
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

                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">GST Rate (%)</Text>
                                <TextInput
                                    placeholder="18"
                                    placeholderTextColor="#94A3B8"
                                    value={formData.gstRate}
                                    onChangeText={(text: string) =>
                                        setFormData({ ...formData, gstRate: text })
                                    }
                                    keyboardType="decimal-pad"
                                    className="border border-[#E5EAF0] rounded-xl px-4 py-3 text-gray-900 font-medium"
                                />
                            </View>
                            <View className="flex-1" />
                        </View>
                    </View>

                    {/* Summary Section */}
                    <View className="px-4 py-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 mx-4 mb-6">
                        <Text className="text-base font-bold text-gray-900 mb-4">Amount Summary</Text>

                        <View className="flex-row justify-between mb-3">
                            <Text className="text-sm text-gray-600 font-medium">Subtotal</Text>
                            <Text className="text-sm font-bold text-gray-900">₹{totals.subtotal}</Text>
                        </View>

                        <View className="flex-row justify-between mb-4 pb-4 border-b border-blue-300">
                            <Text className="text-sm text-gray-600 font-medium">GST ({formData.gstRate}%)</Text>
                            <Text className="text-sm font-bold text-gray-900">₹{totals.gstAmount}</Text>
                        </View>

                        <View className="flex-row justify-between">
                            <Text className="text-base font-bold text-gray-900">Total Amount</Text>
                            <Text className="text-lg font-bold text-[#0066CC]">₹{totals.total}</Text>
                        </View>
                    </View>

                    {/* Action Button */}
                    <View className="px-4 mb-6">
                        <TouchableOpacity
                            onPress={handleGenerateInvoice}
                            className="bg-[#0066CC] rounded-xl py-4 items-center flex-row justify-center"
                        >
                            <Ionicons name="document-text" size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text className="text-white font-bold text-base">Generate Invoice</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
