import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

export default function SettingsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#F4F7FB]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-5 pt-2 pb-4 flex-row items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white items-center justify-center border border-[#E5EAF0]"
                >
                    <Ionicons name="chevron-back" size={20} color="#0F172A" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-[#0F172A] ml-3">Settings</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
                <View className="bg-white rounded-2xl p-4 border border-[#E7ECF3]">
                    <View className="flex-row items-center justify-between py-3 border-b border-[#EEF2F7]">
                        <View>
                            <Text className="text-sm font-semibold text-[#0F172A]">Push Notifications</Text>
                            <Text className="text-xs text-[#64748B] mt-1">Receive service and payment alerts</Text>
                        </View>
                        <Switch value thumbColor="#FFFFFF" trackColor={{ false: '#CBD5E1', true: '#0066CC' }} />
                    </View>

                    <View className="flex-row items-center justify-between py-3 border-b border-[#EEF2F7]">
                        <View>
                            <Text className="text-sm font-semibold text-[#0F172A]">Biometric Login</Text>
                            <Text className="text-xs text-[#64748B] mt-1">Use fingerprint or Face ID</Text>
                        </View>
                        <Switch value={false} thumbColor="#FFFFFF" trackColor={{ false: '#CBD5E1', true: '#0066CC' }} />
                    </View>

                    <TouchableOpacity className="py-3">
                        <Text className="text-sm font-semibold text-[#0F172A]">Change Password</Text>
                        <Text className="text-xs text-[#64748B] mt-1">Update your account password</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
