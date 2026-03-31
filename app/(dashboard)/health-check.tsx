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
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

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
  shortRec?: string; // For the "Critical Issues" list
  cardSubtext?: string; // For the recommendation cards
  service?: string;
  fee?: string;
}

const QUESTIONS: Question[] = [
  {
    id: "registered",
    section: "Compliance",
    text: "Is your business registered?",
    options: ["Yes", "No"],
    weights: { "Yes": 10, "No": 0 },
    recommendation: "Register your business as MSME/Udyam to get government benefits.",
    shortRec: "Business not registered",
    cardSubtext: "Register in 2 days.",
    service: "Udyam Registration",
    fee: "Free"
  },
  {
    id: "type",
    section: "Compliance",
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
    shortRec: "No GST registration",
    cardSubtext: "Get GST in 7 days.",
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
    shortRec: "GST returns overdue (2 months)",
    cardSubtext: "Avoid penalties.",
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
    shortRec: "No trademark protection",
    cardSubtext: "Secure your brand now.",
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
    shortRec: "No legal agreements in place",
    cardSubtext: "Protect your business.",
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
    shortRec: "Basic accounting not maintained",
    cardSubtext: "Start accounting.",
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
    shortRec: "Profit tracking missing",
  },
  {
    id: "online",
    section: "Growth",
    text: "Do you sell online?",
    options: ["Yes", "No"],
    weights: { "Yes": 5, "No": 0 },
    recommendation: "Selling online can expand your customer base significantly.",
    shortRec: "No online presence",
  },
  {
    id: "digital",
    section: "Growth",
    text: "How strong is your digital presence?",
    options: ["High", "Medium", "Low"],
    weights: { "High": 10, "Medium": 5, "Low": 0 },
    recommendation: "Improve your social media presence to reach more customers.",
    shortRec: "Weak digital presence",
    cardSubtext: "Grow your reach.",
    service: "Social Media Marketing",
    fee: "1,499"
  },
  {
    id: "itr",
    section: "Finance",
    text: "Do you file income Tax Return every year?",
    options: ["Yes", "No"],
    weights: { "Yes": 10, "No": 0 },
    recommendation: "Filing ITR is necessary for loans and visar purposes.",
    shortRec: "Income Tax Return missing",
    cardSubtext: "File ITR today.",
    service: "ITR Filing",
    fee: "499"
  },
];

