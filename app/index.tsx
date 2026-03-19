import { Stack, router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";

const DATA = [
  { id: "1", image: require("../assets/images/ca.jpg") },
  { id: "2", image: require("../assets/images/ba.jpg") },
  { id: "3", image: require("../assets/images/aa.jpg") },
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

  const Paginator = () => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {DATA.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 24, 10],
          extrapolate: "clamp",
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            key={i}
            style={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#1A3D8F",
              marginHorizontal: 5,
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
      <View style={{ width, height, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
        <Image
          source={item.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <FlatList
        data={DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        ref={slidesRef}
        scrollEventThrottle={16}
      />

      {/* Pagination & Nav Buttons Overlay */}
      <View
        style={{
          position: "absolute",
          bottom: 40,
          left: 30,
          right: 30,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <TouchableOpacity onPress={() => router.push("/(auth)/login")} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
          <Text style={{ color: "#333", fontSize: 16, fontWeight: "700" }}>Skip</Text>
        </TouchableOpacity>

        <Paginator />

        <TouchableOpacity
          onPress={handleNext}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "#1A3D8F",
            justifyContent: "center",
            alignItems: "center",
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>
            {currentIndex === DATA.length - 1 ? "✓" : "→"}
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}