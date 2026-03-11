import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Helper Components
const StatCard = ({ icon, bg, count, label, badge }: any) => (
  <View
    className={`rounded-2xl p-4 flex-1 mr-3 ${bg}`}
    style={{ minWidth: 100 }}
  >
    <View className="flex-row justify-between items-start mb-4">
      <View className="w-8 h-8 rounded-full bg-white items-center justify-center shadow-sm">
        {icon}
      </View>
      {badge && (
        <View className="bg-blue-100 px-2 py-0.5 rounded-full">
          <Text className="text-[10px] text-blue-600 font-bold">{badge}</Text>
        </View>
      )}
    </View>
    <Text className="text-3xl font-bold text-gray-900 mb-1">{count}</Text>
    <Text className="text-xs text-gray-500 font-medium">{label}</Text>
  </View>
);

const ActionIcon = ({ iconName, iconColor, bg, label }: any) => (
  <TouchableOpacity className="items-center mb-6 w-1/4">
    <View
      className={`w-14 h-14 rounded-2xl items-center justify-center mb-2 ${bg}`}
    >
      <Ionicons name={iconName} size={24} color={iconColor} />
    </View>
    <Text className="text-[11px] text-center text-gray-600 font-medium w-16">
      {label}
    </Text>
  </TouchableOpacity>
);

const ActivityRow = ({
  iconName,
  iconColor,
  iconBg,
  title,
  subtitle,
  status,
  statusBg,
  statusColor,
}: any) => (
  <View className="flex-row items-center border border-gray-100 rounded-2xl p-4 mb-3 bg-white shadow-sm">
    <View
      className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${iconBg}`}
    >
      <Ionicons name={iconName} size={18} color={iconColor} />
    </View>
    <View className="flex-1">
      <Text className="text-sm font-bold text-gray-900 mb-0.5">{title}</Text>
      <Text className="text-[12px] text-gray-400">{subtitle}</Text>
    </View>
    <View className="items-end">
      <View className={`px-2 py-1 rounded-md mb-1 ${statusBg}`}>
        <Text className={`text-[10px] font-bold ${statusColor}`}>{status}</Text>
      </View>
      <Text className="text-[10px] text-gray-400">2h ago</Text>
    </View>
  </View>
);

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="px-5 pt-4 pb-2 flex-row justify-between items-center">
          <View>
            <Text className="text-sm text-gray-500 font-medium mb-1">
              Good Morning,
            </Text>
            <Text className="text-2xl font-bold text-gray-900 tracking-tight">
              Welcome, Rahul
            </Text>
          </View>
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center"
            onPress={() => router.push("/(dashboard)/notifications")}
          >
            <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white z-10" />
            <Ionicons name="notifications-outline" size={26} color="#334155" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="px-5 mb-6 mt-2">
          <View className="flex-row items-center bg-[#F8FAFC] rounded-xl px-4 py-3 border border-gray-100">
            <Ionicons
              name="search"
              size={20}
              color="#94A3B8"
              className="mr-2"
            />
            <TextInput
              placeholder="Search services or documents..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-[15px] font-medium text-gray-800"
            />
          </View>
        </View>

        {/* Overview Section */}
        <View className="px-5 mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">Overview</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="overflow-visible"
          >
            <StatCard
              icon={<Ionicons name="flash" size={16} color="#3B82F6" />}
              bg="bg-[#F0F5FF]"
              count="2"
              label="Active Services"
              badge="+1 new"
            />
            <StatCard
              icon={<Ionicons name="hourglass" size={16} color="#F97316" />}
              bg="bg-[#FFF8F0]"
              count="1"
              label="Pending Requests"
            />
            <StatCard
              icon={
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              }
              bg="bg-[#F0FDF4]"
              count="14"
              label="Completed"
            />
          </ScrollView>
        </View>

        {/* Quick Actions Grid */}
        <View className="px-5 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity
              onPress={() => router.push("/(dashboard)/action")}
            >
              <ActionIcon
                iconName="add-circle"
                iconColor="#3B82F6"
                bg="bg-[#EFF6FF]"
                label="Request Service"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(dashboard)/action")}
            >
              <ActionIcon
                iconName="cloud-upload"
                iconColor="#8B5CF6"
                bg="bg-[#F5F3FF]"
                label="Upload Docs"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(dashboard)/tools")}>
              <ActionIcon
                iconName="calculator"
                iconColor="#10B981"
                bg="bg-[#ECFDF5]"
                label="GST Calculator"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.push("/(dashboard)/profile-pages/help-support")
              }
            >
              <ActionIcon
                iconName="headset"
                iconColor="#F43F5E"
                bg="bg-[#FFF1F2]"
                label="Help Support"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(dashboard)/chat")}>
              <ActionIcon
                iconName="gift"
                iconColor="#EC4899"
                bg="bg-[#FCE7F3]"
                label="Offers"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(dashboard)/action")}
            >
              <ActionIcon
                iconName="bar-chart"
                iconColor="#EAB308"
                bg="bg-[#FEFCE8]"
                label="My Reports"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(dashboard)/action")}
            >
              <ActionIcon
                iconName="ellipsis-horizontal"
                iconColor="#64748B"
                bg="bg-[#F8FAFC]"
                label="View More"
              />
            </TouchableOpacity>
            <View className="w-1/4" />
          </View>
        </View>

        {/* Promo Banner */}
        <View className="px-5 mb-8">
          <View className="bg-primary rounded-2xl p-5 shadow-sm overflow-hidden h-36 border border-blue-400">
            <View className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white opacity-10" />
            <View className="absolute right-10 -bottom-10 w-24 h-24 rounded-full bg-white opacity-10" />
            <Text className="text-white font-bold text-lg mb-1">
              Tax Season Sale!
            </Text>
            <Text className="text-blue-100 text-xs mb-4 w-2/3 leading-4">
              Get 20% off on premium assisted filing plans.
            </Text>
            <TouchableOpacity className="bg-white rounded-full self-start px-4 py-1.5 shadow-sm">
              <Text className="text-primary font-bold text-xs flex flex-row items-center">
                Upgrade Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-5 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Recent Activity
            </Text>
            <TouchableOpacity>
              <Text className="text-primary text-xs font-bold">View All</Text>
            </TouchableOpacity>
          </View>

          <ActivityRow
            iconName="document-text"
            iconColor="#3B82F6"
            iconBg="bg-[#EFF6FF]"
            title="GST Filing Submitted"
            subtitle="March 2024 Return"
            status="Processing"
            statusBg="bg-[#EFF6FF]"
            statusColor="text-blue-600"
          />
          <ActivityRow
            iconName="briefcase"
            iconColor="#F97316"
            iconBg="bg-[#FFF8F0]"
            title="New Service Request"
            subtitle="Annual Audit Service"
            status="Pending"
            statusBg="bg-[#FFF8F0]"
            statusColor="text-orange-500"
          />
          <ActivityRow
            iconName="shield-checkmark"
            iconColor="#10B981"
            iconBg="bg-[#F0FDF4]"
            title="Document Verified"
            subtitle="PAN Card & Aadhar"
            status="Success"
            statusBg="bg-[#F0FDF4]"
            statusColor="text-emerald-500"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
