import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "@devalaya/shared/utils";

const COLORS = { temple: "#8B4513", saffron: "#F97316", templeBg: "#FFF8F0", white: "#FFFFFF", gray: "#666", border: "#E8C9A0", green: "#16A34A", red: "#DC2626" };

export default function AdminDashboard() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Temple Dashboard</Text>
        <Text style={styles.headerSubtitle}>Sri Venkateswara Temple</Text>
      </View>

      <View style={styles.statsGrid}>
        {[
          { label: "Today's Bookings", value: "6", icon: "book" as const, color: COLORS.temple },
          { label: "Today's Donations", value: formatCurrency(1850), icon: "heart" as const, color: COLORS.green },
          { label: "Active Devotees", value: "1,234", icon: "people" as const, color: COLORS.saffron },
          { label: "Live Viewers", value: "142", icon: "radio" as const, color: COLORS.red },
        ].map((stat, idx) => (
          <View key={idx} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + "15" }]}>
              <Ionicons name={stat.icon} size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today&apos;s Bookings</Text>
        {[
          { time: "4:00 PM", puja: "Satyanarayana Puja", devotee: "Anand Kumar", status: "confirmed" },
          { time: "5:00 PM", puja: "Lakshmi Archana", devotee: "Meera Iyer", status: "pending" },
          { time: "6:00 PM", puja: "Ganapathi Homam", devotee: "Ravi Menon", status: "confirmed" },
        ].map((booking, idx) => (
          <View key={idx} style={styles.bookingRow}>
            <Text style={styles.bookingTime}>{booking.time}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.bookingPuja}>{booking.puja}</Text>
              <Text style={styles.bookingDevotee}>{booking.devotee}</Text>
            </View>
            <View style={[styles.statusDot, { backgroundColor: booking.status === "confirmed" ? COLORS.green : COLORS.saffron }]} />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {[
            { label: "Check In", icon: "checkmark-circle" as const },
            { label: "Add Donation", icon: "add-circle" as const },
            { label: "Send Alert", icon: "notifications" as const },
            { label: "Go Live", icon: "videocam" as const },
          ].map((action, idx) => (
            <TouchableOpacity key={idx} style={styles.actionButton}>
              <Ionicons name={action.icon} size={28} color={COLORS.temple} />
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.templeBg },
  header: { padding: 20, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.temple },
  headerSubtitle: { fontSize: 14, color: COLORS.gray, marginTop: 2 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", padding: 12, gap: 8 },
  statCard: { width: "47%", backgroundColor: COLORS.white, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  statIcon: { width: 36, height: 36, borderRadius: 8, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: "bold", color: "#333" },
  statLabel: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.temple, marginBottom: 12 },
  bookingRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, marginBottom: 8, gap: 12 },
  bookingTime: { fontSize: 14, fontWeight: "600", color: COLORS.temple, width: 70 },
  bookingPuja: { fontSize: 15, fontWeight: "600", color: "#333" },
  bookingDevotee: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  actionsGrid: { flexDirection: "row", gap: 12 },
  actionButton: { flex: 1, alignItems: "center", backgroundColor: COLORS.white, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  actionLabel: { fontSize: 11, color: COLORS.temple, fontWeight: "500", marginTop: 6, textAlign: "center" },
});
