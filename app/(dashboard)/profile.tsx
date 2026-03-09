import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

const StatBlock = ({ value, label, accent }: { value: string; label: string; accent?: string }) => (
    <View className="items-center flex-1">
        <Text className={`text-2xl font-bold ${accent ?? 'text-[#0F172A]'}`}>{value}</Text>
        <Text className="text-[10px] tracking-wide text-[#94A3B8] font-semibold mt-1">{label}</Text>
    </View>
);

const ProfileRow = ({
    icon,
    iconBg,
    title,
    subtitle,
    onPress,
    isDanger,
}: {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    iconBg: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    isDanger?: boolean;
}) => (
    <TouchableOpacity className="py-3 flex-row items-center" onPress={onPress} activeOpacity={0.85}>
        <View className={`w-10 h-10 rounded-xl items-center justify-center ${iconBg}`}>
            <Ionicons name={icon} size={18} color={isDanger ? '#EF4444' : '#06B6D4'} />
        </View>
        <View className="ml-3 flex-1">
            <Text className={`text-[15px] font-semibold ${isDanger ? 'text-[#EF4444]' : 'text-[#0F172A]'}`}>{title}</Text>
            {!!subtitle && <Text className="text-xs text-[#94A3B8] mt-0.5">{subtitle}</Text>}
        </View>
        {!isDanger && <Ionicons name="chevron-forward" size={17} color="#B8C2D1" />}
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#F4F7FB]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-5 pt-2 pb-3 flex-row items-center justify-between">
                <Text className="text-[30px] font-bold text-[#0F172A]">Profile</Text>
                <TouchableOpacity className="w-9 h-9 rounded-full items-center justify-center">
                    <Ionicons name="notifications-outline" size={20} color="#475569" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                <View className="bg-[#EAF8FF] rounded-3xl border border-[#DFECF5] px-4 pt-5 pb-4 shadow-sm">
                    <View className="items-center">
                        <View className="relative">
                            <View className="w-24 h-24 rounded-full border-2 border-[#7DD3FC] bg-white items-center justify-center overflow-hidden">
                                <Image
                                    source={{ uri: 'https://i.pravatar.cc/200?img=32' }}
                                    className="w-full h-full"
                                />
                            </View>
                            <View className="absolute -right-1 bottom-1 w-6 h-6 rounded-full bg-[#06B6D4] items-center justify-center border-2 border-white">
                                <Ionicons name="checkmark" size={14} color="#fff" />
                            </View>
                        </View>

                        <Text className="text-[29px] font-bold text-[#0F172A] mt-3">Rajesh Kumar</Text>
                        <View className="flex-row items-center mt-1">
                            <Text className="text-sm text-[#334155]">Rajesh Textiles Pvt Ltd</Text>
                            <Ionicons name="checkmark-circle" size={13} color="#06B6D4" style={{ marginLeft: 4 }} />
                        </View>
                        <Text className="text-xs text-[#94A3B8] mt-0.5">rajesh.kumar@example.com</Text>
                    </View>

                    <View className="mt-5 flex-row items-center justify-between border-t border-[#D8E9F5] pt-4">
                        <StatBlock value="85%" label="COMPLETE" />
                        <View className="h-8 w-[1px] bg-[#D6DEE8]" />
                        <StatBlock value="Pro" label="PLAN" accent="text-[#06B6D4]" />
                    </View>
                </View>

                <Text className="text-xs text-[#9AA6B2] font-bold tracking-wide mt-6 mb-2 px-1">ACCOUNT SETTINGS</Text>
                <View className="bg-white rounded-2xl border border-[#E5EAF0] px-3">
                    <ProfileRow
                        icon="person-outline"
                        iconBg="bg-[#E8F8FE]"
                        title="Edit Profile"
                        subtitle="Update your personal info"
                        onPress={() => router.push('/(dashboard)/profile-pages/edit-profile')}
                    />
                    <View className="h-[1px] bg-[#EEF2F7]" />
                    <ProfileRow
                        icon="business-outline"
                        iconBg="bg-[#E8F8FE]"
                        title="Business Details"
                        subtitle="Manage documents & GST"
                        onPress={() => router.push('/(dashboard)/profile-pages/business-details')}
                    />
                    <View className="h-[1px] bg-[#EEF2F7]" />
                    <ProfileRow
                        icon="settings-outline"
                        iconBg="bg-[#E8F8FE]"
                        title="Settings"
                        subtitle="App preferences & security"
                        onPress={() => router.push('/(dashboard)/profile-pages/settings')}
                    />
                </View>

                <Text className="text-xs text-[#9AA6B2] font-bold tracking-wide mt-6 mb-2 px-1">SUPPORT & MORE</Text>
                <View className="bg-white rounded-2xl border border-[#E5EAF0] px-3">
                    <ProfileRow
                        icon="help-circle-outline"
                        iconBg="bg-[#EEF5FF]"
                        title="Help & Support"
                        onPress={() => router.push('/(dashboard)/profile-pages/help-support')}
                    />
                    <View className="h-[1px] bg-[#EEF2F7]" />
                    <ProfileRow icon="log-out-outline" iconBg="bg-[#FFF1F2]" title="Log Out" isDanger />
                </View>

                <Text className="text-center text-[11px] text-[#9AA6B2] mt-7">VyaaparSaathi v2.4.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}
