import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = { temple: "#8B4513", saffron: "#F97316", templeBg: "#FFF8F0", white: "#FFFFFF", gray: "#666", border: "#E8C9A0", green: "#16A34A" };

const priests = [
  { id: "1", name: "Pandit Ramesh Shastri", role: "Head Priest", todayBookings: 3, available: true },
  { id: "2", name: "Acharya Suresh Dikshitar", role: "Priest", todayBookings: 2, available: true },
  { id: "3", name: "Pandit Vishnu Sharma", role: "Priest", todayBookings: 1, available: false },
];

export default function AdminPriests() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Priests</Text>
      </View>

      {priests.map((priest) => (
        <TouchableOpacity key={priest.id} style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{priest.name.split(" ").pop()?.charAt(0) || "P"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.priestName}>{priest.name}</Text>
              <Text style={styles.priestRole}>{priest.role}</Text>
              <View style={styles.infoRow}>
                <View style={[styles.statusBadge, { backgroundColor: priest.available ? COLORS.green + "20" : COLORS.saffron + "20" }]}>
                  <View style={[styles.dot, { backgroundColor: priest.available ? COLORS.green : COLORS.saffron }]} />
                  <Text style={[styles.statusText, { color: priest.available ? COLORS.green : COLORS.saffron }]}>
                    {priest.available ? "Available" : "Busy"}
                  </Text>
                </View>
                <Text style={styles.bookingCount}>{priest.todayBookings} today</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.scheduleButton}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.temple} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.templeBg },
  header: { padding: 20, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.temple },
  card: { backgroundColor: COLORS.white, marginHorizontal: 16, marginTop: 12, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  cardContent: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.temple, justifyContent: "center", alignItems: "center" },
  avatarText: { color: COLORS.white, fontSize: 20, fontWeight: "bold" },
  priestName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  priestRole: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 6 },
  statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: "600" },
  bookingCount: { fontSize: 12, color: COLORS.gray },
  scheduleButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, justifyContent: "center", alignItems: "center" },
});
