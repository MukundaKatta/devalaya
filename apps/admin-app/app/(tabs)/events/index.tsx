import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = { temple: "#8B4513", saffron: "#F97316", templeBg: "#FFF8F0", white: "#FFFFFF", gray: "#666", border: "#E8C9A0", green: "#16A34A", red: "#DC2626" };

const events = [
  { id: "1", title: "Ram Navami Celebrations", date: "Apr 14", status: "published", rsvps: 245, volunteers: 12 },
  { id: "2", title: "Hanuman Jayanti", date: "Apr 22", status: "draft", rsvps: 0, volunteers: 0 },
  { id: "3", title: "Youth Sanskrit Workshop", date: "Mar 22", status: "published", rsvps: 18, volunteers: 3 },
  { id: "4", title: "Weekly Satsang", date: "Every Sat", status: "published", rsvps: 42, volunteers: 4 },
];

export default function AdminEvents() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.addText}>Create</Text>
        </TouchableOpacity>
      </View>

      {events.map((event) => (
        <TouchableOpacity key={event.id} style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={[styles.badge, { backgroundColor: event.status === "published" ? COLORS.green + "20" : COLORS.saffron + "20" }]}>
              <Text style={[styles.badgeText, { color: event.status === "published" ? COLORS.green : COLORS.saffron }]}>
                {event.status}
              </Text>
            </View>
          </View>
          <Text style={styles.eventDate}>{event.date}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="people-outline" size={16} color={COLORS.gray} />
              <Text style={styles.statText}>{event.rsvps} RSVPs</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="hand-left-outline" size={16} color={COLORS.gray} />
              <Text style={styles.statText}>{event.volunteers} volunteers</Text>
            </View>
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
  eventTitle: { fontSize: 16, fontWeight: "bold", color: "#333", flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: "600", textTransform: "capitalize" },
  eventDate: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  statsRow: { flexDirection: "row", gap: 20, marginTop: 10 },
  stat: { flexDirection: "row", alignItems: "center", gap: 6 },
  statText: { fontSize: 13, color: COLORS.gray },
});
