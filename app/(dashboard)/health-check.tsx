import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect, useMemo } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

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
  actionBlueBg: "#EFF6FF",
};

interface Question {
  id: string;
  section: string;
  text: string;
  options: string[];
  weights: Record<string, number>;
  recommendation?: string;
  service?: string;
  fee?: string;
}

const QUESTIONS: Question[] = [
  {
    id: "registered",
    section: "Basics",
    text: "Is your business registered?",
    options: ["Yes", "No"],
    weights: { "Yes": 10, "No": 0 },
    recommendation: "Register your business as MSME/Udyam to get government benefits.",
    service: "Udyam Registration",
    fee: "Free"
  },
  {
    id: "type",
    section: "Basics",
    text: "Select your business type",
    options: ["Proprietor", "LLP", "Pvt Ltd", "Other"],
    weights: {},
  },
  {
    id: "gst_reg",
    section: "Compliance",
    text: "Are you GST registered?",
    options: ["Yes", "No"],
    weights: { "Yes": 15, "No": 0 },
    recommendation: "GST registration is mandatory for selling online and helps in getting business loans.",
    service: "GST Registration",
    fee: "999"
  },
  {
    id: "gst_filing",
    section: "Compliance",
    text: "Do you file returns regularly?",
    options: ["Yes", "Sometimes", "No"],
    weights: { "Yes": 10, "Sometimes": 5, "No": 0 },
    recommendation: "Regular GST filing avoids heavy penalties and improves credit rating.",
    service: "GST Filings",
    fee: "499"
  },
  {
    id: "trademark",
    section: "Legal",
    text: "Do you have a trademark?",
    options: ["Yes", "No", "Applied"],
    weights: { "Yes": 15, "Applied": 10, "No": 0 },
    recommendation: "Register your brand name legally to protect it from copies.",
    service: "Trademark Registration",
    fee: "1,999"
  },
  {
    id: "agreements",
    section: "Legal",
    text: "Do you use legal agreements?",
    options: ["Yes", "No"],
    weights: { "Yes": 5, "No": 0 },
    recommendation: "Legal agreements protect your business from payment defaults and disputes.",
    service: "Legal Documentation",
    fee: "499"
  },
  {
    id: "accounts",
    section: "Finance",
    text: "Do you maintain accounts?",
    options: ["Yes", "No"],
    weights: { "Yes": 10, "No": 0 },
    recommendation: "Proper bookkeeping is essential for business growth and tax compliance.",
    service: "Bookkeeping Service",
    fee: "999"
  },
  {
    id: "profit",
    section: "Finance",
    text: "Do you track profit monthly?",
    options: ["Yes", "No"],
    weights: { "Yes": 10, "No": 0 },
    recommendation: "Tracking profits helps in making data-driven decisions for your business.",
  },
  {
    id: "online",
    section: "Growth",
    text: "Do you sell online?",
    options: ["Yes", "No"],
    weights: { "Yes": 5, "No": 0 },
    recommendation: "Selling online can expand your customer base significantly.",
  },
  {
    id: "digital",
    section: "Growth",
    text: "How strong is your digital presence?",
    options: ["High", "Medium", "Low"],
    weights: { "High": 10, "Medium": 5, "Low": 0 },
    recommendation: "Improve your social media presence to reach more customers.",
    service: "Social Media Marketing",
    fee: "1,499"
  },
  {
    id: "income",
    section: "Income Tax",
    text: "How much Income you earned last year?",
    options: ["<3 Lacs", "<7 Lacs", "<15 Lacs", "15+ Lacs"],
    weights: {},
  },
  {
    id: "itr",
    section: "Income Tax",
    text: "Do you file income Tax Return every year?",
    options: ["Yes", "No"],
    weights: { "Yes": 10, "No": 0 },
    recommendation: "Filing ITR is necessary for loans and visar purposes.",
    service: "ITR Filing",
    fee: "499"
  },
];

