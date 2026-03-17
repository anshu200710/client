import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

const COLORS = {
  primary: "#1E4FA3",
  secondary: "#2ECC71",
  success: "#22c55e",
  alertRed: "#ef4444",
  alertAmber: "#FFC107",
  lightGrey: "#F5F7FB",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textGray: "#666666",
  textLight: "#9FA3B1",
  border: "#E4E7EF",
};

type ChatMessage = {
  id: string;
  from: "user" | "admin";
  text: string;
  time: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    from: "admin",
    text: "Hello Rajesh, please re-upload a clear shop photo so we can proceed quickly.",
    time: "10:02 AM",
  },
  {
    id: "2",
    from: "user",
    text: "Sure, I will upload it today. Please check once done.",
    time: "10:05 AM",
  },
  {
    id: "3",
    from: "admin",
    text: "Great. Once uploaded, your status will move to Processing.",
    time: "10:07 AM",
  },
];

export default function AdminChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const quickReplies = [
    "Document uploaded",
    "Please verify now",
    "Need help with payment",
  ];

  const adminAutoReply = (userText: string) => {
    setIsAdminTyping(true);
    const lower = userText.toLowerCase();

    setTimeout(() => {
      let reply =
        "Thanks for the update. I have forwarded this to the verification team.";

      if (lower.includes("uploaded") || lower.includes("document")) {
        reply =
          "Received. I can see your document update. Verification should complete within 24 hours.";
      } else if (lower.includes("payment")) {
        reply =
          "Payment status looks pending from bank gateway. Please wait 5-10 minutes and refresh.";
      } else if (lower.includes("help")) {
        reply =
          "Sure, please share the exact issue and I will guide you step by step.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `admin-${Date.now()}`,
          from: "admin",
          text: reply,
          time: "Now",
        },
      ]);
      setIsAdminTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    }, 1000);
  };

  const sendMessage = () => {
    const trimmed = input.trim();
    if (trimmed.length < 1) {
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      from: "user",
      text: trimmed,
      time: "Now",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    adminAutoReply(trimmed);
  };

  const sendQuickReply = (text: string) => {
    setInput(text);
    setTimeout(() => {
      setInput(text);
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        from: "user",
        text,
        time: "Now",
      };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
      adminAutoReply(text);
    }, 10);
  };

  const sendAttachmentNotice = () => {
    const text = "I have uploaded the requested document. Please review.";
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      from: "user",
      text,
      time: "Now",
    };
    setMessages((prev) => [...prev, newMessage]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    adminAutoReply(text);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      edges={["top"]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
          backgroundColor: COLORS.white,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: COLORS.white,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ marginLeft: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textDark,
              }}
            >
              Admin Chat
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#16A34A",
                fontFamily: "Poppins_500Medium",
              }}
            >
              Online
            </Text>
          </View>
        </View>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#E8F8FE",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="shield-checkmark" size={18} color="#0284C7" />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((message) => {
            const fromUser = message.from === "user";
            return (
              <View
                key={message.id}
                style={{
                  marginBottom: 12,
                  alignItems: fromUser ? "flex-end" : "flex-start",
                }}
              >
                <View
                  style={{
                    borderRadius: 16,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    maxWidth: "85%",
                    backgroundColor: fromUser ? COLORS.primary : COLORS.white,
                    borderWidth: fromUser ? 0 : 1,
                    borderColor: fromUser ? "transparent" : "#E2E8F0",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: fromUser ? COLORS.white : COLORS.textDark,
                      fontFamily: "Poppins_400Regular",
                    }}
                  >
                    {message.text}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 10,
                    color: "#94A3B8",
                    marginTop: 4,
                    fontFamily: "Poppins_400Regular",
                  }}
                >
                  {message.time}
                </Text>
              </View>
            );
          })}

          {isAdminTyping && (
            <View style={{ marginBottom: 12, alignItems: "flex-start" }}>
              <View
                style={{
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  backgroundColor: COLORS.white,
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.textGray,
                    fontFamily: "Poppins_400Regular",
                  }}
                >
                  Admin is typing...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 8,
            backgroundColor: COLORS.white,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            paddingBottom: Math.max(insets.bottom, 10) + 72,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 8 }}
          >
            {quickReplies.map((reply) => (
              <TouchableOpacity
                key={reply}
                onPress={() => sendQuickReply(reply)}
                style={{
                  backgroundColor: "#EFF6FF",
                  borderWidth: 1,
                  borderColor: "#DBEAFE",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "Poppins_600SemiBold",
                    color: "#1D4ED8",
                  }}
                >
                  {reply}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={sendAttachmentNotice}
              style={{
                marginRight: 8,
                backgroundColor: "#EFF6FF",
                width: 44,
                height: 44,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="attach" size={16} color="#1D4ED8" />
            </TouchableOpacity>

            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              placeholderTextColor="#94A3B8"
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              style={{
                flex: 1,
                backgroundColor: COLORS.lightGrey,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 14,
                color: COLORS.textDark,
                fontFamily: "Poppins_500Medium",
              }}
            />

            <TouchableOpacity
              onPress={sendMessage}
              disabled={input.trim().length === 0}
              style={{
                marginLeft: 8,
                width: 44,
                height: 44,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  input.trim().length === 0 ? "#93C5FD" : COLORS.primary,
              }}
            >
              <Ionicons name="send" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
