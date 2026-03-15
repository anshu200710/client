import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
  
  actionGreenBg: "#ECFDF5",
  actionGreenIcon: "#10B981",
};

export default function ServiceSuccessScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ service?: string; fee?: string; method?: string }>();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={{ flex: 1, paddingHorizontal: 24, alignItems: "center", justifyContent: "center" }}>
                <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.actionGreenBg, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <Ionicons name="checkmark" size={48} color={COLORS.actionGreenIcon} />
                </View>

                <Text style={{ fontSize: 24, fontFamily: "Poppins_700Bold", color: COLORS.textDark, textAlign: "center", marginBottom: 12 }}>Request Submitted</Text>
                <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: COLORS.textGray, textAlign: "center", lineHeight: 22, paddingHorizontal: 16 }}>
                    Your {params.service ?? 'service'} request and payment (
                    {params.fee === '0' || params.fee === 'Free' ? 'Free' : `₹${params.fee}`}
                    ) were submitted to admin.
                </Text>
                <Text style={{ fontSize: 13, fontFamily: "Poppins_500Medium", color: COLORS.textLight, marginTop: 16 }}>
                    Payment Method: {params.fee === '0' || params.fee === 'Free' ? 'None' : (params.method ?? 'UPI')}
                </Text>

                <View style={{ backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 20, paddingVertical: 16, width: "100%", marginTop: 32 }}>
                    <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: COLORS.textLight, letterSpacing: 0.5 }}>NEXT STEP</Text>
                    <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: COLORS.textDark, marginTop: 8, lineHeight: 22 }}>
                        Admin will verify your documents and update service status in My Services.
                    </Text>
                </View>

                <TouchableOpacity
                    style={{ backgroundColor: COLORS.primary, borderRadius: 20, paddingVertical: 16, alignItems: "center", width: "100%", marginTop: 32 }}
                    onPress={() => router.replace('/(dashboard)/profile-pages/my-services')}
                >
                    <Text style={{ color: COLORS.white, fontSize: 15, fontFamily: "Poppins_700Bold" }}>Track in My Services</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={{ paddingVertical: 16, marginTop: 12 }} 
                    onPress={() => router.replace('/(dashboard)/services')}
                >
                    <Text style={{ color: COLORS.primary, fontSize: 14, fontFamily: "Poppins_600SemiBold" }}>Back to Services</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