export default function HealthCheckScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  const breakdown = useMemo(() => {
    const sections: Record<string, { earned: number; max: number }> = {};
    QUESTIONS.forEach(q => {
      if (Object.keys(q.weights).length > 0) {
        if (!sections[q.section]) {
          sections[q.section] = { earned: 0, max: 0 };
        }
        const maxWeight = Math.max(...Object.values(q.weights));
        const userWeight = answers[q.id] ? (q.weights[answers[q.id]] || 0) : 0;
        sections[q.section].max += maxWeight;
        sections[q.section].earned += userWeight;
      }
    });

    return Object.entries(sections).map(([name, data]) => {
      const percentage = data.max > 0 ? (data.earned / data.max) * 100 : 0;
      let color = COLORS.success;
      if (percentage < 40) color = COLORS.alertRed;
      else if (percentage < 70) color = COLORS.alertAmber;
      return { name, percentage, color };
    });
  }, [answers]);

  const criticalIssues = useMemo(() => {
    return QUESTIONS.filter(q => {
      if (Object.keys(q.weights).length > 0) {
        const userWeight = answers[q.id] ? (q.weights[answers[q.id]] || 0) : 0;
        return userWeight === 0 && Math.max(...Object.values(q.weights)) > 0;
      }
      return false;
    });
  }, [answers]);

  const goodPractices = useMemo(() => {
    return QUESTIONS.filter(q => {
      if (Object.keys(q.weights).length > 0) {
        const maxWeight = Math.max(...Object.values(q.weights));
        const userWeight = answers[q.id] ? (q.weights[answers[q.id]] || 0) : 0;
        return userWeight === maxWeight && maxWeight > 0;
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
    <View style={{ flex: 1, backgroundColor: "#F9FBFF" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        {/* Blue Header Section */}
        <LinearGradient
          colors={["#2563EB", "#1D4ED8"]}
          style={{ paddingTop: insets.top, paddingBottom: 40, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
        >
          {/* Top Bar */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 10, marginBottom: 20 }}>
            <TouchableOpacity onPress={() => router.replace("/(dashboard)/home")} style={{ width: 40, height: 40 }}>
              <Ionicons name="close" size={28} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: COLORS.white }}>Your Business Health Score</Text>
            <TouchableOpacity style={{ width: 40, alignItems: 'center' }}>
              <Ionicons name="notifications" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Semi-circular Gauge */}
          <View style={{ alignItems: "center", position: 'relative' }}>
            <View style={{ width: 260, height: 130, overflow: "hidden" }}>
              {/* Main Gray Arch */}
              <View style={{ 
                width: 260, height: 260, borderRadius: 130, 
                borderWidth: 20, borderColor: "rgba(255,255,255,0.2)"
              }} />
              {/* Progress Colored Arch */}
              <View style={{ 
                position: "absolute",
                top: 0, left: 0,
                width: 260, height: 260, borderRadius: 130, 
                borderWidth: 20, borderColor: COLORS.alertAmber,
                borderBottomColor: "transparent",
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                transform: [{ rotate: `${45 + (score/100)*180}deg` }]
              }} />
            </View>
            
            {/* Score Text inside gauge space */}
            <View style={{ position: 'absolute', bottom: 10, alignItems: 'center' }}>
              <Text style={{ fontSize: 68, fontFamily: "Poppins_700Bold", color: COLORS.alertAmber, lineHeight: 74 }}>
                {score}<Text style={{ fontSize: 24, color: COLORS.white, fontFamily: "Poppins_600SemiBold" }}>/100</Text>
              </Text>
              <View style={{ backgroundColor: "#1e3a8a", paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20, marginTop: -5 }}>
                <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: healthCategory.color }}>{healthCategory.label}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={{ padding: 16 }}>
          {/* Warning Banner */}
          <View style={{ backgroundColor: COLORS.white, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: "#E2E8F0", shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 }}>
            <Text style={{ fontSize: 13, fontFamily: "Poppins_500Medium", color: COLORS.textDark, textAlign: 'center' }}>
              Your business has critical gaps that need to be fixed! ⚠️
            </Text>
          </View>

          {/* Health Breakdown */}
          <View style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 24, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: "#EDF2F7" }}>
            <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginBottom: 20 }}>Health Breakdown</Text>
            {breakdown.map((item, index) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
                <Text style={{ width: 90, fontSize: 13, fontFamily: "Poppins_600SemiBold", color: COLORS.textDark }}>{item.name}</Text>
                <Text style={{ width: 45, fontSize: 13, fontFamily: "Poppins_700Bold", color: item.color }}>{Math.round(item.percentage)}%</Text>
                <View style={{ flex: 1, height: 12, backgroundColor: "#EDF2F7", borderRadius: 6, overflow: "hidden" }}>
                  <View style={{ width: `${item.percentage}%`, height: '100%', backgroundColor: item.color, borderRadius: 6 }} />
                </View>
              </View>
            ))}
          </View>

          {/* Critical Issues */}
          {criticalIssues.length > 0 && (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 24, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: "#EDF2F7" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <View style={{ backgroundColor: "#FEE2E2", width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="alert-circle" size={24} color={COLORS.alertRed} />
                </View>
                <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold", color: COLORS.textDark }}>Critical Issues</Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#EDF2F7", marginBottom: 16 }} />
              {criticalIssues.map((issue, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                  <Ionicons name="warning-outline" size={18} color={COLORS.alertRed} style={{ marginTop: 1 }} />
                  <Text style={{ flex: 1, fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textDark, lineHeight: 18 }}>
                    {issue.shortRec || issue.text}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Good Practices */}
          {goodPractices.length > 0 && (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 24, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: "#EDF2F7" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <View style={{ backgroundColor: "#D1FAE5", width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                   <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
                </View>
                <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold", color: COLORS.textDark }}>Good Practices</Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#EDF2F7", marginBottom: 16 }} />
              {goodPractices.map((practice, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                  <Text style={{ flex: 1, fontSize: 13, fontFamily: "Poppins_400Regular", color: COLORS.textDark }}>
                    {practice.text}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Smart Recommendations */}
          <View style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 24, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: "#EDF2F7" }}>
             <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold", color: COLORS.textDark, marginBottom: 20 }}>Smart Recommendations</Text>
             
             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {recommendations.slice(0, 3).map((rec, index) => (
                  <View key={index} style={{ width: 160, backgroundColor: COLORS.white, borderRadius: 16, borderWidth: 1, borderColor: "#EDF2F7", padding: 16, alignItems: 'center' }}>
                    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                      <Ionicons name={index === 0 ? "shield-checkmark" : (index === 1 ? "document-text" : "reader")} size={22} color="#2563EB" />
                    </View>
                    <Text style={{ fontSize: 13, fontFamily: "Poppins_700Bold", color: COLORS.textDark, textAlign: 'center', height: 36, lineHeight: 18 }} numberOfLines={2}>{rec.service || "Improve Business"}</Text>
                    <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: COLORS.textGray, textAlign: 'center', marginBottom: 12, height: 32 }} numberOfLines={2}>{rec.cardSubtext || "Get started now."}</Text>
                    
                    {rec.service && (
                      <TouchableOpacity 
                        onPress={() => router.push(`/service-pages/request-form?service=${encodeURIComponent(rec.service!)}&fee=${encodeURIComponent(rec.fee!)}`)}
                        style={{ 
                          backgroundColor: rec.id === 'gst_filing' ? "#EF4444" : "#2563EB", 
                          borderRadius: 8, 
                          paddingVertical: 10, 
                          width: '100%', 
                          alignItems: "center" 
                        }}
                      >
                        <Text style={{ color: COLORS.white, fontSize: 11, fontFamily: "Poppins_700Bold" }}>{rec.id === 'gst_filing' ? 'File Now >' : (rec.id === 'trademark' ? 'Apply Now >' : 'Get Templates >')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
             </ScrollView>
          </View>
        </View>

      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: "#E2E8F0", padding: 16, paddingBottom: Math.max(insets.bottom, 16) }}>
        <TouchableOpacity 
          onPress={() => router.replace("/(dashboard)/home")}
          style={{ borderRadius: 14, overflow: "hidden", shadowColor: "#F59E0B", shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 }}
        >
          <LinearGradient
            colors={["#FBBF24", "#F59E0B"]}
            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
            style={{ paddingVertical: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10 }}
          >
            <Text style={{ fontSize: 24 }}>🚀</Text>
            <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold", color: "#1e3a8a" }}>Fix My Business Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
  );
}
