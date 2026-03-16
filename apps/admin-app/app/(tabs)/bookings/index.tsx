import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "@devalaya/shared/utils";

const COLORS = { temple: "#8B4513", saffron: "#F97316", templeBg: "#FFF8F0", white: "#FFFFFF", gray: "#666", border: "#E8C9A0", green: "#16A34A" };

const bookings = [
  { id: "1", devotee: "Anand Kumar", puja: "Satyanarayana Puja", priest: "Pandit Ramesh", date: "Today", time: "4:00 PM", amount: 151, status: "confirmed" },
  { id: "2", devotee: "Meera Iyer", puja: "Navagraha Homam", priest: "Acharya Suresh", date: "Tomorrow", time: "9:00 AM", amount: 251, status: "confirmed" },
  { id: "3", devotee: "Venkat Reddy", puja: "Rudra Abhishekam", priest: "Unassigned", date: "Mar 18", time: "10:00 AM", amount: 201, status: "pending" },
  { id: "4", devotee: "Sunita Joshi", puja: "Lakshmi Archana", priest: "Pandit Ramesh", date: "Mar 19", time: "11:00 AM", amount: 51, status: "confirmed" },
];

export default function AdminBookings() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.addText}>New</Text>
        </TouchableOpacity>
      </View>

      {bookings.map((b) => (
        <TouchableOpacity key={b.id} style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.pujaName}>{b.puja}</Text>
            <View style={[styles.badge, { backgroundColor: b.status === "confirmed" ? COLORS.green + "20" : COLORS.saffron + "20" }]}>
              <Text style={[styles.badgeText, { color: b.status === "confirmed" ? COLORS.green : COLORS.saffron }]}>{b.status}</Text>
            </View>
          </View>
          <Text style={styles.devoteeName}>{b.devotee}</Text>
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={14} color={COLORS.gray} />
              <Text style={styles.detailText}>{b.priest}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.gray} />
              <Text style={styles.detailText}>{b.date}, {b.time}</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.amount}>{formatCurrency(b.amount)}</Text>
            {b.status === "pending" && (
              <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.templeBg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.temple },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.temple, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 4 },
  addText: { color: COLORS.white, fontWeight: "600" },
  card: { backgroundColor: COLORS.white, marginHorizontal: 16, marginTop: 12, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pujaName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: "600", textTransform: "capitalize" },
  devoteeName: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  details: { marginTop: 10, gap: 4 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailText: { fontSize: 13, color: COLORS.gray },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  amount: { fontSize: 18, fontWeight: "bold", color: COLORS.green },
  confirmButton: { backgroundColor: COLORS.temple, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  confirmText: { color: COLORS.white, fontWeight: "600" },
});
