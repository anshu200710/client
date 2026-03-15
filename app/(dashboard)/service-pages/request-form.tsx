import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
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
                <Text style={{ fontSize: 20, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginLeft: 16 }}>Request {service}</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                
                {/* Image Banner */}
                <View style={{ width: '100%', height: 160, borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}>
                    <Image 
                        source={require('../../../assets/images/splash3.png')} 
                        style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                    />
                </View>

                {/* Service Details */}
                <View style={{ backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 20, marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: COLORS.textLight, marginBottom: 8, letterSpacing: 0.5 }}>SERVICE</Text>
                    <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginBottom: 4 }}>{service}</Text>
                    <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textGray }}>Your request will be submitted to admin for verification.</Text>
                </View>

                {/* Form Inputs */}
                <View style={{ backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 20, marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: COLORS.textLight, marginBottom: 8, letterSpacing: 0.5 }}>BUSINESS NAME</Text>
                    <TextInput
                        style={{ backgroundColor: COLORS.lightGrey, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, fontFamily: "Poppins_400Regular", color: COLORS.textDark, marginBottom: 16, outlineStyle: "none" as any }}
                        value={businessName}
                        onChangeText={setBusinessName}
                        placeholder="Enter business name"
                        placeholderTextColor={COLORS.textLight}
                    />

                    <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: COLORS.textLight, marginBottom: 8, letterSpacing: 0.5 }}>CONTACT NUMBER</Text>
                    <TextInput
                        style={{ backgroundColor: COLORS.lightGrey, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, fontFamily: "Poppins_400Regular", color: COLORS.textDark, outlineStyle: "none" as any }}
                        value={contactNumber}
                        onChangeText={setContactNumber}
                        keyboardType="phone-pad"
                        placeholder="Enter phone number"
                        placeholderTextColor={COLORS.textLight}
                    />
                </View>

                {/* Document Uploads */}
                <View style={{ backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 20, marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: COLORS.textLight, marginBottom: 12, letterSpacing: 0.5 }}>UPLOAD REQUIRED DOCUMENTS</Text>
                    {docOptions.map((doc) => {
                        const selected = selectedDocs.includes(doc);
                        return (
                            <TouchableOpacity
                                key={doc}
                                onPress={() => toggleDoc(doc)}
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
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Ionicons name="document-text-outline" size={18} color={selected ? COLORS.primary : COLORS.textGray} />
                                    <Text style={{ marginLeft: 12, fontSize: 14, fontFamily: selected ? "Poppins_600SemiBold" : "Poppins_500Medium", color: selected ? COLORS.textDark : COLORS.textGray }}>{doc}</Text>
                                </View>
                                <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: selected ? "rgba(0, 102, 204, 0.15)" : COLORS.lightGrey }}>
                                    <Text style={{ fontSize: 11, fontFamily: "Poppins_600SemiBold", color: selected ? COLORS.primary : COLORS.textLight }}>
                                        {selected ? 'Uploaded' : 'Upload'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                    <Text style={{ fontSize: 12, fontFamily: "Poppins_500Medium", color: COLORS.textLight, marginTop: 4 }}>Selected: {selectedDocs.length} documents</Text>
                </View>

                {/* Payment Summary */}
                <View style={{ backgroundColor: COLORS.actionYellowBg, borderRadius: 20, borderWidth: 1, borderColor: COLORS.actionYellowIcon, padding: 20, marginBottom: 24 }}>
                    <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: COLORS.actionYellowIcon, marginBottom: 4 }}>PAYMENT DUE</Text>
                    <Text style={{ fontSize: 28, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginBottom: 4 }}>
                        {fee === '0' || fee === 'Free' ? 'Free' : `₹${fee}`}
                    </Text>
                    <Text style={{ fontSize: 13, fontFamily: "Poppins_500Medium", color: "#92400E" }}>Pay now to complete and send request to admin.</Text>
                </View>

                {/* Continue Button */}
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: '/(dashboard)/service-pages/payment',
                            params: { service, fee, docs: String(selectedDocs.length) },
                        })
                    }
                    disabled={!canProceed}
                    style={{
                        borderRadius: 20,
                        paddingVertical: 16,
                        alignItems: "center",
                        backgroundColor: canProceed ? COLORS.primary : COLORS.textLight
                    }}
                >
                    <Text style={{ color: COLORS.white, fontSize: 15, fontFamily: "Poppins_700Bold" }}>Continue to Payment</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
