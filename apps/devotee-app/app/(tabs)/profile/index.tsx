import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@devalaya/shared/i18n";
import { formatCurrency } from "@devalaya/shared/utils";
import { useState } from "react";

const COLORS = {
  saffron: "#F97316",
  temple: "#8B4513",
  templeBg: "#FFF8F0",
  white: "#FFFFFF",
  gray: "#666666",
  border: "#E8C9A0",
  green: "#16A34A",
};

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const [showLangPicker, setShowLangPicker] = useState(false);

  function changeLanguage(lang: SupportedLanguage) {
    i18n.changeLanguage(lang);
    setShowLangPicker(false);
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RS</Text>
        </View>
        <Text style={styles.profileName}>Rajesh Sharma</Text>
        <Text style={styles.profileEmail}>rajesh@email.com</Text>
        <View style={styles.memberBadge}>
          <Text style={styles.memberText}>Premium Member</Text>
        </View>
      </View>

      {/* Donation Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{t("donation.totalDonations")}</Text>
        <Text style={styles.summaryAmount}>{formatCurrency(5200)}</Text>
        <Text style={styles.summarySubtext}>{t("donation.thisYear")}: {formatCurrency(1850)}</Text>
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        {[
          { icon: "receipt-outline" as const, label: t("donation.donationHistory"), badge: "12" },
          { icon: "document-text-outline" as const, label: t("donation.taxReceipts"), badge: null },
          { icon: "analytics-outline" as const, label: t("donation.annualStatement"), badge: null },
          { icon: "calendar-outline" as const, label: "My Bookings", badge: "3" },
          { icon: "people-outline" as const, label: t("devotee.familyMembers"), badge: "4" },
          { icon: "heart-outline" as const, label: t("volunteer.title"), badge: null },
        ].map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name={item.icon} size={22} color={COLORS.temple} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              {item.badge && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color={COLORS.gray} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("settings.title")}</Text>

        {/* Language Selector */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowLangPicker(!showLangPicker)}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons name="globe-outline" size={22} color={COLORS.temple} />
          </View>
          <Text style={styles.menuLabel}>{t("settings.language")}</Text>
          <Text style={styles.menuValue}>
            {SUPPORTED_LANGUAGES[i18n.language as SupportedLanguage] || "English"}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.gray} />
        </TouchableOpacity>

        {showLangPicker && (
          <View style={styles.langPicker}>
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <TouchableOpacity
                key={code}
                style={[styles.langOption, i18n.language === code && styles.langOptionActive]}
                onPress={() => changeLanguage(code as SupportedLanguage)}
              >
                <Text style={[styles.langOptionText, i18n.language === code && styles.langOptionTextActive]}>
                  {name}
                </Text>
                {i18n.language === code && (
                  <Ionicons name="checkmark" size={18} color={COLORS.temple} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.temple} />
          </View>
          <Text style={styles.menuLabel}>{t("settings.notifications")}</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="card-outline" size={22} color={COLORS.temple} />
          </View>
          <Text style={styles.menuLabel}>{t("settings.payment")}</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
        <Text style={styles.signOutText}>{t("auth.logout")}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.templeBg },
  profileHeader: { alignItems: "center", padding: 24, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.temple, justifyContent: "center", alignItems: "center" },
  avatarText: { color: COLORS.white, fontSize: 28, fontWeight: "bold" },
  profileName: { fontSize: 22, fontWeight: "bold", color: "#333", marginTop: 12 },
  profileEmail: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  memberBadge: { backgroundColor: COLORS.saffron + "20", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  memberText: { color: COLORS.saffron, fontSize: 13, fontWeight: "600" },
  summaryCard: { margin: 16, padding: 20, backgroundColor: COLORS.temple, borderRadius: 16, alignItems: "center" },
  summaryTitle: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  summaryAmount: { color: COLORS.white, fontSize: 32, fontWeight: "bold", marginTop: 4 },
  summarySubtext: { color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 },
  section: { paddingHorizontal: 16, paddingTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.temple, marginBottom: 8 },
  menuItem: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, marginBottom: 6, gap: 12 },
  menuIconContainer: { width: 36, height: 36, borderRadius: 8, backgroundColor: COLORS.temple + "10", justifyContent: "center", alignItems: "center" },
  menuLabel: { flex: 1, fontSize: 15, color: "#333", fontWeight: "500" },
  menuValue: { fontSize: 13, color: COLORS.gray },
  menuBadge: { backgroundColor: COLORS.saffron, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  menuBadgeText: { color: COLORS.white, fontSize: 12, fontWeight: "bold" },
  langPicker: { backgroundColor: COLORS.white, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, marginBottom: 8, overflow: "hidden" },
  langOption: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  langOptionActive: { backgroundColor: COLORS.temple + "10" },
  langOptionText: { fontSize: 15, color: "#333" },
  langOptionTextActive: { color: COLORS.temple, fontWeight: "600" },
  signOutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#DC2626", marginHorizontal: 16, marginTop: 16, paddingVertical: 14, borderRadius: 10 },
  signOutText: { color: COLORS.white, fontSize: 16, fontWeight: "600" },
});
