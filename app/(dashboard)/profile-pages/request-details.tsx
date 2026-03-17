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

type DocItem = {
  id: string;
  name: string;
  size: string;
};

const initialDocs: DocItem[] = [
  { id: "1", name: "pan_card.pdf", size: "2.4 MB" },
  { id: "2", name: "shop_photo.jpg", size: "4.1 MB" },
];

const statusSteps = [
  {
    title: "Submitted",
    sub: "Your request has been received by our team.",
    time: "24 Oct, 10:30 AM",
    state: "done",
  },
  {
    title: "Reviewing Documents",
    sub: "Admin is currently verifying your attached documents.",
    time: "In Progress",
    state: "active",
  },
  {
    title: "Processing Application",
    sub: "Filing with government portal.",
    time: "",
    state: "todo",
  },
  {
    title: "Completed",
    sub: "GST Number generated and sent.",
    time: "",
    state: "todo",
  },
] as const;

export default function RequestDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    service?: string;
    requestId?: string;
  }>();

  const [docs, setDocs] = useState<DocItem[]>(initialDocs);
  const [newDocName, setNewDocName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const serviceName = params.service ?? "GST Registration";
  const requestId = params.requestId ?? "#VS-9921";

  const canAdd = useMemo(() => newDocName.trim().length > 2, [newDocName]);

  const addDocument = () => {
    if (!canAdd) {
      return;
    }
    const newItem: DocItem = {
      id: Date.now().toString(),
      name: newDocName.trim(),
      size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
    };
    setDocs((prev) => [newItem, ...prev]);
    setNewDocName("");
  };

  const deleteDocument = (id: string) => {
    setDocs((prev) => prev.filter((doc) => doc.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingValue("");
    }
  };

  const startEditing = (doc: DocItem) => {
    setEditingId(doc.id);
    setEditingValue(doc.name);
  };

  const saveEdit = () => {
    if (!editingId || editingValue.trim().length < 3) {
      return;
    }
    setDocs((prev) =>
      prev.map((doc) =>
        doc.id === editingId ? { ...doc, name: editingValue.trim() } : doc,
      ),
    );
    setEditingId(null);
    setEditingValue("");
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
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
          backgroundColor: COLORS.white,
        }}
      >
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
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Poppins_700Bold",
            color: COLORS.textDark,
            marginLeft: 12,
          }}
        >
          Request Details
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 16,
            paddingVertical: 16,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <View>
              <View
                style={{
                  backgroundColor: "#EAF2FF",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 20,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    color: "#2563EB",
                    fontFamily: "Poppins_600SemiBold",
                  }}
                >
                  Service Request
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: "Poppins_700Bold",
                  color: COLORS.textDark,
                  marginTop: 8,
                }}
              >
                {serviceName}
              </Text>
              <Text
                style={{ fontSize: 12, color: COLORS.textGray, marginTop: 4 }}
              >
                Req ID: {requestId}
              </Text>
            </View>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: "#EAF2FF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="document-text" size={18} color="#2563EB" />
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: "#EEF2F7",
              marginVertical: 12,
            }}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={COLORS.textGray}
            />
            <Text
              style={{ fontSize: 12, color: COLORS.textGray, marginLeft: 8 }}
            >
              Submitted on 24 Oct, 2023
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 16,
            paddingVertical: 16,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Poppins_700Bold",
              color: COLORS.textDark,
              marginBottom: 12,
            }}
          >
            Request Status
          </Text>
          {statusSteps.map((step, index) => {
            const isDone = step.state === "done";
            const isActive = step.state === "active";
            return (
              <View key={step.title} style={{ flexDirection: "row" }}>
                <View style={{ alignItems: "center", marginRight: 12 }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isDone
                        ? "#2A83E8"
                        : isActive
                          ? "#93C5FD"
                          : "#E2E8F0",
                    }}
                  >
                    {isDone ? (
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    ) : (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: isActive ? "#1D4ED8" : "#CBD5E1",
                        }}
                      />
                    )}
                  </View>
                  {index !== statusSteps.length - 1 && (
                    <View
                      style={{
                        width: 2,
                        height: 36,
                        backgroundColor: "#E2E8F0",
                      }}
                    />
                  )}
                </View>

                <View style={{ flex: 1, paddingBottom: 12 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_600SemiBold",
                      color: isDone || isActive ? COLORS.textDark : "#94A3B8",
                    }}
                  >
                    {step.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      marginTop: 4,
                      color: isDone || isActive ? COLORS.textGray : "#CBD5E1",
                    }}
                  >
                    {step.sub}
                  </Text>
                  {!!step.time && (
                    <Text
                      style={{ fontSize: 10, color: "#94A3B8", marginTop: 4 }}
                    >
                      {step.time}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <Text
          style={{
            fontSize: 15,
            fontFamily: "Poppins_700Bold",
            color: COLORS.textDark,
            marginBottom: 8,
          }}
        >
          Uploaded Documents
        </Text>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 12,
            paddingVertical: 12,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: "#94A3B8",
              fontFamily: "Poppins_600SemiBold",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            ADD DOCUMENT
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              value={newDocName}
              onChangeText={setNewDocName}
              placeholder="example: gst_certificate.pdf"
              placeholderTextColor="#94A3B8"
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
              onPress={addDocument}
              disabled={!canAdd}
              style={{
                marginLeft: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: canAdd ? COLORS.primary : "#93C5FD",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: COLORS.white,
                  fontFamily: "Poppins_600SemiBold",
                }}
              >
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {docs.map((doc) => (
          <View
            key={doc.id}
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
              paddingHorizontal: 12,
              paddingVertical: 12,
              marginBottom: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: "#FEE2E2",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 8,
                }}
              >
                <Ionicons
                  name="document-attach"
                  size={14}
                  color={COLORS.alertRed}
                />
              </View>

              <View style={{ flex: 1 }}>
                {editingId === doc.id ? (
                  <TextInput
                    value={editingValue}
                    onChangeText={setEditingValue}
                    style={{
                      backgroundColor: COLORS.lightGrey,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 6,
                      fontSize: 14,
                      color: COLORS.textDark,
                      fontFamily: "Poppins_500Medium",
                    }}
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_600SemiBold",
                      color: COLORS.textDark,
                    }}
                  >
                    {doc.name}
                  </Text>
                )}
                <Text
                  style={{
                    fontSize: 11,
                    color: "#94A3B8",
                    marginTop: 4,
                    fontFamily: "Poppins_400Regular",
                  }}
                >
                  {doc.size}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  style={{ paddingHorizontal: 8, paddingVertical: 4 }}
                  onPress={() => startEditing(doc)}
                >
                  <Ionicons name="create-outline" size={16} color="#2563EB" />
                </TouchableOpacity>
                {editingId === doc.id ? (
                  <TouchableOpacity
                    style={{ paddingHorizontal: 8, paddingVertical: 4 }}
                    onPress={saveEdit}
                  >
                    <Ionicons name="checkmark-done" size={16} color="#16A34A" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{ paddingHorizontal: 8, paddingVertical: 4 }}
                  >
                    <Ionicons name="eye" size={16} color="#2563EB" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={{ paddingHorizontal: 8, paddingVertical: 4 }}
                  onPress={() => deleteDocument(doc.id)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color={COLORS.alertRed}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View
          style={{
            backgroundColor: "#FFF7DF",
            borderWidth: 1,
            borderColor: "#F4D35E",
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 14,
            marginTop: 8,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Ionicons name="alert-circle" size={14} color="#B45309" />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_600SemiBold",
                color: "#B45309",
                marginLeft: 4,
              }}
            >
              Admin Note
            </Text>
          </View>
          <Text
            style={{
              fontSize: 12,
              color: "#92400E",
              lineHeight: 20,
              fontFamily: "Poppins_400Regular",
            }}
          >
            Namaste! Please re-upload a clearer picture of your shop
            establishment license. The current one is blurry and the
            registration number is not visible.
          </Text>
          <TouchableOpacity
            style={{ marginTop: 8 }}
            onPress={() => setNewDocName("shop_license_clear.jpg")}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_600SemiBold",
                color: "#1D4ED8",
              }}
            >
              Re-upload Document
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: "#D7E0EA",
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
          onPress={() => router.push("/(dashboard)/profile-pages/admin-chat")}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={16}
            color={COLORS.textDark}
          />
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_600SemiBold",
              color: COLORS.textDark,
              marginLeft: 8,
            }}
          >
            Contact Support / Chat with Admin
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
