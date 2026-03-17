import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Adding specific colors matching the user's provided screenshot
const COLORS = {
  primary: "#14C8EB", // Bright Cyan
  primaryLight: "#DDF5F8", // Light Cyan background for dashed box
  white: "#FFFFFF",
  textDark: "#1E293B",
  textGray: "#64748B",
  textLight: "#94A3B8",
  border: "#E2E8F0",
  lightGrey: "#F8FAFC",

  // Specific image colors
  toggleActiveBg: "#14C8EB",
  toggleInactiveBg: "#E2E8F0",
  cyanBorder: "#B9E8EF",
};

export default function CreateOfferScreen() {
  const router = useRouter();
  const [offerName, setOfferName] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [value, setValue] = useState("");
  const [expiry, setExpiry] = useState("");

  const [toggles, setToggles] = useState({
    offer1: true,
    offer2: true,
    offer3: false,
  });

  const toggleSwitch = (id: string) => {
    setToggles((prev: any) => ({ ...prev, [id]: !prev[id] }));
  };

  const InputField = ({ label, icon, placeholder, value, onChangeText, isValueField }: any) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 11, fontFamily: "Poppins_600SemiBold", color: COLORS.textGray, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.border }}>
        {icon && !isValueField && <Ionicons name={icon} size={18} color={COLORS.primary} style={{ marginRight: 10 }} />}
        {isValueField && <Text style={{ color: COLORS.primary, fontSize: 18, marginRight: 8 }}>%</Text>}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
          style={{ flex: 1, fontSize: 14, fontFamily: "Poppins_400Regular", color: COLORS.textDark, outlineStyle: "none" as any }}
        />
        {isValueField && (
           <View style={{ backgroundColor: COLORS.primary, borderRadius: 4, width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
             <Text style={{ color: COLORS.white, fontSize: 14, fontFamily: "Poppins_700Bold" }}>%</Text>
           </View>
        )}
      </View>
    </View>
  );

  const ExistingOfferItem = ({ id, title, code, expiryText, noExpiry, isInactive, bgImageColor }: any) => (
    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 }}>
      
      {/* Thumbnail Mock */}
      <View style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: bgImageColor, alignItems: "center", justifyContent: "center", marginRight: 14, opacity: isInactive ? 0.5 : 1 }}>
         <Text style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Poppins_600SemiBold", fontSize: 14, fontStyle: "italic" }}>Offer</Text>
      </View>
      
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: isInactive ? COLORS.textLight : COLORS.textDark, marginBottom: 4 }}>{title}</Text>
        <Text style={{ fontSize: 12, fontFamily: "Poppins_500Medium", color: COLORS.primary, marginBottom: 6 }}>{code}</Text>
        <View style={{ backgroundColor: COLORS.lightGrey, alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
            <Text style={{ fontSize: 10, fontFamily: "Poppins_500Medium", color: COLORS.textGray }}>{noExpiry ? "No Expiry" : `Expires: ${expiryText}`}</Text>
        </View>
      </View>
      
      <View style={{ alignItems: "flex-end", justifyContent: "space-between", height: 64 }}>
         <Switch
            trackColor={{ false: COLORS.toggleInactiveBg, true: COLORS.toggleActiveBg }}
            thumbColor={COLORS.white}
            ios_backgroundColor={COLORS.toggleInactiveBg}
            onValueChange={() => toggleSwitch(id)}
            value={(toggles as any)[id]}
            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
          />
          <TouchableOpacity style={{ padding: 4 }}>
             <Ionicons name="trash-outline" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header Fixed */}
      <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.white, zIndex: 10 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textGray} />
        </TouchableOpacity>
        
        <Text style={{ fontSize: 18, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, flex: 1, textAlign: "center", marginRight: -12 }}>
            Create Offer
        </Text>

        <TouchableOpacity style={{ padding: 4 }}>
            <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: COLORS.primary }}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24, paddingBottom: 120 }}>
        
        {/* Upload Banner */}
        <TouchableOpacity style={{
            height: 140,
            backgroundColor: COLORS.primaryLight,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: COLORS.cyanBorder,
            borderStyle: "dashed",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
        }}>
            <Ionicons name="image" size={32} color={COLORS.primary} style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: COLORS.textDark, marginBottom: 4 }}>Upload Banner</Text>
            <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: COLORS.textGray }}>PNG, JPG up to 5MB</Text>
        </TouchableOpacity>

        {/* Inputs */}
        <InputField 
            label="Offer Name" 
            icon="pricetag" 
            placeholder="e.g. Summer Sale Bonanza"
            value={offerName}
            onChangeText={setOfferName}
        />
        
        <InputField 
            label="Discount Code" 
            icon="grid" 
            placeholder="E.G. SUMMER2024"
            value={discountCode}
            onChangeText={setDiscountCode}
        />

        <View style={{ flexDirection: "row", gap: 16, marginBottom: 24 }}>
             <View style={{ flex: 1 }}>
                <InputField 
                    label="Value" 
                    placeholder="25"
                    value={value}
                    onChangeText={setValue}
                    isValueField={true}
                />
             </View>
             <View style={{ flex: 1.3 }}>
                 <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 11, fontFamily: "Poppins_600SemiBold", color: COLORS.textGray, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Expiry Date
                    </Text>
                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.border }}>
                         <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: COLORS.textDark }}>mm/dd/yyyy</Text>
                         </View>
                         <Ionicons name="calendar" size={18} color={COLORS.textDark} />
                    </TouchableOpacity>
                 </View>
             </View>
        </View>

        {/* Publish Button */}
        <TouchableOpacity style={{
            backgroundColor: COLORS.primary,
            borderRadius: 12,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        }}>
            <Text style={{ color: COLORS.white, fontSize: 16, fontFamily: "Poppins_700Bold", marginRight: 8 }}>
                Publish Offer
            </Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>


        {/* Divider */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            <Text style={{ marginHorizontal: 16, fontSize: 11, fontFamily: "Poppins_600SemiBold", color: COLORS.textGray, letterSpacing: 0.5 }}>
                MANAGE EXISTING
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
        </View>

        {/* Manage Existing List */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold", color: COLORS.textDark }}>Active Offers</Text>
            <View style={{ backgroundColor: COLORS.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50 }}>
                <Text style={{ fontSize: 11, fontFamily: "Poppins_600SemiBold", color: COLORS.primary }}>3 Active</Text>
            </View>
        </View>

        <ExistingOfferItem 
            id="offer1"
            title="Monsoon Mega Sale"
            code="MONSOON50"
            expiryText="24 Oct"
            noExpiry={false}
            bgImageColor="#DB7E4E" // Orange mock
        />
        
        <ExistingOfferItem 
            id="offer2"
            title="New User Bonus"
            code="WELCOME10"
            noExpiry={true}
            bgImageColor="#D3A273" // Tan mock
        />
        
        <ExistingOfferItem 
            id="offer3"
            title="Flash Deal Friday"
            code="FLASH50"
            expiryText="10 Aug"
            noExpiry={false}
            isInactive={true}
            bgImageColor="#CFD4D9" // Gray mockup
        />

      </ScrollView>
    </SafeAreaView>
  );
}
