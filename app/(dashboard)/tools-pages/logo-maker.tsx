import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#1E4FA3",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textGray: "#666666",
  textLight: "#9FA3B1",
  border: "#E4E7EF",
  actionYellowBg: "#FFFBEB",
  actionYellowIcon: "#F59E0B",
};

export default function LogoMakerScreen() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [slogan, setSlogan] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState(false);

  const handleGenerate = () => {
    if (!businessName || !industry) {
      alert("Please fill in Business Name and Industry.");
      return;
    }
    setIsGenerating(true);
    // Simulate AI Generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedLogo(true);
    }, 2500);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Free Logo Maker",
          headerTitleStyle: {
            fontFamily: "Poppins_600SemiBold",
            fontSize: 18,
            color: COLORS.textDark,
          },
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 8, marginRight: 16 }}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
      >
        <View
          style={{
            alignItems: "center",
            marginBottom: 32,
            padding: 24,
            backgroundColor: COLORS.actionYellowBg,
            borderRadius: 20,
          }}
        >
          <Ionicons
            name="color-palette"
            size={48}
            color={COLORS.actionYellowIcon}
          />
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textDark,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            AI Logo Generator
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: COLORS.textGray,
              marginTop: 8,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            Describe your business, and our AI will generate a professional logo
            for you instantly.
          </Text>
        </View>

        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_600SemiBold",
            color: COLORS.textDark,
            marginBottom: 8,
          }}
        >
          Business Name *
        </Text>
        <TextInput
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="e.g. Vyaapar Saathi"
          placeholderTextColor={COLORS.textLight}
          style={{
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            fontFamily: "Poppins_400Regular",
            color: COLORS.textDark,
            marginBottom: 20,
          }}
        />

        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_600SemiBold",
            color: COLORS.textDark,
            marginBottom: 8,
          }}
        >
          Industry / Category *
        </Text>
        <TextInput
          value={industry}
          onChangeText={setIndustry}
          placeholder="e.g. Legal Services, Restaurant"
          placeholderTextColor={COLORS.textLight}
          style={{
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            fontFamily: "Poppins_400Regular",
            color: COLORS.textDark,
            marginBottom: 20,
          }}
        />

        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_600SemiBold",
            color: COLORS.textDark,
            marginBottom: 8,
          }}
        >
          Slogan / Tagline (Optional)
        </Text>
        <TextInput
          value={slogan}
          onChangeText={setSlogan}
          placeholder="e.g. Trust in every transaction"
          placeholderTextColor={COLORS.textLight}
          style={{
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            fontFamily: "Poppins_400Regular",
            color: COLORS.textDark,
            marginBottom: 32,
          }}
        />

        {isGenerating ? (
          <View style={{ alignItems: "center", padding: 20 }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ marginTop: 12, fontFamily: "Poppins_500Medium", color: COLORS.textGray }}>
              Generating your logo...
            </Text>
          </View>
        ) : generatedLogo ? (
          <View
            style={{
              padding: 24,
              backgroundColor: "#F8FAFC",
              borderRadius: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <View
              style={{
                width: 120,
                height: 120,
                backgroundColor: COLORS.primary,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
              <Text style={{ fontSize: 40, fontFamily: "Poppins_700Bold", color: COLORS.white }}>
                {businessName.charAt(0).toUpperCase() || "V"}
              </Text>
            </View>
            <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: COLORS.textDark, textAlign: "center" }}>
              {businessName || "Your Business"}
            </Text>
            <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textGray, marginTop: 4 }}>
              {industry || "Your Industry"}
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 20,
                paddingVertical: 12,
                paddingHorizontal: 24,
                backgroundColor: COLORS.white,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: COLORS.primary,
              }}
              onPress={() => alert("Downloading Logo...")}
            >
              <Text style={{ color: COLORS.primary, fontFamily: "Poppins_600SemiBold" }}>
                Download High Quality
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      {!generatedLogo && !isGenerating && (
        <View
          style={{
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            backgroundColor: COLORS.white,
          }}
        >
          <TouchableOpacity
            onPress={handleGenerate}
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Ionicons name="sparkles" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
            <Text
              style={{
                color: COLORS.white,
                fontSize: 16,
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              Generate with AI
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
