import { Stack, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#0066CC", // Royal Blue
  secondary: "#FF9900", // Saffron
  background: "#FFF", // White
  white: "#FFFFFF",
  success: "#28A745",
  textDark: "#1A1A1A",
  textLight: "#666666",
};

const FONTS = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semiBold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extraBold: "PlusJakartaSans_800ExtraBold",
};

const SLIDES = [
  {
    id: "1",
    image: require("../assets/images/1.jpeg"),
    title: "Trusted by Entrepreneurs Across India",
    description: "Professional support for company registration, GST, and trademark.",
  },
  {
    id: "2",
    image: require("../assets/images/splash2.avif"),
    title: "Secure Payments. Complete Transparency.",
    description: "Pay online with confidence and receive official filing proof.",
  },
  {
    id: "3",
    image: require("../assets/images/splash3.png"),
    title: "Your Business Partner for Growth",
    description: "Compliance, funding, and advisory — all on one platform.",
  },
];

const TRUST_ELEMENTS = [
  { icon: "shield-checkmark-outline", text: "Secure Payments" },
  { icon: "people-outline", text: "Verified Experts" },
  { icon: "pricetag-outline", text: "Transparent Pricing" },
  { icon: "headset-outline", text: "Dedicated Support" },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= SLIDES.length) nextIndex = 0;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 4500);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const onScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);

    if (index !== currentIndex && index >= 0 && index < SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  const getItemLayout = (_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const renderItem = ({ item }: any) => {
    return (
      <View style={{ width, paddingHorizontal: 24, alignItems: "center" }}>
        {/* Illustration */}
        <View style={{ height: width * 0.7, justifyContent: "center", marginBottom: 20 }}>
          <Image
            source={item.image}
            resizeMode="contain"
            style={{
              width: width * 0.8,
              height: width * 0.6,
            }}
          />
        </View>

        {/* Title */}
        <Text style={{
          color: COLORS.primary,
          fontSize: 26,
          fontFamily: FONTS.bold,
          textAlign: "center",
          lineHeight: 32
        }}>
          {item.title}
        </Text>

        {/* Description */}
        <Text style={{
          color: COLORS.textLight,
          fontSize: 16,
          textAlign: "center",
          marginTop: 12,
          lineHeight: 24,
          paddingHorizontal: 10,
          fontFamily: FONTS.medium
        }}>
          {item.description}
        </Text>

        {/* Trust Elements Grid */}
        <View style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: 24,
          gap: 12
        }}>
          {TRUST_ELEMENTS.map((trust, idx) => (
            <View key={idx} style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.white,
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1
            }}>
              <Ionicons name={trust.icon as any} size={14} color={COLORS.success} />
              <Text style={{
                color: COLORS.textDark,
                fontSize: 11,
                marginLeft: 4,
                fontFamily: FONTS.semiBold
              }}>
                {trust.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />

      {/* Header with Tagline */}
      <View style={{ alignItems: "center", paddingTop: 20, paddingHorizontal: 30 }}>
        <Text style={{
          fontSize: 24,
          fontFamily: FONTS.extraBold,
          color: COLORS.primary
        }}>
          VYAAPAR <Text style={{ color: COLORS.secondary }}>SAATHI</Text>
        </Text>
        <Text style={{
          fontSize: 12,
          color: COLORS.textLight,
          textAlign: "center",
          marginTop: 4,
          fontStyle: "italic",
          fontFamily: FONTS.medium
        }}>
          India’s Smart Platform for Business Registration, Compliance & Funding.
        </Text>
      </View>

      {/* Skip Button */}
      {/* <TouchableOpacity
        onPress={() => router.push("/login")}
        style={{ position: "absolute", right: 24, top: 45, zIndex: 10 }}
      >
        <Text style={{ color: COLORS.textLight, fontSize: 14, fontWeight: "600" }}>Skip</Text>
      </TouchableOpacity> */}

      {/* Slides */}
      <View style={{ flex: 1, marginTop: 20 }}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          getItemLayout={getItemLayout}
        />
      </View>

      {/* Bottom Section */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        {/* Pagination */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 24, gap: 8 }}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={{
                height: 6,
                width: currentIndex === index ? 24 : 6,
                borderRadius: 3,
                backgroundColor: currentIndex === index ? COLORS.secondary : "#D1D5DB",
              }}
            />
          ))}
        </View>

        {/* Buttons */}
        <TouchableOpacity
          onPress={() => router.push("/signup")}
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: "center",
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4
          }}
        >
          <Text style={{ color: COLORS.white, fontFamily: FONTS.bold, fontSize: 16 }}>
            Create Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/login")}
          style={{ alignItems: "center", marginTop: 20 }}
        >
          <Text style={{
            color: COLORS.textLight,
            fontSize: 15,
            fontFamily: FONTS.regular
          }}>
            Already have an account?{" "}
            <Text style={{ color: COLORS.primary, fontFamily: FONTS.bold }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
