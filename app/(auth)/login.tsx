import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
};

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = () => {
        router.replace("/(dashboard)/home");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingVertical: 40, paddingHorizontal: 24 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Title */}
                    <Text style={{ fontSize: 28, fontFamily: "Poppins_700Bold", color: COLORS.textDark, textAlign: "center", marginBottom: 30, marginTop: 20 }}>
                        Step Into the Future{"\n"}of Shopping
                    </Text>

                    {/* Login/Register Toggle */}
                    <View style={{ flexDirection: "row", backgroundColor: COLORS.lightGrey, borderRadius: 50, padding: 4, marginBottom: 32 }}>
                        <TouchableOpacity 
                            style={{ flex: 1, backgroundColor: COLORS.primary, borderRadius: 50, paddingVertical: 14, alignItems: "center", shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
                        >
                            <Text style={{ color: COLORS.white, fontSize: 15, fontFamily: "Poppins_600SemiBold" }}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => router.replace("/signup")}
                            style={{ flex: 1, borderRadius: 50, paddingVertical: 14, alignItems: "center", justifyContent: "center" }}
                        >
                            <Text style={{ color: COLORS.textDark, fontSize: 15, fontFamily: "Poppins_500Medium" }}>Register</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Email Input */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: COLORS.textDark, marginBottom: 8, marginLeft: 4 }}>
                            Email Address
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.lightGrey, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14 }}>
                            <TextInput
                                placeholder="Uzzalh4343@gmail.com"
                                placeholderTextColor={COLORS.textLight}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                style={{ flex: 1, fontSize: 15, color: COLORS.textDark, outlineStyle: "none" }}
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: COLORS.textDark, marginBottom: 8, marginLeft: 4 }}>
                            Password
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.lightGrey, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14 }}>
                            <TextInput
                                placeholder="••••••••••••"
                                placeholderTextColor={COLORS.textLight}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                style={{ flex: 1, fontSize: 15, color: COLORS.textDark, outlineStyle: "none" }}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                                <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color={COLORS.textLight}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Remember Me & Forgot Password */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                        <TouchableOpacity 
                            onPress={() => setRememberMe(!rememberMe)}
                            style={{ flexDirection: "row", alignItems: "center" }}
                            activeOpacity={0.7}
                        >
                            <View style={{ width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: rememberMe ? COLORS.primary : COLORS.textLight, backgroundColor: rememberMe ? COLORS.primary : "transparent", alignItems: "center", justifyContent: "center", marginRight: 8 }}>
                                {rememberMe && <Ionicons name="checkmark" size={12} color={COLORS.white} />}
                            </View>
                            <Text style={{ fontSize: 13, color: COLORS.textDark, fontFamily: "Poppins_500Medium" }}>Remember Me</Text>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Text style={{ fontSize: 13, color: COLORS.textLight, fontFamily: "Poppins_500Medium" }}>Forgot Password</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        onPress={handleLogin}
                        activeOpacity={0.8}
                        style={{ backgroundColor: COLORS.primary, borderRadius: 50, paddingVertical: 16, alignItems: "center", marginBottom: 32, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }}
                    >
                        <Text style={{ color: COLORS.white, fontSize: 16, fontFamily: "Poppins_700Bold" }}>
                            Login
                        </Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 32 }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
                        <Text style={{ marginHorizontal: 16, fontSize: 12, color: COLORS.textLight, fontFamily: "Poppins_500Medium" }}>
                            Or continue with
                        </Text>
                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
                    </View>

                    {/* Social Buttons */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16, marginBottom: 40 }}>
                        <TouchableOpacity style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 50, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white }}>
                            <Ionicons name="logo-google" size={20} color="#DB4437" style={{ marginRight: 8 }} />
                            <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark }}>Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 50, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white }}>
                            <Ionicons name="logo-apple" size={20} color="#000" style={{ marginRight: 8 }} />
                            <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark }}>Apple</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom link */}
                    <View style={{ flexDirection: "row", justifyContent: "center", marginTop: "auto" }}>
                        <Text style={{ fontSize: 14, color: COLORS.textLight }}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.replace("/signup")}>
                            <Text style={{ fontSize: 14, fontFamily: "Poppins_700Bold", color: COLORS.textDark }}>Sign up</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}