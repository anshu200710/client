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
  actionBlueBg: "#EFF6FF",
  actionBlueIcon: "#2563EB",
};

export default function VisitingCardGeneratorScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState(false);

  const handleGenerate = () => {
    if (!name || !phone) {
      alert("Please enter Name and Phone number at least.");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedCard(true);
    }, 2000);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Visiting Card",
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
            backgroundColor: COLORS.actionBlueBg,
            borderRadius: 20,
          }}
        >
          <Ionicons
            name="id-card"
            size={48}
            color={COLORS.actionBlueIcon}
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
            Smart Card Generator
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
            Fill in your details and let AI design a modern layout for your visiting card.
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, marginBottom: 8 }}>
              Full Name *
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. John Doe"
              placeholderTextColor={COLORS.textLight}
              style={{
                borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, fontFamily: "Poppins_400Regular", color: COLORS.textDark, marginBottom: 16,
              }}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, marginBottom: 8 }}>
              Designation
            </Text>
            <TextInput
              value={designation}
              onChangeText={setDesignation}
              placeholder="e.g. CEO / Founder"
              placeholderTextColor={COLORS.textLight}
              style={{
                borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, fontFamily: "Poppins_400Regular", color: COLORS.textDark, marginBottom: 16,
              }}
            />
          </View>
        </View>

        <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, marginBottom: 8 }}>
          Phone Number *
        </Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="+91 98765 43210"
          keyboardType="phone-pad"
          placeholderTextColor={COLORS.textLight}
          style={{
            borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, fontFamily: "Poppins_400Regular", color: COLORS.textDark, marginBottom: 16,
          }}
        />

        <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, marginBottom: 8 }}>
          Email Address
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="contact@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={COLORS.textLight}
          style={{
            borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, fontFamily: "Poppins_400Regular", color: COLORS.textDark, marginBottom: 16,
          }}
        />

        <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, marginBottom: 8 }}>
          Website / Portfolio
        </Text>
        <TextInput
          value={website}
          onChangeText={setWebsite}
          placeholder="www.yourwebsite.com"
          autoCapitalize="none"
          placeholderTextColor={COLORS.textLight}
          style={{
            borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, fontFamily: "Poppins_400Regular", color: COLORS.textDark, marginBottom: 32,
          }}
        />

        {isGenerating ? (
          <View style={{ alignItems: "center", padding: 20 }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ marginTop: 12, fontFamily: "Poppins_500Medium", color: COLORS.textGray }}>
              Designing layout...
            </Text>
          </View>
        ) : generatedCard ? (
          <View>
            <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginBottom: 16 }}>
              Your Generated Layout
            </Text>
            <View
              style={{
                backgroundColor: "#111827",
                borderRadius: 16,
                padding: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 10,
                position: "relative",
                overflow: "hidden"
              }}
            >
              <View style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.05)" }} />
              
              <Text style={{ fontSize: 24, fontFamily: "Poppins_700Bold", color: COLORS.white, marginBottom: 4 }}>
                {name || "John Doe"}
              </Text>
              <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: "#9CA3AF", marginBottom: 32 }}>
                {designation || "Professional"}
              </Text>
              
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <Ionicons name="call" size={16} color={COLORS.white} style={{ marginRight: 12, opacity: 0.7 }} />
                <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.white }}>{phone || "Not provided"}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <Ionicons name="mail" size={16} color={COLORS.white} style={{ marginRight: 12, opacity: 0.7 }} />
                <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.white }}>{email || "Not provided"}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="globe" size={16} color={COLORS.white} style={{ marginRight: 12, opacity: 0.7 }} />
                <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.white }}>{website || "Not provided"}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={{
                marginTop: 24,
                paddingVertical: 14,
                backgroundColor: COLORS.white,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: COLORS.border,
                alignItems: "center"
              }}
              onPress={() => alert("Card saved to gallery!")}
            >
              <Text style={{ color: COLORS.textDark, fontFamily: "Poppins_600SemiBold" }}>
                Save as Image
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      {!generatedCard && !isGenerating && (
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
            <Ionicons name="color-wand" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
            <Text
              style={{
                color: COLORS.white,
                fontSize: 16,
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              Generate Design
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