export default function HealthCheckScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: Intro, 1-12: Questions, 13: Result
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const progress = useMemo(() => {
    if (step === 0) return 0;
    if (step > QUESTIONS.length) return 1;
    return step / QUESTIONS.length;
  }, [step]);

  const score = useMemo(() => {
    let total = 0;
    QUESTIONS.forEach(q => {
      const answer = answers[q.id];
      if (answer && q.weights[answer]) {
        total += q.weights[answer];
      }
    });
    return total;
  }, [answers]);

  const healthCategory = useMemo(() => {
    if (score >= 80) return { label: "Healthy", color: COLORS.success, icon: "checkmark-circle", text: "Your business is in great shape!" };
    if (score >= 50) return { label: "Needs Improvement", color: COLORS.alertAmber, icon: "alert-circle", text: "Your business has some gaps to bridge." };
    return { label: "High Risk", color: COLORS.alertRed, icon: "warning", text: "Your business is at high risk. Fix compliance soon!" };
  }, [score]);

  const recommendations = useMemo(() => {
    return QUESTIONS.filter(q => {
      const answer = answers[q.id];
      // If it's a weighted question and user didn't get max points
      if (Object.keys(q.weights).length > 0) {
        const maxWeight = Math.max(...Object.values(q.weights));
        const userWeight = answer ? q.weights[answer] || 0 : 0;
        return userWeight < maxWeight && q.recommendation;
      }
      return false;
    });
  }, [answers]);

  const handleStart = () => setStep(1);
  const handleNext = (answer: string) => {
    const currentQ = QUESTIONS[step - 1];
    setAnswers({ ...answers, [currentQ.id]: answer });
    
    if (step < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setStep(QUESTIONS.length + 1);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  if (isAnalyzing) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.white, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontFamily: "Poppins_700Bold", color: COLORS.primary, marginBottom: 20 }}>Analyzing your business...</Text>
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={{ width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="analytics" size={32} color={COLORS.white} />
        </LinearGradient>
      </View>
    );
  }

  // ── INTRO SCREEN ──
  if (step === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <Stack.Screen options={{ title: "Business Health", headerShown: true }} />
        <View style={{ flex: 1, padding: 24, justifyContent: "center", alignItems: "center" }}>
            <Ionicons name="fitness" size={64} color={COLORS.primary} />
          <Text style={{ fontSize: 28, fontFamily: "Poppins_700Bold", color: COLORS.textDark, textAlign: "center", marginBottom: 16 }}>Check Your Business Health in 2 Minutes</Text>
          <Text style={{ fontSize: 16, fontFamily: "Poppins_400Regular", color: COLORS.textGray, textAlign: "center", marginBottom: 40, lineHeight: 24 }}>
            Get a free score & improve your compliance, growth & safety.
          </Text>
          
          <View style={{ width: '100%', gap: 16, marginBottom: 48 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              <Text style={{ fontSize: 15, fontFamily: "Poppins_500Medium", color: COLORS.textDark }}>Instant Health Score</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              <Text style={{ fontSize: 15, fontFamily: "Poppins_500Medium", color: COLORS.textDark }}>Detailed Actionable Insights</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              <Text style={{ fontSize: 15, fontFamily: "Poppins_500Medium", color: COLORS.textDark }}>Professional Recommendations</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleStart}
            style={{ width: '100%', height: 60, backgroundColor: COLORS.primary, borderRadius: 16, alignItems: "center", justifyContent: "center", elevation: 4 }}
          >
            <Text style={{ color: COLORS.white, fontSize: 18, fontFamily: "Poppins_700Bold" }}>Start Now →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── QUESTION SCREEN ──
  if (step > 0 && step <= QUESTIONS.length) {
    const currentQ = QUESTIONS[step - 1];
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <Stack.Screen options={{ title: "Health Check", headerShown: true }} />
        
        {/* Progress Bar */}
        <View style={{ height: 6, backgroundColor: COLORS.border, marginHorizontal: 20, marginTop: 10, borderRadius: 3, overflow: "hidden" }}>
          <View style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: COLORS.primary }} />
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: 8, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: COLORS.textLight }}>STEP {step} OF {QUESTIONS.length}</Text>
          <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: COLORS.primary }}>{currentQ.section.toUpperCase()}</Text>
        </View>

        <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
          <Text style={{ fontSize: 22, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginBottom: 32 }}>{currentQ.text}</Text>
          
          <View style={{ gap: 12 }}>
            {currentQ.options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleNext(option)}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderColor: answers[currentQ.id] === option ? COLORS.primary : COLORS.border,
                  backgroundColor: answers[currentQ.id] === option ? COLORS.actionBlueBg : COLORS.white,
                }}
              >
                <Text style={{ fontSize: 16, fontFamily: "Poppins_600SemiBold", color: answers[currentQ.id] === option ? COLORS.primary : COLORS.textDark }}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ padding: 24, borderTopWidth: 1, borderTopColor: COLORS.border }}>
          <TouchableOpacity onPress={handleBack} style={{ paddingVertical: 12 }}>
            <Text style={{ color: COLORS.textLight, textAlign: "center", fontFamily: "Poppins_600SemiBold" }}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── RESULT SCREEN ──
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Stack.Screen options={{ title: "Results", headerShown: true }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Score Card */}
        <LinearGradient
          colors={[COLORS.primary, "#2B6FE6"]}
          style={{ padding: 40, alignItems: "center", borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
        >
          <View style={{ width: 140, height: 140, borderRadius: 70, borderWidth: 8, borderColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
             <View style={{ position: "absolute", width: '100%', height: '100%', borderRadius: 70, borderLeftWidth: 8, borderLeftColor: "#fff", transform: [{ rotate: `${(score/100)*360}deg` }] }} />
             <Text style={{ fontSize: 42, fontFamily: "Poppins_700Bold", color: COLORS.white }}>{score}</Text>
             <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: "rgba(255,255,255,0.8)" }}>OUT OF 100</Text>
          </View>
          
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
            <Ionicons name={healthCategory.icon as any} size={20} color={COLORS.white} />
            <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: COLORS.white }}>{healthCategory.label}</Text>
          </View>
          <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: "rgba(255,255,255,0.9)", marginTop: 12, textAlign: "center" }}>{healthCategory.text}</Text>
        </LinearGradient>

        <View style={{ padding: 24 }}>
          {/* Action Recommendations */}
          <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginBottom: 16 }}>Recommended Actions</Text>
          
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <View key={index} style={{ backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 }}>
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.actionBlueBg, alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="bulb" size={20} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontFamily: "Poppins_700Bold", color: COLORS.textDark }}>{rec.service || "Improve Business"}</Text>
                    <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textGray }} numberOfLines={2}>{rec.recommendation}</Text>
                  </View>
                </View>
                
                {rec.service && (
                  <TouchableOpacity 
                    onPress={() => router.push(`/service-pages/request-form?service=${encodeURIComponent(rec.service!)}&fee=${encodeURIComponent(rec.fee!)}`)}
                    style={{ backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 12, alignItems: "center" }}
                  >
                    <Text style={{ color: COLORS.white, fontSize: 14, fontFamily: "Poppins_700Bold" }}>Fix Now - ₹{rec.fee}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <View style={{ padding: 20, backgroundColor: COLORS.actionBlueBg, borderRadius: 20, alignItems: "center" }}>
              <Ionicons name="star" size={32} color={COLORS.alertAmber} />
              <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginTop: 12 }}>Excellent Work!</Text>
              <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: COLORS.textGray, textAlign: "center", marginTop: 4 }}>Your business is fully compliant and growing well.</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => router.replace("/(dashboard)/home")}
            style={{ marginTop: 20, paddingVertical: 16, alignItems: "center", borderRadius: 16, borderWidth: 1.5, borderColor: COLORS.border }}
          >
            <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold", color: COLORS.textDark }}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
