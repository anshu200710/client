import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
    primary: "#0066CC",
    secondary: "#FF9900",
    white: "#FFFFFF",
    bg: "#F2F4F8",
    textDark: "#1A1D2E",
    textGray: "#9FA3B1",
    textLight: "#C4C8D4",
    border: "#E4E7EF",
    inputBg: "#FFFFFF",
};

export default function LoginScreen() {
    const { width } = useWindowDimensions();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const handleLogin = () => {
        router.replace("/(dashboard)/home");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 32, paddingHorizontal: 20 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* White Card */}
                    <View
                        style={{
                            width: "100%",
                            backgroundColor: COLORS.white,
                            borderRadius: 28,
                            paddingHorizontal: 28,
                            paddingVertical: 36,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.08,
                            shadowRadius: 24,
                            elevation: 8,
                        }}
                    >
                        {/* Logo mark — 2 squares like reference */}
                        <View style={{ alignItems: "center", marginBottom: 16 }}>
                            <View style={{ flexDirection: "row", gap: 4 }}>
                                <View style={{ width: 14, height: 14, backgroundColor: COLORS.primary, borderRadius: 3 }} />
                                <View style={{ width: 14, height: 14, backgroundColor: COLORS.secondary, borderRadius: 3, marginTop: 6 }} />
                            </View>
                        </View>

                        {/* Title */}
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 28 }}>
                            <Text style={{ fontSize: 15, fontWeight: "600", color: COLORS.textGray, letterSpacing: 2, marginRight: 6 }}>
                                LOG IN TO
                            </Text>
                            <Text style={{ fontSize: 15, fontWeight: "800", color: COLORS.primary, letterSpacing: 2 }}>
                                VYAAPAAR
                            </Text>
                        </View>

                        {/* Email Input */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                borderWidth: 0,
                                borderRadius: 50,
                                backgroundColor: COLORS.inputBg,
                                paddingHorizontal: 18,
                                paddingVertical: 13,
                                marginBottom: 14,
                            }}
                        >
                            <TextInput
                                placeholder="Email ID"
                                placeholderTextColor={COLORS.textLight}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                selectionColor="transparent"
                                underlineColorAndroid="transparent"
                                style={{
                                    flex: 1,
                                    fontSize: 14,
                                    color: COLORS.textDark,
                                    outlineStyle: "none"
                                }}
                            />
                        </View>

                        {/* Password Input */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                borderWidth: 0,
                                borderRadius: 50,
                                backgroundColor: COLORS.inputBg,
                                paddingHorizontal: 18,
                                paddingVertical: 13,
                                marginBottom: 10,
                            }}
                        >
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor={COLORS.textLight}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                selectionColor="transparent"
                                underlineColorAndroid="transparent"
                                style={{
                                    flex: 1,
                                    fontSize: 14,
                                    color: COLORS.textDark,
                                    outlineStyle: "none"
                                }}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={18}
                                    color={COLORS.textLight}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Forgot password */}
                        <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 20 }}>
                            <Text style={{ fontSize: 12, color: COLORS.textGray }}>Forgot password?</Text>
                        </TouchableOpacity>

                        {/* Terms checkbox */}
                        <TouchableOpacity
                            onPress={() => setAgreed(!agreed)}
                            style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}
                            activeOpacity={0.7}
                        >
                            <View
                                style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 4,
                                    borderWidth: 1.5,
                                    borderColor: agreed ? COLORS.primary : COLORS.border,
                                    backgroundColor: agreed ? COLORS.primary : COLORS.white,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: 10,
                                }}
                            >
                                {agreed && <Ionicons name="checkmark" size={11} color={COLORS.white} />}
                            </View>
                            <Text style={{ fontSize: 12, color: COLORS.textGray }}>
                                I understand the{" "}
                                <Text style={{ color: COLORS.primary, fontWeight: "600" }}>terms and condition</Text>
                            </Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            activeOpacity={0.85}
                            style={{
                                backgroundColor: COLORS.primary,
                                borderRadius: 50,
                                paddingVertical: 15,
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 20,
                                shadowColor: COLORS.primary,
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.3,
                                shadowRadius: 12,
                                elevation: 6,
                            }}
                        >
                            <Text style={{ color: COLORS.white, fontSize: 15, fontWeight: "700", letterSpacing: 1.5 }}>
                                LOGIN
                            </Text>
                        </TouchableOpacity>

                        {/* Sign up link */}
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <Text style={{ fontSize: 12, color: COLORS.textGray }}>Already have an account?  </Text>
                            <TouchableOpacity onPress={() => router.push("/signup")}>
                                <Text style={{ fontSize: 12, fontWeight: "700", color: COLORS.secondary }}>
                                    Sign up here
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Bottom bar accent */}
                        <View
                            style={{
                                alignSelf: "center",
                                marginTop: 28,
                                width: 48,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: COLORS.primary,
                                opacity: 0.25,
                            }}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}