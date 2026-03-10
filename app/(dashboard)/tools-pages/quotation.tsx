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

export default function QuotationScreen() {
    const [formData, setFormData] = useState({
        clientName: '',
        clientPhone: '',
        quotationNo: 'QT-' + Date.now().toString().slice(-6),
        date: new Date().toISOString().split('T')[0],
        validTill: '',
        serviceTitle: '',
        serviceDescription: '',
        quantity: '1',
        rate: '',
        discount: '0',
        notes: 'Thank you for considering us! We look forward to working with you.',
    });

    const calculateTotals = () => {
        const rate = parseFloat(formData.rate) || 0;
        const quantity = parseFloat(formData.quantity) || 0;
        const discount = parseFloat(formData.discount) || 0;

        const subtotal = rate * quantity;
        const discountAmount = (subtotal * discount) / 100;
        const totalAmount = subtotal - discountAmount;

        return {
            subtotal: subtotal.toFixed(2),
            discount: discountAmount.toFixed(2),
            total: totalAmount.toFixed(2),
        };
    };

    const handleGenerateQuote = () => {
        if (!formData.clientName || !formData.serviceTitle || !formData.rate) {
            Alert.alert('Missing Information', 'Please fill all required fields');
            return;
        }

        const totals = calculateTotals();

        Alert.alert(
            'Quotation Generated',
            `Quote #${formData.quotationNo}\n\nClient: ${formData.clientName}\nAmount: ₹${totals.total}\n\nQuotation created successfully! Ready to send to win the deal.`,
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
                    <View className="mx-4 mt-4 bg-[#FEF3C7] border border-[#FCD34D] rounded-xl p-3.5 flex-row items-start mb-6">
                        <Ionicons name="information-circle" size={18} color="#92400E" style={{ marginRight: 10, marginTop: 2 }} />
                        <Text className="text-xs text-[#92400E] font-medium leading-4 flex-1">
                            Send price estimates to potential clients. Make compelling offers to win new deals quickly.
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
                            label="Client Phone"
                            placeholder="+91 XXXXXXXXXX"
                            value={formData.clientPhone}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, clientPhone: text })
                            }
                            keyboardType="phone-pad"
                        />

                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Quote #</Text>
                                <View className="border border-[#E5EAF0] rounded-xl px-4 py-3 bg-gray-50">
                                    <Text className="text-gray-600 font-medium text-sm">{formData.quotationNo}</Text>
                                </View>
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Date</Text>
                                <View className="border border-[#E5EAF0] rounded-xl px-4 py-3 bg-gray-50">
                                    <Text className="text-gray-600 font-medium text-sm">{formData.date}</Text>
                                </View>
                            </View>
                        </View>

                        <InputField
                            label="Valid Till"
                            placeholder="YYYY-MM-DD"
                            value={formData.validTill}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, validTill: text })
                            }
                        />
                    </View>

                    {/* Service Details Section */}
                    <View className="px-4 py-5 bg-white rounded-2xl border border-[#E5EAF0] mx-4 mb-4">
                        <Text className="text-lg font-bold text-gray-900 mb-4">Service Details</Text>

                        <InputField
                            label="Service Title *"
                            placeholder="e.g., Website Design & Development"
                            value={formData.serviceTitle}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, serviceTitle: text })
                            }
                        />

                        <TextInput
                            placeholder="Detailed description of the service..."
                            placeholderTextColor="#94A3B8"
                            value={formData.serviceDescription}
                            onChangeText={(text: string) =>
                                setFormData({ ...formData, serviceDescription: text })
                            }
                            multiline
                            numberOfLines={3}
                            className="border border-[#E5EAF0] rounded-xl px-4 py-3 text-gray-900 font-medium mb-4"
                        />

                        <View className="flex-row gap-3 mb-4">
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Quantity/Hours</Text>
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
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Discount (%)</Text>
                                <TextInput
                                    placeholder="0"
                                    placeholderTextColor="#94A3B8"
                                    value={formData.discount}
                                    onChangeText={(text: string) =>
                                        setFormData({ ...formData, discount: text })
                                    }
                                    keyboardType="decimal-pad"
                                    className="border border-[#E5EAF0] rounded-xl px-4 py-3 text-gray-900 font-medium"
                                />
                            </View>
                            <View className="flex-1" />
                        </View>
                    </View>

                    {/* Notes Section */}
                    <View className="px-4 py-5 bg-white rounded-2xl border border-[#E5EAF0] mx-4 mb-4">
                        <Text className="text-base font-bold text-gray-900 mb-3">Additional Notes</Text>

                        <TextInput
                            placeholder="Add terms, conditions, or special offers..."
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
                    <View className="px-4 py-5 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border border-amber-200 mx-4 mb-6">
                        <Text className="text-base font-bold text-gray-900 mb-4">Quote Summary</Text>

                        <View className="flex-row justify-between mb-3">
                            <Text className="text-sm text-gray-600 font-medium">Subtotal</Text>
                            <Text className="text-sm font-bold text-gray-900">₹{totals.subtotal}</Text>
                        </View>

                        {parseFloat(formData.discount) > 0 && (
                            <View className="flex-row justify-between mb-3">
                                <Text className="text-sm text-gray-600 font-medium">Discount</Text>
                                <Text className="text-sm font-bold text-green-600">-₹{totals.discount}</Text>
                            </View>
                        )}

                        <View className="flex-row justify-between pt-3 border-t border-amber-300">
                            <Text className="text-base font-bold text-gray-900">Final Quote</Text>
                            <Text className="text-lg font-bold text-[#D97706]">₹{totals.total}</Text>
                        </View>
                    </View>

                    {/* Action Button */}
                    <View className="px-4 mb-6">
                        <TouchableOpacity
                            onPress={handleGenerateQuote}
                            className="bg-[#D97706] rounded-xl py-4 items-center flex-row justify-center"
                        >
                            <Ionicons name="pricetag" size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text className="text-white font-bold text-base">Generate Quotation</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
