import { LinearGradient } from "expo-linear-gradient";
import { Stack, router } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  FlatList,
  Animated,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#0066CC",
  accent: "#FF4B4B",       // Red for dots & button (matching reference)
  white: "#FFFFFF",
  textGray: "#6B7280",
  textDark: "#1A237E",     // Deep blue for titles
};

const FONTS = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semiBold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extraBold: "PlusJakartaSans_800ExtraBold",
};

const DATA = [
  {
    id: "1",
    title: "Empower Your Shop",
    description: "Manage sales, inventory, and customers with ease using our smart tools.",
    image: require("../assets/images/1.png"),
  },
  {
    id: "2",
    title: "Digital Payments",
    description: "Accept UPI, card, and digital payments instantly and securely.",
    image: require("../assets/images/2.png"),
  },
  {
    id: "3",
    title: "Secure Growth",
    description: "Protect your business data and watch your profits soar with confidence.",
    image: require("../assets/images/3.png"),
  },
  {
    id: "4",
    title: "Smart Analytics",
    description: "Deep insights into your business growth and trends to stay ahead.",
    image: require("../assets/images/4.png"),
  },
];

export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const scrollTo = () => {
    if (currentIndex < DATA.length - 1) {
      slidesRef.current?.scrollToOffset({
        offset: (currentIndex + 1) * width,
        animated: true
      });
    } else {
      router.push("/(auth)/signup");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < DATA.length - 1) {
        slidesRef.current?.scrollToOffset({
          offset: (currentIndex + 1) * width,
          animated: true
        });
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [currentIndex, width]);

  // Dot paginator — red accent, matches reference
  const Paginator = ({ scrollX, width }: { scrollX: any, width: number }) => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {DATA.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 20, 8],
          extrapolate: "clamp",
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.35, 1, 0.35],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            key={i.toString()}
            style={{
              height: 8,
              borderRadius: 4,
              backgroundColor: COLORS.accent,
              marginHorizontal: 3,
              width: dotWidth,
              opacity,
            }}
          />
        );
      })}
    </View>
  );

  const renderItem = React.useCallback(({ item }: { item: typeof DATA[0] }) => (
    <View style={{ width, height, backgroundColor: COLORS.white }}>
      {/* ── Hero Image section ── */}
      <View
        style={{
          height: height * 0.60,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          overflow: "hidden",
        }}
      >
        <Image
          source={item.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      {/* ── Content section ── */}
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          paddingHorizontal: 30,
          paddingTop: 28,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontFamily: FONTS.bold,
            color: COLORS.textDark,
            textAlign: "center",
            letterSpacing: 0.5,
            marginBottom: 10,
          }}
        >
          {item.title}
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontFamily: FONTS.regular,
            color: COLORS.textGray,
            textAlign: "center",
            lineHeight: 22,
          }}
        >
          {item.description}
        </Text>
      </View>
    </View>
  ), [width, height]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />


      {/* Slides */}
      <FlatList
        data={DATA}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        scrollEventThrottle={16}
      />

      {/* Fixed Paginator */}
      <View style={{ position: "absolute", bottom: height * 0.15, width: "100%", alignItems: "center" }}>
        <Paginator scrollX={scrollX} width={width} />
      </View>

      {/* ── Bottom Bar: Skip (left) — Arrow button (right) ── */}
      <View
        style={{
          position: "absolute",
          bottom: height * 0.04,
          left: 30,
          right: 30,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {/* Skip to Login */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text
            style={{
              fontSize: 15,
              fontFamily: FONTS.semiBold,
              color: COLORS.textGray,
            }}
          >
            Skip
          </Text>
        </TouchableOpacity>

        {/* Red circular arrow / checkmark button */}
        <TouchableOpacity
          onPress={scrollTo}
          activeOpacity={0.85}
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: COLORS.accent,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: COLORS.accent,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 22,
              fontFamily: FONTS.bold,
              marginLeft: currentIndex === DATA.length - 1 ? 0 : 2,
            }}
          >
            {currentIndex === DATA.length - 1 ? "✓" : "→"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}