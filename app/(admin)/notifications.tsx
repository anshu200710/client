import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#1E4FA3",
  primaryLight: "#E5F0FF",
  primaryHover: "#2B5AFF",
  secondary: "#2ECC71",
  success: "#22c55e",
  successLight: "#DCFCE7",
  alertRed: "#ef4444",
  alertRedLight: "#FEE2E2",
  alertAmber: "#F59E0B",
  alertAmberLight: "#FEF3C7",
  infoBlue: "#0C8CE9",
  infoBlueBg: "#E0F2FE",
  lightGrey: "#F8FAFC",
  lightGrey2: "#F1F5F9",
  white: "#FFFFFF",
  textDark: "#0F172A",
  textGray: "#64748B",
  textLight: "#94A3B8",
  border: "#E2E8F0",

  // Segment colors
  segmentActiveBg: "#0C8CE9",
  segmentActiveBadge: "#3B9DEF",

  // Avatar colors
  avatarBlueText: "#2563EB",
  avatarBlueBg: "#DBEAFE",
  avatarPurpleText: "#9333EA",
  avatarPurpleBg: "#F3E8FF",
  avatarOrangeText: "#EA580C",
  avatarOrangeBg: "#FFEDD5",
  avatarGreenText: "#059669",
  avatarGreenBg: "#D1FAE5",
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSegment, setActiveSegment] = useState("All");

  const SegmentButton = ({ label, count, isActive }: any) => (
    <TouchableOpacity
      onPress={() => setActiveSegment(label)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: isActive ? COLORS.segmentActiveBg : COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 50,
        borderWidth: isActive ? 0 : 1,
        borderColor: COLORS.border,
        marginRight: 10,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontFamily: isActive ? "Poppins_600SemiBold" : "Poppins_500Medium",
          color: isActive ? COLORS.white : COLORS.textGray,
          marginRight: 6,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          backgroundColor: isActive
            ? COLORS.segmentActiveBadge
            : COLORS.lightGrey2,
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Poppins_600SemiBold",
            color: isActive ? COLORS.white : COLORS.textLight,
          }}
        >
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const NotificationItem = ({
    type = "text",
    initial,
    avatarBg,
    avatarColor,
    isRead,
    userName,
    userEmail,
    notificationTitle,
    notificationMessage,
    time,
    notificationType = "info",
    onPress,
  }: any) => {
    // Determine notification color based on type
    const getNotificationColor = () => {
      switch (notificationType) {
        case "success":
          return {
            icon: "checkmark-circle",
            color: COLORS.success,
            bg: COLORS.successLight,
          };
        case "warning":
          return {
            icon: "alert-circle",
            color: COLORS.alertAmber,
            bg: COLORS.alertAmberLight,
          };
        case "error":
          return {
            icon: "close-circle",
            color: COLORS.alertRed,
            bg: COLORS.alertRedLight,
          };
        default:
          return {
            icon: "information-circle",
            color: COLORS.infoBlue,
            bg: COLORS.infoBlueBg,
          };
      }
    };

    const notifColor = getNotificationColor();

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          backgroundColor: isRead ? COLORS.white : COLORS.infoBlueBg,
          padding: 16,
          borderRadius: 16,
          marginBottom: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.03,
          shadowRadius: 6,
          elevation: 2,
          borderWidth: 1,
          borderColor: isRead
            ? "rgba(226, 232, 240, 0.4)"
            : COLORS.infoBlue + "30",
        }}
      >
        {/* User Avatar */}
        <View style={{ marginRight: 12, marginTop: 4 }}>
          {type === "text" ? (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: avatarBg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins_600SemiBold",
                  color: avatarColor,
                }}
              >
                {initial}
              </Text>
            </View>
          ) : (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: COLORS.lightGrey2,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Ionicons name="person" size={28} color={COLORS.textLight} />
            </View>
          )}
        </View>

        {/* Notification Content */}
        <View style={{ flex: 1 }}>
          {/* User Name and Email */}
          <View style={{ marginBottom: 8 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.textDark,
                marginBottom: 2,
              }}
            >
              {userName}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: COLORS.textGray,
              }}
            >
              {userEmail}
            </Text>
          </View>

          {/* Notification Title and Message */}
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.textDark,
                marginBottom: 4,
              }}
            >
              {notificationTitle}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: COLORS.textGray,
                lineHeight: 18,
              }}
              numberOfLines={2}
            >
              {notificationMessage}
            </Text>
          </View>

          {/* Status and Time */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: notifColor.bg,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name={notifColor.icon as any}
                  size={12}
                  color={notifColor.color}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Poppins_600SemiBold",
                    color: notifColor.color,
                    textTransform: "capitalize",
                  }}
                >
                  {notificationType}
                </Text>
              </View>
              {!isRead && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: COLORS.infoBlue,
                    marginLeft: 8,
                  }}
                />
              )}
            </View>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Poppins_400Regular",
                color: COLORS.textLight,
              }}
            >
              {time}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={{ paddingLeft: 12, justifyContent: "center" }}>
          <Ionicons name="chevron-forward" size={20} color={COLORS.border} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGrey }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Fixed */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={28} color={COLORS.textGray} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            fontFamily: "Poppins_600SemiBold",
            color: COLORS.textDark,
            flex: 1,
            textAlign: "center",
          }}
        >
          Notifications
        </Text>

        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: COLORS.primaryLight,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="trash-outline"
            size={22}
            color={COLORS.primaryHover}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Search */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.white,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 1,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Ionicons
              name="search"
              size={20}
              color={COLORS.textLight}
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Search by user name..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: COLORS.textDark,
                outlineStyle: "none" as any,
              }}
            />
          </View>
        </View>

        {/* Segments */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        >
          <SegmentButton
            label="All"
            count="24"
            isActive={activeSegment === "All"}
          />
          <SegmentButton
            label="Unread"
            count="8"
            isActive={activeSegment === "Unread"}
          />
          <SegmentButton
            label="Read"
            count="16"
            isActive={activeSegment === "Read"}
          />
          <SegmentButton
            label="Success"
            count="5"
            isActive={activeSegment === "Success"}
          />
        </ScrollView>

        {/* Unread Notifications Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textLight,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            UNREAD NOTIFICATIONS
          </Text>

          <NotificationItem
            type="text"
            initial="RK"
            avatarBg={COLORS.avatarBlueBg}
            avatarColor={COLORS.avatarBlueText}
            isRead={false}
            userName="Rajesh Kumar"
            userEmail="rajesh.k@vyaapar.in"
            notificationTitle="New Service Request"
            notificationMessage="A new GST invoice request was submitted. Tap to review request details."
            time="2m ago"
            notificationType="info"
            onPress={() => router.push("/requests/req_1")}
          />

          <NotificationItem
            type="text"
            initial="AS"
            avatarBg={COLORS.avatarPurpleBg}
            avatarColor={COLORS.avatarPurpleText}
            isRead={false}
            userName="Anita Sharma"
            userEmail="anita.sharma@gmail.com"
            notificationTitle="Account Verification"
            notificationMessage="Document verification completed successfully. User account is now fully activated."
            time="15m ago"
            notificationType="success"
          />

          <NotificationItem
            type="text"
            initial="VK"
            avatarBg={COLORS.avatarOrangeBg}
            avatarColor={COLORS.avatarOrangeText}
            isRead={false}
            userName="Vikram Kohli"
            userEmail="vikram.kohli88@yahoo.com"
            notificationTitle="Account Suspended"
            notificationMessage="User account has been suspended due to policy violation. Review the case and take action."
            time="1h ago"
            notificationType="error"
          />

          <NotificationItem
            type="text"
            initial="SM"
            avatarBg={COLORS.avatarGreenBg}
            avatarColor={COLORS.avatarGreenText}
            isRead={false}
            userName="Sunita Mehra"
            userEmail="s.mehra@boutique.com"
            notificationTitle="Payment Issue"
            notificationMessage="Payment failed for service delivery. User needs assistance to process the transaction."
            time="3h ago"
            notificationType="warning"
          />
        </View>

        {/* Read Notifications Section */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textLight,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            READ NOTIFICATIONS
          </Text>

          <NotificationItem
            type="image"
            isRead={true}
            userName="Priya Desai"
            userEmail="priya.d@fashionhub.co.in"
            notificationTitle="Profile Update"
            notificationMessage="User profile information was successfully updated."
            time="1d ago"
            notificationType="success"
          />

          <NotificationItem
            type="text"
            initial="AK"
            avatarBg={COLORS.avatarBlueBg}
            avatarColor={COLORS.avatarBlueText}
            isRead={true}
            userName="Amit Kapoor"
            userEmail="amit.k@tradecorp.in"
            notificationTitle="Service Completed"
            notificationMessage="The trademark search service was completed and delivered successfully."
            time="2d ago"
            notificationType="success"
          />

          <NotificationItem
            type="text"
            initial="NK"
            avatarBg={COLORS.avatarPurpleBg}
            avatarColor={COLORS.avatarPurpleText}
            isRead={true}
            userName="Neha Kapoor"
            userEmail="neha.kapoor@skills.com"
            notificationTitle="Account Created"
            notificationMessage="New business account was registered in the system."
            time="3d ago"
            notificationType="info"
          />

          <NotificationItem
            type="text"
            initial="RJ"
            avatarBg={COLORS.avatarOrangeBg}
            avatarColor={COLORS.avatarOrangeText}
            isRead={true}
            userName="Raj Joshi"
            userEmail="raj.joshi@solutions.co"
            notificationTitle="Refund Processed"
            notificationMessage="User refund of ₹2,500 has been processed successfully."
            time="4d ago"
            notificationType="success"
          />

          <NotificationItem
            type="text"
            initial="PC"
            avatarBg={COLORS.avatarGreenBg}
            avatarColor={COLORS.avatarGreenText}
            isRead={true}
            userName="Pooja Chauhan"
            userEmail="pooja.c@business.in"
            notificationTitle="Service Rating"
            notificationMessage="User gave 5-star rating for GST consultation service."
            time="5d ago"
            notificationType="success"
          />
        </View>

        {/* Placeholder Loader */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, opacity: 0.5 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: COLORS.border,
                marginRight: 12,
              }}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  height: 12,
                  width: 120,
                  backgroundColor: COLORS.border,
                  borderRadius: 6,
                  marginBottom: 8,
                }}
              />
              <View
                style={{
                  height: 10,
                  width: 180,
                  backgroundColor: COLORS.border,
                  borderRadius: 5,
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
