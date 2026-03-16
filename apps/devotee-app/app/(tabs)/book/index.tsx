import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  saffron: "#F97316",
  temple: "#8B4513",
  templeBg: "#FFF8F0",
  white: "#FFFFFF",
  gray: "#666666",
  border: "#E8C9A0",
};

const pujas = [
  { id: "1", name: "Ganapathi Homam", deity: "Lord Ganesha", duration: 60, price: 151, category: "homa" },
  { id: "2", name: "Rudra Abhishekam", deity: "Lord Shiva", duration: 90, price: 201, category: "abhishekam" },
  { id: "3", name: "Satyanarayana Puja", deity: "Lord Vishnu", duration: 120, price: 151, category: "special" },
  { id: "4", name: "Lakshmi Archana", deity: "Goddess Lakshmi", duration: 30, price: 51, category: "archana" },
  { id: "5", name: "Navagraha Homam", deity: "Nine Planets", duration: 90, price: 251, category: "homa" },
  { id: "6", name: "Hanuman Chalisa Path", deity: "Lord Hanuman", duration: 45, price: 51, category: "special" },
  { id: "7", name: "Durga Puja", deity: "Goddess Durga", duration: 60, price: 108, category: "special" },
  { id: "8", name: "Shiva Abhishekam", deity: "Lord Shiva", duration: 45, price: 108, category: "abhishekam" },
];

const categories = [
  { key: "all", label: "All" },
  { key: "archana", label: "Archana" },
  { key: "abhishekam", label: "Abhishekam" },
  { key: "homa", label: "Homa" },
  { key: "special", label: "Special" },
];

const timeSlots = [
  "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM",
  "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM",
];

export default function BookScreen() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPuja, setSelectedPuja] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const filteredPujas = selectedCategory === "all"
    ? pujas
    : pujas.filter((p) => p.category === selectedCategory);

  const puja = pujas.find((p) => p.id === selectedPuja);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("puja.pujas")}</Text>
        <Text style={styles.headerSubtitle}>Select a puja and choose your preferred time</Text>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.categoryPill, selectedCategory === cat.key && styles.categoryPillActive]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Text style={[styles.categoryPillText, selectedCategory === cat.key && styles.categoryPillTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Puja List */}
      {filteredPujas.map((pujaItem) => (
        <TouchableOpacity
          key={pujaItem.id}
          style={[styles.pujaCard, selectedPuja === pujaItem.id && styles.pujaCardActive]}
          onPress={() => setSelectedPuja(pujaItem.id === selectedPuja ? null : pujaItem.id)}
        >
          <View style={styles.pujaHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pujaName}>{pujaItem.name}</Text>
              <Text style={styles.pujaDeity}>{pujaItem.deity}</Text>
            </View>
            <Text style={styles.pujaPrice}>${pujaItem.price}</Text>
          </View>
          <View style={styles.pujaDetails}>
            <View style={styles.pujaDetail}>
              <Ionicons name="time-outline" size={14} color={COLORS.gray} />
              <Text style={styles.pujaDetailText}>{pujaItem.duration} min</Text>
            </View>
            <View style={[styles.pujaDetail, { backgroundColor: COLORS.saffron + "15" }]}>
              <Text style={[styles.pujaDetailText, { color: COLORS.saffron }]}>
                {pujaItem.category.charAt(0).toUpperCase() + pujaItem.category.slice(1)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {/* Time Slot Selection (shown when puja selected) */}
      {selectedPuja && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("puja.selectTime")}</Text>
          <View style={styles.slotGrid}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[styles.slotButton, selectedSlot === slot && styles.slotButtonActive]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Book Button */}
      {selectedPuja && selectedSlot && puja && (
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>
            {t("puja.bookPuja")} - ${puja.price}
          </Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.templeBg },
  header: { padding: 20, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.temple },
  headerSubtitle: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  categoryScroll: { paddingHorizontal: 16, paddingVertical: 12 },
  categoryPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  categoryPillActive: { backgroundColor: COLORS.temple, borderColor: COLORS.temple },
  categoryPillText: { fontSize: 14, color: COLORS.temple, fontWeight: "500" },
  categoryPillTextActive: { color: COLORS.white },
  pujaCard: { backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 10, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  pujaCardActive: { borderColor: COLORS.temple, borderWidth: 2 },
  pujaHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  pujaName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  pujaDeity: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  pujaPrice: { fontSize: 20, fontWeight: "bold", color: COLORS.saffron },
  pujaDetails: { flexDirection: "row", gap: 8, marginTop: 10 },
  pujaDetail: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#F5F5F5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  pujaDetailText: { fontSize: 12, color: COLORS.gray },
  section: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.temple, marginBottom: 12 },
  slotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  slotButton: { width: "22%", paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", backgroundColor: COLORS.white },
  slotButtonActive: { borderColor: COLORS.temple, backgroundColor: COLORS.temple },
  slotText: { fontSize: 12, fontWeight: "600", color: COLORS.temple },
  slotTextActive: { color: COLORS.white },
  bookButton: { backgroundColor: COLORS.saffron, marginHorizontal: 16, marginTop: 8, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  bookButtonText: { color: COLORS.white, fontSize: 18, fontWeight: "bold" },
});
