import { LinearGradient } from "expo-linear-gradient";
import { Stack, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const DATA = [
  {
    id: "1",
    image: require("../assets/images/spl1.png"),
    title: "Start Your Business in Minutes- No Office Visit Required",
    subtitle: "GST • MSME • Startup Registration • 100% Online",
    buttonText: "Next",
    bgColor1: "#4A90E2",
    bgColor2: "#5BA3F5",
    accentColor: "#4A90E2",
  },
  {
    id: "2",
    image: require("../assets/images/spl2.png"),
    title: "All Your Compliance in One Place",
    subtitle: "ISO • FSSAI • Licenses • Legal Support",
    buttonText: "Next",
    bgColor1: "#27AE60",
    bgColor2: "#2ECC71",
    accentColor: "#27AE60",
  },
  {
    id: "3",
    image: require("../assets/images/spl3.png"),
    title: "Powerful Business Tools — Absolutely Free",
    subtitle: "GST Calculator • Trademark Search • 50+ Ready Agreements & More",
    buttonText: "Get Started",
    bgColor1: "#E67E22",
    bgColor2: "#F39C12",
    accentColor: "#E67E22",
  },
];

export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  // ── Logo Animation Values ──
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const nameTranslateY = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(15)).current;
  const introOverallOpacity = useRef(new Animated.Value(1)).current;

  // ── Intro Animation Sequence ──
  useEffect(() => {
    if (!showIntro) return;

    Animated.sequence([
      // 1. Logo scales up + fades in (0–600ms)
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // 2. Brief pause
      Animated.delay(200),
      // 3. App name slides up + fades in (600–1000ms)
      Animated.parallel([
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(nameTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // 4. Tagline slides up + fades in
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslateY, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      // 5. Hold for a moment
      Animated.delay(800),
      // 6. Fade out entire intro
      Animated.timing(introOverallOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowIntro(false);
    });
  }, [showIntro]);

  // ── Auto-scroll for onboarding ──
  useEffect(() => {
    if (showIntro) return;
    const timer = setInterval(() => {
      if (currentIndex < DATA.length - 1) {
        slidesRef.current?.scrollToOffset({
          offset: (currentIndex + 1) * width,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex, width, showIntro]);

  const handleNext = () => {
    if (currentIndex < DATA.length - 1) {
      slidesRef.current?.scrollToOffset({
        offset: (currentIndex + 1) * width,
        animated: true,
      });
    } else {
      router.push("/(auth)/login");
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const Paginator = () => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {DATA.map((_, i) => {
        const isActive = i === currentIndex;
        const dotWidth = isActive ? 24 : 8;
        const opacity = isActive ? 1 : 0.4;
        return (
          <Animated.View
            key={i}
            style={{
              height: 8,
              borderRadius: 4,
              backgroundColor: DATA[currentIndex]?.accentColor || "#fff",
              marginHorizontal: 4,
              width: dotWidth,
              opacity,
            }}
          />
        );
      })}
    </View>
  );

  const renderItem = ({ item }: any) => {
    return (
      <View
        style={{
          width,
          height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "88%",
            maxWidth: 450,
            borderRadius: 28,
            backgroundColor: "rgba(255,255,255,0.95)",
            padding: 24,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Image
            source={item.image}
            style={{
              width: "100%",
              height: 260,
              borderRadius: 20,
              marginBottom: 24,
            }}
            resizeMode="cover"
          />

          <Text
            style={{
              fontSize: 26,
              fontFamily: "Poppins_700Bold",
              color: "#2D3436",
              textAlign: "center",
              marginBottom: 10,
              lineHeight: 34,
            }}
          >
            {item.title}
          </Text>

          <Text
            style={{
              fontSize: 15,
              fontFamily: "Poppins_500Medium",
              color: "#6C7A89",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            {item.subtitle}
          </Text>

          <Paginator />

          <TouchableOpacity
            onPress={handleNext}
            style={{
              marginTop: 20,
              width: "100%",
              borderRadius: 16,
              backgroundColor: item.accentColor,
              paddingVertical: 15,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontFamily: "Poppins_600SemiBold",
                textAlign: "center",
              }}
            >
              {item.buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const currentBgColor1 = DATA[currentIndex]?.bgColor1 || "#4A90E2";
  const currentBgColor2 = DATA[currentIndex]?.bgColor2 || "#5BA3F5";

  // ── LOGO INTRO SCREEN ──
  if (showIntro) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" }}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <Animated.View style={{ opacity: introOverallOpacity }}>
          <Image
            source={require("../assets/images/animate.gif")}
            style={{ width: 500, height: 500 }}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    );
  }

  // ── ONBOARDING SCREEN ──
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <LinearGradient
        colors={[currentBgColor1, currentBgColor2]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View
        style={{
          position: "absolute",
          top: 40,
          left: 20,
          right: 20,
          zIndex: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        
      </View>

      <Animated.FlatList
        ref={slidesRef}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
}

