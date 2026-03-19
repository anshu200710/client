import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const conversionFAQs = [
    { q: "Can I avoid GST if my business is small?", a: "If you sell online on Amazon/Flipkart or sell outside your state, GST is 100% mandatory from day one! Don't risk heavy penalties." },
    { q: "Will GST registration help me get business loans?", a: "Yes! Banks trust businesses with a GST number. It works as solid proof of business and helps secure mudra or MSME loans faster." },
    { q: "Can I claim back the GST I pay on purchases?", a: "Absolutely. With GST registration, you can claim Input Tax Credit (ITC) on goods and services you buy for your business, saving you thousands every month!" },
    { q: "Does a GST number make me look professional?", a: "Yes. Big companies, B2B clients, and government tenders usually only work with GST-registered vendors." },
    { q: "Am I losing customers without GST?", a: "Likely yes. B2B buyers prefer GST-registered suppliers so they can claim ITC. Without GST, you are turning away high-value clients." },
    { q: "I run my business from home. Can I still get GST?", a: "Yes! You can easily register GST using your home address. Just provide your electricity bill and a NOC from the property owner." },
    { q: "Is GST registration a complicated offline process?", a: "Not at all! With VyaaparSaathi, it is completely online, paperless, and hassle-free. You don't need to visit any government office." },
    { q: "What if I get GST but have zero sales in some months?", a: "No problem. You simply file a 'Nil Return.' Filing is quick, and having the GST active keeps your business ready for future growth." },
    { q: "How much penalty can I face for not registering?", a: "Operating without GST when required can attract penalties of 100% of the tax due or a minimum of ₹10,000. It's not worth the risk!" },
    { q: "I'm not sure if I cross the turnover limit?", a: "Voluntary registration has zero disadvantages and opens up growth opportunities. Registering early is always the safer path." }
];

export default function ServiceRequestFormScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ service?: string; fee?: string }>();
    const service = params.service ?? 'Service Request';
    const fee = params.fee ?? '999';

    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const [businessName, setBusinessName] = useState('Rajesh Textiles Pvt Ltd');
    const [contactNumber, setContactNumber] = useState('+91 98765 43210');

    const canProceed = useMemo(() => businessName.trim().length > 2 && contactNumber.trim().length > 8, [businessName, contactNumber]);

    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [selectedDocForUpload, setSelectedDocForUpload] = useState<string | null>(null);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const handleUploadClick = (doc: string) => {
        if (selectedDocs.includes(doc)) {
            setSelectedDocs((prev) => prev.filter((item) => item !== doc));
        } else {
            setSelectedDocForUpload(doc);
            setUploadModalVisible(true);
        }
    };

    const confirmUpload = () => {
        if (selectedDocForUpload && !selectedDocs.includes(selectedDocForUpload)) {
            setSelectedDocs([...selectedDocs, selectedDocForUpload]);
        }
        setUploadModalVisible(false);
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
                        source={require('../../../assets/images/splash.jpeg')}
                        style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                    />
                </View>

                {/* Service Details */}
                <View style={{ backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 20, marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: COLORS.textLight, marginBottom: 8, letterSpacing: 0.5 }}>SERVICE</Text>
                    <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginBottom: 4 }}>{service}</Text>
                    <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textGray }}>Your request will be submitted to admin for verification.</Text>
                </View>

                {/* Why You Need This Box */}
                <View style={{ backgroundColor: COLORS.actionBlueBg, borderRadius: 20, padding: 20, marginBottom: 16 }}>
                    <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold", color: COLORS.primary, marginBottom: 12 }}>Why do you need this?</Text>
                    <View style={{ flexDirection: "row", marginBottom: 8, alignItems: "flex-start" }}>
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} style={{ marginRight: 8, marginTop: 2 }} />
                        <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textDark, flex: 1 }}>Mandatory for selling online (Amazon, Flipkart)</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginBottom: 8, alignItems: "flex-start" }}>
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} style={{ marginRight: 8, marginTop: 2 }} />
                        <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textDark, flex: 1 }}>Requirement for taking Bank / MSME loans</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginBottom: 8, alignItems: "flex-start" }}>
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} style={{ marginRight: 8, marginTop: 2 }} />
                        <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textDark, flex: 1 }}>Build trust with B2B clients</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} style={{ marginRight: 8, marginTop: 2 }} />
                        <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textDark, flex: 1 }}>Claim Input Tax Credit (ITC) to save costs</Text>
                    </View>
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
                                onPress={() => handleUploadClick(doc)}
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

                {/* FAQ Section */}
                <View style={{ backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 20, marginBottom: 16 }}>
                    <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginBottom: 12 }}>Frequently Asked Questions</Text>
                    {conversionFAQs.map((faq, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
                            style={{
                                borderBottomWidth: index === conversionFAQs.length - 1 ? 0 : 1,
                                borderBottomColor: COLORS.border,
                                paddingVertical: 12
                            }}
                        >
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, flex: 1, paddingRight: 16 }}>{faq.q}</Text>
                                <Ionicons name={expandedFaq === index ? "chevron-up" : "chevron-down"} size={18} color={COLORS.textGray} />
                            </View>
                            {expandedFaq === index && (
                                <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textGray, marginTop: 8, lineHeight: 20 }}>
                                    {faq.a}
                                </Text>
                            )}
                        </TouchableOpacity>
                    ))}
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

            {/* Upload Modal */}
            <Modal visible={uploadModalVisible} transparent animationType="fade">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                    <View style={{ width: '100%', backgroundColor: COLORS.white, borderRadius: 24, padding: 24 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: COLORS.textDark }}>Upload Document</Text>
                            <TouchableOpacity onPress={() => setUploadModalVisible(false)} style={{ padding: 4 }}>
                                <Ionicons name="close" size={24} color={COLORS.textGray} />
                            </TouchableOpacity>
                        </View>

                        <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, marginBottom: 4 }}>
                            {selectedDocForUpload}
                        </Text>
                        <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textGray, marginBottom: 20 }}>
                            Please upload a clear, readable image of your original document. See the sample below for expected format.
                        </Text>

                        <View style={{ width: '100%', height: 180, backgroundColor: COLORS.lightGrey, borderRadius: 16, marginBottom: 24, alignItems: "center", justifyContent: "center", overflow: "hidden", borderWidth: 1, borderColor: COLORS.border, borderStyle: "dashed" }}>
                            {/* Sample Image */}
                            <Image
                                source={require('../../../assets/images/splash.jpeg')}
                                style={{ width: '100%', height: '100%', opacity: 0.8, resizeMode: "cover" }}
                            />
                            <View style={{ position: "absolute", backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
                                <Text style={{ color: COLORS.white, fontSize: 12, fontFamily: "Poppins_600SemiBold", letterSpacing: 0.5 }}>SAMPLE FORMAT</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={confirmUpload}
                            style={{
                                backgroundColor: COLORS.primary,
                                borderRadius: 16,
                                paddingVertical: 16,
                                alignItems: "center"
                            }}
                        >
                            <Text style={{ color: COLORS.white, fontSize: 15, fontFamily: "Poppins_700Bold" }}>
                                Select File to Upload
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
