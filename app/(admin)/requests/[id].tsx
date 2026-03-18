import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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
  lightGrey: "#F8FAFC",
  lightGrey2: "#F1F5F9",
  white: "#FFFFFF",
  textDark: "#0F172A",
  textGray: "#64748B",
  textLight: "#94A3B8",
  border: "#E2E8F0",
};

type RequestItem = {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceType: string;
  status: "pending" | "in-progress" | "completed" | "rejected";
  submittedAt: string;
  summary: string;
  details: Record<string, string>;
  attachments?: { name: string; url: string }[];
};

const requests: RequestItem[] = [
  {
    id: "req_1",
    customerName: "Rajesh Kumar",
    customerEmail: "rajesh.k@vyaapar.in",
    serviceType: "GST Registration",
    status: "pending",
    submittedAt: "2h ago",
    summary: "GST registration for new business.",
    details: {
      "Business Name": "Kumar Traders",
      "PAN Number": "ABCDE1234F",
      "Business Address": "123 Market Rd, Ahmedabad",
      "Contact Number": "+91 98765 43210",
    },
    attachments: [
      { name: "Identity Proof.pdf", url: "#" },
      { name: "Address Proof.pdf", url: "#" },
    ],
  },
  {
    id: "req_2",
    customerName: "Anita Sharma",
    customerEmail: "anita.sharma@gmail.com",
    serviceType: "GST Return Filing",
    status: "in-progress",
    submittedAt: "6h ago",
    summary: "Filing GSTR-3B for April.",
    details: {
      GSTIN: "24ABCDE1234F1Z5",
      "Return Period": "Apr 2026",
      Turnover: "₹12,50,000",
    },
    attachments: [{ name: "Invoice_0426.pdf", url: "#" }],
  },
  {
    id: "req_3",
    customerName: "Vikram Kohli",
    customerEmail: "vikram.kohli88@yahoo.com",
    serviceType: "GST Cancellation",
    status: "completed",
    submittedAt: "1d ago",
    summary: "Cancel GST registration as business closed.",
    details: {
      GSTIN: "27ABCDE1234F1Z2",
      Reason: "Business closed",
      "Closure Date": "2026-03-10",
    },
  },
];

