import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from 'expo-file-system';

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
  bgSubtle: "#F8FAFC",
};

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  multiline = false,
  style = {},
}: any) => (
  <View style={[{ marginBottom: 16 }, style]}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={COLORS.textLight}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
      style={[
        styles.input,
        multiline && { height: 80, textAlignVertical: "top" }
      ]}
    />
  </View>
);

export default function GSTInvoiceScreen() {
  const router = useRouter();
  
  // -- Form States --
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    gstin: "",
    address: "",
    city: "",
    state: "Maharashtra",
  });

  const [clientInfo, setClientInfo] = useState({
    name: "",
    gstin: "",
    address: "",
    city: "",
    state: "Maharashtra",
  });

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: "INV-12",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    placeOfSupply: "Maharashtra",
  });

  const [lineItems, setLineItems] = useState([
    { id: 1, description: "", hsn: "", qty: "1", rate: "", sgst: "9", cgst: "9", cess: "0" }
  ]);

  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [notes, setNotes] = useState("It was great doing business with you.");
  const [terms, setTerms] = useState("Please make the payment by the due date.");
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // -- Calculations --
  const calculateTotals = () => {
    let subtotal = 0;
    let totalSGST = 0;
    let totalCGST = 0;
    let totalCess = 0;

    lineItems.forEach(item => {
      const gtyValue = parseFloat(item.qty) || 0;
      const rateValue = parseFloat(item.rate) || 0;
      const sgstRate = parseFloat(item.sgst) || 0;
      const cgstRate = parseFloat(item.cgst) || 0;
      const cessRate = parseFloat(item.cess) || 0;

      const amount = gtyValue * rateValue;
      subtotal += amount;
      totalSGST += (amount * sgstRate) / 100;
      totalCGST += (amount * cgstRate) / 100;
      totalCess += (amount * cessRate) / 100;
    });

    const grandTotal = subtotal + totalSGST + totalCGST + totalCess;

    return {
      subtotal: subtotal.toFixed(2),
      totalSGST: totalSGST.toFixed(2),
      totalCGST: totalCGST.toFixed(2),
      totalCess: totalCess.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    };
  };

  const totals = calculateTotals();

  // -- Utilities --
  const numberToWords = (num: number) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const countWords = (n: number): string => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
      if (n < 1000) return countWords(Math.floor(n / 100)) + 'Hundred ' + (n % 100 !== 0 ? 'and ' + countWords(n % 100) : '');
      if (n < 100000) return countWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? countWords(n % 1000) : '');
      if (n < 10000000) return countWords(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 !== 0 ? countWords(n % 100000) : '');
      return countWords(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 !== 0 ? countWords(n % 10000000) : '');
    };

    const whole = Math.floor(num);
    const fraction = Math.round((num - whole) * 100);
    
    let res = countWords(whole) + 'Rupees ';
    if (fraction > 0) {
      res += 'and ' + countWords(fraction) + 'Paise ';
    }
    return res + 'Only';
  };

  // -- Handlers --
  const pickLogo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now(), description: "", hsn: "", qty: "1", rate: "", sgst: "9", cgst: "9", cess: "0" }
    ]);
  };

  const removeLineItem = (id: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: number, field: string, value: string) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const generatePDF = async (mode: 'print' | 'share' | 'save' | 'whatsapp') => {
    if (!companyInfo.name || !clientInfo.name || lineItems.some(i => !i.description || !i.rate)) {
      Alert.alert("Missing Fields", "Please ensure company name, client name, and item details are filled.");
      return;
    }

    setIsGenerating(true);
    let logoBase64 = "";
    if (logoUri) {
        try {
            const response = await fetch(logoUri);
            const blob = await response.blob();
            logoBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.log("Logo error", error);
        }
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            @page { margin: 0; }
            body { 
                font-family: 'Helvetica', Arial, sans-serif;
                color: #1e293b;
                margin: 0;
                padding: 40px;
                background-color: #fff;
            }
            .invoice-label { font-size: 32px; font-weight: 900; color: #1e4fa3; text-transform: uppercase; margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th { background-color: #1e4fa3; color: white; padding: 10px; text-align: left; font-size: 11px; }
            td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
            .grand-total { background-color: #1e4fa3; color: white; font-weight: bold; }
        </style>
    </head>
    <body style="padding: 40px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <div>
                ${logoBase64 ? `<img src="${logoBase64}" style="width: 100px; height: 100px; object-fit: contain;" />` : ''}
                <div style="margin-top: 15px;">
                    <strong style="font-size: 20px;">${companyInfo.name}</strong>
                    <p>${companyInfo.address}, ${companyInfo.city}</p>
                    <p>GSTIN: ${companyInfo.gstin}</p>
                </div>
            </div>
            <div style="text-align: right;">
                <h1 class="invoice-label">TAX INVOICE</h1>
                <p>Invoice #: <strong>${invoiceDetails.invoiceNo}</strong></p>
                <p>Date: <strong>${invoiceDetails.invoiceDate}</strong></p>
                <p>POS: <strong>${invoiceDetails.placeOfSupply}</strong></p>
            </div>
        </div>

        <div style="margin-bottom: 30px;">
            <p style="text-transform: uppercase; color: #1e4fa3; font-weight: bold; font-size: 13px; border-bottom: 1px solid #1e4fa3; padding-bottom: 5px;">Bill To</p>
            <strong>${clientInfo.name}</strong>
            <p>${clientInfo.address}</p>
            <p>${clientInfo.city}, ${clientInfo.state}</p>
            ${clientInfo.gstin ? `<p>GSTIN: ${clientInfo.gstin}</p>` : ''}
        </div>

        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>HSN</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>GST %</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${lineItems.map(item => `
                    <tr>
                        <td>${item.description}</td>
                        <td>${item.hsn}</td>
                        <td>${item.qty}</td>
                        <td>₹${item.rate}</td>
                        <td>${(parseFloat(item.sgst) + parseFloat(item.cgst)).toFixed(0)}%</td>
                        <td>₹${(parseFloat(item.qty) * parseFloat(item.rate)).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
            <table style="width: 250px;">
                <tr><td>Subtotal</td><td style="text-align: right;">₹${totals.subtotal}</td></tr>
                <tr><td>Total GST</td><td style="text-align: right;">₹${(parseFloat(totals.totalSGST) + parseFloat(totals.totalCGST)).toFixed(2)}</td></tr>
                <tr class="grand-total"><td>Total</td><td style="text-align: right;">₹${totals.grandTotal}</td></tr>
            </table>
        </div>

        <div style="margin-top: 40px; padding: 15px; background: #f8fafc; border-radius: 8px;">
            <p><strong>Amount in Words:</strong> ${numberToWords(parseFloat(totals.grandTotal))}</p>
        </div>

        <div style="margin-top: 40px; display: flex; gap: 40px;">
            <div style="flex: 1;">
                <p style="font-weight: bold; color: #1e4fa3;">Notes</p>
                <p style="font-size: 12px; color: #666;">${notes}</p>
            </div>
            <div style="flex: 1; text-align: center;">
                <p style="font-weight: bold;">For ${companyInfo.name}</p>
                <div style="height: 50px; border-bottom: 1px solid #ccc;"></div>
                <p style="font-size: 11px; margin-top: 5px;">Authorized Signatory</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        if (mode === 'print') {
            await Print.printAsync({ html: htmlContent });
        } else {
            const { uri } = await Print.printToFileAsync({ html: htmlContent });
            
            if (mode === 'save' && Platform.OS === 'android') {
                const permissions = await (FileSystem as any).StorageAccessFramework.requestDirectoryPermissionsAsync();
                if (permissions.granted) {
                    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: (FileSystem as any).EncodingType.Base64 });
                    const fileUri = await (FileSystem as any).StorageAccessFramework.createFileAsync(permissions.directoryUri, `Invoice_${invoiceDetails.invoiceNo}`, 'application/pdf');
                    await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: (FileSystem as any).EncodingType.Base64 });
                    Alert.alert("Success", "Invoice saved successfully!");
                } else {
                    await Sharing.shareAsync(uri);
                }
            } else {
                // For WhatsApp and Share (and iOS Save), the system share sheet is the most reliable Expo Go way
                await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
            }
        }
    } catch (error) {
        Alert.alert("Error", "Action failed. This might require a native build.");
        console.error(error);
    } finally {
        setIsGenerating(false);
    }
  };

  // -- Preview Component --
  const PreviewModal = () => (
    <Modal visible={showPreview} animationType="slide" transparent={false}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.previewHeader}>
            <TouchableOpacity onPress={() => setShowPreview(false)} style={styles.closePreviewButton}>
                <Ionicons name="close" size={28} color={COLORS.textDark} />
            </TouchableOpacity>
            <Text style={styles.previewHeaderTitle}>Invoice Preview</Text>
            <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.previewContainer}>
            <View style={styles.paperPage}>
                {/* Paper Content Header */}
                <View style={[styles.flexRow, { justifyContent: 'space-between', marginBottom: 20 }]}>
                    <View>
                        {logoUri ? <Image source={{ uri: logoUri }} style={{ width: 60, height: 60, resizeMode: 'contain' }} /> : <View style={styles.paperLogoMock} />}
                        <Text style={styles.paperBusinessName}>{companyInfo.name || "Your Business"}</Text>
                        <Text style={styles.paperAddressSmall}>{companyInfo.address}</Text>
                        <Text style={styles.paperAddressSmall}>{companyInfo.city}, {companyInfo.state}</Text>
                        <Text style={styles.paperGSTINSmall}>GSTIN: {companyInfo.gstin}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.paperInvoiceType}>TAX INVOICE</Text>
                        <Text style={styles.paperMetaSmall}># {invoiceDetails.invoiceNo}</Text>
                        <Text style={styles.paperMetaSmall}>{invoiceDetails.invoiceDate}</Text>
                    </View>
                </View>

                {/* Bill To */}
                <View style={styles.paperBillToSection}>
                    <Text style={styles.paperSectionLabel}>Bill To</Text>
                    <Text style={styles.paperClientName}>{clientInfo.name || "Client Name"}</Text>
                    <Text style={styles.paperAddressSmall}>{clientInfo.address}</Text>
                    <Text style={styles.paperAddressSmall}>{clientInfo.city}, {clientInfo.state}</Text>
                    {clientInfo.gstin ? <Text style={styles.paperGSTINSmall}>GSTIN: {clientInfo.gstin}</Text> : null}
                </View>

                {/* Table Mockup */}
                <View style={styles.paperTable}>
                    <View style={styles.paperTableHeader}>
                        <Text style={[styles.paperTableHeadText, { flex: 2 }]}>Description</Text>
                        <Text style={[styles.paperTableHeadText, { flex: 1, textAlign: 'right' }]}>Qty x Rate</Text>
                        <Text style={[styles.paperTableHeadText, { flex: 1, textAlign: 'right' }]}>Amount</Text>
                    </View>
                    {lineItems.map((item, idx) => (
                        <View key={item.id} style={styles.paperTableRow}>
                            <Text style={[styles.paperTableBodyText, { flex: 2 }]} numberOfLines={1}>{item.description || "Item Name"}</Text>
                            <Text style={[styles.paperTableBodyText, { flex: 1, textAlign: 'right' }]}>{item.qty} x {item.rate}</Text>
                            <Text style={[styles.paperTableBodyText, { flex: 1, textAlign: 'right' }]}>₹{((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0)).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Totals */}
                <View style={styles.paperTotalsSection}>
                    <View style={styles.paperTotalRow}>
                        <Text style={styles.paperTotalLabel}>Sub Total</Text>
                        <Text style={styles.paperTotalVal}>₹{totals.subtotal}</Text>
                    </View>
                    <View style={styles.paperTotalRow}>
                        <Text style={styles.paperTotalLabel}>GST Total</Text>
                        <Text style={styles.paperTotalVal}>₹{(parseFloat(totals.totalSGST) + parseFloat(totals.totalCGST)).toFixed(2)}</Text>
                    </View>
                    <View style={[styles.paperTotalRow, styles.paperGrandTotalRow]}>
                        <Text style={styles.paperGrandTotalLabel}>GRAND TOTAL</Text>
                        <Text style={styles.paperGrandTotalVal}>₹{totals.grandTotal}</Text>
                    </View>
                </View>

                {/* Amount in words */}
                <View style={styles.paperWordsBox}>
                    <Text style={styles.paperWordsLabel}>Amount in Words:</Text>
                    <Text style={styles.paperWordsText}>{numberToWords(parseFloat(totals.grandTotal))}</Text>
                </View>

                {/* Footer Signature */}
                <View style={styles.paperFooter}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.paperNotesLabel}>Notes:</Text>
                        <Text style={styles.paperNotesText} numberOfLines={2}>{notes}</Text>
                    </View>
                    <View style={styles.paperSignBox}>
                        <Text style={styles.paperSignTitle}>For {companyInfo.name || "Business"}</Text>
                        <View style={styles.paperSignLine} />
                        <Text style={styles.paperSignLabel}>Authorized Signatory</Text>
                    </View>
                </View>
            </View>

            {/* Modal Actions */}
            <View style={styles.previewActions}>
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                    <TouchableOpacity onPress={() => generatePDF('save')} style={[styles.actionButton, { flex: 1, backgroundColor: COLORS.success }]}>
                        <Ionicons name="save" size={24} color="#fff" />
                        <Text style={styles.actionButtonText}>Save PDF</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => generatePDF('whatsapp')} style={[styles.actionButton, { flex: 1, backgroundColor: '#25D366' }]}>
                        <Ionicons name="logo-whatsapp" size={24} color="#fff" />
                        <Text style={styles.actionButtonText}>WhatsApp</Text>
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity onPress={() => generatePDF('share')} style={[styles.actionButton, styles.downloadButton, { marginBottom: 16 }]}>
                    <Ionicons name="share-social" size={24} color="#fff" />
                    <Text style={styles.actionButtonText}>Share (System)</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => generatePDF('print')} style={[styles.actionButton, styles.printButton]}>
                    <Ionicons name="print" size={24} color={COLORS.primary} />
                    <Text style={[styles.actionButtonText, { color: COLORS.primary }]}>Print Invoice</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <PreviewModal />

      {/* Main Form Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GST Invoice Maker</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <TouchableOpacity onPress={pickLogo} style={styles.logoContainer}>
            {logoUri ? <Image source={{ uri: logoUri }} style={styles.logoImage} /> : (
              <View style={styles.logoPlaceholder}>
                <Ionicons name="image-outline" size={44} color={COLORS.textLight} />
                <Text style={styles.logoText}>Tap to upload Business Logo</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.taxInvoiceLabel}>TAX INVOICE</Text>

          {/* Form Content */}
          <View style={styles.card}>
            <View style={styles.cardHeader}><Ionicons name="business" size={20} color={COLORS.primary} /><Text style={styles.cardTitle}>Your Company Details</Text></View>
            <InputField label="Business Name *" placeholder="Your Business" value={companyInfo.name} onChangeText={(v: string) => setCompanyInfo({ ...companyInfo, name: v })} />
            <InputField label="GSTIN" placeholder="27ABCDE1234F1Z5" value={companyInfo.gstin} onChangeText={(v: string) => setCompanyInfo({ ...companyInfo, gstin: v })} />
            <InputField label="Address" placeholder="Business Address" value={companyInfo.address} onChangeText={(v: string) => setCompanyInfo({ ...companyInfo, address: v })} multiline />
            <View style={styles.flexRow}>
                <InputField label="City" placeholder="City" value={companyInfo.city} onChangeText={(v: string) => setCompanyInfo({ ...companyInfo, city: v })} style={{ flex: 1, marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>State</Text>
                    <View style={styles.dropdown}><TextInput value={companyInfo.state} onChangeText={(v) => setCompanyInfo({ ...companyInfo, state: v })} style={styles.dropdownText} /></View>
                </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}><Ionicons name="person" size={20} color={COLORS.primary} /><Text style={styles.cardTitle}>Bill To (Client)</Text></View>
            <InputField label="Client Name *" placeholder="Client Name" value={clientInfo.name} onChangeText={(v: string) => setClientInfo({ ...clientInfo, name: v })} />
            <InputField label="Client GSTIN" placeholder="Optional" value={clientInfo.gstin} onChangeText={(v: string) => setClientInfo({ ...clientInfo, gstin: v })} />
            <InputField label="Address" placeholder="Client Address" value={clientInfo.address} onChangeText={(v: string) => setClientInfo({ ...clientInfo, address: v })} multiline />
            <View style={styles.flexRow}>
                <InputField label="City" placeholder="City" value={clientInfo.city} onChangeText={(v: string) => setClientInfo({ ...clientInfo, city: v })} style={{ flex: 1, marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>State</Text>
                    <View style={styles.dropdown}><TextInput value={clientInfo.state} onChangeText={(v) => setClientInfo({ ...clientInfo, state: v })} style={styles.dropdownText} /></View>
                </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}><Ionicons name="document-text" size={20} color={COLORS.primary} /><Text style={styles.cardTitle}>Invoice Details</Text></View>
            <View style={styles.flexRow}>
                <InputField label="Invoice #" placeholder="INV-12" value={invoiceDetails.invoiceNo} onChangeText={(v: string) => setInvoiceDetails({ ...invoiceDetails, invoiceNo: v })} style={{ flex: 1, marginRight: 8 }} />
                <InputField label="Date" placeholder="YYYY-MM-DD" value={invoiceDetails.invoiceDate} onChangeText={(v: string) => setInvoiceDetails({ ...invoiceDetails, invoiceDate: v })} style={{ flex: 1 }} />
            </View>
            <View style={styles.flexRow}>
                <InputField label="Due Date" placeholder="Optional" value={invoiceDetails.dueDate} onChangeText={(v: string) => setInvoiceDetails({ ...invoiceDetails, dueDate: v })} style={{ flex: 1, marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Place of Supply</Text>
                    <View style={styles.dropdown}><TextInput value={invoiceDetails.placeOfSupply} onChangeText={(v) => setInvoiceDetails({ ...invoiceDetails, placeOfSupply: v })} style={styles.dropdownText} /></View>
                </View>
            </View>
          </View>

          {/* Line Items */}
          <View style={[styles.card, { padding: 0 }]}>
            <View style={styles.itemTableHeader}><View style={styles.flexRow}><Ionicons name="list" size={20} color={COLORS.primary} /><Text style={[styles.cardTitle, { marginLeft: 8, marginBottom: 0 }]}>Items & Services</Text></View></View>
            {lineItems.map((item, index) => (
                <View key={item.id} style={styles.itemRow}>
                    <View style={styles.flexRowSpace}>
                        <Text style={styles.itemIndex}>Item #{index + 1}</Text>
                        <TouchableOpacity onPress={() => removeLineItem(item.id)} style={styles.deleteButton}><Ionicons name="trash-outline" size={18} color={COLORS.alertRed} /></TouchableOpacity>
                    </View>
                    <InputField label="Description" placeholder="Description" value={item.description} onChangeText={(v: string) => updateLineItem(item.id, 'description', v)} />
                    <View style={styles.flexRow}>
                        <InputField label="HSN" placeholder="HSN" value={item.hsn} onChangeText={(v: string) => updateLineItem(item.id, 'hsn', v)} style={{ flex: 1, marginRight: 8 }} />
                        <InputField label="Qty" placeholder="1" value={item.qty} onChangeText={(v: string) => updateLineItem(item.id, 'qty', v)} keyboardType="decimal-pad" style={{ flex: 0.7, marginRight: 8 }} />
                        <InputField label="Rate" placeholder="0" value={item.rate} onChangeText={(v: string) => updateLineItem(item.id, 'rate', v)} keyboardType="decimal-pad" style={{ flex: 1.2 }} />
                    </View>
                </View>
            ))}
            <TouchableOpacity onPress={addLineItem} style={styles.addItemButton}><Ionicons name="add-circle" size={24} color={COLORS.primary} /><Text style={styles.addItemText}>Add New Item</Text></TouchableOpacity>
          </View>

          {/* Form Actions */}
          <View style={styles.actionContainer}>
            <TouchableOpacity onPress={() => setShowPreview(true)} style={[styles.actionButton, styles.downloadButton]}>
                <Ionicons name="eye" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Preview Invoice</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgSubtle },
  flexRow: { flexDirection: "row", alignItems: "center" },
  flexRowSpace: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14, backgroundColor: COLORS.white, elevation: 3 },
  backButton: { padding: 6 },
  headerTitle: { fontSize: 18, fontFamily: "Poppins_700Bold", color: COLORS.textDark },
  scrollContent: { paddingBottom: 120 },
  logoContainer: { alignItems: "center", marginTop: 24, paddingHorizontal: 16 },
  logoPlaceholder: { width: "100%", height: 160, borderWidth: 2, borderColor: COLORS.border, borderStyle: "dashed", borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  logoImage: { width: "100%", height: 160, resizeMode: "contain", borderRadius: 16, borderWidth: 1, borderColor: COLORS.border },
  logoText: { fontSize: 14, fontFamily: "Poppins_600SemiBold", color: COLORS.textGray, marginTop: 10 },
  taxInvoiceLabel: { textAlign: "center", fontSize: 26, fontFamily: "Poppins_800ExtraBold", color: COLORS.primary, marginVertical: 24, letterSpacing: 1.5 },
  card: { backgroundColor: "#fff", borderRadius: 20, marginHorizontal: 16, marginBottom: 20, padding: 20, borderWidth: 1, borderColor: COLORS.border, elevation: 2 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontFamily: "Poppins_700Bold", color: COLORS.textDark },
  inputLabel: { fontSize: 13, fontFamily: "Poppins_600SemiBold", color: COLORS.textGray, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, padding: 12, color: COLORS.textDark, backgroundColor: "#F9FBFF" },
  dropdown: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, padding: 12, backgroundColor: "#F1F5F9", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dropdownText: { color: COLORS.textDark, flex: 1 },
  itemTableHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: "#F8FAFC", borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  itemRow: { padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: "#fff" },
  itemIndex: { fontSize: 13, fontFamily: "Poppins_700Bold", color: "#475569", backgroundColor: "#E2E8F0", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  deleteButton: { padding: 6, backgroundColor: "#FEE2E2", borderRadius: 6 },
  addItemButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 20, gap: 10 },
  addItemText: { fontSize: 16, fontFamily: "Poppins_700Bold", color: COLORS.primary },
  actionContainer: { paddingHorizontal: 16, marginTop: 10 },
  actionButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 18, borderRadius: 16, gap: 12, elevation: 4 },
  downloadButton: { backgroundColor: COLORS.primary },
  printButton: { backgroundColor: "#fff", borderWidth: 2, borderColor: COLORS.primary },
  actionButtonText: { fontSize: 17, fontFamily: "Poppins_700Bold", color: "#fff" },

  // Preview Styles
  previewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  closePreviewButton: { padding: 8 },
  previewHeaderTitle: { fontSize: 18, fontWeight: 'bold' },
  previewContainer: { padding: 16, backgroundColor: '#f1f5f9' },
  paperPage: { backgroundColor: '#fff', padding: 25, borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, minHeight: 600 },
  paperLogoMock: { width: 40, height: 40, backgroundColor: '#f1f5f9', borderRadius: 4 },
  paperBusinessName: { fontSize: 18, fontWeight: 'bold', color: '#1e4fa3', marginTop: 10 },
  paperAddressSmall: { fontSize: 11, color: '#666' },
  paperGSTINSmall: { fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  paperInvoiceType: { fontSize: 24, fontWeight: '900', color: '#1e4fa3' },
  paperMetaSmall: { fontSize: 12, color: '#444', fontWeight: 'bold' },
  paperBillToSection: { marginTop: 30, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 15 },
  paperSectionLabel: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', color: '#1e4fa3', marginBottom: 5 },
  paperClientName: { fontSize: 14, fontWeight: 'bold' },
  paperTable: { marginTop: 30 },
  paperTableHeader: { flexDirection: 'row', backgroundColor: '#1e4fa3', padding: 8 },
  paperTableHeadText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  paperTableRow: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  paperTableBodyText: { fontSize: 11, color: '#333' },
  paperTotalsSection: { marginTop: 20, alignItems: 'flex-end' },
  paperTotalRow: { flexDirection: 'row', width: 200, justifyContent: 'space-between', paddingVertical: 4 },
  paperTotalLabel: { fontSize: 12, color: '#666' },
  paperTotalVal: { fontSize: 12, fontWeight: 'bold' },
  paperGrandTotalRow: { backgroundColor: '#1e4fa3', padding: 8, borderRadius: 4, marginTop: 8 },
  paperGrandTotalLabel: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  paperGrandTotalVal: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  paperWordsBox: { marginTop: 25, padding: 10, backgroundColor: '#f8fafc', borderRadius: 4 },
  paperWordsLabel: { fontSize: 10, color: '#1e4fa3', fontWeight: 'bold' },
  paperWordsText: { fontSize: 11, color: '#444', fontStyle: 'italic' },
  paperFooter: { marginTop: 40, flexDirection: 'row', gap: 20 },
  paperNotesLabel: { fontSize: 10, color: '#1e4fa3', fontWeight: 'bold' },
  paperNotesText: { fontSize: 10, color: '#666' },
  paperSignBox: { flex: 1, alignItems: 'center' },
  paperSignTitle: { fontSize: 11, fontWeight: 'bold' },
  paperSignLine: { width: '80%', height: 40, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  paperSignLabel: { fontSize: 9, color: '#999', marginTop: 5 },
  previewActions: { marginTop: 30, paddingBottom: 100 }
});
