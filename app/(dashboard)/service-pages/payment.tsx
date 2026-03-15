import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

// Match Dashboard/Auth Colors
const COLORS = {
  primary: "#0066CC",
  secondary: "#FF9900",
  success: "#28A745",
  alertRed: "#DC3545",
  alertAmber: "#FFC107",
  lightGrey: "#F8F9FA",
  white: "#FFFFFF",
  textDark: "#1A1D2E",
  textGray: "#666666",
  textLight: "#9FA3B1",
  border: "#E4E7EF",
  
  // Custom pastels matching home.tsx
  actionBlueBg: "#EFF6FF",
  actionPurpleBg: "#F5F3FF",
  actionPurpleIcon: "#8B5CF6",
  actionGreenBg: "#ECFDF5",
  actionGreenIcon: "#10B981",
  actionRedBg: "#FEF2F2",
  actionRedIcon: "#EF4444",
  actionYellowBg: "#FFFBEB",
  actionYellowIcon: "#F59E0B",
  actionGreyBg: "#F8FAFC",
  actionGreyIcon: "#94A3B8",
};

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
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ paddingHorizontal: 24, paddingVertical: 16, flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lightGrey, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.border }}
                >
                    <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginLeft: 16 }}>Complete Payment</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                
                {/* Summary */}
                <View style={{ backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 20, marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: COLORS.textLight, marginBottom: 8, letterSpacing: 0.5 }}>SERVICE SUMMARY</Text>
                    <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginBottom: 4 }}>{service}</Text>
                    <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textGray }}>Documents uploaded: {docs}</Text>
                    <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: COLORS.textGray }}>Payable Amount</Text>
                        <Text style={{ fontSize: 24, fontFamily: "Poppins_700Bold", color: COLORS.primary }}>
                            {fee === '0' || fee === 'Free' ? 'Free' : `₹${fee}`}
                        </Text>
                    </View>
                </View>

                {/* Methods */}
                <View style={{ backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 20, marginBottom: 24 }}>
                    <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: COLORS.textLight, marginBottom: 12, letterSpacing: 0.5 }}>SELECT PAYMENT METHOD</Text>
                    {paymentMethods.map((item) => {
                        const selected = item === method;
                        return (
                            <TouchableOpacity
                                key={item}
                                onPress={() => setMethod(item)}
                                style={{
                                    borderRadius: 16,
                                    borderWidth: 1,
                                    paddingHorizontal: 16,
                                    paddingVertical: 14,
                                    marginBottom: 12,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    borderColor: selected ? COLORS.primary : COLORS.border,
                                    backgroundColor: selected ? COLORS.actionBlueBg : COLORS.white
                                }}
                            >
                                <Text style={{ fontSize: 14, fontFamily: selected ? "Poppins_600SemiBold" : "Poppins_500Medium", color: selected ? COLORS.textDark : COLORS.textGray }}>{item}</Text>
                                {selected && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Pay Button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: COLORS.primary,
                        borderRadius: 20,
                        paddingVertical: 16,
                        alignItems: "center"
                    }}
                    onPress={() => setShowSuccessPopup(true)}
                >
                    <Text style={{ color: COLORS.white, fontSize: 15, fontFamily: "Poppins_700Bold" }}>
                        Pay {fee === '0' || fee === 'Free' ? 'Free' : `₹${fee}`} and Submit
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Success Modal */}
            <Modal visible={showSuccessPopup} transparent animationType="fade" onRequestClose={() => setShowSuccessPopup(false)}>
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}>
                    <View style={{ width: '100%', maxWidth: 360, backgroundColor: COLORS.white, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border, padding: 24, overflow: "hidden" }}>
                        <View style={{ alignItems: "center", paddingTop: 8 }}>
                            <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.actionGreenBg, alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                                <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.actionGreenIcon, alignItems: "center", justifyContent: "center" }}>
                                    <Ionicons name="checkmark" size={32} color={COLORS.white} />
                                </View>
                            </View>

                            <Text style={{ fontSize: 24, textAlign: "center", fontFamily: "Poppins_700Bold", color: COLORS.textDark }}>Request Submitted</Text>
                            <Text style={{ fontSize: 24, textAlign: "center", fontFamily: "Poppins_700Bold", color: COLORS.textDark }}>Successfully!</Text>
                            <Text style={{ fontSize: 13, textAlign: "center", fontFamily: "Poppins_400Regular", color: COLORS.textGray, marginTop: 8, paddingHorizontal: 16, lineHeight: 20 }}>
                                We have received your request and our admin team will review it shortly.
                            </Text>
                        </View>

                        <View style={{ marginTop: 24, backgroundColor: COLORS.lightGrey, borderRadius: 16, padding: 16 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                <Text style={{ fontSize: 14, fontFamily: "Poppins_700Bold", color: COLORS.textDark }}>Request Details</Text>
                                <View style={{ backgroundColor: COLORS.actionGreenBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                                    <Text style={{ fontSize: 10, fontFamily: "Poppins_600SemiBold", color: COLORS.actionGreenIcon }}>Submitted</Text>
                                </View>
                            </View>

                            <View style={{ marginBottom: 12 }}>
                                <Text style={{ fontSize: 12, fontFamily: "Poppins_500Medium", color: COLORS.textLight }}>Request ID</Text>
                                <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, marginTop: 2 }}>{requestId}</Text>
                            </View>

                            <View style={{ marginBottom: 12 }}>
                                <Text style={{ fontSize: 12, fontFamily: "Poppins_500Medium", color: COLORS.textLight }}>Service Name</Text>
                                <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, marginTop: 2 }}>{service}</Text>
                            </View>

                            <View>
                                <Text style={{ fontSize: 12, fontFamily: "Poppins_500Medium", color: COLORS.textLight }}>Date</Text>
                                <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, marginTop: 2 }}>{formattedDate}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 14, marginTop: 24, alignItems: "center" }}
                            onPress={() => {
                                setShowSuccessPopup(false);
                                router.replace('/(dashboard)/profile-pages/my-services');
                            }}
                        >
                            <Text style={{ color: COLORS.white, fontSize: 14, fontFamily: "Poppins_700Bold" }}>View My Requests {'->'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, paddingVertical: 14, marginTop: 12, alignItems: "center" }}
                            onPress={() => {
                                setShowSuccessPopup(false);
                                router.replace('/(dashboard)/home');
                            }}
                        >
                            <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: COLORS.textGray }}>Back to Home</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
