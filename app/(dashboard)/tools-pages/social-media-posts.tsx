import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSubscription } from "@/context/SubscriptionContext";
import PremiumPaywall from "@/components/PremiumPaywall";

const COLORS = {
  primary: "#1E4FA3",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textGray: "#666666",
  textLight: "#9FA3B1",
  border: "#E4E7EF",
  actionPurpleBg: "#F5F3FF",
  actionPurpleIcon: "#8B5CF6",
};

const TEMPLATES = [
  { id: 1, title: "Festival Greeting", category: "Diwali Special", bg: "#FF9800", icon: "flame", isPremium: false },
  { id: 2, title: "Offer of the Day", category: "Sales & Marketing", bg: "#E91E63", icon: "pricetag", isPremium: true },
  { id: 3, title: "New Arrival", category: "Product Launch", bg: "#4CAF50", icon: "cube", isPremium: true },
  { id: 4, title: "Hiring Now", category: "Recruitment", bg: "#9C27B0", icon: "briefcase", isPremium: false },
  { id: 5, title: "Client Testimonial", category: "Social Proof", bg: "#3F51B5", icon: "star", isPremium: false },
  { id: 6, title: "Motivational Quote", category: "Engagement", bg: "#00BCD4", icon: "chatbubbles", isPremium: true },
];

export default function SocialMediaPostsScreen() {
  const router = useRouter();
  const { canAccessTemplates } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleTemplatePress = (item: any) => {
    if (item.isPremium && !canAccessTemplates) {
      setShowPaywall(true);
      return;
    }

    alert(`Opening template: ${item.title}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Social Media Posts",
          headerTitleStyle: { fontFamily: "Poppins_600SemiBold", fontSize: 18, color: COLORS.textDark },
          headerStyle: { backgroundColor: COLORS.white },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 8, marginRight: 16 }}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        <View style={{ alignItems: "center", marginBottom: 32, padding: 24, backgroundColor: COLORS.actionPurpleBg, borderRadius: 20 }}>
          <Ionicons name="logo-instagram" size={48} color={COLORS.actionPurpleIcon} />
          <Text style={{ fontSize: 20, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginTop: 16, textAlign: "center" }}>
            Canva Style Templates
          </Text>
          <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: COLORS.textGray, marginTop: 8, textAlign: "center", lineHeight: 22 }}>
            Choose from ready-to-use professional templates to boost your social media presence.
          </Text>
        </View>

        <Text style={{ fontSize: 16, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, marginBottom: 16 }}>
          Trending Templates
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          {TEMPLATES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{ width: "48%", marginBottom: 16 }}
              onPress={() => handleTemplatePress(item)}
            >
              <View
                style={{
                  height: 160,
                  backgroundColor: item.bg,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons name={item.icon as any} size={40} color={COLORS.white} style={{ opacity: 0.8 }} />
                <Text style={{ color: COLORS.white, fontFamily: "Poppins_600SemiBold", marginTop: 8, textAlign: "center", paddingHorizontal: 8 }}>
                  {item.title}
                </Text>
              </View>
              <Text style={{ fontSize: 13, fontFamily: "Poppins_500Medium", color: COLORS.textDark }}>
                {item.title}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: COLORS.textGray }}>
                  {item.category}
                </Text>
                {item.isPremium && (
                  <View style={{ backgroundColor: "#FEF3C7", borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }}>
                    <Text style={{ fontSize: 10, fontFamily: "Poppins_600SemiBold", color: "#B45309" }}>Premium</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <PremiumPaywall
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        featureName="Social media templates"
        onUpgradePress={() => router.push("/subscription/choose")}
      />
    </SafeAreaView>
  );
}
