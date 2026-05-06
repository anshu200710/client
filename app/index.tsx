import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const DATA = [
  {
    id: "1",
    image: require("../assets/images/spl1.png"),
    title: "Start Your Business\nin Minutes",
    subtitle: "GST • MSME • Startup Registration • 100% Online Compliance",
    buttonText: "Next Step",
    accentColor: "#4F46E5",
  },
  {
    id: "2",
    image: require("../assets/images/spl2.png"),
    title: "All Your Compliance\nin One Place",
    subtitle: "ISO • FSSAI • Licenses • Dedicated Legal Support for Growth",
    buttonText: "Continue",
    accentColor: "#10B981",
  },
  {
    id: "3",
    image: require("../assets/images/spl3.png"),
    title: "Powerful Business Tools\nAbsolutely Free",
    subtitle: "GST Calculator • Trademark Search • 50+ Ready Agreements",
    buttonText: "Get Started",
    accentColor: "#6366F1",
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const introOpacity = useRef(new Animated.Value(1)).current;
  const introScale = useRef(new Animated.Value(1.1)).current;

  useEffect(() => {
    if (!showIntro) return;
    
    // Smooth fade out for intro
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(introOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(introScale, {
          toValue: 0.9,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => setShowIntro(false));
    }, 2500);

    return () => clearTimeout(timer);
  }, [showIntro]);

  const handleNext = () => {
    if (currentIndex < DATA.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
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
    <View className="flex-row items-center justify-center mt-6">
      {DATA.map((_, i) => {
        const isActive = i === currentIndex;
        return (
          <View
            key={i}
            style={{
              height: 6,
              width: isActive ? 24 : 6,
              borderRadius: 3,
              backgroundColor: isActive ? DATA[currentIndex].accentColor : "rgba(0,0,0,0.1)",
              marginHorizontal: 3,
            }}
          />
        );
      })}
    </View>
  );

  if (showIntro) {
    return (
      <Animated.View 
        style={{ 
          flex: 1, 
          backgroundColor: "#FFFFFF", 
          justifyContent: "center", 
          alignItems: "center",
          opacity: introOpacity,
          transform: [{ scale: introScale }]
        }}
      >
        <StatusBar barStyle="dark-content" />
        <Image
          source={require("../assets/images/animate.gif")}
          style={{ width: width * 0.8, height: width * 0.8 }}
          resizeMode="contain"
        />
      </Animated.View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={["#EEF2FF", "#F0FDFA"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <FlatList
        ref={slidesRef}
        data={DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width, height, paddingHorizontal: 24, paddingTop: insets.top + 40 }}>
            <View className="items-center justify-center flex-1">
              <View 
                style={{ 
                  width: width - 48, 
                  height: height * 0.45, 
                  borderRadius: 32, 
                  overflow: 'hidden',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.1,
                  shadowRadius: 24,
                  elevation: 10,
                }}
              >
                <Image
                  source={item.image}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>

              <View style={{ marginTop: 40, alignItems: 'center' }}>
                <Text 
                  style={{ 
                    fontSize: 32, 
                    fontFamily: "PlusJakartaSans_800ExtraBold", 
                    color: "#0F172A", 
                    textAlign: 'center',
                    lineHeight: 40,
                  }}
                >
                  {item.title}
                </Text>
                <Text 
                  style={{ 
                    fontSize: 16, 
                    fontFamily: "PlusJakartaSans_500Medium", 
                    color: "#64748B", 
                    textAlign: 'center', 
                    marginTop: 16,
                    lineHeight: 24,
                    paddingHorizontal: 20
                  }}
                >
                  {item.subtitle}
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      <View style={{ paddingBottom: insets.bottom + 40, paddingHorizontal: 24 }}>
        <Paginator />
        
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.8}
          style={{
            marginTop: 40,
            height: 60,
            borderRadius: 20,
            backgroundColor: DATA[currentIndex].accentColor,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: DATA[currentIndex].accentColor,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 18, fontFamily: "PlusJakartaSans_700Bold" }}>
            {DATA[currentIndex].buttonText}
          </Text>
        </TouchableOpacity>
        
        {currentIndex === 0 && (
          <TouchableOpacity 
            onPress={() => router.push("/(auth)/login")}
            style={{ marginTop: 20, alignItems: 'center' }}
          >
            <Text style={{ color: "#94A3B8", fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold" }}>
              Skip onboarding
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}


