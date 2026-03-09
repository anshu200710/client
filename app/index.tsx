import React, { useState, useRef, useEffect } from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image } from "react-native";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    image: "https://picsum.photos/seed/slide1/800/800",
    badges: ["RBI Registered", "2 Cr+ Users"],
    text: (
      <Text className="text-[26px] text-center text-gray-800 leading-[40px] px-2" style={{ fontFamily: "SpaceGrotesk-Regular" }}>
        Over <Text className="font-bold">68%</Text> of our users have earned more than <Text className="font-bold">20% p.a.</Text>
      </Text>
    ),
  },
  {
    id: "2",
    image: "https://picsum.photos/seed/slide2/800/800",
    badges: ["100% Safe", "Daily Interest"],
    text: (
      <Text className="text-[26px] text-center text-gray-800 leading-[40px] px-2">
        Join <Text className="font-bold">2 Cr+</Text> users who already trust <Text className="font-bold">our platform</Text>
      </Text>
    ),
  },
  {
    id: "3",
    image: "https://picsum.photos/seed/slide3/800/800",
    badges: ["Secure", "Regulated"],
    text: (
      <Text className="text-[26px] text-center text-gray-800 leading-[40px] px-2">
        Get <Text className="font-bold">Daily</Text> interest credited directly to your <Text className="font-bold">Account</Text>
      </Text>
    ),
  },
  {
    id: "4",
    image: "https://picsum.photos/seed/slide4/800/800",
    badges: ["Fast KYC", "Zero Fees"],
    text: (
      <Text className="text-[26px] text-center text-gray-800 leading-[40px] px-2">
        Safe & <Text className="font-bold">Secure</Text> platform regulated by <Text className="font-bold">RBI</Text>
      </Text>
    ),
  }
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= SLIDES.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const onScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    // Be careful with updating state rapidly onScroll, only update if changed
    if (index !== currentIndex && index >= 0 && index < SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  const getItemLayout = (_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const onScrollToIndexFailed = (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    });
  };

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    return (
      <View style={{ width }} className="items-center px-6 pt-4">
        {/* Decorative Top Area / Placeholder for custom image */}
        <View className="w-full h-[40vh] items-center justify-end mb-8">
          <Image
            source={{ uri: item.image }}
            style={{ width: width * 0.75, height: width * 0.75, borderRadius: 24 }}
            resizeMode="cover"
            className="bg-gray-100"
          />
        </View>

        {/* Badges */}
        <View className="flex-row gap-3 mb-6">
          {item.badges.map((badge, idx) => (
            <View key={idx} className="bg-[#B9E910] px-4 py-2 rounded-lg">
              <Text className="text-[#333333] text-sm" style={{ fontWeight: '500' }}>{badge}</Text>
            </View>
          ))}
        </View>

        {/* Dynamic Title */}
        <View className="w-full px-2">
          {item.text}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 pb-6 pt-4">

        {/* Carousel */}
        <View className="flex-1">
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
            onScrollToIndexFailed={onScrollToIndexFailed}
          />
        </View>

        {/* Pagination Dots */}
        <View className="flex-row justify-center items-center h-8 mb-4 gap-2">
          {SLIDES.map((_, index) => (
            <View
              key={index}
              className={`h-[10px] rounded-full mx-1 ${currentIndex === index ? "w-[10px] bg-primary" : "w-[10px] bg-gray-300"
                }`}
            />
          ))}
        </View>

        {/* Bottom Actions */}
        <View className="px-6 space-y-4 pb-4">
          <TouchableOpacity
            onPress={() => router.push("/signup")}
            className="w-full py-4 rounded-xl items-center justify-center mb-4 bg-primary"
          >
            <Text className="text-white text-[17px]" style={{ fontWeight: '600' }}>
              Create an Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")} className="items-center py-2">
            <Text className="text-[16px] text-gray-500">
              Have an account? <Text className="text-primary" style={{ fontWeight: '600' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
