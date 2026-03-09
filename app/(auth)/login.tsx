import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // Handle login action
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: "#F7F9FC" }}>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

                    <View className="flex-1 px-6 pt-16 items-center">
                        {/* Logo Icon */}
                        <View className="w-20 h-20 rounded-2xl items-center justify-center mb-8" style={{ backgroundColor: "#E6F0FC" }}>
                            <Ionicons name="storefront-outline" size={32} color="#0066CC" />
                        </View>

                        {/* Welcome Text */}
                        <Text className="text-[32px] font-bold mb-3" style={{ color: "#0F172A", letterSpacing: -0.5 }}>
                            Welcome Back
                        </Text>
                        <Text className="text-base text-center mb-10 leading-6 px-4" style={{ color: "#64748B" }}>
                            Manage your business with ease using VyaaparSaathi.
                        </Text>

                        {/* Email Input */}
                        <View className="w-full mb-5">
                            <Text className="text-sm font-semibold mb-2" style={{ color: "#334155" }}>Email Address</Text>
                            <View className="flex-row items-center border rounded-xl bg-white px-4 py-3.5 shadow-sm" style={{ borderColor: "#E2E8F0" }}>
                                <Ionicons name="mail-outline" size={20} color="#94A3B8" className="mr-3" />
                                <TextInput
                                    className="flex-1 text-[16px]"
                                    placeholder="you@example.com"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                    style={{ color: "#0F172A" }}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View className="w-full mb-3">
                            <Text className="text-sm font-semibold mb-2" style={{ color: "#334155" }}>Password</Text>
                            <View className="flex-row items-center border rounded-xl bg-white px-4 py-3.5 shadow-sm" style={{ borderColor: "#E2E8F0" }}>
                                <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" className="mr-3" />
                                <TextInput
                                    className="flex-1 text-[16px]"
                                    placeholder="••••••••"
                                    placeholderTextColor="#94A3B8"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                    style={{ color: "#0F172A" }}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="pl-2">
                                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#94A3B8" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot Password */}
                        <View className="w-full items-end mb-8">
                            <TouchableOpacity>
                                <Text className="text-sm font-medium" style={{ color: "#0066CC" }}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            className="w-full py-4 rounded-xl items-center justify-center mb-4"
                            style={{ backgroundColor: "#0066CC", shadowColor: "#0066CC", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 }}
                        >
                            <Text className="text-white text-[16px] font-semibold">Login</Text>
                        </TouchableOpacity>

                        {/* Sign Up Link */}
                        <View className="flex-row items-center justify-center mb-10">
                            <Text className="text-[15px]" style={{ color: "#64748B" }}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => router.push("/signup")}>
                                <Text className="text-[15px] font-semibold" style={{ color: "#0066CC" }}>Sign up</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Bottom Navigation Links */}
                        <View className="w-full pt-6 border-t flex-row justify-center items-center h-20" style={{ borderColor: "#E2E8F0" }}>
                            <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
                                <Text className="text-xs mr-1" style={{ color: "#3B82F6" }}>←</Text>
                                <Text className="text-[13px] font-medium" style={{ color: "#3B82F6" }}>Back to Navigation</Text>
                            </TouchableOpacity>
                            <View className="w-[1px] h-4 mx-4" style={{ backgroundColor: "#CBD5E1" }} />
                            <TouchableOpacity className="flex-row items-center">
                                <Text className="text-[13px] font-medium" style={{ color: "#3B82F6" }}>Dashboard</Text>
                                <Text className="text-xs ml-1" style={{ color: "#3B82F6" }}>→</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