export default function RequestDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const requestId = params.id as string;
  const request = useMemo(
    () => requests.find((item) => item.id === requestId) || requests[0],
    [requestId],
  );

  const [status, setStatus] = useState(request.status);
  const [note, setNote] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [sentNotifications, setSentNotifications] = useState<string[]>([]);
  const [sentDocuments, setSentDocuments] = useState<string[]>([]);

  const statusOptions: { label: string; value: RequestItem["status"] }[] = [
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
    { label: "Rejected", value: "rejected" },
  ];

  const sendNotification = () => {
    if (!note.trim()) return;
    setSentNotifications((prev) => [note.trim(), ...prev]);
    setNote("");
  };

  const sendDocument = () => {
    if (!documentName.trim()) return;
    setSentDocuments((prev) => [documentName.trim(), ...prev]);
    setDocumentName("");
  };

  const statusColor =
    status === "pending"
      ? COLORS.alertAmber
      : status === "in-progress"
        ? COLORS.primary
        : status === "completed"
          ? COLORS.success
          : COLORS.alertRed;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGrey }}>
      <Stack.Screen options={{ headerShown: false }} />

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

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.textDark,
              textAlign: "center",
            }}
          >
            Request Detail
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: COLORS.textGray,
              textAlign: "center",
            }}
          >
            {request.customerName} · {request.customerEmail}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/dashboard/chat")}
          style={{ padding: 4 }}
        >
          <Ionicons
            name="chatbubble-ellipses"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: "rgba(226, 232, 240, 0.4)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.textDark,
                    marginBottom: 4,
                  }}
                >
                  {request.serviceType}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textGray,
                  }}
                >
                  {request.summary}
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: statusColor,
                      marginRight: 8,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_600SemiBold",
                      color: statusColor,
                      textTransform: "capitalize",
                    }}
                  >
                    {status}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "Poppins_400Regular",
                    color: COLORS.textLight,
                  }}
                >
                  Submitted {request.submittedAt}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textGray,
                marginBottom: 8,
              }}
            >
              Submission Details
            </Text>
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: "rgba(226, 232, 240, 0.4)",
              }}
            >
              {Object.entries(request.details).map(([key, value]) => (
                <View key={key} style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.textGray,
                    }}
                  >
                    {key}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Poppins_400Regular",
                      color: COLORS.textDark,
                    }}
                  >
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {request.attachments?.length ? (
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.textGray,
                  marginBottom: 8,
                }}
              >
                Uploaded Attachments
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "rgba(226, 232, 240, 0.4)",
                }}
              >
                {request.attachments.map((attach) => (
                  <TouchableOpacity
                    key={attach.name}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(226, 232, 240, 0.6)",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons
                        name="document-text"
                        size={20}
                        color={COLORS.primary}
                        style={{ marginRight: 10 }}
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "Poppins_500Medium",
                          color: COLORS.textDark,
                        }}
                      >
                        {attach.name}
                      </Text>
                    </View>
                    <Ionicons
                      name="download"
                      size={18}
                      color={COLORS.textLight}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textGray,
                marginBottom: 10,
              }}
            >
              Update Status
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setStatus(option.value)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor:
                      status === option.value ? COLORS.primary : COLORS.border,
                    backgroundColor:
                      status === option.value
                        ? COLORS.primaryLight
                        : COLORS.white,
                    marginRight: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_600SemiBold",
                      color:
                        status === option.value
                          ? COLORS.primary
                          : COLORS.textGray,
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textGray,
                marginBottom: 10,
              }}
            >
              Send Notification
            </Text>
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: "rgba(226, 232, 240, 0.4)",
              }}
            >
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Write a notification message..."
                placeholderTextColor={COLORS.textLight}
                multiline
                style={{
                  minHeight: 80,
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textDark,
                  textAlignVertical: "top",
                }}
              />
              <TouchableOpacity
                onPress={sendNotification}
                activeOpacity={0.8}
                style={{
                  marginTop: 12,
                  backgroundColor: COLORS.primary,
                  paddingVertical: 12,
                  borderRadius: 14,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.white,
                  }}
                >
                  Send Notification
                </Text>
              </TouchableOpacity>

              {sentNotifications.length ? (
                <View style={{ marginTop: 16 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.textGray,
                      marginBottom: 8,
                    }}
                  >
                    Sent Messages
                  </Text>
                  {sentNotifications.map((msg, idx) => (
                    <View key={idx} style={{ marginBottom: 10 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "Poppins_500Medium",
                          color: COLORS.textDark,
                        }}
                      >
                        • {msg}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textGray,
                marginBottom: 10,
              }}
            >
              Send Document
            </Text>
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: "rgba(226, 232, 240, 0.4)",
              }}
            >
              <TextInput
                value={documentName}
                onChangeText={setDocumentName}
                placeholder="Document title (e.g. GST Certificate)"
                placeholderTextColor={COLORS.textLight}
                style={{
                  backgroundColor: COLORS.lightGrey2,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textDark,
                }}
              />
              <TouchableOpacity
                onPress={sendDocument}
                activeOpacity={0.8}
                style={{
                  marginTop: 12,
                  backgroundColor: COLORS.primary,
                  paddingVertical: 12,
                  borderRadius: 14,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.white,
                  }}
                >
                  Send Document
                </Text>
              </TouchableOpacity>

              {sentDocuments.length ? (
                <View style={{ marginTop: 16 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.textGray,
                      marginBottom: 8,
                    }}
                  >
                    Sent Documents
                  </Text>
                  {sentDocuments.map((doc, idx) => (
                    <View key={idx} style={{ marginBottom: 10 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "Poppins_500Medium",
                          color: COLORS.textDark,
                        }}
                      >
                        • {doc}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>

          <View style={{ marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_700Bold",
                color: COLORS.textGray,
                marginBottom: 10,
              }}
            >
              Customer Chat
            </Text>
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: "rgba(226, 232, 240, 0.4)",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_400Regular",
                  color: COLORS.textGray,
                  marginBottom: 8,
                }}
              >
                Use chat to discuss details or share updates directly.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/dashboard/chat")}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: COLORS.primary,
                  borderRadius: 14,
                  paddingVertical: 12,
                }}
              >
                <Ionicons
                  name="chatbubble-ellipses"
                  size={18}
                  color={COLORS.white}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_600SemiBold",
                    color: COLORS.white,
                  }}
                >
                  Open Chat
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
