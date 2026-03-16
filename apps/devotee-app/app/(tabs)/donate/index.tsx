import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  saffron: "#F97316",
  temple: "#8B4513",
  templeBg: "#FFF8F0",
  white: "#FFFFFF",
  gray: "#666666",
  border: "#E8C9A0",
  green: "#16A34A",
};

const quickAmounts = [21, 51, 101, 251, 501, 1001];

const donationTypes = [
  { key: "general", icon: "heart" as const },
  { key: "food_offering", icon: "restaurant" as const },
  { key: "building_fund", icon: "business" as const },
  { key: "education_fund", icon: "school" as const },
  { key: "festival_sponsorship", icon: "star" as const },
  { key: "priest_dakshina", icon: "person" as const },
];

export default function DonateScreen() {
  const { t } = useTranslation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(101);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedType, setSelectedType] = useState("general");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");

  const currentAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  function handleAmountSelect(amount: number) {
    setSelectedAmount(amount);
    setCustomAmount("");
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("donation.donateNow")}</Text>
        <Text style={styles.headerSubtitle}>{t("donation.taxDeductible")}</Text>
      </View>

      {/* Amount Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("donation.amount")}</Text>
        <View style={styles.amountGrid}>
          {quickAmounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[styles.amountButton, selectedAmount === amount && !customAmount && styles.amountButtonActive]}
              onPress={() => handleAmountSelect(amount)}
            >
              <Text style={[styles.amountText, selectedAmount === amount && !customAmount && styles.amountTextActive]}>
                ${amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.customAmountRow}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.customInput}
            placeholder={t("donation.customAmount")}
            keyboardType="decimal-pad"
            value={customAmount}
            onChangeText={(text) => {
              setCustomAmount(text);
              setSelectedAmount(null);
            }}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Frequency */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("donation.frequency")}</Text>
        <View style={styles.frequencyRow}>
          <TouchableOpacity
            style={[styles.frequencyButton, frequency === "one_time" && styles.frequencyActive]}
            onPress={() => setFrequency("one_time")}
          >
            <Text style={[styles.frequencyText, frequency === "one_time" && styles.frequencyTextActive]}>
              {t("donation.oneTime")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.frequencyButton, frequency === "monthly" && styles.frequencyActive]}
            onPress={() => setFrequency("monthly")}
          >
            <Text style={[styles.frequencyText, frequency === "monthly" && styles.frequencyTextActive]}>
              {t("donation.monthly")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Donation Type */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("donation.donationType")}</Text>
        <View style={styles.typeGrid}>
          {donationTypes.map((dtype) => (
            <TouchableOpacity
              key={dtype.key}
              style={[styles.typeButton, selectedType === dtype.key && styles.typeButtonActive]}
              onPress={() => setSelectedType(dtype.key)}
            >
              <Ionicons
                name={dtype.icon}
                size={20}
                color={selectedType === dtype.key ? COLORS.white : COLORS.temple}
              />
              <Text style={[styles.typeText, selectedType === dtype.key && styles.typeTextActive]}>
                {t(`donation.${dtype.key === "food_offering" ? "foodOffering" : dtype.key === "building_fund" ? "buildingFund" : dtype.key === "education_fund" ? "educationFund" : dtype.key === "festival_sponsorship" ? "festivalSponsorship" : dtype.key === "priest_dakshina" ? "priestDakshina" : "general"}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Anonymous toggle */}
      <TouchableOpacity
        style={styles.anonymousRow}
        onPress={() => setIsAnonymous(!isAnonymous)}
      >
        <Ionicons
          name={isAnonymous ? "checkbox" : "square-outline"}
          size={22}
          color={COLORS.temple}
        />
        <Text style={styles.anonymousText}>{t("donation.anonymous")}</Text>
      </TouchableOpacity>

      {/* Donate Button */}
      <TouchableOpacity
        style={[styles.donateButton, !currentAmount && styles.donateButtonDisabled]}
        disabled={!currentAmount}
      >
        <Ionicons name="heart" size={20} color={COLORS.white} />
        <Text style={styles.donateButtonText}>
          {t("donation.donate")} {currentAmount ? `$${currentAmount}` : ""}
        </Text>
      </TouchableOpacity>

      <Text style={styles.secureText}>
        Secure payment powered by Stripe
      </Text>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.templeBg },
  header: { padding: 20, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.temple },
  headerSubtitle: { fontSize: 13, color: COLORS.green, marginTop: 4 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.temple, marginBottom: 12 },
  amountGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  amountButton: { width: "30%", paddingVertical: 14, borderRadius: 10, borderWidth: 2, borderColor: COLORS.border, alignItems: "center", backgroundColor: COLORS.white },
  amountButtonActive: { borderColor: COLORS.temple, backgroundColor: COLORS.temple },
  amountText: { fontSize: 18, fontWeight: "bold", color: COLORS.temple },
  amountTextActive: { color: COLORS.white },
  customAmountRow: { flexDirection: "row", alignItems: "center", marginTop: 12, backgroundColor: COLORS.white, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 12 },
  dollarSign: { fontSize: 20, color: COLORS.temple, fontWeight: "bold" },
  customInput: { flex: 1, fontSize: 18, paddingVertical: 12, paddingHorizontal: 8, color: "#333" },
  frequencyRow: { flexDirection: "row", gap: 12 },
  frequencyButton: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 2, borderColor: COLORS.border, alignItems: "center", backgroundColor: COLORS.white },
  frequencyActive: { borderColor: COLORS.temple, backgroundColor: COLORS.temple },
  frequencyText: { fontSize: 15, fontWeight: "600", color: COLORS.temple },
  frequencyTextActive: { color: COLORS.white },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeButton: { width: "47%", flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
  typeButtonActive: { backgroundColor: COLORS.temple, borderColor: COLORS.temple },
  typeText: { fontSize: 12, color: COLORS.temple, fontWeight: "500", flex: 1 },
  typeTextActive: { color: COLORS.white },
  anonymousRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 8 },
  anonymousText: { fontSize: 14, color: "#333" },
  donateButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: COLORS.saffron, marginHorizontal: 16, marginTop: 16, paddingVertical: 16, borderRadius: 12 },
  donateButtonDisabled: { opacity: 0.5 },
  donateButtonText: { color: COLORS.white, fontSize: 18, fontWeight: "bold" },
  secureText: { textAlign: "center", fontSize: 12, color: COLORS.gray, marginTop: 12 },
});
