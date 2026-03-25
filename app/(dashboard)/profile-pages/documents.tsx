import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import { config } from "../../../environment";

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

interface Document {
  id: string;
  name: string;
  type: 'panCard' | 'aadhaarCard' | 'gstCertificate' | 'businessProof' | 'bankStatement' | 'electricityBill' | 'addressProof';
  fileUrl?: string;
  uploadedAt?: string;
  verified?: boolean;
}

const DocumentTypes = [
  { id: 'panCard', label: 'PAN Card', icon: 'id-card' },
  { id: 'aadhaarCard', label: 'Aadhaar Card', icon: 'id-card' },
  { id: 'gstCertificate', label: 'GST Certificate', icon: 'document-text' },
  { id: 'businessProof', label: 'Business Proof', icon: 'document-text' },
  { id: 'bankStatement', label: 'Bank Statement', icon: 'document-text' },
  { id: 'electricityBill', label: 'Electricity Bill', icon: 'document-text' },
  { id: 'addressProof', label: 'Address Proof', icon: 'home' },
];

const DocumentCard = ({
  doc,
  onDelete,
  onUpdate,
}: {
  doc: Document;
  onDelete: (id: string) => void;
  onUpdate: (id: string) => void;
}) => {
  const docType = DocumentTypes.find(dt => dt.id === doc.type);
  
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              backgroundColor: "#EAF8FF",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons name={docType?.icon as any} size={24} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_600SemiBold",
                color: COLORS.textDark,
              }}
            >
              {docType?.label}
            </Text>
            {doc.uploadedAt && (
              <Text
                style={{
                  fontSize: 11,
                  color: COLORS.textLight,
                  fontFamily: "Poppins_400Regular",
                  marginTop: 4,
                }}
              >
                Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
              </Text>
            )}
            {doc.verified && (
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
                <Text
                  style={{
                    fontSize: 11,
                    color: COLORS.success,
                    fontFamily: "Poppins_500Medium",
                    marginLeft: 4,
                  }}
                >
                  Verified
                </Text>
              </View>
            )}
            {!doc.fileUrl && (
              <Text
                style={{
                  fontSize: 11,
                  color: COLORS.alertAmber,
                  fontFamily: "Poppins_500Medium",
                  marginTop: 4,
                }}
              >
                Not Uploaded
              </Text>
            )}
          </View>
        </View>

        {doc.fileUrl && (
          <TouchableOpacity
            onPress={() => onDelete(doc.id)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#FEE2E2",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.alertRed} />
          </TouchableOpacity>
        )}

        {!doc.fileUrl && (
          <TouchableOpacity
            onPress={() => onUpdate(doc.id)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#EAF8FF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="cloud-upload-outline" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function DocumentsScreen() {
  const { user, loading, tokens } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([
    { id: 'panCard', name: 'PAN Card', type: 'panCard' },
    { id: 'aadhaarCard', name: 'Aadhaar Card', type: 'aadhaarCard' },
    { id: 'gstCertificate', name: 'GST Certificate', type: 'gstCertificate' },
    { id: 'businessProof', name: 'Business Proof', type: 'businessProof' },
    { id: 'bankStatement', name: 'Bank Statement', type: 'bankStatement' },
    { id: 'electricityBill', name: 'Electricity Bill', type: 'electricityBill' },
    { id: 'addressProof', name: 'Address Proof', type: 'addressProof' },
  ]);

  // Fetch documents on mount
  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/profile/documents`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data = await response.json();
      
      // Map server documents to local state
      if (data.documents) {
        const updatedDocs = documents.map((doc) => {
          const serverDoc = data.documents[doc.type];
          return {
            ...doc,
            fileUrl: serverDoc?.fileUrl,
            uploadedAt: serverDoc?.uploadedAt,
            verified: serverDoc?.verified,
          };
        });
        setDocuments(updatedDocs);
      }
    } catch (error: any) {
      console.error("Error loading documents:", error);
      // Don't show alert on initial load failure
    } finally {
      setIsLoading(false);
    }
  };

  const pickAndUploadDocument = async (documentType: string) => {
    try {
      // For now, show a message that file picker needs to be implemented
      // In production, you'll need to install and use:
      // - expo-document-picker or expo-file-system
      // - expo-image-picker for image selection
      
      Alert.prompt(
        "Upload Document",
        "Please provide the file URI or select a file. For now, you can:\n1. Use the file manager app\n2. Take a photo and copy its URI",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Upload",
            onPress: (fileUri: any) => {
              if (fileUri) {
                uploadDocument(documentType, fileUri);
              }
            },
          },
        ],
        "plain-text",
        "file:///path/to/document"
      );
    } catch (error: any) {
      Alert.alert("Error", "Failed to pick file: " + error.message);
    }
  };

  const uploadDocument = async (documentType: string, fileUri: string) => {
    try {
      setIsLoading(true);

      // Get file info
      const fileName = fileUri.split("/").pop() || `${documentType}_${Date.now()}`;
      const fileType = fileName.includes(".pdf") ? "application/pdf" : "image/jpeg";

      // Create FormData
      const formData = new FormData();
      formData.append("document", {
        uri: fileUri,
        name: fileName,
        type: fileType,
      } as any);

      // Determine endpoint based on documentType
      const endpointMap: { [key: string]: string } = {
        panCard: "pan",
        aadhaarCard: "aadhaar",
        gstCertificate: "gst",
        businessProof: "business-proof",
        bankStatement: "bank-statement",
        electricityBill: "electricity-bill",
        addressProof: "address-proof",
      };

      const endpoint = endpointMap[documentType];
      if (!endpoint) {
        throw new Error("Invalid document type");
      }

      const response = await fetch(`${config.API_BASE_URL}/profile/documents/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload document");
      }

      const data = await response.json();

      // Update local state
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.type === documentType
            ? {
                ...doc,
                fileUrl: data.document,
                uploadedAt: new Date().toISOString(),
              }
            : doc
        )
      );

      Alert.alert("Success", "Document uploaded successfully");
    } catch (error: any) {
      Alert.alert("Upload Failed", error.message || "Failed to upload document");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentType: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${config.API_BASE_URL}/profile/documents`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete document");
      }

      // Update local state
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.type === documentType
            ? {
                ...doc,
                fileUrl: undefined,
                uploadedAt: undefined,
              }
            : doc
        )
      );

      Alert.alert("Success", "Document deleted successfully");
    } catch (error: any) {
      Alert.alert("Delete Failed", error.message || "Failed to delete document");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Document",
      "Are you sure you want to delete this document?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteDocument(id),
        },
      ]
    );
  };

  const handleUpdate = (documentType: string) => {
    pickAndUploadDocument(documentType);
  };

  const uploadedCount = documents.filter((d) => d.fileUrl).length;
  const verifiedCount = documents.filter((d) => d.verified).length;

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "My Documents",
          headerTitleStyle: {
            fontFamily: "Poppins_700Bold",
            fontSize: 18,
            color: COLORS.textDark,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="chevron-back"
                size={28}
                color={COLORS.primary}
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Card */}
        <View
          style={{
            backgroundColor: "#EAF8FF",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#DFECF5",
            padding: 16,
            marginBottom: 24,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Poppins_800ExtraBold",
                color: COLORS.primary,
              }}
            >
              {uploadedCount}/{documents.length}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.textLight,
                fontFamily: "Poppins_600SemiBold",
                marginTop: 4,
              }}
            >
              UPLOADED
            </Text>
          </View>

          <View
            style={{ height: 40, width: 1, backgroundColor: "#D8E9F5" }}
          />

          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Poppins_800ExtraBold",
                color: COLORS.success,
              }}
            >
              {verifiedCount}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.textLight,
                fontFamily: "Poppins_600SemiBold",
                marginTop: 4,
              }}
            >
              VERIFIED
            </Text>
          </View>
        </View>

        {/* Documents Section */}
        <Text
          style={{
            fontSize: 13,
            color: COLORS.textLight,
            fontFamily: "Poppins_700Bold",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 16,
          }}
        >
          Documents
        </Text>

        {isLoading ? (
          <View style={{ paddingVertical: 40 }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))
        )}

        {/* Info Box */}
        <View
          style={{
            backgroundColor: "#FFF3CD",
            borderRadius: 12,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.alertAmber,
            padding: 12,
            marginTop: 24,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              name="information-circle"
              size={16}
              color={COLORS.alertAmber}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                flex: 1,
                fontSize: 12,
                color: COLORS.textDark,
                fontFamily: "Poppins_400Regular",
              }}
            >
              Upload all required documents to verify your account and unlock all features.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
